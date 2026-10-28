/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Profile
 * **Associated Route/Context**: `/client (Tab/Modal: Profile)`  
 * **Total Discovered Backend Calls**: 7
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Profile.jsx:132`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L132) | Form Submit / Create Button (`handleSave`) | `handleSave` | `DELETE` | `/client/profile/photo` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:146`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L146) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/client/profile/update` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:206`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L206) | Form Submit / Create Button (`handleSavePassword`) | `handleSavePassword` | `PUT` | `endpoint` | `{ current_password: pwForm.current_password` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Profile.jsx:125`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L125) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `${BASE_URL}/api/client/profile/photo` | `None` | Bearer token (Authorization header) | Confirmed |
 * | [`Profile.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L57) | User Action Handler (`Field`) | `Field` | `GET` | `/client/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`Profile.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L57) | User Action Handler (`Field`) | `Field` | `GET` | `/employee/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`Profile.jsx:138`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L138) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/employee/profile/update` | `{           firstname: form.firstname,           name:      form.name,           email:     form.email,           phone:     form.phone \|\| null,         }` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * 
 * =====================================================================
 */
// Client profile — shared by both platforms (bookly and staffly).
//
// One component serves both brands: the palette comes from useClientTheme(),
// and the brand shown on the identity card is whichever platform the account
// belongs to (personal_info.platform_partner on the backend). Nothing here is
// brand-specific, so a change lands on both clients at once.
//
// It also serves the two account kinds the client area has:
//   client / patron  -> GET /client/profile,   PUT /client/profile/update
//   sous_client      -> GET /employee/profile, PUT /employee/profile/update
// Employees only own their personal fields; the company block is hidden for
// them, which is exactly what the backend allows them to update.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Building2,
  Check,
  Edit3,
  Eye,
  EyeOff,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from 'lucide-react-native';

import { fetchClient } from '../../../api/fetchClient';
import { useAuth } from '../../../context/AuthContext';
import { describeApiError } from '../../../utils/apiError';
import { toPhotoSrc } from '../../../utils/toPhotoSrc';
import {
  EMPTY_FORM,
  buildPasswordBody,
  buildUpdateBody,
  toForm,
} from './profileModel';
import { profileStylesByBrand } from './styles';
import { useClientTheme } from '../theme/ClientThemeContext';

