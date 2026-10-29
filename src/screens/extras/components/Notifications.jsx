/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Shared Portal Component : NotificationsPanel
 * **Associated Route/Context**: `Shared Component across Dashboards`  
 * **Total Discovered Backend Calls**: 9
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`NotificationsPanel.jsx:329`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L329) | User Action Handler (`handleBulkRead`) | `handleBulkRead` | `PATCH` | `/notifications/${id}/read` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`NotificationsPanel.jsx:339`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L339) | Delete / Cancel Button (`handleBulkDelete`) | `handleBulkDelete` | `DELETE` | `/notifications/${id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`NotificationsPanel.jsx:348`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L348) | Delete / Cancel Button (`handleBulkDelete`) | `handleBulkDelete` | `GET` | `url` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`NotificationsPanel.jsx:372`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L372) | Delete / Cancel Button (`handleBulkDelete`) | `handleBulkDelete` | `PATCH` | `siteId ? `/notifications/read-all?site_id=${siteId}` : '/notifications/read-all` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`NotificationsPanel.jsx:399`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L399) | User Action Handler (`handleOpen`) | `handleOpen` | `PATCH` | `/notifications/${notif.id}/read` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`NotificationsPanel.jsx:407`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L407) | User Action Handler (`handleReadAll`) | `handleReadAll` | `PATCH` | `siteId ? `/notifications/read-all?site_id=${siteId}` : '/notifications/read-all` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`NotificationsPanel.jsx:419`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L419) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `POST` | `/notifications/targets` | `{ ids` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`NotificationsPanel.jsx:437`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L437) | User Action Handler (`handleGo`) | `handleGo` | `PATCH` | `/notifications/${notif.id}/read` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`NotificationsPanel.jsx:447`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/NotificationsPanel.jsx#L447) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/notifications/${id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  List,
  Search,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { notifications as styles } from './styles';
import {
  getNotifications,
  getNotificationTargets,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotificationApi,
} from '../../../api/clientService';
import { getNotificationCategory } from '../../../utils/notifications';

// Port of the web "extra notifications" page
// (staffly-frontend/src/pages/extras/components/Notifications.jsx): unread badge,
// search, category chips, select-all bar, notification rows and footer. The row
// detail and the "Par page" select use the app bottom sheet.
const PAGE_SIZES = [5, 10, 20, 50];

// Accent used by the "Voir …" link, same palette as the web NotificationsPanel.
const CAT_COLORS = {
  welcome: '#6366F1',
  mission: '#F97316',
  invoice: '#22C55E',
  report: '#F43F5E',
  message: '#0EA5E9',
  document: '#F59E0B',
  account: '#8B5CF6',
  availability: '#10B981',
  info: '#B9622C',
};

function categoryColor(category) {
  return CAT_COLORS[category] || CAT_COLORS.info;
}

const CHIPS = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'non_lues', label: 'Non lues' },
  { key: 'missions', label: 'Missions' },
  { key: 'factures', label: 'Factures' },
  { key: 'signalements', label: 'Signalements' },
  { key: 'comptes', label: 'Comptes' },
  { key: 'bienvenue', label: 'Bienvenue' },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'INFO',
    category: 'missions',
    title: 'Nouvelle évaluation reçue ★★★★★',
    message:
      "Votre prestation sur 'Séminaire annuel de la direction' a été évaluée : ★★★★★",
    createdAt: '2026-10-12T15:17:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Séminaire annuel',
    message:
      'Les horaires de votre prestation "Séminaire annuel de la direction" ont été modifiés.',
    createdAt: '2026-10-12T15:12:00',
    read: false,
  },
  {
    id: 'n3',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Séminaire annuel',
    message:
      'Les horaires de votre prestation "Séminaire annuel de la direction" ont été modifiés.',
    createdAt: '2026-10-12T15:10:00',
    read: false,
  },
  {
    id: 'n4',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Cocktail de lancement',
    message:
      'Les horaires de votre prestation "Cocktail de lancement de la nouvelle collection" ont été modifiés.',
    createdAt: '2026-10-12T14:58:00',
    read: false,
  },
  {
    id: 'n5',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Dîner de gala',
    message:
      'Les horaires de votre prestation "Dîner de gala des partenaires" ont été modifiés.',
    createdAt: '2026-10-03T11:20:00',
    read: false,
  },
  {
    id: 'n6',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Dîner de gala',
    message:
      'Les horaires de votre prestation "Dîner de gala des partenaires" ont été modifiés.',
    createdAt: '2026-10-03T11:15:00',
    read: false,
  },
  {
    id: 'n7',
    type: 'INFO',
    category: 'missions',
    title: 'Horaires modifiés — Dîner de gala',
    message:
      'Les horaires de votre prestation "Dîner de gala des partenaires" ont été modifiés.',
    createdAt: '2026-10-03T10:40:00',
    read: false,
  },
];

const SHORT_MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];
const LONG_DAYS = [
  'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
];
const LONG_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function pad(value) {
  return String(value).padStart(2, '0');
}

// Row date, e.g. "12 oct.".
function formatShortDate(value) {
  const date = new Date(value);
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

// Detail date, e.g. "lundi 12 octobre 2026 à 15:17".
function formatLongDate(value) {
  const date = new Date(value);
  return `${LONG_DAYS[date.getDay()]} ${date.getDate()} ${
    LONG_MONTHS[date.getMonth()]
  } ${date.getFullYear()} à ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizeNotification(raw) {
  if (!raw) return null;
  const data = raw.data || {};
  const isRead =
    raw.isRead !== undefined
      ? Boolean(raw.isRead)
      : raw.lu !== undefined && raw.lu !== null
      ? raw.lu === 1 || raw.lu === true
      : raw.read_at !== undefined
      ? Boolean(raw.read_at)
      : raw.read !== undefined
      ? Boolean(raw.read)
      : false;
  // The backend column is `titre` (French) — `title` alone would always be empty.
  const title =
    raw.titre ||
    raw.title ||
    data.titre ||
    data.title ||
    data.subject ||
    'Notification';
  const message =
    raw.message ||
    raw.description ||
    data.message ||
    data.description ||
    raw.content ||
    '';
  const category = (
    raw.category ||
    data.category ||
    getNotificationCategory(title)
  )
    .toString()
    .toLowerCase();
  const type = raw.type || data.type || category.toUpperCase();
  const createdAt = raw.created_at || raw.createdAt || raw.date || new Date().toISOString();

  return {
    ...raw,
    id: raw.id,
    titre: raw.titre,
    title,
    message,
    description: message,
    category,
    type,
    tag: raw.tag || data.tag || category.toUpperCase(),
    read: isRead,
    isRead,
    lu: isRead ? 1 : 0,
    createdAt,
  };
}

export default function Notifications({ onGo }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('toutes');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [detailId, setDetailId] = useState(null);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState({});

  useEffect(() => {
    setLoading(true);
    getNotifications()
      .then(data => {
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.notifications)) list = data.notifications;
        else if (Array.isArray(data?.items)) list = data.items;
        const normalized = list.map(normalizeNotification).filter(Boolean);
        setNotifications(normalized);
      })
      .catch(err => {
        console.error('Error loading notifications:', err);
        Alert.alert(
          'Erreur',
          'Impossible de charger les notifications depuis le serveur. Vérifiez votre connexion.',
        );
        setNotifications(INITIAL_NOTIFICATIONS.map(normalizeNotification).filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(item => !item.read).length;

  // Which notifications still point to an existing mission (and whether the
  // link opens the mission or its discussion) — same endpoint as the web panel.
  useEffect(() => {
    if (notifications.length === 0) return;
    const ids = notifications
      .map(item => item.id)
      .filter(id => Number.isFinite(Number(id)));
    if (ids.length === 0) return;
    getNotificationTargets(ids)
      .then(data => {
        if (data && typeof data === 'object') setTargets(data);
      })
      .catch(() => {});
  }, [notifications]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return notifications.filter(item => {
      if (filter === 'non_lues' && item.read) return false;
      if (
        filter !== 'toutes' &&
        filter !== 'non_lues' &&
        item.category !== filter
      ) {
        return false;
      }
      if (search) {
        const haystack = `${item.title} ${item.message}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [notifications, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);
  const allPageSelected =
    pageItems.length > 0 && pageItems.every(item => selectedIds.has(item.id));
  const detail = detailId
    ? notifications.find(item => item.id === detailId)
    : null;

  function selectFilter(nextFilter) {
    setFilter(nextFilter);
    setPage(1);
  }

  function changeQuery(value) {
    setQuery(value);
    setPage(1);
  }

  function markAllRead() {
    setNotifications(previous =>
      previous.map(item => ({ ...item, read: true, isRead: true, lu: 1, read_at: new Date().toISOString() })),
    );
    markAllNotificationsRead().catch(() => {});
  }

  function toggleSelectAll() {
    setSelectedIds(previous => {
      if (allPageSelected) return new Set();
      const next = new Set(previous);
      pageItems.forEach(item => next.add(item.id));
      return next;
    });
  }

  function deleteNotification(id) {
    setNotifications(previous => previous.filter(item => item.id !== id));
    setSelectedIds(previous => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
    if (detailId === id) setDetailId(null);
    deleteNotificationApi(id).catch(() => {});
  }

  function deleteSelected() {
    setNotifications(previous =>
      previous.filter(item => !selectedIds.has(item.id)),
    );
    setSelectedIds(new Set());
    if (detailId && selectedIds.has(detailId)) setDetailId(null);
  }

  function closeDetail() {
    if (detailId) {
      setNotifications(previous =>
        previous.map(item =>
          item.id === detailId ? { ...item, read: true, isRead: true, lu: 1, read_at: new Date().toISOString() } : item,
        ),
      );
      markNotificationRead(detailId).catch(() => {});
    }
    setDetailId(null);
  }

  function choosePageSize(size) {
    setPageSize(size);
    setPage(1);
    setPageSizeOpen(false);
  }

  // "Voir la prestation" / "Voir la conversation" from a notification.
  function openTarget(item) {
    const target = targets[item.id];
    if (!target) return;
    setNotifications(previous =>
      previous.map(next =>
        next.id === item.id
          ? {
              ...next,
              read: true,
              isRead: true,
              lu: 1,
              read_at: new Date().toISOString(),
            }
          : next,
      ),
    );
    markNotificationRead(item.id).catch(() => {});
    setDetailId(null);
    onGo?.(target);
  }

  return (
    <View>
      {/* Page heading, same block as the other extras pages */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Notifications</Text>
        <Text style={extras.pageDescription}>
          Restez informé de vos missions, vos factures et vos actualités.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Notifications</Text>
                {unreadCount > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.subtitle}>
                {filtered.length} résultat(s) · page {currentPage}/{pageCount}
              </Text>
            </View>

            <View style={styles.headerActions}>
              {selectedIds.size > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={deleteSelected}
                  style={styles.btnBulkDelete}
                >
                  <Text style={styles.btnBulkDeleteText}>
                    Supprimer ({selectedIds.size})
                  </Text>
                </Pressable>
              ) : null}
              {unreadCount > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={markAllRead}
                  style={styles.btnMarkAll}
                >
                  <Text style={styles.btnMarkAllText}>Tout marquer lu</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.pageSizeRow}>
            <Pressable
              accessibilityLabel="Nombre de notifications par page"
              accessibilityRole="button"
              onPress={() => setPageSizeOpen(true)}
              style={styles.pageSizeBtn}
            >
              <List size={12} color="#A07850" />
              <Text style={styles.pageSizeLabel}>Par page</Text>
              <Text style={styles.pageSizeValue}>{pageSize}</Text>
              <ChevronDown size={12} color="#5C3D1E" />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Search size={13} color="#A07850" />
            <TextInput
              onChangeText={changeQuery}
              placeholder="Rechercher..."
              placeholderTextColor="#bbb"
              style={styles.searchInput}
              value={query}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.chipsContent}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {CHIPS.map(chip => {
              const active = filter === chip.key;
              const label =
                chip.key === 'non_lues' && unreadCount > 0
                  ? `${chip.label} (${unreadCount})`
                  : chip.label;
              return (
                <Pressable
                  key={chip.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectFilter(chip.key)}
                  style={[
                    styles.chip,
                    active ? styles.chipActive : styles.chipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allPageSelected }}
          onPress={toggleSelectAll}
          style={styles.selectAllBar}
        >
          <View
            style={[styles.checkbox, allPageSelected && styles.checkboxChecked]}
          >
            {allPageSelected ? (
              <Check size={10} color={colors.white} strokeWidth={3} />
            ) : null}
          </View>
          <Text style={styles.selectAllText}>
            Tout sélectionner cette page
          </Text>
        </Pressable>

        {pageItems.length === 0 ? (
          <Text style={styles.emptyText}>Aucune notification</Text>
        ) : (
          pageItems.map(item => {
            const selected = selectedIds.has(item.id);
            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  item.read ? styles.rowRead : styles.rowUnread,
                  selected && styles.rowSelected,
                ]}
              >
                <View style={styles.dotColumn}>
                  <View
                    style={item.read ? styles.readDot : styles.unreadDot}
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setNotifications(previous =>
                      previous.map(n =>
                        n.id === item.id ? { ...n, read: true, isRead: true, lu: 1, read_at: new Date().toISOString() } : n,
                      ),
                    );
                    markNotificationRead(item.id).catch(() => {});
                    setDetailId(item.id);
                  }}
                  style={styles.rowBody}
                >
                  <View style={styles.rowTop}>
                    <View style={styles.rowTopLeft}>
                      <View
                        style={[
                          styles.typeBadge,
                          item.read && styles.typeBadgeRead,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeText,
                            item.read && styles.typeBadgeTextRead,
                          ]}
                        >
                          {item.type}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.rowTitle,
                          item.read && styles.rowTitleRead,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>

                    <View style={styles.rowMeta}>
                      <Text style={styles.rowDate}>
                        {formatShortDate(item.createdAt)}
                      </Text>
                      <Pressable
                        accessibilityLabel="Supprimer la notification"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={() => deleteNotification(item.id)}
                        style={styles.rowDelete}
                      >
                        <X size={14} color="#ddd" />
                      </Pressable>
                    </View>
                  </View>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.rowPreview,
                      item.read && styles.rowPreviewRead,
                    ]}
                  >
                    {item.message}
                  </Text>

                  {targets[item.id] ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={event => {
                        event.stopPropagation?.();
                        openTarget(item);
                      }}
                      style={[
                        styles.rowGoBtn,
                        { borderColor: categoryColor(item.category) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rowGoBtnText,
                          { color: categoryColor(item.category) },
                        ]}
                      >
                        {targets[item.id].kind === 'message'
                          ? 'Voir la conversation'
                          : 'Voir la prestation'}
                      </Text>
                      <ChevronRight
                        size={10}
                        color={categoryColor(item.category)}
                      />
                    </Pressable>
                  ) : null}
                </Pressable>
              </View>
            );
          })
        )}

        <View style={styles.footer}>
          {pageCount > 1 ? (
            <Pressable
              accessibilityLabel="Page précédente"
              accessibilityRole="button"
              disabled={currentPage === 1}
              onPress={() => setPage(Math.max(1, currentPage - 1))}
              style={styles.pageNav}
            >
              <ChevronLeft
                size={13}
                color={currentPage === 1 ? '#ddd' : '#C0A090'}
              />
            </Pressable>
          ) : null}
          <Text style={styles.footerText}>
            {filtered.length === 0
              ? '0 résultat'
              : `${pageStart + 1}–${pageStart + pageItems.length} sur ${
                  filtered.length
                }`}{' '}
            · Cliquer pour lire
          </Text>
          {pageCount > 1 ? (
            <Pressable
              accessibilityLabel="Page suivante"
              accessibilityRole="button"
              disabled={currentPage === pageCount}
              onPress={() => setPage(Math.min(pageCount, currentPage + 1))}
              style={styles.pageNav}
            >
              <ChevronRight
                size={13}
                color={currentPage === pageCount ? '#ddd' : '#C0A090'}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Notification detail */}
      <Modal
        animationType="fade"
        onRequestClose={closeDetail}
        transparent
        visible={detail !== null}
      >
        <Pressable
          accessibilityLabel="Fermer la fenêtre"
          accessibilityRole="button"
          onPress={closeDetail}
          style={styles.sheetBackdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={styles.sheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Notification</Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={closeDetail}
                style={styles.sheetClose}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            {detail ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.sheetScroll}
              >
                <View style={styles.detailHeader}>
                  <View style={styles.detailIcon}>
                    <Info size={22} color="#B9622C" />
                  </View>
                  <View style={styles.detailHeaderText}>
                    <View style={styles.detailBadge}>
                      <Text style={styles.detailBadgeText}>{detail.type}</Text>
                    </View>
                    <Text style={styles.detailTitle}>{detail.title}</Text>
                  </View>
                </View>

                <Text style={styles.detailMessage}>{detail.message}</Text>

                <View style={styles.detailFooter}>
                  <View style={styles.detailMetaRow}>
                    <View style={styles.detailMetaDot} />
                    <Text style={styles.detailMetaText}>
                      {detail.read ? 'Lu' : 'Non lu'} ·{' '}
                      {formatLongDate(detail.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.detailActions}>
                    {targets[detail.id] ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => openTarget(detail)}
                        style={[
                          styles.detailGoBtn,
                          { borderColor: categoryColor(detail.category) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailGoBtnText,
                            { color: categoryColor(detail.category) },
                          ]}
                        >
                          {targets[detail.id].kind === 'message'
                            ? 'Voir la conversation'
                            : 'Voir la prestation'}
                        </Text>
                        <ChevronRight
                          size={12}
                          color={categoryColor(detail.category)}
                        />
                      </Pressable>
                    ) : null}
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => deleteNotification(detail.id)}
                      style={styles.btnDanger}
                    >
                      <Text style={styles.btnDangerText}>Supprimer</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={closeDetail}
                      style={styles.btnPrimary}
                    >
                      <Text style={styles.btnPrimaryText}>Fermer</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Page size select */}
      <Modal
        animationType="fade"
        onRequestClose={() => setPageSizeOpen(false)}
        transparent
        visible={pageSizeOpen}
      >
        <Pressable
          accessibilityLabel="Fermer la fenêtre"
          accessibilityRole="button"
          onPress={() => setPageSizeOpen(false)}
          style={styles.sheetBackdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={styles.sheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Par page</Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setPageSizeOpen(false)}
                style={styles.sheetClose}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            {PAGE_SIZES.map(size => (
              <Pressable
                key={size}
                accessibilityRole="button"
                accessibilityState={{ selected: size === pageSize }}
                onPress={() => choosePageSize(size)}
                style={styles.optionRow}
              >
                <Text
                  style={[
                    styles.optionText,
                    size === pageSize && styles.optionTextActive,
                  ]}
                >
                  {size}
                </Text>
                {size === pageSize ? (
                  <Check size={16} color={colors.orange} />
                ) : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
