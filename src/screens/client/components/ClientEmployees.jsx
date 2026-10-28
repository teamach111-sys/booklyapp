/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : ClientEmployees
 * **Associated Route/Context**: `/client (Tab/Modal: ClientEmployees)`  
 * **Total Discovered Backend Calls**: 5
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`ClientEmployees.jsx:47`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientEmployees.jsx#L47) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/sites/${siteId}/employees` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`ClientEmployees.jsx:159`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientEmployees.jsx#L159) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `PUT` | `/employees/${employee.employee_id}` | `form` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`ClientEmployees.jsx:234`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientEmployees.jsx#L234) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/sites/${activeSiteId}/employees` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`ClientEmployees.jsx:251`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientEmployees.jsx#L251) | Toggle Switch / Status Change (`handleToggleStatus`) | `handleToggleStatus` | `PATCH` | `/employees/${emp.employee_id}/status` | `{ status: newStatus` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`ClientEmployees.jsx:262`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientEmployees.jsx#L262) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/employees/${emp.employee_id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
// Collaborateurs (employees) — shared by both platforms (bookly and staffly).
//
// Employees belong to a site, so the screen owns a small site switcher: the
// shell does not expose a real site list yet (its drawer sites are still demo
// data), and GET /sites/{id}/employees needs a real id. A `siteId` prop is
// honoured when it matches one of the client's actual sites, which is what the
// shell can pass once its site picker is wired to /client/profile.
//
// One component serves both brands through useClientTheme().

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Ban,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  UserRound,
} from 'lucide-react-native';