function Banner({ feedback, styles }) {
  if (!feedback) {
    return null;
  }

  const isError = feedback.type === 'error';

  return (
    <View style={[styles.banner, isError ? styles.bannerError : styles.bannerSuccess]}>
      <Text
        style={[
          styles.bannerText,
          isError ? styles.bannerTextError : styles.bannerTextSuccess,
        ]}
      >
        {feedback.message}
      </Text>
    </View>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  editing,
  onChange,
  multiline,
  fullWidth,
  styles,
}) {
  return (
    <View style={fullWidth ? styles.gridItemFull : styles.gridItem}>
      <View style={styles.fieldLabel}>
        {Icon && <Icon size={13} color="#AAA" />}
        <Text style={styles.fieldLabelText}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          multiline={multiline}
          onChangeText={onChange}
          style={[styles.input, multiline && styles.textarea]}
          value={value}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || '—'}</Text>
      )}
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  styles,
}) {
  return (
    <View style={styles.passwordField}>
      <View style={styles.fieldLabel}>
        <Lock size={13} color="#AAA" />
        <Text style={styles.fieldLabelText}>{label}</Text>
      </View>
      <View style={styles.passwordInputContainer}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#AAA"
          secureTextEntry={!visible}
          style={styles.passwordInput}
          value={value}
        />
        <Pressable
          accessibilityLabel={visible ? 'Masquer' : 'Afficher'}
          accessibilityRole="button"
          onPress={onToggle}
          style={styles.passwordToggle}
        >
          {visible ? (
            <EyeOff size={18} color="#AAA" />
          ) : (
            <Eye size={18} color="#AAA" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function Profile() {
  const { partner, colors } = useClientTheme();
  const styles = profileStylesByBrand[partner];
  const { user } = useAuth();

  const isEmployeeRole = user?.role === 'sous_client';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [profile, setProfile] = useState(null);

  const [activeTab, setActiveTab] = useState('information');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [photoFailed, setPhotoFailed] = useState(false);

  const setField = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const info = profile?.personal_info || {};
  const biz = profile?.business_info || {};

  // The API is authoritative once loaded; the session role is the hint we need
  // before the first request (the two endpoints are not interchangeable).
  const isEmployee = Boolean(info.is_employee) || isEmployeeRole;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true);
      }
      setLoadError(null);

      const primary = isEmployeeRole ? '/employee/profile' : '/client/profile';
      const fallback = isEmployeeRole ? '/client/profile' : '/employee/profile';

      try {
        let data;
        try {
          data = await fetchClient(primary);
        } catch (error) {
          // A patron account hits /employee/profile only if the session role
          // is stale; one retry on the other endpoint covers that.
          if (error?.status === 404) {
            data = await fetchClient(fallback);
          } else {
            throw error;
          }
        }

        setProfile(data);
        setForm(toForm(data));
      } catch (error) {
        setLoadError(describeApiError(error));
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [isEmployeeRole],
  );

  useEffect(() => {
    load();
  }, [load]);

  const fullName = useMemo(
    () => `${info.firstname || ''} ${info.name || ''}`.trim(),
    [info.firstname, info.name],
  );

  const initials = useMemo(() => {
    const letters = `${info.firstname?.[0] || ''}${info.name?.[0] || ''}`.toUpperCase();
    return letters || 'CL';
  }, [info.firstname, info.name]);

  const photoSrc = photoFailed ? null : toPhotoSrc(info.profile_photo_url);

  const startEditing = () => {
    setForm(toForm(profile));
    setFeedback(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setForm(toForm(profile));
    setEditing(false);
  };

  async function handleSave() {
    if (!form.firstname.trim() || !form.name.trim()) {
      setFeedback({ type: 'error', message: 'Prénom et nom requis.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      await fetchClient(
        isEmployee ? '/employee/profile/update' : '/client/profile/update',
        { method: 'PUT', body: buildUpdateBody(form, isEmployee) },
      );

      // Re-read the server's copy; no spinner so the card stays put.
      await load({ silent: true });
      setEditing(false);
      setFeedback({ type: 'success', message: 'Profil mis à jour !' });
    } catch (error) {
      setFeedback({ type: 'error', message: describeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordUpdate() {
    if (!password.current || !password.next || !password.confirm) {
      setFeedback({ type: 'error', message: 'Renseignez les trois champs.' });
      return;
    }
    if (password.next.length < 6) {
      setFeedback({
        type: 'error',
        message: 'Le mot de passe doit faire au moins 6 caractères.',
      });
      return;
    }
    if (password.next !== password.confirm) {
      setFeedback({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setSavingPassword(true);
    setFeedback(null);

    try {
      // Same endpoint as the profile update: the backend validates
      // current_password + password (min:6, confirmed) in one payload.
      await fetchClient(
        isEmployee ? '/employee/profile/update' : '/client/profile/update',
        {
          method: 'PUT',
          body: buildPasswordBody(password.current, password.next, password.confirm),
        },
      );

      setPassword({ current: '', next: '', confirm: '' });
      setFeedback({ type: 'success', message: 'Mot de passe mis à jour.' });
    } catch (error) {
      setFeedback({ type: 'error', message: describeApiError(error) });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingBlock}>
        <ActivityIndicator color={colors.orange} size="large" />
        <Text style={styles.loadingText}>Chargement du profil…</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <View style={[styles.banner, styles.bannerError]}>
          <Text style={[styles.bannerText, styles.bannerTextError]}>{loadError}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={load} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const renderInformation = () => (
    <>
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>Informations personnelles</Text>
        <View style={styles.grid}>
          <Field
            editing={editing}
            icon={User}
            label="Prénom"
            onChange={value => setField('firstname', value)}
            styles={styles}
            value={editing ? form.firstname : info.firstname}
          />
          <Field
            editing={editing}
            icon={User}
            label="Nom"
            onChange={value => setField('name', value)}
            styles={styles}
            value={editing ? form.name : info.name}
          />
          <Field
            editing={editing}
            fullWidth
            icon={Mail}
            label="Email"
            onChange={value => setField('email', value)}
            styles={styles}
            value={editing ? form.email : info.email}
          />
          <Field
            editing={editing}
            icon={Phone}
            label="Téléphone"
            onChange={value => setField('phone', value)}
            styles={styles}
            value={editing ? form.phone : info.phone}
          />
        </View>

        {isEmployee ? null : (
          <>
            <Text style={[styles.groupTitle, styles.groupTitleSpacing]}>
              Informations de l'entreprise
            </Text>
            <View style={styles.grid}>
              <Field
                editing={editing}
                icon={Building2}
                label="Raison sociale"
                onChange={value => setField('raison_sociale', value)}
                styles={styles}
                value={editing ? form.raison_sociale : biz.raison_sociale}
              />
              <Field
                editing={editing}
                icon={LayoutGrid}
                label="SIRET"
                onChange={value => setField('siret', value)}
                styles={styles}
                value={editing ? form.siret : biz.siret}
              />
              <Field
                editing={editing}
                icon={MapPin}
                label="Adresse de siège"
                onChange={value => setField('address', value)}
                styles={styles}
                value={editing ? form.address : info.address}
              />
              <Field
                editing={editing}
                icon={LayoutGrid}
                label="N° TVA"
                onChange={value => setField('tva_number', value)}
                styles={styles}
                value={editing ? form.tva_number : biz.tva_number}
              />
              <Field
                editing={editing}
                icon={LayoutGrid}
                label="Tenue exigée par défaut"
                onChange={value => setField('tenue_staff', value)}
                styles={styles}
                value={editing ? form.tenue_staff : biz.tenue_staff}
              />
              <Field
                editing={editing}
                fullWidth
                icon={LayoutGrid}
                label="Conditions de facturation"
                multiline
                onChange={value => setField('billing_conditions', value)}
                styles={styles}
                value={editing ? form.billing_conditions : biz.billing_conditions}
              />
            </View>
          </>
        )}
      </View>
    </>
  );

  const renderPassword = () => (
    <View style={styles.groupCard}>
      <Text style={styles.groupTitle}>Changer le mot de passe</Text>
      <Text style={styles.passwordHelp}>
        Le mot de passe actuel est demandé pour confirmer le changement.
      </Text>
      <PasswordField
        label="Mot de passe actuel"
        onChange={value => setPassword(current => ({ ...current, current: value }))}
        onToggle={() =>
          setVisiblePasswords(current => ({ ...current, current: !current.current }))
        }
        placeholder="••••••••"
        styles={styles}
        value={password.current}
        visible={visiblePasswords.current}
      />
      <PasswordField
        label="Nouveau mot de passe"
        onChange={value => setPassword(current => ({ ...current, next: value }))}
        onToggle={() =>
          setVisiblePasswords(current => ({ ...current, next: !current.next }))
        }
        placeholder="Minimum 6 caractères"
        styles={styles}
        value={password.next}
        visible={visiblePasswords.next}
      />
      <PasswordField
        label="Confirmer"
        onChange={value => setPassword(current => ({ ...current, confirm: value }))}
        onToggle={() =>
          setVisiblePasswords(current => ({ ...current, confirm: !current.confirm }))
        }
        placeholder="••••••••"
        styles={styles}
        value={password.confirm}
        visible={visiblePasswords.confirm}
      />
      <Pressable
        accessibilityRole="button"
        disabled={savingPassword}
        onPress={handlePasswordUpdate}
        style={[styles.saveButton, savingPassword && styles.buttonDisabled]}
      >
        <Check size={17} color={colors.white} />
        <Text style={styles.saveButtonText}>
          {savingPassword ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.section}>
      <View style={styles.identityCard}>
        <View style={styles.identityTop}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {photoSrc ? (
                <Image
                  onError={() => setPhotoFailed(true)}
                  source={{ uri: photoSrc }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.identityName}>{fullName || 'Client'}</Text>
            <Text style={styles.identityEmail}>{info.email || '—'}</Text>
            <View style={styles.tagRow}>
              <Text style={[styles.tag, styles.tagBlue]}>{colors.brandLabel}</Text>
              <Text style={[styles.tag, styles.tagBrown]}>
                {isEmployee ? 'Employé' : 'Client'}
              </Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            {editing ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={cancelEditing}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={handleSave}
                  style={[styles.saveButton, saving && styles.buttonDisabled]}
                >
                  <Save size={14} color={colors.white} />
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Enregistrement…' : 'Sauvegarder'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={startEditing}
                style={styles.modifierButton}
              >
                <Edit3 size={14} color={colors.white} />
                <Text style={styles.modifierButtonText}>Modifier</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <Banner feedback={feedback} styles={styles} />

      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('information')}
          style={[
            styles.tab,
            activeTab === 'information' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'information' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Informations
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('password')}
          style={[styles.tab, activeTab === 'password' ? styles.tabActive : styles.tabInactive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'password' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Mot de passe
          </Text>
        </Pressable>
      </View>

      {activeTab === 'information' ? renderInformation() : renderPassword()}
    </ScrollView>
  );
}
