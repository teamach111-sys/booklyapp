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
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ListFilter,
  Search,
  Trash2,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { useClientSites } from '../state/SitesContext';
import BottomSheet from './BottomSheet';
import { createBrandStyles } from '../theme/clientStyles';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotificationApi,
} from '../../../api/clientService';
import { normalizeNotification, extractNotificationList } from '../../../utils/notifications';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

// Category keys must match the ones produced by `getNotificationCategory()`
// in src/utils/notifications.js (mirrors the web frontend).
const FILTER_TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'mission', label: 'Missions' },
  { key: 'invoice', label: 'Factures' },
  { key: 'report', label: 'Signalements' },
  { key: 'account', label: 'Comptes' },
  { key: 'welcome', label: 'Bienvenue' },
];

export default function Notifications() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [perPage, setPerPage] = useState('10');
  const [showPerPageMenu, setShowPerPageMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNotifications()
      .then(data => {
        const list = extractNotificationList(data);
        setNotifications(list.map(normalizeNotification).filter(Boolean));
      })
      .catch(err => {
        console.error('Error loading notifications:', err);
        Alert.alert(
          'Erreur',
          'Impossible de charger les notifications depuis le serveur. Vérifiez votre connexion.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  function markAllAsRead() {
    setNotifications(current => current.map(n => ({ ...n, isRead: true, lu: 1, read_at: new Date().toISOString() })));
    markAllNotificationsRead().catch(() => {});
  }

  function markAsRead(id) {
    setNotifications(current =>
      current.map(n => (n.id === id ? { ...n, isRead: true, lu: 1, read_at: new Date().toISOString() } : n)),
    );
    markNotificationRead(id).catch(() => {});
  }

  function deleteNotification(id) {
    setNotifications(current => current.filter(n => n.id !== id));
    setSelectedIds(current => current.filter(item => item !== id));
    if (activeNotification && activeNotification.id === id) {
      setActiveNotification(null);
    }
    deleteNotificationApi(id).catch(() => {});
  }

  function deleteSelected() {
    const ids = [...selectedIds];
    setNotifications(current => current.filter(n => !ids.includes(n.id)));
    setSelectedIds([]);
    ids.forEach(id => deleteNotificationApi(id).catch(() => {}));
  }

  function handleNotificationPress(notif) {
    markAsRead(notif.id);
    setActiveNotification({ ...notif, isRead: true, lu: 1 });
  }

  // Filtered list
  const filteredNotifications = notifications.filter(notif => {
    const isReadNotif = Boolean(notif.isRead);
    // Tab filter
    if (activeTab === 'unread' && isReadNotif) return false;
    if (
      activeTab !== 'all' &&
      activeTab !== 'unread' &&
      notif.category !== activeTab
    ) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = (notif.title || '').toLowerCase().includes(q);
      const matchDesc = (notif.description || '').toLowerCase().includes(q);
      const matchTag = (notif.tag || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  const allVisibleSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every(n => selectedIds.includes(n.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  }

  function toggleSelectOne(id) {
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Main Notifications Card Container ── */}
      <View style={styles.cardContainer}>
        {/* Header Row: Title + Unread Badge + "Tout marquer lu" */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleBlock}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.headerSubtitle}>
              {filteredNotifications.length} résultat(s) · page 1/1
            </Text>
          </View>

          <View style={styles.headerActionsCol}>
            <Pressable
              accessibilityLabel="Tout marquer lu"
              accessibilityRole="button"
              onPress={markAllAsRead}
              style={styles.markAllReadBtn}
            >
              <Text style={styles.markAllReadBtnText}>Tout marquer lu</Text>
            </Pressable>

            {/* Par page Selector Pill */}
            <Pressable
              accessibilityLabel={`Afficher ${perPage} par page`}
              accessibilityRole="button"
              onPress={() => setShowPerPageMenu(true)}
              style={styles.perPagePill}
            >
              <ListFilter size={12} color="#A07850" />
              <Text style={styles.perPageLabel}>Par page</Text>
              <Text style={styles.perPageValue}>{perPage}</Text>
              <ChevronDown size={11} color="#A07850" />
            </Pressable>
          </View>
        </View>

        {/* Per page options bottom sheet */}
        <Modal
          animationType="fade"
          onRequestClose={() => setShowPerPageMenu(false)}
          transparent
          visible={showPerPageMenu}
        >
          <Pressable
            accessibilityLabel="Fermer la liste"
            accessibilityRole="button"
            onPress={() => setShowPerPageMenu(false)}
            style={styles.pickerBackdrop}
          >
            <Pressable
              onPress={event => event.stopPropagation()}
              style={styles.pickerSheet}
            >
              <Text style={styles.pickerTitle}>Notifications par page</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {['5', '10', '20', '50'].map(val => (
                  <Pressable
                    key={val}
                    accessibilityRole="button"
                    accessibilityState={{ selected: perPage === val }}
                    onPress={() => {
                      setPerPage(val);
                      setShowPerPageMenu(false);
                    }}
                    style={styles.pickerOption}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        perPage === val && styles.pickerOptionTextActive,
                      ]}
                    >
                      {val} par page
                    </Text>
                    {perPage === val ? (
                      <Check size={16} color={colors.orange} />
                    ) : null}
                  </Pressable>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Search size={13} color="#A07850" />
          <TextInput
            accessibilityLabel="Rechercher dans les notifications"
            onChangeText={setSearchQuery}
            placeholder="Rechercher..."
            placeholderTextColor="#A07850"
            style={styles.searchInput}
            value={searchQuery}
          />
          {searchQuery ? (
            <Pressable
              accessibilityLabel="Effacer la recherche"
              onPress={() => setSearchQuery('')}
            >
              <X size={14} color="#A07850" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Tabs Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsScroll}
        >
          {FILTER_TABS.map(tab => {
            const isSelected = activeTab === tab.key;
            let label = tab.label;
            if (tab.key === 'unread') {
              label = `Non lues (${unreadCount})`;
            }
            return (
              <Pressable
                key={tab.key}
                accessibilityLabel={label}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.filterTab,
                  isSelected && styles.filterTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isSelected && styles.filterTabTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Select All Row */}
        <View style={styles.selectAllRow}>
          <Pressable
            accessibilityLabel="Tout sélectionner cette page"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: allVisibleSelected }}
            onPress={toggleSelectAll}
            style={styles.checkboxRow}
          >
            <View
              style={[
                styles.checkbox,
                allVisibleSelected && styles.checkboxActive,
              ]}
            >
              {allVisibleSelected ? (
                <Check size={11} color={colors.white} strokeWidth={3} />
              ) : null}
            </View>
            <Text style={styles.selectAllText}>
              Tout sélectionner cette page
            </Text>
          </Pressable>

          {selectedIds.length > 0 ? (
            <Pressable
              accessibilityLabel={`Supprimer ${selectedIds.length} sélectionnée(s)`}
              accessibilityRole="button"
              onPress={deleteSelected}
              style={styles.bulkDeleteBtn}
            >
              <Trash2 size={12} color="#DC2626" />
              <Text style={styles.bulkDeleteText}>
                Supprimer ({selectedIds.length})
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Notifications List or Empty State */}
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Bell size={22} color={colors.orange} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification ici</Text>
            <Text style={styles.emptySubtitle}>Essayez un autre filtre.</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {filteredNotifications.map(notif => {
              const isSelected = selectedIds.includes(notif.id);
              const unread = !notif.isRead;
              return (
                <Pressable
                  key={notif.id}
                  accessibilityLabel={notif.title}
                  accessibilityRole="button"
                  onPress={() => handleNotificationPress(notif)}
                  style={[
                    styles.notifRow,
                    unread && styles.notifRowUnread,
                  ]}
                >
                  {/* Left Column: Checkbox or Unread Dot */}
                  <Pressable
                    accessibilityLabel="Sélectionner la notification"
                    onPress={e => {
                      e.stopPropagation();
                      toggleSelectOne(notif.id);
                    }}
                    style={styles.notifCheckArea}
                  >
                    {isSelected ? (
                      <View style={[styles.checkbox, styles.checkboxActive]}>
                        <Check size={11} color={colors.white} strokeWidth={3} />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.unreadDot,
                          unread
                            ? styles.unreadDotActive
                            : styles.unreadDotInactive,
                        ]}
                      />
                    )}
                  </Pressable>

                  {/* Body Content */}
                  <View style={styles.notifBody}>
                    <View style={styles.notifTitleRow}>
                      <View style={styles.notifTagAndTitle}>
                        <View
                          style={[
                            styles.tagBadge,
                            unread
                              ? styles.tagBadgeActive
                              : styles.tagBadgeInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.tagBadgeText,
                              unread
                                ? styles.tagBadgeTextActive
                                : styles.tagBadgeTextInactive,
                            ]}
                          >
                            {notif.tag}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.notifTitle,
                            unread && styles.notifTitleUnread,
                          ]}
                        >
                          {notif.title}
                        </Text>
                      </View>

                      <View style={styles.notifDateCol}>
                        <Text style={styles.notifDateText}>{notif.date}</Text>
                        <Pressable
                          accessibilityLabel="Supprimer la notification"
                          accessibilityRole="button"
                          onPress={e => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          style={styles.notifDeleteBtn}
                        >
                          <X size={12} color="#AAAAAA" />
                        </Pressable>
                      </View>
                    </View>

                    <Text numberOfLines={2} style={styles.notifDescription}>
                      {notif.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Footer Info */}
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>
            {filteredNotifications.length > 0
              ? `1–${filteredNotifications.length} sur ${filteredNotifications.length} · Cliquer pour lire`
              : '0 notification'}
          </Text>
        </View>
      </View>

      {/* ── Notification Detail Modal (same sheet as the select pickers) ── */}
      <BottomSheet
        maxHeight="85%"
        onClose={() => setActiveNotification(null)}
        sheetStyle={styles.modalSheet}
        visible={activeNotification !== null}
      >
          {activeNotification ? (
            <View>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderIconWrap}>
                  <BriefcaseBusiness
                    size={18}
                    color={colors.orange}
                    strokeWidth={2}
                  />
                </View>

                <View style={styles.modalHeaderTitleBlock}>
                  <View style={styles.modalTagBadge}>
                    <Text style={styles.modalTagBadgeText}>
                      {activeNotification.tag}
                    </Text>
                  </View>
                  <Text style={styles.modalTitle}>
                    {activeNotification.title}
                  </Text>
                </View>

                <Pressable
                  accessibilityLabel="Fermer"
                  accessibilityRole="button"
                  onPress={() => setActiveNotification(null)}
                  style={styles.modalCloseBtn}
                >
                  <X size={18} color="#BBBBBB" />
                </Pressable>
              </View>

              {/* Modal Body */}
              <View style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  {activeNotification.description}
                </Text>
              </View>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <View style={styles.modalTimestampRow}>
                  <View style={styles.modalStatusDot} />
                  <Text style={styles.modalTimestampText}>
                    Lu · {activeNotification.fullDate}
                  </Text>
                </View>

                <View style={styles.modalActionsRow}>
                  <Pressable
                    accessibilityLabel="Supprimer"
                    accessibilityRole="button"
                    onPress={() => deleteNotification(activeNotification.id)}
                    style={styles.modalDeleteBtn}
                  >
                    <Text style={styles.modalDeleteBtnText}>Supprimer</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Fermer"
                    accessibilityRole="button"
                    onPress={() => setActiveNotification(null)}
                    style={styles.modalCloseSubmitBtn}
                  >
                    <Text style={styles.modalCloseSubmitBtnText}>Fermer</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}
      </BottomSheet>
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 14,
  },

  /* ── Main Notifications Card Container ── */
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    overflow: 'hidden',
  },

  /* ── Header Row ── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  headerTitleBlock: {
    gap: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  unreadBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F43F5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A07850',
    marginTop: 2,
  },
  headerActionsCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  markAllReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    backgroundColor: colors.white,
  },
  markAllReadBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.orangeDark,
  },
  perPagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF6F4',
    borderWidth: 1,
    borderColor: '#E0D0C8',
    borderRadius: 9,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  perPageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4A2A',
  },
  perPageValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C3D1E',
  },
  /* ── Notification detail sheet ── */
  modalSheet: {
    paddingTop: 0,
  },
  /* ── Per page options bottom sheet ── */
  pickerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    maxHeight: '70%',
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.white,
  },
  pickerTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4dd',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  pickerOptionTextActive: {
    fontWeight: '700',
    color: colors.orange,
  },

  /* ── Search Bar ── */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: '#FAF6F4',
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1A0F00',
    padding: 0,
  },

  /* ── Filter Tabs ── */
  filterTabsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  filterTab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0E8E3',
  },
  filterTabActive: {
    backgroundColor: colors.orange,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4A2A',
  },
  filterTabTextActive: {
    color: colors.white,
  },

  /* ── Select All Row ── */
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
    backgroundColor: '#FDF8F5',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#A07850',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  selectAllText: {
    fontSize: 11,
    color: '#A07850',
    fontWeight: '500',
  },
  bulkDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bulkDeleteText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },

  /* ── Notifications List ── */
  notificationsList: {
    backgroundColor: colors.white,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EDE7',
    backgroundColor: colors.white,
  },
  notifRowUnread: {
    borderLeftColor: colors.orange,
  },
  notifCheckArea: {
    width: 20,
    paddingTop: 3,
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  unreadDotActive: {
    backgroundColor: '#F97316',
  },
  unreadDotInactive: {
    backgroundColor: '#E0D0C8',
  },
  notifBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTagAndTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 20,
  },
  tagBadgeActive: {
    backgroundColor: colors.orange,
  },
  tagBadgeInactive: {
    backgroundColor: '#EEEEEE',
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagBadgeTextActive: {
    color: colors.white,
  },
  tagBadgeTextInactive: {
    color: '#999999',
  },
  notifTitle: {
    fontSize: 13,
    color: '#5C3D1E',
    fontWeight: '500',
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  notifDateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifDateText: {
    fontSize: 11,
    color: '#A07850',
  },
  notifDeleteBtn: {
    padding: 2,
  },
  notifDescription: {
    fontSize: 12,
    color: '#7A4A2A',
    lineHeight: 16,
  },

  /* ── Empty State Card ── */
  emptyContainer: {
    paddingVertical: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FAF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
    marginTop: 10,
    fontFamily: serifFont,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
    textAlign: 'center',
  },

  /* ── Footer ── */
  cardFooter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 11,
    color: '#A07850',
  },

  /* ── Modal ── */
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  modalHeaderIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitleBlock: {
    flex: 1,
    gap: 4,
  },
  modalTagBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: colors.orange,
  },
  modalTagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A0F00',
    lineHeight: 20,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalDescription: {
    fontSize: 13,
    color: '#3A2A1A',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F5EDE7',
  },
  modalTimestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  modalStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97316',
  },
  modalTimestampText: {
    fontSize: 11,
    color: '#A07850',
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalDeleteBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF2F2',
  },
  modalDeleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E53E3E',
  },
  modalCloseSubmitBtn: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.orange,
  },
  modalCloseSubmitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});

const stylesByBrand = createBrandStyles(createStyles);