import { fetchClient } from '../../../api/fetchClient';
import { useAuth } from '../../../context/AuthContext';
import { describeApiError, extractFieldErrors } from '../../../utils/apiError';
import { toPhotoSrc } from '../../../utils/toPhotoSrc';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import { useClientSites } from '../state/SitesContext';
import BottomSheet from './BottomSheet';
import {
  EMPTY_EMPLOYEE_FORM,
  buildEmployeeCreateBody,
  buildEmployeeUpdateBody,
  employeeToForm,
  parseEmployeeResponse,
  validateEmployeeForm,
} from './employeeModel';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export default function ClientEmployees() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const { user } = useAuth();

  // Employees are attached to the site selected in the drawer; the site list
  // and the selection live in SitesProvider so both stay in step.
  const {
    selectableSites,
    activeSite,
    activeSiteId,
    setActiveSiteId,
    loading: sitesLoading,
    error: sitesError,
  } = useClientSites();

  // Only a client account may manage employees; employees themselves are
  // rejected by the backend with a 403.
  const canManage = user?.role === 'client';

  const [employees, setEmployees] = useState([]);
  const [capacity, setCapacity] = useState({ max: 3, count: 0, slotsLeft: 3 });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_EMPLOYEE_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [failedPhotos, setFailedPhotos] = useState({});

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!activeSiteId) {
        setEmployees([]);
        setCapacity({ max: 3, count: 0, slotsLeft: 3 });
        setLoading(false);
        return;
      }

      if (!silent) {
        setLoading(true);
      }
      setLoadError(null);

      try {
        const response = await fetchClient(`/sites/${activeSiteId}/employees`);
        const parsed = parseEmployeeResponse(response);
        setEmployees(parsed.employees);
        setCapacity({
          max: parsed.max,
          count: parsed.count,
          slotsLeft: parsed.slotsLeft,
        });
      } catch (error) {
        setLoadError(describeApiError(error));
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [activeSiteId],
  );

  useEffect(() => {
    load();
  }, [load]);

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
    if (capacity.slotsLeft <= 0) {
      Alert.alert(
        'Limite atteinte',
        `Maximum ${capacity.max} collaborateurs par site.`,
      );
      return;
    }

    setForm(EMPTY_EMPLOYEE_FORM);
    setFieldErrors({});
    setFeedback(null);
    setShowPassword(false);
    setEditingId(null);
    setModalMode('create');
  }

  function openEdit(employee) {
    setForm(employeeToForm(employee));
    setFieldErrors({});
    setFeedback(null);
    setEditingId(employee.id);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_EMPLOYEE_FORM);
    setFieldErrors({});
    setShowPassword(false);
  }

  async function handleSubmit() {
    const isCreate = modalMode === 'create';
    const errors = validateEmployeeForm(form, isCreate);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (!activeSiteId) {
      return;
    }

    setSaving(true);
    setFeedback(null);
    setFieldErrors({});

    try {
      if (isCreate) {
        await fetchClient(`/sites/${activeSiteId}/employees`, {
          method: 'POST',
          body: buildEmployeeCreateBody(form),
        });
      } else {
        await fetchClient(`/employees/${editingId}`, {
          method: 'PUT',
          body: buildEmployeeUpdateBody(form),
        });
      }

      closeModal();
      setFeedback({
        type: 'success',
        message: isCreate ? 'Collaborateur créé.' : 'Collaborateur mis à jour.',
      });
      await load({ silent: true });
    } catch (error) {
      const fields = extractFieldErrors(error);
      if (Object.keys(fields).length > 0) {
        setFieldErrors({
          ...fields,
          passwordConfirmation:
            fields.passwordConfirmation || fields.password_confirmation,
        });
      } else {
        setFeedback({ type: 'error', message: describeApiError(error) });
      }
    } finally {
      setSaving(false);
    }
  }

  function confirmStatusToggle(employee) {
    const blocking = employee.nextStatus === 'blocked';

    Alert.alert(
      blocking ? 'Bannir le collaborateur' : 'Réactiver le collaborateur',
      blocking
        ? `${employee.fullName} perdra immédiatement l'accès à ce site.`
        : `${employee.fullName} pourra de nouveau accéder à ce site.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: blocking ? 'Bannir' : 'Réactiver',
          style: blocking ? 'destructive' : 'default',
          onPress: () => toggleStatus(employee),
        },
      ],
    );
  }

  async function toggleStatus(employee) {
    setBusyId(employee.id);
    setFeedback(null);

    try {
      const response = await fetchClient(`/employees/${employee.id}/status`, {
        method: 'PATCH',
        body: { status: employee.nextStatus },
      });
      setFeedback({
        type: 'success',
        message: response?.message || 'Statut mis à jour.',
      });
      await load({ silent: true });
    } catch (error) {
      setFeedback({ type: 'error', message: describeApiError(error) });
    } finally {
      setBusyId(null);
    }
  }

  if (loading || sitesLoading) {
    return (
      <View style={styles.loadingBlock}>
        <ActivityIndicator color={colors.orange} size="large" />
        <Text style={styles.loadingText}>Chargement des collaborateurs…</Text>
      </View>
    );
  }

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

  const blockingError = loadError || sitesError;

  if (blockingError) {
    return (
      <View style={styles.container}>
        <View style={[styles.banner, styles.bannerError]}>
          <Text style={[styles.bannerText, styles.bannerTextError]}>
            {blockingError}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => load()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!activeSiteId) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconWrap}>
          <UserRound size={22} color="#CCCCCC" strokeWidth={2} />
        </View>
        <Text style={styles.emptyTitle}>Aucun site</Text>
        <Text style={styles.emptySubtitle}>
          Créez d’abord un site : les collaborateurs sont rattachés à un site.
        </Text>
      </View>
    );
  }

  const filled = Math.min(capacity.count, capacity.max);

  return (
    <View style={styles.container}>
      {selectableSites.length > 1 ? (
        <View style={styles.siteRow}>
          {selectableSites.map(space => {
            const active = String(space.id) === String(activeSiteId);
            return (
              <Pressable
                accessibilityLabel={`Collaborateurs du site ${space.name}`}
                accessibilityRole="button"
                key={space.id}
                onPress={() => {
                  if (!active) {
                    setActiveSiteId(space.id);
                  }
                }}
                style={[styles.siteChip, active && styles.siteChipActive]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.siteChipText, active && styles.siteChipTextActive]}
                >
                  {space.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {banner}

      <View style={styles.actionRow}>
        {canManage ? (
          <Pressable
            accessibilityLabel="Ajouter un collaborateur"
            accessibilityRole="button"
            onPress={openCreate}
            style={[
              styles.addButton,
              capacity.slotsLeft <= 0 && styles.addButtonDisabled,
            ]}
          >
            <Plus size={14} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Ajouter un collaborateur</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.capacityBarRow}>
        {Array.from({ length: capacity.max }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.capacitySegment,
              index < filled ? styles.segmentFilled : styles.segmentEmpty,
            ]}
          />
        ))}
        <Text
          accessibilityLabel={`${capacity.count} sur ${capacity.max} collaborateurs`}
          style={styles.capacityText}
        >
          {capacity.count}/{capacity.max}
        </Text>
      </View>

      {employees.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <UserRound size={22} color="#CCCCCC" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Aucun collaborateur</Text>
          <Text style={styles.emptySubtitle}>
            {activeSite?.name
              ? `Aucun collaborateur sur « ${activeSite.name} » pour le moment.`
              : 'Ajoutez un collaborateur à ce site.'}
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {employees.map(employee => {
            const showPhoto = employee.photoUrl && !failedPhotos[employee.id];

            return (
              <View key={employee.id} style={styles.employeeCard}>
                <View style={styles.avatarWrap}>
                  {showPhoto ? (
                    <Image
                      onError={() =>
                        setFailedPhotos(current => ({
                          ...current,
                          [employee.id]: true,
                        }))
                      }
                      source={{ uri: toPhotoSrc(employee.photoUrl) }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>{employee.initials}</Text>
                  )}
                </View>

                <View style={styles.infoCol}>
                  <View style={styles.nameRow}>
                    <Text numberOfLines={1} style={styles.nameText}>
                      {employee.fullName}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        employee.isBlocked && styles.statusBadgeBlocked,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          employee.isBlocked && styles.statusBadgeTextBlocked,
                        ]}
                      >
                        {employee.statusLabel}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.emailText}>
                    {employee.email}
                  </Text>
                  {employee.phone ? (
                    <Text numberOfLines={1} style={styles.phoneText}>
                      {employee.phone}
                    </Text>
                  ) : null}
                </View>

                {canManage ? (
                  <View style={styles.actionsRow}>
                    <Pressable
                      accessibilityLabel={`Modifier ${employee.fullName}`}
                      accessibilityRole="button"
                      onPress={() => openEdit(employee)}
                      style={styles.actionBtn}
                    >
                      <Edit3 size={13} color={colors.orange} />
                    </Pressable>
                    <Pressable
                      accessibilityLabel={
                        employee.isBlocked
                          ? `Réactiver ${employee.fullName}`
                          : `Bannir ${employee.fullName}`
                      }
                      accessibilityRole="button"
                      disabled={busyId === employee.id}
                      onPress={() => confirmStatusToggle(employee)}
                      style={[
                        styles.actionBtn,
                        busyId === employee.id && styles.disabled,
                      ]}
                    >
                      {busyId === employee.id ? (
                        <ActivityIndicator color="#DC2626" size="small" />
                      ) : employee.isBlocked ? (
                        <RotateCcw size={13} color="#2E7D32" />
                      ) : (
                        <Ban size={13} color="#DC2626" />
                      )}
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      <BottomSheet
        maxHeight="90%"
        onClose={closeModal}
        subtitle={
          modalMode === 'create'
            ? `Rattaché au site ${activeSite?.name || ''}`.trim()
            : 'Le mot de passe du collaborateur ne change pas ici'
        }
        title={modalMode === 'create' ? 'Nouveau collaborateur' : 'Modifier le collaborateur'}
        visible={modalMode !== null}
      >
        <ScrollView
          contentContainerStyle={styles.modalFormContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.fieldLabel}>Prénom</Text>
              <TextInput
                accessibilityLabel="Prénom"
                autoCapitalize="words"
                onChangeText={value => setField('firstname', value)}
                placeholder="Prénom"
                placeholderTextColor="#BBBBBB"
                style={[
                  styles.textInput,
                  fieldErrors.firstname && styles.textInputError,
                ]}
                value={form.firstname}
              />
              {fieldErrors.firstname ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.firstname}</Text>
              ) : null}
            </View>
            <View style={styles.formCol}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <TextInput
                accessibilityLabel="Nom"
                autoCapitalize="words"
                onChangeText={value => setField('name', value)}
                placeholder="Nom"
                placeholderTextColor="#BBBBBB"
                style={[styles.textInput, fieldErrors.name && styles.textInputError]}
                value={form.name}
              />
              {fieldErrors.name ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={value => setField('email', value)}
              placeholder="nom@exemple.com"
              placeholderTextColor="#BBBBBB"
              style={[styles.textInput, fieldErrors.email && styles.textInputError]}
              value={form.email}
            />
            {fieldErrors.email ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>
              Téléphone <Text style={styles.fieldLabelOptional}>(optionnel)</Text>
            </Text>
            <TextInput
              accessibilityLabel="Téléphone (optionnel)"
              keyboardType="phone-pad"
              onChangeText={value => setField('phone', value)}
              placeholder="06 12 34 56 78"
              placeholderTextColor="#BBBBBB"
              style={styles.textInput}
              value={form.phone}
            />
          </View>

          {modalMode === 'create' ? (
            <>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Mot de passe</Text>
                  <View style={styles.passwordInputWrap}>
                    <TextInput
                      accessibilityLabel="Mot de passe"
                      autoCapitalize="none"
                      onChangeText={value => setField('password', value)}
                      placeholder="••••••••"
                      placeholderTextColor="#BBBBBB"
                      secureTextEntry={!showPassword}
                      style={[
                        styles.passwordInput,
                        fieldErrors.password && styles.textInputError,
                      ]}
                      value={form.password}
                    />
                    <Pressable
                      accessibilityLabel={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                      accessibilityRole="button"
                      onPress={() => setShowPassword(current => !current)}
                      style={styles.passwordToggleBtn}
                    >
                      {showPassword ? (
                        <EyeOff size={15} color="#BBBBBB" />
                      ) : (
                        <Eye size={15} color="#BBBBBB" />
                      )}
                    </Pressable>
                  </View>
                  {fieldErrors.password ? (
                    <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
                  ) : null}
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Confirmer</Text>
                  <TextInput
                    accessibilityLabel="Confirmer le mot de passe"
                    autoCapitalize="none"
                    onChangeText={value => setField('passwordConfirmation', value)}
                    placeholder="••••••••"
                    placeholderTextColor="#BBBBBB"
                    secureTextEntry={!showPassword}
                    style={[
                      styles.textInput,
                      fieldErrors.password_confirmation && styles.textInputError,
                    ]}
                    value={form.passwordConfirmation}
                  />
                  {fieldErrors.password_confirmation ? (
                    <Text style={styles.fieldErrorText}>
                      {fieldErrors.password_confirmation}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Text style={styles.infoNote}>
                Le collaborateur accède uniquement à ce site. Maximum{' '}
                {capacity.max} par site.
              </Text>
            </>
          ) : null}

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
                modalMode === 'create'
                  ? 'Créer le collaborateur'
                  : 'Enregistrer le collaborateur'
              }
              accessibilityRole="button"
              disabled={saving}
              onPress={handleSubmit}
              style={[styles.submitBtn, saving && styles.disabled]}
            >
              <Check size={13} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.submitBtnText}>
                {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
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

  /* ── Site switcher ── */
  siteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  siteChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    maxWidth: '48%',
  },
  siteChipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  siteChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
  },
  siteChipTextActive: {
    color: colors.white,
  },

  /* ── Action Button Row ── */
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
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
  addButtonDisabled: {
    opacity: 0.5,
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

  /* ── Segmented Capacity Bar ── */
  capacityBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  capacitySegment: {
    flex: 1,
    height: 6,
    borderRadius: 4,
  },
  segmentFilled: {
    backgroundColor: colors.orange,
  },
  segmentEmpty: {
    backgroundColor: '#F0E4DD',
  },
  capacityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999999',
    marginLeft: 8,
  },

  /* ── Empty State Card ── */
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

  /* ── Employees List ── */
  listContainer: {
    gap: 10,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDF3EE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 14.4,
    fontWeight: '700',
    color: colors.orange,
    fontFamily: serifFont,
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#EAF5EA',
  },
  statusBadgeBlocked: {
    backgroundColor: '#FCEAEA',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  statusBadgeTextBlocked: {
    color: '#B3261E',
  },
  emailText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    color: '#BBBBBB',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Modal form ── */
  modalFormContent: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formCol: {
    flex: 1,
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
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 11,
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
  passwordInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    borderRadius: 9,
    paddingVertical: 9,
    paddingLeft: 11,
    paddingRight: 36,
    fontSize: 13,
    color: '#1A1A1A',
    backgroundColor: colors.white,
  },
  passwordToggleBtn: {
    position: 'absolute',
    right: 9,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoNote: {
    fontSize: 11,
    color: '#AAAAAA',
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 4,
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
