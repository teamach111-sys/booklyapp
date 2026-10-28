/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Espaces
 * **Associated Route/Context**: `/client (Tab/Modal: Espaces)`  
 * **Total Discovered Backend Calls**: 4
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Espaces.jsx:93`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Espaces.jsx#L93) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/client/spaces` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Espaces.jsx:224`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Espaces.jsx#L224) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/client/spaces/${space.id}` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Espaces.jsx:244`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Espaces.jsx#L244) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/client/spaces/${space.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Espaces.jsx:255`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Espaces.jsx#L255) | Toggle Switch / Status Change (`handleToggle`) | `handleToggle` | `PATCH` | `/client/spaces/${space.id}/toggle` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
// Sites (espaces) — shared by both platforms (bookly and staffly).
//
// The list lives in SitesProvider so the drawer's "Site actif" selector and
// every site-scoped screen agree on one selection. This page is where sites
// are created, renamed, enabled/disabled and deleted.
//
// Backend (Api/Client.php):
//   POST   /client/spaces                 { space_name, adresse, space_city }
//   PUT    /client/spaces/{id}            partial — only edited fields
//   PATCH  /client/spaces/{id}/toggle     is_active 0 <-> 1
//   DELETE /client/spaces/{id}            422 if it is the last site or has missions
//
// One component serves both brands through useClientTheme().

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
} from 'lucide-react-native';

