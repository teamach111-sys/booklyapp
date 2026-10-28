/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : ClientCoOwners
 * **Associated Route/Context**: `/client (Tab/Modal: ClientCoOwners)`  
 * **Total Discovered Backend Calls**: 2
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`ClientCoOwners.jsx:46`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientCoOwners.jsx#L46) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/client/co-owners` | `{         firstname: form.firstname,         name:      form.name,         email:     form.email,         phone:     form.phone,         password:  form.password,         password_confirmation: form.password_confirmation,       }` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`ClientCoOwners.jsx:170`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/ClientCoOwners.jsx#L170) | Delete / Cancel Button (`handleRemove`) | `handleRemove` | `DELETE` | `/client/co-owners/${id}` | `coOwner.id` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * 
 * =====================================================================
 */
// Co-propriétaires — shared by both platforms (bookly and staffly).
//
// One component serves both brands through useClientTheme(), so a change here
// lands on both clients at once.
//
// What the backend allows (see Api/Client.php):
//   list  GET    /client/co-owners
//   add   POST   /client/co-owners
//   remove DELETE /client/co-owners/{id}
// There is no update endpoint, so this screen does not offer editing — the
// previous mock had an "edit" button that could never have saved anything.

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
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react-native';

import { fetchClient } from '../../../api/fetchClient';
import { describeApiError, extractFieldErrors } from '../../../utils/apiError';
import { toPhotoSrc } from '../../../utils/toPhotoSrc';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import BottomSheet from './BottomSheet';
import {
  EMPTY_CO_OWNER_FORM,
  buildCoOwnerBody,
  normalizeCoOwners,
  validateCoOwnerForm,
} from './coOwnerModel';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export default function ClientCoOwners() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];

  const [coOwners, setCoOwners] = useState([]);
  const [isPrimaryOwner, setIsPrimaryOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(EMPTY_CO_OWNER_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      // The list never includes yourself, so "am I the account holder?" has to
      // come from the profile — it decides whether removing is allowed.
      const [listResult, profileResult] = await Promise.allSettled([
        fetchClient('/client/co-owners'),
        fetchClient('/client/profile'),
      ]);

      if (listResult.status !== 'fulfilled') {
        throw listResult.reason;
      }

      setCoOwners(normalizeCoOwners(listResult.value));
      setIsPrimaryOwner(
        profileResult.status === 'fulfilled'
          ? Boolean(profileResult.value?.personal_info?.is_primary_owner)
          : false,
      );
    } catch (error) {
      setLoadError(describeApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    // Clear the field's error as soon as the user edits it.
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
    setForm(EMPTY_CO_OWNER_FORM);
    setFieldErrors({});
    setFeedback(null);
    setShowPassword(false);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setForm(EMPTY_CO_OWNER_FORM);
    setFieldErrors({});
    setShowPassword(false);
  }

  async function handleCreate() {
    const errors = validateCoOwnerForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setFeedback(null);
    setFieldErrors({});

    try {
      await fetchClient('/client/co-owners', {
        method: 'POST',
        body: buildCoOwnerBody(form),
      });

      closeModal();
      setFeedback({
        type: 'success',
        message: 'Co-propriétaire créé avec succès !',
      });
      await load();
    } catch (error) {
      const fields = extractFieldErrors(error);
      if (Object.keys(fields).length > 0) {
        // Laravel's keys are snake_case; the form is camelCase.
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

  function handleDelete(coOwner) {
    Alert.alert(
      'Retirer le co-propriétaire',
      `Retirer ${coOwner.fullName} de l'entreprise ? Cette personne perdra tout accès.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => removeCoOwner(coOwner),
        },
      ],
    );
  }

  async function removeCoOwner(coOwner) {
    setDeletingId(coOwner.id);
    setFeedback(null);

    try {
      await fetchClient(`/client/co-owners/${coOwner.id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', message: 'Co-propriétaire retiré.' });
      await load();
    } catch (error) {
      setFeedback({ type: 'error', message: describeApiError(error) });
    } finally {
      setDeletingId(null);
    }
  }

  const renderRow = coOwner => {
    const showPhoto =
      coOwner.photoUrl && !failedPhotos[coOwner.id];

    return (
      <View
        key={coOwner.id}
        style={[styles.coOwnerCard, coOwner.isPrimary && styles.coOwnerCardPrimary]}
      >
        <View style={styles.avatarWrap}>
          {showPhoto ? (
            <Image
              onError={() =>
                setFailedPhotos(current => ({ ...current, [coOwner.id]: true }))
              }
              source={{ uri: toPhotoSrc(coOwner.photoUrl) }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{coOwner.initials}</Text>
          )}
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.nameText}>
              {coOwner.fullName}
            </Text>
            <View
              style={[
                styles.statusBadge,
                coOwner.isPrimary && styles.statusBadgePrimary,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  coOwner.isPrimary && styles.statusBadgeTextPrimary,
                ]}
              >
                {coOwner.statusLabel}
              </Text>
            </View>
          </View>
          <Text numberOfLines={1} style={styles.emailText}>
            {coOwner.email}
          </Text>
        </View>

        {isPrimaryOwner && coOwner.canRemove ? (
          <Pressable
            accessibilityLabel={`Retirer ${coOwner.fullName}`}
            accessibilityRole="button"
            disabled={deletingId === coOwner.id}
            onPress={() => handleDelete(coOwner)}
            style={[
              styles.actionBtn,
              deletingId === coOwner.id && styles.disabled,
            ]}
          >
            {deletingId === coOwner.id ? (
              <ActivityIndicator color="#DC2626" size="small" />
            ) : (
              <Trash2 size={13} color="#DC2626" />
            )}
          </Pressable>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingBlock}>
        <ActivityIndicator color={colors.orange} size="large" />
        <Text style={styles.loadingText}>Chargement des co-propriétaires…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel="Ajouter un co-propriétaire"
          accessibilityRole="button"
          onPress={openCreate}
          style={styles.addButton}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un co-propriétaire</Text>
        </Pressable>
      </View>

      {feedback ? (
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
      ) : null}

      {loadError ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Chargement impossible</Text>
          <Text style={styles.emptySubtitle}>{loadError}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={load}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : coOwners.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <UserRound size={22} color="#CCCCCC" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Aucun co-propriétaire</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez un compte avec un accès complet à votre entreprise.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>{coOwners.map(renderRow)}</View>
      )}

      <BottomSheet
        maxHeight="90%"
        onClose={closeModal}
        subtitle="Accès complet à l’entreprise, identique au vôtre"
        title="Nouveau co-propriétaire"
        visible={modalVisible}
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
            Le compte sera activé immédiatement. Le co-propriétaire aura le même
            accès que vous sur toute l’entreprise (tous les sites, employés,
            prestations, factures...).
          </Text>

          <View style={styles.modalActions}>
            <Pressable
              accessibilityLabel="Annuler la création"
              accessibilityRole="button"
              disabled={saving}
              onPress={closeModal}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Créer le co-propriétaire"
              accessibilityRole="button"
              disabled={saving}
              onPress={handleCreate}
              style={[styles.submitBtn, saving && styles.disabled]}
            >
              <Check size={13} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.submitBtnText}>
                {saving ? 'Création…' : 'Créer le co-propriétaire'}
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
    marginTop: 14,
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

  /* ── Co-Owners List ── */
  listContainer: {
    gap: 10,
  },
  coOwnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  coOwnerCardPrimary: {
    backgroundColor: '#FDF8F2',
    borderWidth: 1.5,
    borderColor: '#F0DCAE',
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    fontSize: 14,
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
  statusBadgePrimary: {
    backgroundColor: '#F5E2B8',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  statusBadgeTextPrimary: {
    color: '#8A6511',
  },
  emailText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
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
