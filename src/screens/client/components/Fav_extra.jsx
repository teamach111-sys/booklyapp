/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Fav_extra
 * **Associated Route/Context**: `/client (Tab/Modal: Fav_extra)`  
 * **Total Discovered Backend Calls**: 2
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Fav_extra.jsx:149`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Fav_extra.jsx#L149) | Toggle Switch / Status Change (`handleToggle`) | `handleToggle` | `POST` | `/client/favorites/toggle` | `spaceId, extraId` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`Fav_extra.jsx:163`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Fav_extra.jsx#L163) | User Action Handler (`handleRating`) | `handleRating` | `POST` | `/client/favorites/rang` | `spaceId, extraId, rang` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * 
 * =====================================================================
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Filter,
  Heart,
  List,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import { useClientSites } from '../state/SitesContext';
import {
  getExtrasForSpace,
  getFavoritesBySpace,
  toggleFavoriteExtra,
  updateFavoriteRang,
} from '../../../api/clientService';
import { API_BASE_URL } from '../../../config/env';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const QUAL_LABELS = {
  BARISTA: 'Barista',
  CHEF_DE_CUISINE: 'Chef de cuisine',
  COMMIS: 'Commis',
  PLONGEUR: 'Plongeur',
  CHEF_DE_PARTIE: 'Chef de partie',
  CHEF_DE_RANG: 'Chef de rang',
  SERVEUR: 'Serveur',
  BARTENDER: 'Bartender',
  SOMMELIER: 'Sommelier',
  PATISSIER: 'Pâtissier',
};

const qualLabel = code => {
  if (!code) return '';
  const label = QUAL_LABELS[code] || code.replace(/_/g, ' ');
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
};

function Avatar({ photo, firstname, name, size = 48 }) {
  const { colors } = useClientTheme();
  const initials = ((firstname?.[0] || '') + (name?.[0] || '')).toUpperCase();
  const src = photo
    ? photo.startsWith('http')
      ? photo
      : `${API_BASE_URL.replace('/api', '')}/${photo}`
    : null;

  if (src) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: '#ecddd6',
          flexShrink: 0,
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FDF3EE',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FDF3EE',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ecddd6',
        flexShrink: 0,
      }}
    >
      <Text
        style={{
          fontSize: size * 0.33,
          fontWeight: '700',
          color: colors.orange,
        }}
      >
        {initials || '?'}
      </Text>
    </View>
  );
}

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  const displayValue = hover || value || 0;

  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= displayValue;
        return (
          <Pressable
            key={star}
            disabled={readonly}
            onPress={() => !readonly && onChange && onChange(star)}
            onPressIn={() => !readonly && setHover(star)}
            onPressOut={() => !readonly && setHover(0)}
            style={{ padding: 1 }}
          >
            <Star
              size={16}
              color={filled ? '#f59e0b' : '#ddd'}
              fill={filled ? '#f59e0b' : 'none'}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Fav_extra({ selectedSpace: propSelectedSpace } = {}) {
  const { partner, colors } = useClientTheme();
  const { activeSite } = useClientSites();
  const styles = stylesByBrand[partner];
  const selectedSpace = propSelectedSpace || activeSite;

  const [activeTab, setActiveTab] = useState('extras');
  const [extras, setExtras] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [loadingEx, setLoadingEx] = useState(true);
  const [loadingFav, setLoadingFav] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [filterQual, setFilterQual] = useState('');
  const [allQuals, setAllQuals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const spaceId = selectedSpace?.id;

  const fetchExtras = useCallback(async () => {
    if (!spaceId) {
      setLoadingEx(false);
      return;
    }
    setLoadingEx(true);
    try {
      const data = await getExtrasForSpace(spaceId);
      const list = data?.extras || [];
      setExtras(list);
      const quals = [
        ...new Set(list.flatMap(e => e.qualifications || [])),
      ].sort();
      setAllQuals(quals);
    } catch (error) {
      Alert.alert('Erreur', "Erreur lors du chargement des extras.");
    } finally {
      setLoadingEx(false);
    }
  }, [spaceId]);

  const fetchFavorites = useCallback(async () => {
    if (!spaceId) {
      setLoadingFav(false);
      return;
    }
    setLoadingFav(true);
    try {
      const data = await getFavoritesBySpace(spaceId);
      const list = data?.favorites || [];
      setFavorites(list);
      setFavIds(new Set(list.map(f => f.id)));
    } catch (error) {
      Alert.alert('Erreur', "Erreur lors du chargement des favoris.");
    } finally {
      setLoadingFav(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchExtras();
    fetchFavorites();
  }, [fetchExtras, fetchFavorites]);

  const handleToggle = async extraId => {
    if (!spaceId) return;
    setToggling(extraId);
    try {
      await toggleFavoriteExtra(spaceId, extraId);
      await fetchFavorites();
      const isNowFav = !favIds.has(extraId);
      // Silent success like web (toasts) - just update state
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour des favoris.');
    } finally {
      setToggling(null);
    }
  };

  const handleRating = async (extraId, rang) => {
    if (!spaceId) return;
    try {
      await updateFavoriteRang(spaceId, extraId, rang);
      setFavorites(prev =>
        prev.map(f => (f.id === extraId ? { ...f, rang } : f)),
      );
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour de la note.');
    }
  };

  const filteredExtras = extras
    .filter(e => (filterQual ? (e.qualifications || []).includes(filterQual) : true))
    .filter(e => {
      if (!searchTerm.trim()) return true;
      const fullName = `${e.firstname || ''} ${e.name || ''}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = `${a.firstname || ''} ${a.name || ''}`.toLowerCase();
      const nameB = `${b.firstname || ''} ${b.name || ''}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const favoriteExtras = favorites
    .slice()
    .sort((a, b) => (b.rang || 0) - (a.rang || 0));

  if (!selectedSpace) {
    return (
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderTitle}>Aucun espace sélectionné</Text>
        <Text style={styles.placeholderText}>
          Sélectionnez un espace dans le menu pour voir les extras disponibles.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
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
            {favorites.length}
          </Text>
        </Pressable>
      </View>

      {activeTab === 'extras' ? (
        <View style={styles.tabContent}>
          <View style={styles.subHeaderRow}>
            <View style={styles.titleCol}>
              <Text style={styles.sectionTitle}>
                Extras — {selectedSpace.city || selectedSpace.name}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {filteredExtras.length} extra(s) trouvé(s)
              </Text>
            </View>

            <View style={styles.searchAndFilterBar}>
              <View style={styles.searchInputWrap}>
                <Search size={14} color="#BBBBBB" />
                <TextInput
                  accessibilityLabel="Rechercher un extra"
                  onChangeText={setSearchTerm}
                  placeholder="Rechercher un extra..."
                  placeholderTextColor="#BBBBBB"
                  style={styles.searchInput}
                  value={searchTerm}
                />
              </View>
              <View style={styles.filterTrigger}>
                <Filter size={13} color="#AAAAAA" />
                <Text style={styles.filterTriggerText}>Filtrer :</Text>
              </View>
            </View>
          </View>

          {filterQual ? (
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <Pressable
                onPress={() => setFilterQual('')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: colors.orange,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.white }}>
                  {qualLabel(filterQual)}
                </Text>
                <X size={13} color={colors.white} />
              </Pressable>
            </View>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {allQuals
              .filter(q => q !== filterQual)
              .map(role => (
                <Pressable
                  key={role}
                  accessibilityLabel={`Filtrer par ${qualLabel(role)}`}
                  accessibilityRole="button"
                  onPress={() => setFilterQual(role)}
                  style={[styles.filterChip]}
                >
                  <Text style={styles.filterChipText}>
                    {qualLabel(role)}
                  </Text>
                </Pressable>
              ))}
          </ScrollView>

          {loadingEx ? (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <ActivityIndicator color={colors.orange} />
            </View>
          ) : filteredExtras.length === 0 ? (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderTitle}>Aucun extra trouvé</Text>
              <Text style={styles.placeholderText}>
                Essayez de modifier les filtres.
              </Text>
            </View>
          ) : (
            <View style={styles.extrasList}>
              {filteredExtras.map(extra => {
                const isFav = favIds.has(extra.id);
                const isTogglingItem = toggling === extra.id;
                return (
                  <View key={extra.id} style={styles.extraCard}>
                    <View style={styles.extraCardTop}>
                      <Avatar
                        photo={extra.profile_photo_url}
                        firstname={extra.firstname}
                        name={extra.name}
                        size={44}
                      />
                      <View style={styles.extraInfo}>
                        <Text style={styles.extraName}>
                          {extra.firstname} {extra.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#AAAAAA', marginTop: 2 }}>
                          {extra.city}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            marginTop: 4,
                            color:
                              extra.statut_auto_entrepreneur === 'oui'
                                ? '#2e7d32'
                                : '#888',
                          }}
                        >
                          {extra.statut_auto_entrepreneur === 'oui'
                            ? '✓ Auto-entrepreneur'
                            : extra.statut_auto_entrepreneur === 'en_cours'
                            ? 'En cours'
                            : 'Non AE'}
                        </Text>
                      </View>
                      <Pressable
                        accessibilityLabel={
                          isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'
                        }
                        accessibilityRole="button"
                        disabled={isTogglingItem}
                        onPress={() => handleToggle(extra.id)}
                        style={[
                          styles.favoriteBtn,
                          isFav && styles.favoriteBtnActive,
                          isTogglingItem && { opacity: 0.6 },
                        ]}
                      >
                        <Heart
                          size={17}
                          color={isFav ? '#E11D48' : '#888888'}
                          fill={isFav ? '#E11D48' : 'none'}
                        />
                      </Pressable>
                    </View>

                    {extra.qualifications?.length > 0 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 5,
                          marginTop: 4,
                        }}
                      >
                        {extra.qualifications.map(q => (
                          <Pressable
                            key={q}
                            onPress={() => setFilterQual(q)}
                            style={{
                              paddingVertical: 2,
                              paddingHorizontal: 8,
                              borderRadius: 20,
                              backgroundColor:
                                filterQual === q ? colors.orange : '#f0e4dd',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '600',
                                color: filterQual === q ? colors.white : colors.orange,
                              }}
                            >
                              {qualLabel(q)}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.tabContent}>
          <View style={styles.subHeaderSimple}>
            <Text style={styles.sectionTitle}>
              Mes favoris — {selectedSpace.city || selectedSpace.space_name || selectedSpace.name}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {favoriteExtras.length} extra(s) dans vos favoris
            </Text>
          </View>

          {loadingFav ? (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <ActivityIndicator color={colors.orange} />
            </View>
          ) : favoriteExtras.length === 0 ? (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderTitle}>Aucun favori</Text>
              <Text style={styles.placeholderText}>
                Ajoutez des extras depuis l'onglet "Extras disponibles".
              </Text>
            </View>
          ) : (
            <View style={styles.extrasList}>
              {favoriteExtras.map((fav, idx) => (
                <View key={fav.id} style={styles.extraCard}>
                  <View style={styles.extraCardTop}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor:
                          idx === 0
                            ? '#f59e0b'
                            : idx === 1
                            ? '#9ca3af'
                            : idx === 2
                            ? '#b45309'
                            : '#f0e4dd',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '700',
                          color: idx <= 2 ? colors.white : colors.orange,
                        }}
                      >
                        {idx + 1}
                      </Text>
                    </View>
                    <Avatar
                      photo={fav.profile_photo_url}
                      firstname={fav.firstname}
                      name={fav.name}
                      size={44}
                    />
                    <View style={styles.extraInfo}>
                      <Text style={styles.extraName}>
                        {fav.firstname} {fav.name}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#AAAAAA', marginTop: 2 }}>
                        {fav.city}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityLabel="Retirer des favoris"
                      accessibilityRole="button"
                      disabled={toggling === fav.id}
                      onPress={() => handleToggle(fav.id)}
                      style={[
                        styles.favoriteBtn,
                        styles.favoriteBtnActive,
                        toggling === fav.id && { opacity: 0.6 },
                      ]}
                    >
                      <Heart size={17} color="#E11D48" fill="#E11D48" />
                    </Pressable>
                  </View>

                  <View style={styles.extraCardFooter}>
                    <View style={styles.metaCol}>
                      <StarRating
                        value={fav.rang || 0}
                        onChange={rang => handleRating(fav.id, rang)}
                      />
                      <Text style={{ fontSize: 10, color: '#BBBBBB', marginTop: 4 }}>
                        {fav.rang ? fav.rang + '/5' : 'Non noté'}
                      </Text>
                    </View>
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

const createStyles = colors =>
  StyleSheet.create({
    container: {
      gap: 14,
    },
    tabSwitcher: {
      flexDirection: 'row',
      gap: 4,
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: '#ECDDD6',
      alignItems: 'stretch',
    },
    tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 8,
      minHeight: 38,
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
      flexShrink: 1,
      textAlign: 'center',
    },
    tabButtonTextInactive: {
      fontSize: 13,
      fontWeight: '500',
      color: '#888888',
      flexShrink: 1,
      textAlign: 'center',
    },
    tabBadgeActive: {
      fontSize: 10,
      fontWeight: '700',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      color: colors.white,
      paddingVertical: 1,
      paddingHorizontal: 6,
      borderRadius: 20,
      flexShrink: 0,
    },
    tabBadgeInactive: {
      fontSize: 10,
      fontWeight: '700',
      backgroundColor: '#F0E4DD',
      color: colors.orangeDark,
      paddingVertical: 1,
      paddingHorizontal: 6,
      borderRadius: 20,
      flexShrink: 0,
    },
    tabContent: {
      gap: 12,
    },
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
    filterChipText: {
      fontSize: 11,
      color: '#888888',
      fontWeight: '500',
    },
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
    extraInfo: {
      flex: 1,
      minWidth: 0,
    },
    extraName: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1A1A1A',
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
  });

const stylesByBrand = createBrandStyles(createStyles);
