import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Calendar,
  ChevronDown,
  CircleMinus,
  Clock,
  Filter,
  Heart,
  RotateCw,
  Star,
  UserCheck,
} from 'lucide-react-native';
import { colors } from '../../../styles';

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
            onPress={() => setShowTypeDropdown(current => !current)}
            style={styles.dropdownBtn}
          >
            <Text numberOfLines={1} style={styles.dropdownBtnText}>
              {selectedTypeObj.label}
            </Text>
            <ChevronDown size={12} color="#555555" />
          </Pressable>

          {/* Date from */}
          <View style={styles.dateInputWrap}>
            <Calendar size={11} color="#BBBBBB" />
            <TextInput
              accessibilityLabel="Date de début (mm/dd/yyyy)"
              onChangeText={setDateFrom}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#BBBBBB"
              style={styles.dateInput}
              value={dateFrom}
            />
          </View>

          {/* Arrow */}
          <Text style={styles.arrowText}>→</Text>

          {/* Date to */}
          <View style={styles.dateInputWrap}>
            <Calendar size={11} color="#BBBBBB" />
            <TextInput
              accessibilityLabel="Date de fin (mm/dd/yyyy)"
              onChangeText={setDateTo}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#BBBBBB"
              style={styles.dateInput}
              value={dateTo}
            />
          </View>

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

        {/* Dropdown Options List */}
        {showTypeDropdown ? (
          <View style={styles.dropdownMenu}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.dropdownScroll}
            >
              {ACTIVITY_TYPES.map(item => {
                const isSelected = selectedType === item.key;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityLabel={item.label}
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedType(item.key);
                      setShowTypeDropdown(false);
                    }}
                    style={[
                      styles.dropdownOption,
                      isSelected && styles.dropdownOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
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

const styles = StyleSheet.create({
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
  dropdownMenu: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF3EF',
  },
  dropdownOptionActive: {
    backgroundColor: '#FDF3EE',
  },
  dropdownOptionText: {
    fontSize: 11,
    color: '#555555',
  },
  dropdownOptionTextActive: {
    color: colors.orange,
    fontWeight: '700',
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
