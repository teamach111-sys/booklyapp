import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Check,
  ChevronDown,
  CircleMinus,
  Clock,
  Filter,
  Heart,
  RotateCw,
  Star,
  UserCheck,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import DatePicker from '../../../components/DatePicker';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const ACTIVITY_TYPES = [
  { key: 'ALL', label: 'Tous les types' },
  { key: 'favorite_added', label: 'Favori ajouté' },
  { key: 'favorite_removed', label: 'Favori retiré' },
  { key: 'favorite_rated', label: 'Note mise à jour' },
  { key: 'mission_created', label: 'Prestation créée' },
  { key: 'mission_cancelled', label: 'Prestation annulée' },
  { key: 'mission_deleted', label: 'Prestation supprimée' },
  { key: 'mission_finished', label: 'Prestation terminée' },
  { key: 'nomination_made', label: 'Extra nominé' },
];

export default function ClientHistorique() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const [activities] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }

  const selectedTypeObj =
    ACTIVITY_TYPES.find(t => t.key === selectedType) || ACTIVITY_TYPES[0];

  const filteredActivities = activities.filter(item => {
    if (selectedType !== 'ALL' && item.type !== selectedType) {
      return false;
    }
    if (dateFrom && item.date < dateFrom) return false;
    if (dateTo && item.date > dateTo) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* ── Subheader ── */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>
          Historique — Dashboard Client 02
        </Text>
        <Text style={styles.subHeaderSubtitle}>
          Dashboard Client 02 · 0 employé(s)
        </Text>
      </View>

      {/* ── Filter & Action Card ── */}
      <View style={styles.filterCard}>
        <View style={styles.filterControlsRow}>
          {/* Filtres indicator */}
          <View style={styles.filterBadge}>
            <Filter size={12} color="#BBBBBB" />
            <Text style={styles.filterBadgeText}>Filtres</Text>
          </View>

          {/* Vertical divider */}
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

          {/* Arrow */}
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

          {/* Actualiser Button */}
          <View style={styles.refreshBtnCol}>
            <Pressable
              accessibilityLabel="Actualiser l'historique"
              accessibilityRole="button"
              onPress={handleRefresh}
              style={[
                styles.refreshBtn,
                isRefreshing && styles.refreshBtnActive,
              ]}
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
                      {isSelected ? (
                        <Check size={16} color={colors.orange} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>

      {/* ── Content: Activity List or Empty State (matching screenshot-1) ── */}
      {filteredActivities.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <CircleMinus
              size={40}
              color={colors.orange}
              strokeWidth={1.5}
            />
          </View>
          <Text style={styles.emptyTitle}>Aucune activité</Text>
          <Text style={styles.emptySubtitle}>
            Les activités apparaîtront ici au fil des actions.
          </Text>
        </View>
      ) : (
        <View style={styles.activitiesList}>
          {filteredActivities.map(item => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.activityIconWrap}>
                {item.type.startsWith('favorite') ? (
                  <Heart size={14} color={colors.orange} />
                ) : item.type === 'favorite_rated' ? (
                  <Star size={14} color="#D97706" />
                ) : item.type === 'nomination_made' ? (
                  <UserCheck size={14} color="#15803D" />
                ) : (
                  <Clock size={14} color={colors.orangeDark} />
                )}
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityActionText}>{item.action}</Text>
                <Text style={styles.activityMetaText}>
                  {item.author} · {item.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
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
    gap: 8,
    flexWrap: 'wrap',
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
    height: 20,
    backgroundColor: '#E0D0C8',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    minWidth: 130,
    justifyContent: 'space-between',
  },
  dropdownBtnText: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '500',
    flexShrink: 1,
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
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  dateInput: {
    fontSize: 11,
    color: '#555555',
    padding: 0,
    minWidth: 70,
  },
  arrowText: {
    fontSize: 11,
    color: '#BBBBBB',
  },
  refreshBtnCol: {
    marginLeft: 'auto',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
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

  /* ── Content / Empty State Card (matches screenshot-1) ── */
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

  /* ── Activity Cards ── */
  activitiesList: {
    gap: 8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  activityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FAF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityActionText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  activityMetaText: {
    fontSize: 11,
    color: '#999999',
  },
});

const stylesByBrand = createBrandStyles(createStyles);
