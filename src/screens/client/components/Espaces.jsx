import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Building2,
  CheckCircle2,
  Edit3,
  MapPin,
  Navigation,
  Plus,
  Power,
  Trash2,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const defaultSites = [
  {
    id: 'site-1',
    name: 'Dashboard Client 02',
    address: '1 Rue du Test 02, Paris',
    city: 'Ile de France',
    isActive: true,
    isCurrent: true,
  },
];

export default function Espaces() {
  const [sites, setSites] = useState(defaultSites);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [siteCity, setSiteCity] = useState('Ile de France');

  function resetForm() {
    setSiteName('');
    setSiteAddress('');
    setSiteCity('Ile de France');
    setEditingId(null);
    setModalMode(null);
  }

  function openCreateModal() {
    resetForm();
    setModalMode('create');
  }

  function openEditModal(site) {
    setEditingId(site.id);
    setSiteName(site.name || '');
    setSiteAddress(site.address || '');
    setSiteCity(site.city || 'Ile de France');
    setModalMode('edit');
  }

  function closeModal() {
    resetForm();
  }

  function handleSubmit() {
    const trimmedName = siteName.trim();
    if (!trimmedName) {
      Alert.alert('Champ requis', 'Veuillez saisir le nom du site.');
      return;
    }

    if (modalMode === 'create') {
      const newSite = {
        id: Date.now().toString(),
        name: trimmedName,
        address: siteAddress.trim() || '1 Rue du Test 02, Paris',
        city: siteCity.trim() || 'Ile de France',
        isActive: true,
        isCurrent: sites.length === 0,
      };
      setSites(current => [...current, newSite]);
      closeModal();
    } else if (modalMode === 'edit') {
      setSites(current =>
        current.map(item =>
          item.id === editingId
            ? {
                ...item,
                name: trimmedName,
                address: siteAddress.trim(),
                city: siteCity.trim(),
              }
            : item,
        ),
      );
      closeModal();
    }
  }

  function handleSelectActive(id) {
    setSites(current =>
      current.map(item => ({
        ...item,
        isCurrent: item.id === id,
      })),
    );
  }

  function handleToggleActive(id, currentStatus) {
    setSites(current =>
      current.map(item =>
        item.id === id
          ? {
              ...item,
              isActive: !currentStatus,
              isCurrent: currentStatus ? false : item.isCurrent,
            }
          : item,
      ),
    );
  }

  function handleDelete(id, name) {
    Alert.alert(
      'Supprimer le site',
      `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setSites(current => {
              const remaining = current.filter(item => item.id !== id);
              if (
                remaining.length > 0 &&
                !remaining.some(item => item.isCurrent)
              ) {
                remaining[0].isCurrent = true;
              }
              return remaining;
            });
          },
        },
      ],
    );
  }

  const totalSites = sites.length;
  const activeSites = sites.filter(s => s.isActive).length;
  const inactiveSites = sites.filter(s => !s.isActive).length;

  return (
    <View style={styles.container}>
      {/* ── Subheader: "Mes espaces" / "{activeSites} actif" + "+ Ajouter un site" ── */}
      <View style={styles.subHeaderRow}>
        <View style={styles.subHeaderTitles}>
          <Text style={styles.subHeaderTitle}>Mes espaces</Text>
          <Text style={styles.subHeaderSubtitle}>
            {activeSites} actif{activeSites > 1 ? 's' : ''}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Ajouter un site"
          accessibilityRole="button"
          onPress={openCreateModal}
          style={styles.addButton}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un site</Text>
        </Pressable>
      </View>

      {/* ── 3 Stat Cards Row ── */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={[styles.statNum, styles.statNumPrimary]}>
            {totalSites}
          </Text>
          <Text style={styles.statLabel}>Total sites</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSuccess]}>
          <Text style={[styles.statNum, styles.statNumSuccess]}>
            {activeSites}
          </Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={[styles.statCard, styles.statCardMuted]}>
          <Text style={[styles.statNum, styles.statNumMuted]}>
            {inactiveSites}
          </Text>
          <Text style={styles.statLabel}>Désactivés</Text>
        </View>
      </View>

      {/* ── Content: Sites Cards List or Empty State ── */}
      {sites.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Building2 size={24} color="#CCCCCC" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Aucun site enregistré</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez les établissements pour lesquels vous recherchez du personnel.
          </Text>
        </View>
      ) : (
        <View style={styles.sitesList}>
          {sites.map(site => {
            const isSelected = site.isCurrent;
            return (
              <Pressable
                key={site.id}
                accessibilityLabel={`Sélectionner ${site.name}`}
                accessibilityRole="button"
                onPress={() => handleSelectActive(site.id)}
                style={[
                  styles.siteCard,
                  isSelected && styles.siteCardActive,
                  !site.isActive && styles.siteCardDisabled,
                ]}
              >
                {isSelected ? <View style={styles.activeAccentBar} /> : null}

                <View style={styles.siteCardBody}>
                  {/* Top Row: Icon + Name/Badges + Actions */}
                  <View style={styles.siteHeaderRow}>
                    <View style={styles.siteIconWrap}>
                      <Building2 size={18} color={colors.orange} />
                    </View>

                    <View style={styles.siteInfoCol}>
                      <Text numberOfLines={1} style={styles.siteTitle}>
                        {site.name}
                      </Text>
                      <View style={styles.badgeRow}>
                        {site.isActive ? (
                          <View style={styles.statusBadgeActive}>
                            <CheckCircle2 size={11} color="#15803D" />
                            <Text style={styles.statusBadgeActiveText}>
                              Actif
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.statusBadgeInactive}>
                            <Text style={styles.statusBadgeInactiveText}>
                              Désactivé
                            </Text>
                          </View>
                        )}
                        {isSelected ? (
                          <View style={styles.enCoursBadge}>
                            <Text style={styles.enCoursBadgeText}>En cours</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.actionsRow}>
                      <Pressable
                        accessibilityLabel="Modifier le site"
                        accessibilityRole="button"
                        onPress={e => {
                          e.stopPropagation();
                          openEditModal(site);
                        }}
                        style={styles.actionBtn}
                      >
                        <Edit3 size={12} color={colors.orangeDark} />
                      </Pressable>
                      <Pressable
                        accessibilityLabel={
                          site.isActive ? 'Désactiver le site' : 'Activer le site'
                        }
                        accessibilityRole="button"
                        onPress={e => {
                          e.stopPropagation();
                          handleToggleActive(site.id, site.isActive);
                        }}
                        style={[
                          styles.actionBtn,
                          site.isActive
                            ? styles.actionBtnPowerActive
                            : styles.actionBtnPowerInactive,
                        ]}
                      >
                        <Power
                          size={12}
                          color={site.isActive ? '#9B1C1C' : '#15803D'}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityLabel="Supprimer le site"
                        accessibilityRole="button"
                        onPress={e => {
                          e.stopPropagation();
                          handleDelete(site.id, site.name);
                        }}
                        style={[styles.actionBtn, styles.actionBtnDelete]}
                      >
                        <Trash2 size={12} color="#9B1C1C" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Region Row */}
                  <View style={styles.metaRow}>
                    <Navigation
                      size={12}
                      color="#BBBBBB"
                      style={styles.metaIcon}
                    />
                    <Text style={styles.metaRegion}>{site.city}</Text>
                  </View>

                  {/* Address Row */}
                  <View style={styles.metaRow}>
                    <MapPin size={12} color="#BBBBBB" style={styles.metaIcon} />
                    <Text numberOfLines={1} style={styles.metaAddress}>
                      {site.address}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* ── Info Tip Banner ── */}
      <View style={styles.infoBanner}>
        <CheckCircle2 size={14} color="#1565C0" style={styles.infoBannerIcon} />
        <Text style={styles.infoBannerText}>
          Cliquez sur une carte pour la sélectionner comme site actif. Utilisez
          ✏ pour modifier, le bouton d’alimentation pour activer / désactiver,
          et 🗑 pour supprimer.
        </Text>
      </View>

      {/* ── Bottom Sheet Modal (Slide-Up matching Messages & Co-owners) ── */}
      <Modal
        animationType="slide"
        onRequestClose={closeModal}
        transparent
        visible={modalMode !== null}
      >
        <View style={styles.modalOverlay}>
          <Pressable onPress={closeModal} style={styles.modalScrim} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalHeaderIconWrap}>
                  <Plus size={16} color={colors.orange} strokeWidth={2.5} />
                </View>
                <View style={styles.modalTitleBlock}>
                  <Text style={styles.modalTitle}>
                    {modalMode === 'create'
                      ? 'Nouvel espace'
                      : 'Modifier l’espace'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {modalMode === 'create'
                      ? 'Ajouter un nouveau site'
                      : 'Modifier les informations du site'}
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityLabel="Fermer la modal"
                accessibilityRole="button"
                onPress={closeModal}
                style={styles.modalClose}
              >
                <X size={20} color="#888888" />
              </Pressable>
            </View>

            {/* Modal Form */}
            <ScrollView
              contentContainerStyle={styles.modalFormContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Field 1: Nom du site */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>SITE *</Text>
                <View style={styles.inputWrap}>
                  <Building2
                    size={14}
                    color="#CCCCCC"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    accessibilityLabel="Nom du site"
                    onChangeText={setSiteName}
                    placeholder="Nom du site (ex : Siège social, Boutique Marais...)"
                    placeholderTextColor="#BBBBBB"
                    style={styles.textInputWithIcon}
                    value={siteName}
                  />
                </View>
              </View>

              {/* Field 2: Adresse du site */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  ADRESSE DU SITE{' '}
                  <Text style={styles.fieldLabelOptional}>(OPTIONNEL)</Text>
                </Text>
                <View style={styles.inputWrap}>
                  <MapPin size={14} color="#CCCCCC" style={styles.inputIcon} />
                  <TextInput
                    accessibilityLabel="Adresse du site"
                    onChangeText={setSiteAddress}
                    placeholder="12 rue de la Paix, 75001 Ile de France"
                    placeholderTextColor="#BBBBBB"
                    style={styles.textInputWithIcon}
                    value={siteAddress}
                  />
                </View>
              </View>

              {/* Field 3: Ville */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  VILLE{' '}
                  <Text style={styles.fieldLabelOptional}>
                    (ILE DE FRANCE PAR DÉFAUT)
                  </Text>
                </Text>
                <View style={styles.inputWrap}>
                  <Navigation
                    size={14}
                    color="#CCCCCC"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    accessibilityLabel="Ville"
                    onChangeText={setSiteCity}
                    placeholder="Ile de France"
                    placeholderTextColor="#BBBBBB"
                    style={styles.textInputWithIcon}
                    value={siteCity}
                  />
                </View>
              </View>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={closeModal}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSubmit}
                  style={styles.submitBtn}
                >
                  {modalMode === 'create' ? (
                    <Plus size={14} color={colors.white} strokeWidth={2.5} />
                  ) : null}
                  <Text style={styles.submitBtnText}>
                    {modalMode === 'create'
                      ? 'Ajouter l’espace'
                      : 'Enregistrer'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  /* ── Subheader Row ── */
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subHeaderTitles: {
    gap: 2,
  },
  subHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.orange,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  /* ── Empty State Card ── */
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FAF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.brown,
    marginBottom: 6,
    fontFamily: serifFont,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },

  /* ── 3 Stat Cards Row ── */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    borderTopWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statCardPrimary: {
    borderTopColor: colors.orange,
  },
  statCardSuccess: {
    borderTopColor: '#15803D',
  },
  statCardMuted: {
    borderTopColor: '#9CA3AF',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: serifFont,
  },
  statNumPrimary: {
    color: colors.orange,
  },
  statNumSuccess: {
    color: '#15803D',
  },
  statNumMuted: {
    color: '#9CA3AF',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#AAAAAA',
    marginTop: 2,
  },

  /* ── Sites List ── */
  sitesList: {
    gap: 14,
  },
  siteCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ECDDD6',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  siteCardActive: {
    borderColor: colors.orange,
    backgroundColor: '#FDF9F7',
  },
  siteCardDisabled: {
    opacity: 0.65,
  },
  activeAccentBar: {
    height: 3,
    backgroundColor: colors.orange,
  },
  siteCardBody: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 8,
  },
  siteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  siteIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FDF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  siteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  statusBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusBadgeActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  statusBadgeInactive: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 20,
  },
  statusBadgeInactiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  enCoursBadge: {
    backgroundColor: colors.orange,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 20,
    marginLeft: 4,
  },
  enCoursBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPowerActive: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  actionBtnPowerInactive: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  actionBtnDelete: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metaIcon: {
    flexShrink: 0,
  },
  metaRegion: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  metaAddress: {
    fontSize: 12,
    color: '#666666',
    flexShrink: 1,
  },

  /* ── Info Tip Banner ── */
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  infoBannerIcon: {
    flexShrink: 0,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 17,
  },

  /* ── Bottom Sheet Modal (matching Messages & Co-owners) ── */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  modalHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FDF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 1,
  },
  modalClose: {
    padding: 4,
  },
  modalFormContent: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 14,
  },
  formField: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  fieldLabelOptional: {
    fontWeight: '400',
    color: '#CCCCCC',
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  textInputWithIcon: {
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    borderRadius: 8,
    paddingVertical: 9,
    paddingLeft: 32,
    paddingRight: 12,
    fontSize: 13,
    color: '#333333',
    backgroundColor: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.orange,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});
