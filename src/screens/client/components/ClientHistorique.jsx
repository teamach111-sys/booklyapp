/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : ClientHistorique
 * **Associated Route/Context**: `/client (Tab/Modal: ClientHistorique)`  
 * **Total Discovered Backend Calls**: 1
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`ClientHistorique.jsx:158`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientHistorique.jsx#L158) | User Action Handler (`ClientHistorique`) | `ClientHistorique` | `GET` | `/client/sites/${selectedSpace.id}/employee-activity?${p.toString(` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {
  Calendar,
  Check,
  ChevronDown,
  CircleMinus,
  Clock,
  Filter,
  Heart,
  RotateCw,
  Star,
  UserCheck,
  XCircle,
  Trash2,
  FileText,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import DatePicker from '../../../components/DatePicker';
import { getEmployeeActivity } from '../../../api/clientService';
import { useClientSites } from '../state/SitesContext';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

/* ── Type config (mirrors the web frontend TYPE_CFG) ── */
const TYPE_CFG = {
  favorite_added:    { label: 'Favori ajouté',        color: '#f59e0b', bg: '#FFF8E1' },
  favorite_removed:  { label: 'Favori retiré',        color: '#9ca3af', bg: '#F5F5F5' },
  favorite_rated:    { label: 'Note mise à jour',     color: '#f59e0b', bg: '#FFF8E1' },
  mission_created:   { label: 'Prestation créée',     color: '#1565C0', bg: '#DBEAFE' },
  mission_cancelled: { label: 'Prestation annulée',   color: '#9B1C1C', bg: '#FEF2F2' },
  mission_deleted:   { label: 'Prestation supprimée', color: '#9B1C1C', bg: '#FEF2F2' },
  mission_finished:  { label: 'Prestation terminée',  color: '#15803D', bg: '#DCFCE7' },
  nomination:        { label: 'Extra nominé',         color: '#7E22CE', bg: '#F3E8FF' },
  nomination_made:   { label: 'Extra nominé',         color: '#7E22CE', bg: '#F3E8FF' },
};

const ACTIVITY_TYPES = [
  { key: 'ALL', label: 'Tous les types' },
  ...Object.entries(TYPE_CFG).map(([k, v]) => ({ key: k, label: v.label })),
];

/* ── Icon for each type ── */
function TypeIcon({ type, size = 14, color }) {
  switch (type) {
    case 'favorite_added':
    case 'favorite_removed':
      return <Heart size={size} color={color} />;
    case 'favorite_rated':
      return <Star size={size} color={color} />;
    case 'mission_created':
      return <FileText size={size} color={color} />;
    case 'mission_cancelled':
      return <XCircle size={size} color={color} />;
    case 'mission_deleted':
      return <Trash2 size={size} color={color} />;
    case 'mission_finished':
      return <Check size={size} color={color} />;
    case 'nomination':
    case 'nomination_made':
      return <UserCheck size={size} color={color} />;
    default:
      return <Clock size={size} color={color} />;
  }
}

/* ── Date helpers ── */
const fmtDateSh = d =>
  d
    ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '—';
const fmtTime = d =>
  d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