import { fetchClient } from '../../../api/fetchClient';
import { describeApiError } from '../../../utils/apiError';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import { useClientSites } from '../state/SitesContext';
import BottomSheet from './BottomSheet';
import {
  EMPTY_SITE_FORM,
  buildSiteCreateBody,
  buildSiteUpdateBody,
  siteToForm,
  validateSiteForm,
} from './siteModel';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export default function Espaces() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];

  const {
    sites,
    activeSiteId,
    setActiveSiteId,
    loading,
    error: loadError,
    reload,
  } = useClientSites();

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingSite, setEditingSite] = useState(null);
  const [form, setForm] = useState(EMPTY_SITE_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_SITE_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const setField = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    setFieldErrors(current => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  function openCreate() {
    setForm(EMPTY_SITE_FORM);
    setInitialForm(EMPTY_SITE_FORM);
    setEditingSite(null);
    setFieldErrors({});
    setFeedback(null);
    setModalMode('create');
  }

  function openEdit(site) {
    const nextForm = siteToForm(site);
    setForm(nextForm);
    setInitialForm(nextForm);
    setEditingSite(site);
    setFieldErrors({});
    setFeedback(null);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingSite(null);
    setForm(EMPTY_SITE_FORM);
    setFieldErrors({});
  }

  async function handleSubmit() {
    const errors = validateSiteForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      if (modalMode === 'create') {
        await fetchClient('/client/spaces', {
          method: 'POST',
          body: buildSiteCreateBody(form),
        });
      } else {
        const body = buildSiteUpdateBody(form, initialForm);
        // Nothing changed: no point sending an empty body.
        if (Object.keys(body).length > 0) {
          await fetchClient(`/client/spaces/${editingSite.id}`, {
            method: 'PUT',
            body,
          });
        }
      }

      closeModal();
      setFeedback({
        type: 'success',
        message: modalMode === 'create' ? 'Site ajouté.' : 'Site mis à jour.',
      });
      await reload({ silent: true });
    } catch (requestError) {
      setFeedback({ type: 'error', message: describeApiError(requestError) });
    } finally {
      setSaving(false);
    }
  }

  function confirmToggle(site) {
    const disabling = site.isActive;

    Alert.alert(
      disabling ? 'Désactiver le site' : 'Activer le site',
      disabling
        ? `« ${site.name} » ne sera plus proposé comme site actif.`
        : `« ${site.name} » pourra de nouveau être sélectionné.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: disabling ? 'Désactiver' : 'Activer',
          style: disabling ? 'destructive' : 'default',
          onPress: () => toggleSite(site),
        },
      ],
    );
  }

  async function toggleSite(site) {
    setBusyId(site.id);
    setFeedback(null);

    try {
      const response = await fetchClient(`/client/spaces/${site.id}/toggle`, {
        method: 'PATCH',
      });
      setFeedback({
        type: 'success',
        message: response?.message || 'Statut mis à jour.',
      });
      await reload({ silent: true });
    } catch (requestError) {
      setFeedback({ type: 'error', message: describeApiError(requestError) });
    } finally {
      setBusyId(null);
    }
  }

  function confirmDelete(site) {
    Alert.alert(
      'Supprimer le site',
      `Supprimer « ${site.name} » ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteSite(site),
        },
      ],
    );
  }

  async function deleteSite(site) {
    setBusyId(site.id);
    setFeedback(null);

    try {
      await fetchClient(`/client/spaces/${site.id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', message: 'Site supprimé.' });
      await reload({ silent: true });
    } catch (requestError) {
      setFeedback({ type: 'error', message: describeApiError(requestError) });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingBlock}>
        <ActivityIndicator color={colors.orange} size="large" />
        <Text style={styles.loadingText}>Chargement des sites…</Text>
      </View>
    );
  }

  const totalSites = sites.length;
  const activeSites = sites.filter(site => site.isActive).length;
  const inactiveSites = totalSites - activeSites;

  const banner = feedback ? (
    <View
      style={[
        styles.banner,
        feedback.type === 'error' ? styles.bannerError : styles.bannerSuccess,
      ]}
    >
      <Text
        style={[
          styles.bannerText,
          feedback.type === 'error'
            ? styles.bannerTextError
            : styles.bannerTextSuccess,
        ]}
      >
        {feedback.message}
      </Text>
    </View>
  ) : null;

  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={[styles.banner, styles.bannerError]}>
          <Text style={[styles.bannerText, styles.bannerTextError]}>{loadError}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => reload()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          onPress={openCreate}
          style={styles.addButton}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un site</Text>
        </Pressable>
      </View>

      {banner}

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={[styles.statNum, styles.statNumPrimary]}>{totalSites}</Text>
          <Text style={styles.statLabel}>Total sites</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSuccess]}>
          <Text style={[styles.statNum, styles.statNumSuccess]}>{activeSites}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={[styles.statCard, styles.statCardMuted]}>
          <Text style={[styles.statNum, styles.statNumMuted]}>{inactiveSites}</Text>
          <Text style={styles.statLabel}>Désactivés</Text>
        </View>
      </View>

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
            const isSelected = String(site.id) === String(activeSiteId);
            const busy = busyId === site.id;

            return (
              <Pressable
                key={site.id}
                accessibilityLabel={
                  site.isActive
                    ? `Sélectionner ${site.name}`
                    : `${site.name} est désactivé`
                }
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                disabled={!site.isActive}
                onPress={() => setActiveSiteId(site.id)}
                style={[
                  styles.siteCard,
                  isSelected && styles.siteCardActive,
                  !site.isActive && styles.siteCardDisabled,
                ]}
              >
                {isSelected ? <View style={styles.activeAccentBar} /> : null}

                <View style={styles.siteCardBody}>
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
                            <Text style={styles.statusBadgeActiveText}>Actif</Text>
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
                        accessibilityLabel={`Modifier ${site.name}`}
                        accessibilityRole="button"
                        onPress={event => {
                          event?.stopPropagation?.();
                          openEdit(site);
                        }}
                        style={styles.actionBtn}
                      >
                        <Edit3 size={12} color={colors.orange} />
                      </Pressable>
                      <Pressable
                        accessibilityLabel={
                          site.isActive
                            ? `Désactiver ${site.name}`
                            : `Activer ${site.name}`
                        }
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={event => {
                          event?.stopPropagation?.();
                          confirmToggle(site);
                        }}
                        style={[
                          styles.actionBtn,
                          site.isActive
                            ? styles.actionBtnPowerActive
                            : styles.actionBtnPowerInactive,
                          busy && styles.disabled,
                        ]}
                      >
                        <Power
                          size={12}
                          color={site.isActive ? '#9B1C1C' : '#15803D'}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityLabel={`Supprimer ${site.name}`}
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={event => {
                          event?.stopPropagation?.();
                          confirmDelete(site);
                        }}
                        style={[
                          styles.actionBtn,
                          styles.actionBtnDelete,
                          busy && styles.disabled,
                        ]}
                      >
                        <Trash2 size={12} color="#9B1C1C" />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Navigation size={12} color="#BBBBBB" style={styles.metaIcon} />
                    <Text style={styles.metaRegion}>
                      {site.region || site.city || '—'}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <MapPin size={12} color="#BBBBBB" style={styles.metaIcon} />
                    <Text numberOfLines={1} style={styles.metaAddress}>
                      {site.address || 'Adresse non renseignée'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.infoBanner}>
        <CheckCircle2 size={14} color="#1565C0" style={styles.infoBannerIcon} />
        <Text style={styles.infoBannerText}>
          Cliquez sur une carte pour la sélectionner comme site actif. Utilisez ✏
          pour modifier, le bouton d’alimentation pour activer / désactiver, et 🗑
          pour supprimer.
        </Text>
      </View>

      <BottomSheet
        maxHeight="90%"
        onClose={closeModal}
        subtitle={
          modalMode === 'create'
            ? 'Ajouter un nouveau site'
            : 'Modifier les informations du site'
        }
        title={modalMode === 'create' ? 'Nouvel espace' : 'Modifier l’espace'}
        visible={modalMode !== null}
      >
        <ScrollView
          contentContainerStyle={styles.modalFormContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>SITE *</Text>
            <View style={styles.inputWrap}>
              <Building2 size={14} color="#CCCCCC" style={styles.inputIcon} />
              <TextInput
                accessibilityLabel="Nom du site"
                onChangeText={value => setField('name', value)}
                placeholder="Nom du site (ex : Siège social, Boutique Marais...)"
                placeholderTextColor="#BBBBBB"
                style={[
                  styles.textInputWithIcon,
                  fieldErrors.name && styles.textInputError,
                ]}
                value={form.name}
              />
            </View>
            {fieldErrors.name ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>
            ) : null}
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>
              ADRESSE DU SITE{' '}
              <Text style={styles.fieldLabelOptional}>(OPTIONNEL)</Text>
            </Text>
            <View style={styles.inputWrap}>
              <MapPin size={14} color="#CCCCCC" style={styles.inputIcon} />
              <TextInput
                accessibilityLabel="Adresse du site"
                onChangeText={value => setField('address', value)}
                placeholder="12 rue de la Paix, 75001 Paris"
                placeholderTextColor="#BBBBBB"
                style={styles.textInputWithIcon}
                value={form.address}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>
              VILLE{' '}
              <Text style={styles.fieldLabelOptional}>
                (ILE DE FRANCE PAR DÉFAUT)
              </Text>
            </Text>
            <View style={styles.inputWrap}>
              <Navigation size={14} color="#CCCCCC" style={styles.inputIcon} />
              <TextInput
                accessibilityLabel="Ville"
                onChangeText={value => setField('region', value)}
                placeholder="Ile de France"
                placeholderTextColor="#BBBBBB"
                style={styles.textInputWithIcon}
                value={form.region}
              />
            </View>
          </View>

          <View style={styles.modalActions}>
            <Pressable
              accessibilityLabel="Annuler"
              accessibilityRole="button"
              disabled={saving}
              onPress={closeModal}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </Pressable>
            <Pressable
              accessibilityLabel={
                modalMode === 'create' ? 'Créer le site' : 'Enregistrer le site'
              }
              accessibilityRole="button"
              disabled={saving}
              onPress={handleSubmit}
              style={[styles.submitBtn, saving && styles.disabled]}
            >
              <Text style={styles.submitBtnText}>
                {saving
                  ? 'Enregistrement…'
                  : modalMode === 'create'
                    ? 'Créer'
                    : 'Enregistrer'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 16,
  },

  /* ── Subheader ── */
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  subHeaderTitles: {
    flexShrink: 1,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.brown,
    fontFamily: serifFont,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
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
    fontWeight: '600',
  },

  /* ── States ── */
  loadingBlock: {
    paddingVertical: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#888',
    fontSize: 13,
  },
  banner: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bannerError: {
    backgroundColor: '#FCEDEA',
    borderColor: '#F0C2BC',
  },
  bannerSuccess: {
    backgroundColor: colors.successLight,
    borderColor: colors.successBorder,
  },
  bannerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bannerTextError: {
    color: '#A02A1C',
  },
  bannerTextSuccess: {
    color: colors.success,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: colors.orange,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },

  /* ── Stat cards ── */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardPrimary: {
    backgroundColor: '#FDF3EE',
    borderColor: '#F2DCCB',
  },
  statCardSuccess: {
    backgroundColor: '#F1F9F2',
    borderColor: '#CDEBD3',
  },
  statCardMuted: {
    backgroundColor: '#F7F4F2',
    borderColor: '#E9E1DB',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  statNumPrimary: {
    color: colors.orange,
  },
  statNumSuccess: {
    color: '#15803D',
  },
  statNumMuted: {
    color: '#9A8F88',
  },
  statLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 2,
  },

  /* ── Empty state ── */
  emptyCard: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF9F7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  emptyIconWrap: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 16,
  },

  /* ── Site cards ── */
  sitesList: {
    gap: 10,
  },
  siteCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    overflow: 'hidden',
  },
  siteCardActive: {
    borderColor: '#F0DCAE',
    backgroundColor: '#FDF8F2',
  },
  siteCardDisabled: {
    opacity: 0.7,
  },
  activeAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.orange,
  },
  siteCardBody: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  siteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  siteIconWrap: {
    width: 36,
    height: 36,
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
    gap: 6,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  statusBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#EAF5EA',
  },
  statusBadgeActiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  statusBadgeInactive: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F0E4DD',
  },
  statusBadgeInactiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9A8F88',
  },
  enCoursBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F5E2B8',
  },
  enCoursBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8A6511',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPowerActive: {
    borderColor: '#F3D2D2',
  },
  actionBtnPowerInactive: {
    borderColor: '#CDEBD3',
  },
  actionBtnDelete: {
    borderColor: '#F3D2D2',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    marginTop: 1,
  },
  metaRegion: {
    fontSize: 12,
    color: '#999999',
  },
  metaAddress: {
    fontSize: 12,
    color: '#BBBBBB',
    flexShrink: 1,
  },

  /* ── Info banner ── */
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0F7FE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6E9FB',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoBannerIcon: {
    marginTop: 1,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: '#4A6B85',
  },

  /* ── Modal form ── */
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
    marginBottom: 5,
  },
  fieldLabelOptional: {
    fontWeight: '400',
    color: '#BBBBBB',
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 11,
    zIndex: 1,
  },
  textInputWithIcon: {
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    borderRadius: 9,
    paddingVertical: 9,
    paddingLeft: 34,
    paddingRight: 11,
    fontSize: 13,
    color: '#1A1A1A',
    backgroundColor: colors.white,
  },
  textInputError: {
    borderColor: '#F87171',
  },
  fieldErrorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 9,
    backgroundColor: colors.orange,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
});

const stylesByBrand = createBrandStyles(createStyles);
