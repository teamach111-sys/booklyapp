import { useMemo, useState } from 'react';
import {
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

// Port of the web "extra notifications" page
// (staffly-frontend/src/pages/extras/components/Notifications.jsx): unread badge,
// search, category chips, select-all bar, notification rows and footer. The row
// detail and the "Par page" select use the app bottom sheet.
const PAGE_SIZES = [5, 10, 20, 50];

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

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('toutes');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [detailId, setDetailId] = useState(null);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const unreadCount = notifications.filter(item => !item.read).length;

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
      previous.map(item => ({ ...item, read: true })),
    );
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
          item.id === detailId ? { ...item, read: true } : item,
        ),
      );
    }
    setDetailId(null);
  }

  function choosePageSize(size) {
    setPageSize(size);
    setPage(1);
    setPageSizeOpen(false);
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
                  onPress={() => setDetailId(item.id)}
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