const fmtDate = (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  d ? new Date(d).toLocaleDateString('fr-FR', opts) : '—';
const todayStr = () => new Date().toISOString().split('T')[0];

function initials(firstname, name) {
  return `${firstname?.[0] || ''}${name?.[0] || ''}`.toUpperCase();
}

export default function ClientHistorique({ selectedSpace } = {}) {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const { activeSite } = useClientSites();
  const site = selectedSpace || activeSite;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterEmp, setFilterEmp] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!site?.id) {
      setLoading(false);
      setData(null);
      return;
    }
    setIsRefreshing(true);
    try {
      const result = await getEmployeeActivity(site.id, {
        type: selectedType,
        employee_id: filterEmp !== 'ALL' ? filterEmp : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      setData(result);
    } catch (error) {
      Alert.alert('Erreur', "Erreur lors du chargement de l'historique.");
      setData(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [site?.id, selectedType, filterEmp, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  function handleRefresh() {
    load();
  }

  function handleReset() {
    setFilterEmp('ALL');
    setSelectedType('ALL');
    setDateFrom('');
    setDateTo('');
  }

  const selectedTypeObj =
    ACTIVITY_TYPES.find(t => t.key === selectedType) || ACTIVITY_TYPES[0];

  const employees = data?.employees || [];
  const activity = data?.activity || [];
  const stats = data?.stats || {};
  const space = data?.space || { name: site?.space_name || '', city: site?.city || '' };

  // Group by day
  const grouped = (() => {
    const map = {};
    activity.forEach(item => {
      const day = item.date?.slice(0, 10) || 'unknown';
      if (!map[day]) map[day] = [];
      map[day].push(item);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  })();

  const hasFilters =
    filterEmp !== 'ALL' || selectedType !== 'ALL' || dateFrom || dateTo;

  /* ── Render stat card ── */
  const STAT_CARDS = [
    { num: stats.total || 0, label: 'Total', color: colors.orange },
    { num: stats.missions || 0, label: 'Missions', color: '#1565C0' },
    { num: stats.favorites || 0, label: 'Favoris', color: '#F59E0B' },
    { num: stats.nominations || 0, label: 'Nominations', color: '#7E22CE' },
  ];

  /* ── Render activity card ── */
  function renderActivityCard(item, index) {
    const cfg = TYPE_CFG[item.type] || { label: item.type, color: '#888', bg: '#F5F5F5' };
    const emp = employees.find(e => e.id === item.employee_id);
    const empName = emp ? `${emp.firstname} ${emp.name}` : '';
    const meta = item.meta || {};
    const isExpanded = expandedId === `${item.date}-${index}`;
    const day = item.date?.slice(0, 10) || '';

    return (
      <Pressable
        key={`${item.date}-${index}`}
        onPress={() => setExpandedId(isExpanded ? null : `${item.date}-${index}`)}
        style={styles.activityCard}
      >
        {/* Icon dot */}
        <View style={[styles.activityIconWrap, { backgroundColor: cfg.bg }]}>
          <TypeIcon type={item.type} size={14} color={cfg.color} />
        </View>

        <View style={styles.activityInfo}>
          {/* Badge + employee */}
          <View style={styles.activityTopRow}>
            <View style={[styles.activityBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.activityBadgeText, { color: cfg.color }]}>
                {cfg.label}
              </Text>
            </View>
            {emp ? (
              <View style={styles.activityEmpRow}>
                <View style={[styles.miniAvatar, { backgroundColor: '#F5E6D8' }]}>
                  <Text style={styles.miniAvatarText}>{initials(emp.firstname, emp.name)}</Text>
                </View>
                <Text style={styles.activityEmpName}>{empName}</Text>
              </View>
            ) : null}
          </View>

          {/* Description */}
          <Text style={styles.activityDescription}>{item.description}</Text>

          {/* Expanded meta */}
          {isExpanded && meta && Object.keys(meta).length > 0 ? (
            <View style={styles.metaBox}>
              {meta.mission_name ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Mission</Text>
                  <Text style={styles.metaValue}>"{meta.mission_name}"</Text>
                </View>
              ) : null}
              {meta.date_debut ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Date</Text>
                  <Text style={styles.metaValue}>{fmtDate(meta.date_debut)}</Text>
                </View>
              ) : null}
              {meta.staff_count ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Staff requis</Text>
                  <Text style={styles.metaValue}>{meta.staff_count} personne(s)</Text>
                </View>
              ) : null}
              {meta.etat ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>État</Text>
                  <Text style={styles.metaValue}>{meta.etat}</Text>
                </View>
              ) : null}
              {meta.is_approved ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Validation</Text>
                  <Text style={styles.metaValue}>{meta.is_approved}</Text>
                </View>
              ) : null}
              {meta.reason ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Motif</Text>
                  <Text style={[styles.metaValue, { color: '#9B1C1C', fontStyle: 'italic' }]}>
                    {meta.reason}
                  </Text>
                </View>
              ) : null}
              {meta.rang ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Note</Text>
                  <Text style={[styles.metaValue, { color: '#F59E0B' }]}>
                    {'★'.repeat(meta.rang)}{'☆'.repeat(5 - meta.rang)} ({meta.rang}/5)
                  </Text>
                </View>
              ) : null}
              {meta.qualification_code ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Qualification</Text>
                  <View style={[styles.metaBadge, { backgroundColor: '#F3E8FF' }]}>
                    <Text style={[styles.metaBadgeText, { color: '#7E22CE' }]}>
                      {meta.qualification_code}
                    </Text>
                  </View>
                </View>
              ) : null}
              {meta.extra_name ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Extra</Text>
                  <Text style={styles.metaValue}>{meta.extra_name}</Text>
                </View>
              ) : null}
              {meta.statut_reponse ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Statut extra</Text>
                  <Text style={styles.metaValue}>{meta.statut_reponse}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Time */}
        <View style={styles.activityTimeCol}>
          <Text style={styles.activityDate}>{fmtDateSh(item.date)}</Text>
          <Text style={styles.activityTime}>{fmtTime(item.date)}</Text>
        </View>
      </Pressable>
    );
  }

  if (!site?.id) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconWrap}>
          <CircleMinus size={40} color={colors.orange} strokeWidth={1.5} />
        </View>
        <Text style={styles.emptyTitle}>Sélectionnez un espace</Text>
        <Text style={styles.emptySubtitle}>
          Sélectionnez un espace pour voir l'historique.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Subheader ── */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Historique — {space.name}</Text>
        <Text style={styles.subHeaderSubtitle}>
          {space.city} · {employees.length} employé(s)
        </Text>
      </View>

      {/* ── Stats ── */}
      {data ? (
        <View style={styles.statsRow}>
          {STAT_CARDS.map((s, i) => (
            <View
              key={i}
              style={[styles.statCard, { borderTopColor: s.color }]}
            >
              <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* ── Filter & Action Card ── */}
      <View style={styles.filterCard}>
        <View style={styles.filterControlsRow}>
          <View style={styles.filtersGroup}>
            <View style={styles.filterBadge}>
              <Filter size={12} color="#BBBBBB" />
              <Text style={styles.filterBadgeText}>Filtres</Text>
            </View>

            <View style={styles.divider} />

            {/* Type dropdown button */}
            <Pressable
              accessibilityLabel={`Filtrer par type : ${selectedTypeObj.label}`}
              accessibilityRole="button"
              onPress={() => setShowTypeDropdown(true)}
              style={styles.dropdownBtn}
            >
              <Text numberOfLines={1} style={styles.dropdownBtnText}>
                {selectedTypeObj.label}
              </Text>
              <ChevronDown size={12} color="#555555" />
            </Pressable>

            {/* Date from */}
            <DatePicker
              accessibilityLabel="Date de début"
              allowClear
              colors={colors}
              onChange={setDateFrom}
              outputFormat="iso"
              placeholder="JJ/MM/AAAA"
              style={styles.dateInputWrap}
              textStyle={styles.dateInput}
              value={dateFrom}
            />

            <Text style={styles.arrowText}>→</Text>

            {/* Date to */}
            <DatePicker
              accessibilityLabel="Date de fin"
              allowClear
              colors={colors}
              onChange={setDateTo}
              outputFormat="iso"
              placeholder="JJ/MM/AAAA"
              style={styles.dateInputWrap}
              textStyle={styles.dateInput}
              value={dateTo}
            />
          </View>

          <View style={styles.refreshGroup}>
            {hasFilters ? (
              <Pressable
                accessibilityLabel="Réinitialiser les filtres"
                accessibilityRole="button"
                onPress={handleReset}
                style={styles.resetBtn}
              >
                <Text style={styles.resetBtnText}>Réinit.</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityLabel="Actualiser l'historique"
              accessibilityRole="button"
              onPress={handleRefresh}
              style={[styles.refreshBtn, isRefreshing && styles.refreshBtnActive]}
            >
              <RotateCw
                size={12}
                color="#888888"
                style={isRefreshing ? styles.refreshIconSpin : undefined}
              />
              <Text style={styles.refreshBtnText}>Actualiser</Text>
            </Pressable>
          </View>
        </View>

        {/* Employee chips */}
        {employees.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.empChipsRow}
            contentContainerStyle={styles.empChipsContent}
          >
            <Pressable
              onPress={() => setFilterEmp('ALL')}
              style={[
                styles.empChip,
                filterEmp === 'ALL' && { borderColor: colors.orange, backgroundColor: colors.orange },
              ]}
            >
              <Text
                style={[
                  styles.empChipText,
                  filterEmp === 'ALL' && { color: '#FFF' },
                ]}
              >
                Tous
              </Text>
            </Pressable>
            {employees.map(e => {
              const active = filterEmp === String(e.id);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => setFilterEmp(String(e.id))}
                  style={[
                    styles.empChip,
                    active && { borderColor: colors.orange, backgroundColor: colors.orange },
                  ]}
                >
                  <View style={[styles.miniAvatar, { backgroundColor: '#F5E6D8' }]}>
                    <Text style={styles.miniAvatarText}>{initials(e.firstname, e.name)}</Text>
                  </View>
                  <Text
                    style={[
                      styles.empChipText,
                      active && { color: '#FFF' },
                    ]}
                  >
                    {e.firstname} {e.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {/* Type options bottom sheet */}
        <Modal
          animationType="fade"
          onRequestClose={() => setShowTypeDropdown(false)}
          transparent
          visible={showTypeDropdown}
        >
          <Pressable
            accessibilityLabel="Fermer la liste"
            accessibilityRole="button"
            onPress={() => setShowTypeDropdown(false)}
            style={styles.pickerBackdrop}
          >
            <Pressable
              onPress={event => event.stopPropagation()}
              style={styles.pickerSheet}
            >
              <Text style={styles.pickerTitle}>Type d'activité</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {ACTIVITY_TYPES.map(item => {
                  const isSelected = selectedType === item.key;
                  return (
                    <Pressable
                      key={item.key}
                      accessibilityLabel={item.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        setSelectedType(item.key);
                        setShowTypeDropdown(false);
                      }}
                      style={styles.pickerOption}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          isSelected && styles.pickerOptionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected ? <Check size={16} color={colors.orange} /> : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      ) : grouped.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <CircleMinus size={40} color={colors.orange} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Aucune activité</Text>
          <Text style={styles.emptySubtitle}>
            {hasFilters
              ? 'Aucune activité pour ces filtres.'
              : "Les activités apparaîtront ici au fil des actions."}
          </Text>
        </View>
      ) : (
        <View style={styles.timelineWrap}>
          {grouped.map(([day, items], gi) => {
            const isToday = day === todayStr();
            const label = isToday
              ? "Aujourd'hui"
              : fmtDate(day, { weekday: 'long', day: 'numeric', month: 'long' });
            return (
              <View key={day}>
                <View
                  style={[
                    styles.daySeparator,
                    isToday && { backgroundColor: '#FAF5F2' },
                    gi > 0 && { borderTopWidth: 1, borderTopColor: '#F0E4DD' },
                  ]}
                >
                  <View
                    style={[
                      styles.dayDot,
                      { backgroundColor: isToday ? colors.orange : '#D1C5BE' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: isToday ? colors.orange : '#999' },
                    ]}
                  >
                    {label}
                  </Text>
                  <Text style={styles.dayCount}>
                    {items.length} action{items.length > 1 ? 's' : ''}
                  </Text>
                </View>
                {items.map((item, ii) => renderActivityCard(item, ii))}
              </View>
            );
          })}
        </View>
      )}

      {/* Footer */}
      {data && activity.length > 0 ? (
        <Text style={styles.footerText}>
          {activity.length} événement{activity.length > 1 ? 's' : ''} · données depuis la
          mise en place du tracking
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 12,
  },

  /* ── Subheader ── */
  subHeader: {
    marginBottom: 4,
    gap: 3,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  subHeaderSubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
  },

  /* ── Stats Row ── */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    borderTopWidth: 3,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: serifFont,
  },
  statLabel: {
    fontSize: 10,
    color: '#AAAAAA',
    fontWeight: '600',
    marginTop: 2,
  },

  /* ── Filter & Action Card ── */
  filterCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  filtersGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BBBBBB',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0D0C8',
    marginHorizontal: 2,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    flex: 1.2,
    minWidth: 100,
    minHeight: 32,
    justifyContent: 'space-between',
  },
  dropdownBtnText: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '500',
    flexShrink: 1,
  },
  refreshGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    minHeight: 32,
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
  },

  /* ── Employee chips ── */
  empChipsRow: {
    flexGrow: 0,
  },
  empChipsContent: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 2,
  },
  empChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  empChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },
  miniAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ECDDD6',
  },
  miniAvatarText: {
    fontSize: 7,
    fontWeight: '700',
    color: colors.orangeDark,
  },

  /* ── Type options bottom sheet ── */
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
  dateInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    minHeight: 32,
    flex: 1,
    minWidth: 80,
    paddingHorizontal: 8,
  },
  dateInput: {
    fontSize: 11,
    color: '#555555',
    padding: 0,
    // No minWidth here: the DatePicker trigger uses space-between, so a fixed
    // min width pushes the calendar icon outside the bordered box.
    flexShrink: 1,
  },
  arrowText: {
    fontSize: 11,
    color: '#BBBBBB',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    minHeight: 32,
  },
  refreshBtnActive: {
    backgroundColor: '#FAF5F2',
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
  },
  refreshIconSpin: {
    transform: [{ rotate: '180deg' }],
  },

  /* ── Loading ── */
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Content / Empty State Card ── */
  emptyCard: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyIconWrap: {
    opacity: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
  },

  /* ── Timeline ── */
  timelineWrap: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    overflow: 'hidden',
  },
  daySeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: '#FAF6F4',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
    flex: 1,
  },
  dayCount: {
    fontSize: 10,
    color: '#BBBBBB',
  },

  /* ── Activity Cards ── */
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F0EC',
  },
  activityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityInfo: {
    flex: 1,
    gap: 3,
  },
  activityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  activityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activityEmpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityEmpName: {
    fontSize: 11,
    color: colors.orangeDark,
    fontWeight: '700',
  },
  activityDescription: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  activityTimeCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  activityDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#BBBBBB',
  },
  activityTime: {
    fontSize: 10,
    color: '#DDDDDD',
  },

  /* ── Meta box (expanded) ── */
  metaBox: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAF6F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BBBBBB',
    textTransform: 'uppercase',
    minWidth: 90,
    flexShrink: 0,
  },
  metaValue: {
    fontSize: 12,
    color: '#555555',
    flexShrink: 1,
  },
  metaBadge: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ── Footer ── */
  footerText: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 10,
  },
});

const stylesByBrand = createBrandStyles(createStyles);
