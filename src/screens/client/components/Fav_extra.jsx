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
  Filter,
  Heart,
  List,
  MapPin,
  Search,
  Star,
  Users,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const defaultExtras = [
  {
    id: 'extra-1',
    name: 'Lucas Martin',
    qualification: 'Serveur',
    rating: 4.9,
    missionsCount: 24,
    location: 'Paris (75)',
    hourlyRate: '16 €/h',
    isFavorite: false,
    initials: 'LM',
  },
  {
    id: 'extra-2',
    name: 'Thomas Laurent',
    qualification: 'Barista',
    rating: 4.8,
    missionsCount: 19,
    location: 'Ile de France',
    hourlyRate: '18 €/h',
    isFavorite: false,
    initials: 'TL',
  },
  {
    id: 'extra-3',
    name: 'Sarah Benali',
    qualification: 'Chef de partie',
    rating: 5.0,
    missionsCount: 32,
    location: 'Paris (75)',
    hourlyRate: '22 €/h',
    isFavorite: false,
    initials: 'SB',
  },
];

const FILTER_ROLES = [
  'Tous',
  'Serveur',
  'Barista',
  'Chef de partie',
  'Commis',
  'Plongeur',
];

export default function Fav_extra() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const [activeTab, setActiveTab] = useState('extras'); // 'extras' | 'favorites'
  const [extras, setExtras] = useState(defaultExtras);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tous');

  function toggleFavorite(id) {
    setExtras(current =>
      current.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  }

  // Filter extras for "Extras disponibles"
  const availableExtras = extras.filter(extra => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      extra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extra.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extra.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === 'Tous' || extra.qualification === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Filter extras for "Mes favoris"
  const favoriteExtras = extras.filter(extra => extra.isFavorite);

  return (
    <View style={styles.container}>
      {/* ── Tab Switcher (Pill Container matching screenshot-1 & screenshot-2) ── */}
      <View style={styles.tabSwitcher}>
        <Pressable
          accessibilityLabel="Extras disponibles"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'extras' }}
          onPress={() => setActiveTab('extras')}
          style={[
            styles.tabButton,
            activeTab === 'extras'
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}
        >
          <Users
            size={15}
            color={activeTab === 'extras' ? colors.white : '#AAAAAA'}
            strokeWidth={2}
          />
          <Text
            style={
              activeTab === 'extras'
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive
            }
          >
            Extras disponibles
          </Text>
          <Text
            style={
              activeTab === 'extras'
                ? styles.tabBadgeActive
                : styles.tabBadgeInactive
            }
          >
            {extras.length}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Mes favoris"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'favorites' }}
          onPress={() => setActiveTab('favorites')}
          style={[
            styles.tabButton,
            activeTab === 'favorites'
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}
        >
          <List
            size={15}
            color={activeTab === 'favorites' ? colors.white : '#AAAAAA'}
            strokeWidth={2}
          />
          <Text
            style={
              activeTab === 'favorites'
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive
            }
          >
            Mes favoris
          </Text>
          <Text
            style={
              activeTab === 'favorites'
                ? styles.tabBadgeActive
                : styles.tabBadgeInactive
            }
          >
            {favoriteExtras.length}
          </Text>
        </Pressable>
      </View>

      {/* ── Content for "Extras disponibles" ── */}
      {activeTab === 'extras' ? (
        <View style={styles.tabContent}>
          {/* Subheader: Title + Search & Filter */}
          <View style={styles.subHeaderRow}>
            <View style={styles.titleCol}>
              <Text style={styles.sectionTitle}>
                Extras — Dashboard Client 02
              </Text>
              <Text style={styles.sectionSubtitle}>
                {availableExtras.length} extra(s) trouvé(s)
              </Text>
            </View>

            <View style={styles.searchAndFilterBar}>
              <View style={styles.searchInputWrap}>
                <Search size={14} color="#BBBBBB" />
                <TextInput
                  accessibilityLabel="Rechercher un extra"
                  onChangeText={setSearchQuery}
                  placeholder="Rechercher un extra..."
                  placeholderTextColor="#BBBBBB"
                  style={styles.searchInput}
                  value={searchQuery}
                />
              </View>

              <View style={styles.filterTrigger}>
                <Filter size={13} color="#AAAAAA" />
                <Text style={styles.filterTriggerText}>Filtrer :</Text>
              </View>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {FILTER_ROLES.map(role => {
              const isSelected = selectedRole === role;
              return (
                <Pressable
                  key={role}
                  accessibilityLabel={`Filtrer par ${role}`}
                  accessibilityRole="button"
                  onPress={() => setSelectedRole(role)}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* List or Placeholder */}
          {availableExtras.length === 0 ? (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderTitle}>Aucun extra trouvé</Text>
              <Text style={styles.placeholderText}>
                Essayez de modifier les filtres.
              </Text>
            </View>
          ) : (
            <View style={styles.extrasList}>
              {availableExtras.map(extra => (
                <View key={extra.id} style={styles.extraCard}>
                  <View style={styles.extraCardTop}>
                    <View style={styles.extraAvatar}>
                      <Text style={styles.extraAvatarText}>
                        {extra.initials}
                      </Text>
                    </View>
                    <View style={styles.extraInfo}>
                      <Text style={styles.extraName}>{extra.name}</Text>
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>
                          {extra.qualification}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      accessibilityLabel={
                        extra.isFavorite
                          ? 'Retirer des favoris'
                          : 'Ajouter aux favoris'
                      }
                      accessibilityRole="button"
                      onPress={() => toggleFavorite(extra.id)}
                      style={[
                        styles.favoriteBtn,
                        extra.isFavorite && styles.favoriteBtnActive,
                      ]}
                    >
                      <Heart
                        size={17}
                        color={extra.isFavorite ? '#E11D48' : '#888888'}
                        fill={extra.isFavorite ? '#E11D48' : 'none'}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.extraCardFooter}>
                    <View style={styles.metaCol}>
                      <View style={styles.metaRow}>
                        <Star size={13} color="#D97706" fill="#D97706" />
                        <Text style={styles.metaRatingText}>
                          {extra.rating} ({extra.missionsCount} missions)
                        </Text>
                      </View>
                      <View style={styles.metaRow}>
                        <MapPin size={12} color="#AAAAAA" />
                        <Text style={styles.metaLocationText}>
                          {extra.location}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.hourlyRateText}>
                      {extra.hourlyRate}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* ── Content for "Mes favoris" ── */
        <View style={styles.tabContent}>
          {/* Subheader: Title */}
          <View style={styles.subHeaderSimple}>
            <Text style={styles.sectionTitle}>
              Mes favoris — Dashboard Client 02
            </Text>
            <Text style={styles.sectionSubtitle}>
              {favoriteExtras.length} extra(s) dans vos favoris
            </Text>
          </View>

          {/* List or Placeholder */}
          {favoriteExtras.length === 0 ? (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderTitle}>Aucun favori</Text>
              <Text style={styles.placeholderText}>
                Ajoutez des extras depuis l'onglet "Extras disponibles".
              </Text>
            </View>
          ) : (
            <View style={styles.extrasList}>
              {favoriteExtras.map(extra => (
                <View key={extra.id} style={styles.extraCard}>
                  <View style={styles.extraCardTop}>
                    <View style={styles.extraAvatar}>
                      <Text style={styles.extraAvatarText}>
                        {extra.initials}
                      </Text>
                    </View>
                    <View style={styles.extraInfo}>
                      <Text style={styles.extraName}>{extra.name}</Text>
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>
                          {extra.qualification}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      accessibilityLabel="Retirer des favoris"
                      accessibilityRole="button"
                      onPress={() => toggleFavorite(extra.id)}
                      style={[styles.favoriteBtn, styles.favoriteBtnActive]}
                    >
                      <Heart size={17} color="#E11D48" fill="#E11D48" />
                    </Pressable>
                  </View>

                  <View style={styles.extraCardFooter}>
                    <View style={styles.metaCol}>
                      <View style={styles.metaRow}>
                        <Star size={13} color="#D97706" fill="#D97706" />
                        <Text style={styles.metaRatingText}>
                          {extra.rating} ({extra.missionsCount} missions)
                        </Text>
                      </View>
                      <View style={styles.metaRow}>
                        <MapPin size={12} color="#AAAAAA" />
                        <Text style={styles.metaLocationText}>
                          {extra.location}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.hourlyRateText}>
                      {extra.hourlyRate}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 14,
  },

  /* ── Tab Switcher (Pill container) ── */
  tabSwitcher: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.orange,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabButtonTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  tabButtonTextInactive: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888888',
  },
  tabBadgeActive: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: colors.white,
    paddingVertical: 1,
    paddingHorizontal: 7,
    borderRadius: 20,
  },
  tabBadgeInactive: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#F0E4DD',
    color: colors.orangeDark,
    paddingVertical: 1,
    paddingHorizontal: 7,
    borderRadius: 20,
  },

  /* ── Tab Content ── */
  tabContent: {
    gap: 12,
  },

  /* ── Subheaders ── */
  subHeaderRow: {
    gap: 10,
    marginBottom: 4,
  },
  subHeaderSimple: {
    marginBottom: 4,
    gap: 3,
  },
  titleCol: {
    gap: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
  },

  /* ── Search and Filter Bar ── */
  searchAndFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  searchInputWrap: {
    flex: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.orangeDark,
    padding: 0,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  filterTriggerText: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
  },

  /* ── Filter Chips ── */
  filterChipsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0D0C8',
  },
  filterChipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterChipText: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  /* ── Placeholder Box (matches screenshot-1 & screenshot-2) ── */
  placeholderBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E3C5B8',
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.orangeDark,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: serifFont,
  },
  placeholderText: {
    fontSize: 13,
    color: '#BBBBBB',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* ── Extra Cards ── */
  extrasList: {
    gap: 10,
  },
  extraCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    padding: 14,
    gap: 10,
  },
  extraCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  extraAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.orange,
  },
  extraInfo: {
    flex: 1,
    minWidth: 0,
  },
  extraName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF5F2',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.orangeDark,
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  favoriteBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  extraCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FAF3EF',
  },
  metaCol: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaRatingText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },
  metaLocationText: {
    fontSize: 12,
    color: '#888888',
  },
  hourlyRateText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orange,
  },
});
const stylesByBrand = createBrandStyles(createStyles);
