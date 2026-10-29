/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : Profile
 * **Associated Route/Context**: `/extras (Tab/Modal: Profile)`  
 * **Total Discovered Backend Calls**: 12
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Profile.jsx:92`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L92) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:187`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L187) | Data Fetch / Revalidation (`refreshProfile`) | `refreshProfile` | `GET` | `/my-dashboard-data` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:298`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L298) | Data Fetch / Revalidation (`handlePhotoUpload`) | `handlePhotoUpload` | `POST` | `/extra/update` | `formData` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:313`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L313) | Delete / Cancel Button (`handlePhotoDelete`) | `handlePhotoDelete` | `POST` | `/extra/update` | `{ remove_photo: true` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:415`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L415) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:853`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L853) | File Upload / Change Event (`handleFileSelect`) | `handleFileSelect` | `POST` | `/extra/update` | `formData` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:868`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L868) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/extra/documents/${key}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Profile.jsx:997`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L997) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:1015`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1015) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `{ skills: localSkills.map(s => ({ code: s.code` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:1101`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1101) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:1118`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1118) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `{ qualifications: localQuals` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Profile.jsx:926`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L926) | Document Download / Preview (`handleDelete`) | `handleDelete` | `GET` | `/api/files/extra-doc/... (extraId, key)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |
 * 
 * =====================================================================
 */
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker';
import {
  Award,
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Plus,
  Star,
  Trash,
  Upload,
  UserRound,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { profile } from './styles';
import { toPhotoSrc } from '../../../utils/toPhotoSrc';
import {
  getMyDashboardData,
  getExtraFormOptions,
  updateExtraProfile,
  deleteExtraDocument,
} from '../../../api/extraService';

// Port of the web "extra profile" page (staffly-frontend/src/pages/extras/components/Profile.jsx),
// itself styled after Extras.css (.ex-card / .ex-stats-grid / .ex-info-grid / .ex-field …).
const PROFILE_TABS = [
  { key: 'INFO', label: 'Informations', icon: UserRound },
  { key: 'DOCUMENTS', label: 'Documents', icon: FileText },
  { key: 'SKILLS', label: 'Compétences', icon: Star },
  { key: 'QUALIFICATIONS', label: 'Qualifications', icon: Award },
];

const VILLES = [
  'Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil',
  'Créteil', 'Nanterre', 'Versailles', 'Vitry-sur-Seine', 'Colombes',
  'Aulnay-sous-Bois', 'Asnières-sur-Seine', 'Courbevoie', 'Rueil-Malmaison',
  'Aubervilliers', 'Champigny-sur-Marne', 'Saint-Maur-des-Fossés', 'Drancy',
  'Issy-les-Moulineaux', 'Noisy-le-Grand', 'Levallois-Perret', 'Antony',
  'Neuilly-sur-Seine', 'Sarcelles', 'Vénissieux', 'Ivry-sur-Seine', 'Clichy',
  'Cergy', 'Villejuif', 'Pantin', 'Le Blanc-Mesnil', 'Maisons-Alfort',
  'Fontenay-sous-Bois', 'Meaux', 'Melun', 'Chelles', 'Évry-Courcouronnes',
  'Corbeil-Essonnes', 'Massy', 'Mantes-la-Jolie', 'Sartrouville',
  'Sainte-Geneviève-des-Bois', 'Fontainebleau', 'Rambouillet', 'Pontoise',
  'Franconville', 'Goussainville',
];

const REGIONS = ['Ile de France'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AUTO_ENTREPRENEUR_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'en_cours', label: 'En cours' },
];
const AUTO_ENTREPRENEUR_LABELS = { oui: 'Oui', non: 'Non', en_cours: 'En cours' };

const LANGUAGES = [
  'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien',
  'Arabe', 'Portugais', 'Russe', 'Chinois', 'Turc',
];

const SKILLS_CATALOG = [
  'Service en salle', 'Cuisine', 'Manutention', 'Hôte de caisse',
  'Nettoyage', 'Accueil', 'Livraison', 'Inventaire',
];

const QUALIFICATIONS_CATALOG = [
  'HACCP', 'SST', 'CACES 1', 'CACES 3', 'CAP Cuisine', 'Permis B', 'SSIAP 1',
];

const DOC_TYPES = [
  { key: 'cni_recto', label: "Pièce d'identité / Titre de séjour — Recto", required: true },
  { key: 'cni_verso', label: "Pièce d'identité / Titre de séjour — Verso" },
  { key: 'attestation_urssaf', label: 'Attestation de vigilance URSSAF', required: true },
  { key: 'kbis', label: "Kbis / Attestation d'affiliation URSSAF" },
  { key: 'permis_recto', label: 'Permis Recto' },
  { key: 'permis_verso', label: 'Permis Verso' },
  { key: 'cv', label: 'CV' },
  { key: 'diplomes', label: 'Diplômes divers' },
];

const MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

const getInitials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

const formatDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return value || '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const formatMonth = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return value || '—';
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const getDocBadge = (doc) => {
  if (!doc) return { bg: '#f5f5f5', color: '#888', label: 'Non insérée' };
  const map = {
    valide: { bg: '#eaf5ea', color: '#2e7d32', label: 'Validé' },
    en_attente: { bg: '#fff8e1', color: '#f57f17', label: 'En attente' },
    rejete: { bg: '#fdf0f0', color: '#9b1c1c', label: 'Non acceptée' },
  };
  return map[doc.statut_conformite] || { bg: '#f5f5f5', color: '#888', label: 'Non insérée' };
};

/* ── Shared field primitives ── */
function Field({ label, grow, children }) {
  return (
    <View style={grow ? profile.fieldGrow : profile.field}>
      <Text style={profile.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function TextField({ label, grow, ...inputProps }) {
  return (
    <Field label={label} grow={grow}>
      <TextInput
        placeholderTextColor="#bbb"
        style={profile.input}
        {...inputProps}
      />
    </Field>
  );
}

function PasswordField({ label, grow, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} grow={grow}>
      <View style={profile.pwWrapper}>
        <TextInput
          placeholderTextColor="#bbb"
          secureTextEntry={!visible}
          style={[profile.input, profile.pwInput]}
          {...inputProps}
        />
        <Pressable
          accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setVisible((value) => !value)}
          style={profile.pwToggle}
        >
          {visible ? <EyeOff size={16} color="#aaa" /> : <Eye size={16} color="#aaa" />}
        </Pressable>
      </View>
    </Field>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[profile.chip, active && profile.chipOn]}
    >
      <Text style={[profile.chipText, active && profile.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function CheckField({ label, checked, onToggle }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={profile.checkItem}
    >
      <View style={[profile.checkBox, checked && profile.checkBoxOn]}>
        {checked ? <Check size={11} color={colors.white} /> : null}
      </View>
      <Text style={profile.checkLabel}>{label}</Text>
    </Pressable>
  );
}

/* Mobile stand-in for the web <select>: a bottom sheet listing the options. */
function OptionSheet({ visible, title, options, value, onSelect, onClose }) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="Fermer la liste"
        accessibilityRole="button"
        onPress={onClose}
        style={profile.pickerBackdrop}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={profile.pickerSheet}
        >
          <Text style={profile.pickerTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const active = optionValue === value;
              return (
                <Pressable
                  key={optionValue}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => onSelect(optionValue)}
                  style={profile.pickerOption}
                >
                  <Text
                    style={[
                      profile.pickerOptionText,
                      active && profile.pickerOptionTextActive,
                    ]}
                  >
                    {optionLabel}
                  </Text>
                  {active ? <Check size={16} color={colors.orange} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SelectField({ label, value, options, onSelect, placeholder = '-- Sélectionner --', grow }) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} grow={grow}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={profile.selectField}
      >
        <Text
          numberOfLines={1}
          style={[profile.selectText, !value && profile.selectPlaceholder]}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={16} color="#aaa" />
      </Pressable>
      <OptionSheet
        onClose={() => setOpen(false)}
        onSelect={(option) => {
          onSelect(option);
          setOpen(false);
        }}
        options={options}
        title={label}
        value={value}
        visible={open}
      />
    </Field>
  );
}

export default function Profile() {
  const [tab, setTab] = useState('INFO');
  const [extraData, setExtraData] = useState(null);
  const [formOptions, setFormOptions] = useState({ languages: [], skills: [], qualifications: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getMyDashboardData().catch(() => null),
      getExtraFormOptions().catch(() => null),
    ]).then(([data, opts]) => {
      if (!alive) return;
      if (data) setExtraData(data);
      if (opts) setFormOptions({
        languages: opts.languages || [],
        skills: opts.skills || [],
        qualifications: opts.qualifications || [],
      });
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const refreshProfile = async () => {
    try {
      const refreshed = await getMyDashboardData();
      setExtraData(refreshed);
    } catch {
      // silent — the user sees the previous state
    }
  };

  const { account_info, profile_details, documents, skills } = extraData || {};

  const updateExtraData = (patch) =>
    setExtraData((previous) => ({ ...previous, ...patch }));

  return (
    <View>
      <View style={profile.tabs}>
        {PROFILE_TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(key)}
              style={[profile.tab, active && profile.tabActive]}
            >
              <Icon size={15} color={active ? colors.white : '#bbb'} />
              <Text
                numberOfLines={1}
                style={[profile.tabLabel, active && profile.tabLabelActive]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={profile.card}>
          <Text style={profile.cardTitle}>Chargement du profil…</Text>
        </View>
      ) : !extraData ? (
        <View style={profile.card}>
          <Text style={profile.cardTitle}>Impossible de charger le profil</Text>
        </View>
      ) : (
        <>
          {tab === 'INFO' ? (
            <InfoTab
              accountInfo={account_info}
              onChange={updateExtraData}
              profileDetails={profile_details}
              languages={formOptions.languages}
              onRefresh={refreshProfile}
            />
          ) : null}

          {tab === 'DOCUMENTS' ? (
            <DocumentsTab documents={documents || []} onChange={updateExtraData} onRefresh={refreshProfile} />
          ) : null}

          {tab === 'SKILLS' ? (
            <SkillsTab onChange={updateExtraData} skills={skills || []} catalog={formOptions.skills} onRefresh={refreshProfile} />
          ) : null}

          {tab === 'QUALIFICATIONS' ? (
            <QualificationsTab
              onChange={updateExtraData}
              profileDetails={profile_details}
              catalog={formOptions.qualifications}
              onRefresh={refreshProfile}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

/* ════ Tab 1 — Informations ════ */
function InfoTab({ accountInfo, profileDetails, onChange, languages: availableLanguages, onRefresh }) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const currentRegions = Array.isArray(profileDetails?.city)
    ? profileDetails.city
    : profileDetails?.city
      ? [profileDetails.city]
      : [];
  const currentVille = profileDetails?.ville || '';
  const autoEntrepreneur = profileDetails?.auto_entrepreneur || '';

  const openEdit = () => {
    setDraft({
      firstname: accountInfo?.first_name || '',
      name: accountInfo?.last_name || '',
      email: accountInfo?.email || '',
      phone: accountInfo?.phone || '',
      address: accountInfo?.address || '',
      postal_code: accountInfo?.postal_code || '',
      birth_date: accountInfo?.birthday || '',
      cities: [...currentRegions],
      ville: currentVille,
      tshirt_size: profileDetails?.tshirt_size || '',
      shoe_size: profileDetails?.shoe_size || '',
      has_permis_b: !!profileDetails?.has_permis_b,
      accepte_camion: !!profileDetails?.accepte_camion,
      vehicule_perso: !!profileDetails?.vehicule_perso,
      statut_auto_entrepreneur: autoEntrepreneur,
      languages: [...(profileDetails?.languages || [])],
      current_password: '',
      password: '',
      password_confirmation: '',
    });
    setEditMode(true);
  };

  const setField = (key, value) =>
    setDraft((previous) => ({ ...previous, [key]: value }));

  const toggleInList = (key, item) =>
    setField(
      key,
      draft[key].includes(item)
        ? draft[key].filter((entry) => entry !== item)
        : [...draft[key], item],
    );

  const pickAvatar = async () => {
    try {
      const [pickedFile] = await pick({ type: [types.images] });
      if (!pickedFile?.uri) return;

      // Upload the photo to the backend.
      // The API expects the file under the "photo_profil" field name.
      const formData = new FormData();
      formData.append('photo_profil', {
        uri: pickedFile.uri,
        type: pickedFile.type || 'image/jpeg',
        name: pickedFile.name || 'avatar.jpg',
      });

      try {
        await updateExtraProfile(formData);
        // Update local state immediately (the API stores it as `photo`).
        onChange({
          account_info: { ...accountInfo, photo: pickedFile.uri },
        });
        if (onRefresh) await onRefresh();
        Alert.alert('Succès', 'Photo de profil mise à jour.');
      } catch (err) {
        Alert.alert('Erreur', err?.message || 'Impossible de téléverser la photo.');
      }
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      Alert.alert(
        'Impossible de choisir une photo',
        isErrorWithCode(error)
          ? error.message
          : 'Une erreur inattendue est survenue. Réessayez.',
      );
    }
  };

  const save = async () => {
    // Build a diff payload — only send changed fields (same logic as web).
    const personalMap = {
      firstname: accountInfo?.first_name || '',
      name: accountInfo?.last_name || '',
      email: accountInfo?.email || '',
      phone: accountInfo?.phone || '',
      address: accountInfo?.address || '',
      postal_code: accountInfo?.postal_code || '',
      birth_date: accountInfo?.birthday || '',
    };
    const profileMap = {
      ville: currentVille,
      tshirt_size: profileDetails?.tshirt_size || '',
      shoe_size: profileDetails?.shoe_size || '',
      has_permis_b: profileDetails?.has_permis_b ? 1 : 0,
      accepte_camion: profileDetails?.accepte_camion ? 1 : 0,
      vehicule_perso: profileDetails?.vehicule_perso ? 1 : 0,
      statut_auto_entrepreneur: autoEntrepreneur,
    };

    const draftMap = {
      ...personalMap,
      ...profileMap,
      firstname: draft.firstname,
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      address: draft.address,
      postal_code: draft.postal_code,
      birth_date: draft.birth_date,
      ville: draft.ville,
      tshirt_size: draft.tshirt_size,
      shoe_size: draft.shoe_size,
      has_permis_b: draft.has_permis_b ? 1 : 0,
      accepte_camion: draft.accepte_camion ? 1 : 0,
      vehicule_perso: draft.vehicule_perso ? 1 : 0,
      statut_auto_entrepreneur: draft.statut_auto_entrepreneur,
    };

    const payload = {};
    Object.entries({ ...personalMap, ...profileMap }).forEach(([key, original]) => {
      if (draftMap[key] !== original) payload[key] = draftMap[key];
    });

    const originalLangs = JSON.stringify([...(profileDetails?.languages || [])].sort());
    const newLangs = JSON.stringify([...draft.languages].sort());
    if (originalLangs !== newLangs) payload.languages = draft.languages;

    const originalRegions = JSON.stringify([...currentRegions].sort());
    const newRegions = JSON.stringify([...(draft.cities || [])].sort());
    if (originalRegions !== newRegions) payload.city = draft.cities;

    if (draft.current_password?.trim()) {
      payload.current_password = draft.current_password;
      payload.password = draft.password;
      payload.password_confirmation = draft.password_confirmation;
    }

    if (Object.keys(payload).length === 0) {
      Alert.alert('Aucune modification', 'Aucun champ n\'a été modifié.');
      return;
    }

    setSaving(true);
    try {
      await updateExtraProfile(payload);
      // Update local state optimistically
      onChange({
        account_info: {
          ...accountInfo,
          first_name: draft.firstname,
          last_name: draft.name,
          email: draft.email,
          phone: draft.phone,
          address: draft.address,
          postal_code: draft.postal_code,
          birthday: draft.birth_date,
        },
        profile_details: {
          ...profileDetails,
          ville: draft.ville,
          city: draft.cities,
          tshirt_size: draft.tshirt_size,
          shoe_size: draft.shoe_size,
          has_permis_b: draft.has_permis_b,
          accepte_camion: draft.accepte_camion,
          vehicule_perso: draft.vehicule_perso,
          auto_entrepreneur: draft.statut_auto_entrepreneur,
          languages: draft.languages,
        },
      });
      if (onRefresh) await onRefresh();
      setEditMode(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (editMode) {
    return (
      <View>
        <View style={profile.card}>
          <Text style={profile.cardTitle}>Informations personnelles</Text>
          <View style={profile.fieldsGrid}>
            <View style={profile.fieldsGridRow}>
              <TextField
                autoCapitalize="words"
                grow
                label="Prénom"
                onChangeText={(value) => setField('firstname', value)}
                value={draft.firstname}
              />
              <TextField
                autoCapitalize="words"
                grow
                label="Nom"
                onChangeText={(value) => setField('name', value)}
                value={draft.name}
              />
            </View>
            <View style={profile.fieldsGridRow}>
              <TextField
                autoCapitalize="none"
                grow
                keyboardType="email-address"
                label="E-mail"
                onChangeText={(value) => setField('email', value)}
                value={draft.email}
              />
              <TextField
                grow
                keyboardType="phone-pad"
                label="Téléphone"
                onChangeText={(value) => setField('phone', value)}
                value={draft.phone}
              />
            </View>
            <TextField
              label="Adresse"
              onChangeText={(value) => setField('address', value)}
              value={draft.address}
            />
            <View style={profile.fieldsGridRow}>
              <TextField
                grow
                keyboardType="number-pad"
                label="Code postal"
                maxLength={5}
                onChangeText={(value) => setField('postal_code', value.replace(/\D/g, '').slice(0, 5))}
                value={draft.postal_code}
              />
              <TextField
                autoCapitalize="none"
                grow
                label="Date de naissance"
                onChangeText={(value) => setField('birth_date', value)}
                placeholder="AAAA-MM-JJ"
                value={draft.birth_date}
              />
            </View>
          </View>
        </View>

        <View style={profile.card}>
          <Text style={profile.cardTitle}>Profil extra</Text>
          <View style={profile.fieldsGrid}>
            <SelectField
              label="Ville"
              onSelect={(value) => setField('ville', value)}
              options={VILLES}
              value={draft.ville}
            />
            <Field label="Région">
              <View style={profile.chipRow}>
                {REGIONS.map((region) => (
                  <Chip
                    key={region}
                    active={draft.cities.includes(region)}
                    label={region}
                    onPress={() => toggleInList('cities', region)}
                  />
                ))}
              </View>
            </Field>
            <View style={profile.fieldsGridRow}>
              <SelectField
                grow
                label="Taille t-shirt"
                onSelect={(value) => setField('tshirt_size', value)}
                options={TSHIRT_SIZES}
                value={draft.tshirt_size}
              />
              <TextField
                grow
                keyboardType="number-pad"
                label="Pointure"
                maxLength={2}
                onChangeText={(value) => setField('shoe_size', value.replace(/\D/g, '').slice(0, 2))}
                value={draft.shoe_size}
              />
            </View>
            <SelectField
              label="Auto-entrepreneur"
              onSelect={(value) => setField('statut_auto_entrepreneur', value)}
              options={AUTO_ENTREPRENEUR_OPTIONS}
              value={draft.statut_auto_entrepreneur}
            />
            <Field label="Permis et véhicule">
              <View style={profile.checkRow}>
                <CheckField
                  checked={draft.has_permis_b}
                  label="Permis B"
                  onToggle={() => setField('has_permis_b', !draft.has_permis_b)}
                />
                <CheckField
                  checked={draft.accepte_camion}
                  label="Accepte camion"
                  onToggle={() => setField('accepte_camion', !draft.accepte_camion)}
                />
                <CheckField
                  checked={draft.vehicule_perso}
                  label="Véhicule personnel"
                  onToggle={() => setField('vehicule_perso', !draft.vehicule_perso)}
                />
              </View>
            </Field>
          </View>
        </View>

        <View style={profile.card}>
          <Text style={profile.cardTitle}>Langues parlées</Text>
          <Field label="Sélectionnez vos langues">
            <View style={profile.chipRow}>
              {(availableLanguages && availableLanguages.length > 0
                ? availableLanguages
                : LANGUAGES
              ).map((lang) => {
                const code = typeof lang === 'string' ? lang : lang.code;
                const label = typeof lang === 'string' ? lang : (lang.label || lang.code);
                return (
                  <Chip
                    key={code}
                    active={draft.languages.includes(code)}
                    label={label}
                    onPress={() => toggleInList('languages', code)}
                  />
                );
              })}
            </View>
          </Field>
        </View>

        <View style={profile.card}>
          <Text style={profile.cardTitle}>Changer le mot de passe</Text>
          <Text style={profile.cardHint}>(laisser vide pour ne pas modifier)</Text>
          <View style={profile.fieldsGrid}>
            <PasswordField
              label="Mot de passe actuel"
              onChangeText={(value) => setField('current_password', value)}
              placeholder="Votre mot de passe actuel"
              value={draft.current_password}
            />
            <View style={profile.fieldsGridRow}>
              <PasswordField
                grow
                label="Nouveau mot de passe"
                onChangeText={(value) => setField('password', value)}
                placeholder="Minimum 6 caractères"
                value={draft.password}
              />
              <PasswordField
                grow
                label="Confirmer le mot de passe"
                onChangeText={(value) => setField('password_confirmation', value)}
                placeholder="Répétez le mot de passe"
                value={draft.password_confirmation}
              />
            </View>
          </View>
        </View>

        <View style={profile.editActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setEditMode(false)}
            style={profile.btnCancel}
          >
            <Text style={profile.btnCancelText}>Annuler</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={save}
            style={[profile.btnSave, saving && profile.btnSaveDisabled]}
          >
            <Check size={14} color={colors.white} />
            <Text style={profile.btnSaveText}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const stats = [
    {
      label: 'Statut',
      value: accountInfo?.status || '—',
      sub: 'état du compte',
      valueColor: accountInfo?.status === 'active' ? '#2e7d32' : '#f57f17',
    },
    { label: 'Ville', value: currentVille || '—', sub: "zone d'activité" },
    {
      label: 'Auto-entrepreneur',
      value: AUTO_ENTREPRENEUR_LABELS[autoEntrepreneur] || '—',
      sub: 'statut',
    },
    { label: 'Membre depuis', value: formatMonth(accountInfo?.member_since), sub: "date d'inscription" },
  ];

  const accountRows = [
    ['Nom complet', `${accountInfo?.first_name || ''} ${accountInfo?.last_name || ''}`.trim()],
    ['E-mail', accountInfo?.email || '—'],
    ['Téléphone', accountInfo?.phone || '—'],
    ['Adresse', accountInfo?.address || '—'],
    ['Code postal', accountInfo?.postal_code || '—'],
    ['Naissance', formatDate(accountInfo?.birthday)],
  ];

  const profilRows = [
    ['Ville', currentVille || '—'],
    ['Région', currentRegions.length > 0 ? currentRegions.join(', ') : '—'],
    ['Taille t-shirt', profileDetails?.tshirt_size || '—'],
    ['Pointure', profileDetails?.shoe_size || '—'],
    ['Permis B', profileDetails?.has_permis_b ? 'Oui' : 'Non'],
    ['Accepte de conduire un camion', profileDetails?.accepte_camion ? 'Oui' : 'Non'],
    ['Véhicule personnel', profileDetails?.vehicule_perso ? 'Oui' : 'Non'],
    ['Auto-entrepreneur', AUTO_ENTREPRENEUR_LABELS[autoEntrepreneur] || '—'],
  ];

  const languages = profileDetails?.languages || [];
  // The API exposes the profile picture as `account_info.photo` ("assets/photos/x.jpg").
  const avatarUri = toPhotoSrc(accountInfo?.photo || accountInfo?.avatar_url);

  return (
    <View>
      <View style={profile.editHeader}>
        <View style={profile.editHeaderIdentity}>
          <View style={profile.avatarWrap}>
            <View style={profile.avatar}>
              {avatarUri ? (
                <Image
                  accessibilityLabel="Photo de profil"
                  source={{ uri: avatarUri }}
                  style={profile.avatarImage}
                />
              ) : (
                <Text style={profile.avatarText}>
                  {getInitials(accountInfo?.first_name, accountInfo?.last_name)}
                </Text>
              )}
            </View>
            <Pressable
              accessibilityLabel="Changer la photo de profil"
              accessibilityRole="button"
              hitSlop={6}
              onPress={pickAvatar}
              style={profile.avatarBadge}
            >
              <Camera size={13} color={colors.white} />
            </Pressable>
          </View>
          <View style={profile.editHeaderText}>
            <Text style={profile.editHeaderTitle}>Informations personnelles</Text>
            <Text style={profile.editHeaderSub}>
              {accountInfo?.first_name} {accountInfo?.last_name}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={openEdit}
          style={profile.btnEdit}
        >
          <Pencil size={14} color={colors.white} />
          <Text style={profile.btnEditText}>Modifier</Text>
        </Pressable>
      </View>

      <View style={profile.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={profile.statCard}>
            <Text style={profile.statLabel}>{stat.label}</Text>
            <Text style={[profile.statValue, stat.valueColor && { color: stat.valueColor }]}>
              {stat.value}
            </Text>
            <Text style={profile.statSub}>{stat.sub}</Text>
          </View>
        ))}
      </View>

      <View style={profile.infoGrid}>
        <View style={profile.card}>
          <Text style={profile.cardTitle}>Compte</Text>
          {accountRows.map(([label, value], index) => (
            <View
              key={label}
              style={[profile.infoRow, index === accountRows.length - 1 && profile.infoRowLast]}
            >
              <Text style={profile.infoLabel}>{label}</Text>
              <Text style={profile.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={profile.card}>
          <Text style={profile.cardTitle}>Profil</Text>
          {profilRows.map(([label, value], index) => (
            <View
              key={label}
              style={[profile.infoRow, index === profilRows.length - 1 && profile.infoRowLast]}
            >
              <Text style={profile.infoLabel}>{label}</Text>
              <Text style={profile.infoValue}>{value}</Text>
            </View>
          ))}
          <View style={[profile.infoRow, profile.infoRowLast]}>
            <Text style={profile.infoLabel}>Langues</Text>
            {languages.length > 0 ? (
              <View style={profile.langTags}>
                {languages.map((language) => (
                  <View key={language} style={profile.langTag}>
                    <Text style={profile.langTagText}>{language}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={profile.infoValue}>—</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

/* ════ Tab 2 — Documents ════ */
function DocumentsTab({ documents, onChange, onRefresh }) {
  const getExistingDoc = (key) =>
    documents.find((doc) => doc.type_document === key);

  const cards = [
    ...DOC_TYPES,
    ...documents
      .filter((doc) => !DOC_TYPES.some((type) => type.key === doc.type_document))
      .map((doc) => ({ key: doc.type_document, label: doc.type_document.replace(/_/g, ' ') })),
  ];

  const commitDocuments = (nextDocuments) => onChange({ documents: nextDocuments });

  // "Ajouter" and "Remplacer" open the phone file picker (images + PDF),
  // then upload the file to the backend via FormData.
  const pickDocument = async (key) => {
    try {
      const [picked] = await pick({ type: [types.images, types.pdf] });
      if (!picked?.uri) return;

      let uri = picked.uri;
      if (uri.startsWith('content://')) {
        try {
          const [copy] = await keepLocalCopy({
            files: [{ uri, fileName: picked.name || `${key}.pdf` }],
            destination: 'cachesDirectory',
          });
          if (copy?.status === 'success' && copy.localUri) uri = copy.localUri;
        } catch (copyError) {
          // Keep the picker uri when the local copy cannot be made.
        }
      }

      // Upload to the backend.
      // The API expects the file under the document type key itself
      // (cni_recto, kbis, permis_verso, ...) — not a generic "document" field.
      const formData = new FormData();
      formData.append(key, {
        uri,
        type: picked.type || (picked.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        name: picked.name || `${key}.pdf`,
      });

      try {
        await updateExtraProfile(formData);
        // Update local state
        const nextDocuments = documents.filter(
          (doc) => doc.type_document !== key,
        );
        nextDocuments.push({
          type_document: key,
          statut_conformite: 'en_attente',
          date_upload: new Date().toISOString(),
          file_name: picked.name || `${key}.pdf`,
          file_uri: uri,
          file_type: picked.type || null,
          file_size: picked.size || null,
        });
        commitDocuments(nextDocuments);
        if (onRefresh) await onRefresh();
        Alert.alert('Succès', 'Document téléversé.');
      } catch (err) {
        Alert.alert('Erreur', err?.message || 'Impossible de téléverser le document.');
      }
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      Alert.alert(
        'Impossible de sélectionner le document',
        isErrorWithCode(error)
          ? error.message
          : 'Une erreur inattendue est survenue. Réessayez.',
      );
    }
  };

  const deleteDocument = (key) => {
    Alert.alert(
      'Supprimer ce document',
      'Le document sera retiré de votre dossier. Vous pourrez en déposer un nouveau à tout moment.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExtraDocument(key);
              commitDocuments(
                documents.filter((doc) => doc.type_document !== key),
              );
              if (onRefresh) await onRefresh();
              Alert.alert('Succès', 'Document supprimé.');
            } catch (err) {
              Alert.alert('Erreur', err?.message || 'Impossible de supprimer le document.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={profile.card}>
      <Text style={profile.cardTitle}>Mes documents</Text>
      <Text style={profile.cardHint}>
        PDF, JPG, PNG — 10 Mo max. Un nouveau fichier remplace l'ancien et repasse « En attente ».
      </Text>

      <View style={profile.docGrid}>
        {cards.map(({ key, label, required }) => {
          const doc = getExistingDoc(key);
          const badge = getDocBadge(doc);
          const hasFile = !!doc;
          const rejected = doc?.statut_conformite === 'rejete';
          // Solid orange is reserved for "Ajouter"; "Remplacer" is outlined
          // whatever the document status.
          const outlined = hasFile;
          return (
            <View
              key={key}
              style={[profile.docCard, rejected && profile.docCardRejected]}
            >
              <View style={profile.docLabelRow}>
                <Text style={profile.docLabel}>{label}</Text>
                {required ? <Text style={profile.docRequired}>Obligatoire</Text> : null}
              </View>

              <View style={[profile.badge, { backgroundColor: badge.bg }]}>
                <Text style={[profile.badgeText, { color: badge.color }]}>
                  {badge.label}
                </Text>
              </View>

              {rejected && doc.commentaires ? (
                <Text style={profile.docComment}>{doc.commentaires}</Text>
              ) : null}

              {hasFile ? (
                <Text style={profile.docLink}>Voir le document</Text>
              ) : null}

              {hasFile && doc.date_upload ? (
                <Text style={profile.docDate}>
                  Déposé le {formatDate(doc.date_upload)}
                </Text>
              ) : null}

              <View style={profile.docActions}>
                <Pressable
                  accessibilityLabel={`${hasFile ? 'Remplacer' : 'Ajouter'} ${label}`}
                  accessibilityRole="button"
                  onPress={() => pickDocument(key)}
                  style={[profile.docBtn, outlined && profile.docBtnOutline]}
                >
                  {hasFile ? (
                    <Upload size={14} color={outlined ? colors.orangeDark : colors.white} />
                  ) : (
                    <Plus size={14} color={colors.white} />
                  )}
                  <Text style={[profile.docBtnText, outlined && profile.docBtnTextOutline]}>
                    {hasFile ? 'Remplacer' : 'Ajouter'}
                  </Text>
                </Pressable>
                {hasFile ? (
                  <Pressable
                    accessibilityLabel={`Supprimer ${label}`}
                    accessibilityRole="button"
                    onPress={() => deleteDocument(key)}
                    style={profile.docDeleteBtn}
                  >
                    <Trash size={14} color="#9b1c1c" />
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ════ Tab 3 — Compétences ════ */
function SkillsTab({ skills, onChange, catalog, onRefresh }) {
  const [selected, setSelected] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  // Local copy of the ratings so clicking a star updates instantly and is
  // not thrown away by a re-render (same behaviour as the web page).
  const [localItems, setLocalItems] = useState(() =>
    (skills || []).map((skill) => ({
      code: skill.skill_code || skill.code,
      score: Number(skill.note ?? skill.score ?? 3) || 3,
    })),
  );

  // Only re-seed from the server when a refresh delivers a genuinely
  // different list (e.g. after save). We compare by JSON so that the
  // onChange-triggered prop mutation (which is identical to what we
  // just wrote) doesn't reset our local edits and the dirty flag.
  const lastSyncedRef = useRef(JSON.stringify(skills || []));
  useEffect(() => {
    const snapshot = JSON.stringify(skills || []);
    if (snapshot !== lastSyncedRef.current) {
      lastSyncedRef.current = snapshot;
      setLocalItems((skills || []).map((skill) => ({
        code: skill.skill_code || skill.code,
        score: Number(skill.note ?? skill.score ?? 3) || 3,
      })));
      setDirty(false);
    }
  }, [skills]);

  const items = localItems;
  const catalogList = (catalog && catalog.length > 0 ? catalog : SKILLS_CATALOG);
  const available = catalogList
    .filter((entry) => {
      const code = typeof entry === 'string' ? entry : (entry.code || entry.label);
      return !items.some((item) => item.code === code);
    })
    .map((entry) => {
      if (typeof entry === 'string') return { value: entry, label: entry };
      const code = entry.code || entry.label;
      return { value: code, label: entry.label || code };
    });

  const commit = (next) => {
    setLocalItems(next);
    onChange({ skills: next.map((item) => ({ skill_code: item.code, note: item.score })) });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      // The API stores the rating under "score" (see Extra::processMetaData).
      await updateExtraProfile({
        skills: items.map(s => ({ code: s.code, score: s.score })),
      });
      setDirty(false);
      if (onRefresh) await onRefresh();
      Alert.alert('Succès', 'Compétences enregistrées.');
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d\'enregistrer.');
    } finally {
      setSaving(false);
    }
  };

  const add = () => {
    if (!selected) return;
    commit([...items, { code: selected, score: 3 }]);
    setSelected('');
  };

  const remove = (code) => commit(items.filter((item) => item.code !== code));

  const rate = (code, score) =>
    commit(items.map((item) => (item.code === code ? { ...item, score } : item)));

  return (
    <View>
      <View style={profile.card}>
        <Text style={profile.cardTitle}>Ajouter une compétence</Text>
        <View style={profile.inlineRow}>
          <SelectField
            grow
            label="Compétence"
            onSelect={setSelected}
            options={available}
            value={selected}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!selected}
            onPress={add}
            style={[profile.btnSave, !selected && profile.btnSaveDisabled]}
          >
            <Plus size={14} color={colors.white} />
            <Text style={profile.btnSaveText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      <View style={profile.card}>
        <Text style={profile.cardTitle}>Mes compétences ({items.length})</Text>
        {items.length === 0 ? (
          <Text style={profile.emptyText}>Aucune compétence ajoutée.</Text>
        ) : (
          <View style={profile.listColumn}>
            {items.map((item) => (
              <View key={item.code} style={profile.skillRow}>
                <Text numberOfLines={1} style={profile.skillName}>{item.code}</Text>
                <View style={profile.skillRating}>
                  <Text style={profile.skillNoteLabel}>Note :</Text>
                  <View style={profile.skillStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable
                        key={star}
                        accessibilityLabel={`Note ${star} sur 5`}
                        accessibilityRole="button"
                        hitSlop={4}
                        onPress={() => rate(item.code, star)}
                        style={profile.iconBtn}
                      >
                        <Star
                          color="#f57f17"
                          fill={star <= item.score ? '#f57f17' : 'none'}
                          size={16}
                        />
                      </Pressable>
                    ))}
                  </View>
                  <Text style={profile.skillScore}>{item.score}/5</Text>
                </View>
                <Pressable
                  accessibilityLabel="Retirer la compétence"
                  accessibilityRole="button"
                  hitSlop={6}
                  onPress={() => remove(item.code)}
                  style={profile.iconBtn}
                >
                  <Trash size={14} color="#ccc" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {items.length > 0 ? (
          <View style={profile.saveRow}>
            <Pressable
              accessibilityRole="button"
              disabled={!dirty || saving}
              onPress={save}
              style={[profile.btnSave, (!dirty || saving) && profile.btnSaveDisabled]}
            >
              <Check size={14} color={colors.white} />
              <Text style={profile.btnSaveText}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ════ Tab 4 — Qualifications ════ */
function QualificationsTab({ profileDetails, onChange, catalog, onRefresh }) {
  const [selected, setSelected] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  // Local copy so an added/removed qualification survives a re-render.
  const [localItems, setLocalItems] = useState(() => profileDetails?.qualifications || []);

  const serverItems = profileDetails?.qualifications || [];

  // Only re-seed from the server when a refresh delivers a genuinely
  // different list (e.g. after save). Without this guard, the onChange
  // triggered by add/remove would mutate the prop, re-trigger this effect,
  // and reset the local list + dirty flag — effectively auto-saving.
  const lastSyncedRef = useRef(JSON.stringify(serverItems));
  useEffect(() => {
    const snapshot = JSON.stringify(serverItems);
    if (snapshot !== lastSyncedRef.current) {
      lastSyncedRef.current = snapshot;
      setLocalItems(serverItems);
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetails?.qualifications]);

  const items = localItems;
  const catalogList = (catalog && catalog.length > 0 ? catalog : QUALIFICATIONS_CATALOG);
  const available = catalogList
    .filter((entry) => {
      const code = typeof entry === 'string' ? entry : (entry.code || entry.label);
      return !items.includes(code);
    })
    .map((entry) => {
      if (typeof entry === 'string') return { value: entry, label: entry };
      const code = entry.code || entry.label;
      return { value: code, label: entry.label || code };
    });

  const commit = (next) => {
    setLocalItems(next);
    onChange({ profile_details: { ...profileDetails, qualifications: next } });
    setDirty(true);
  };

  const add = () => {
    if (!selected) return;
    commit([...items, selected]);
    setSelected('');
  };

  const remove = (code) => commit(items.filter((item) => item !== code));

  const save = async () => {
    setSaving(true);
    try {
      await updateExtraProfile({ qualifications: items });
      setDirty(false);
      if (onRefresh) await onRefresh();
      Alert.alert('Succès', 'Qualifications enregistrées.');
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d\'enregistrer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <View style={profile.card}>
        <Text style={profile.cardTitle}>Ajouter une qualification</Text>
        <View style={profile.inlineRow}>
          <SelectField
            grow
            label="Qualification"
            onSelect={setSelected}
            options={available}
            value={selected}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!selected}
            onPress={add}
            style={[profile.btnSave, !selected && profile.btnSaveDisabled]}
          >
            <Plus size={14} color={colors.white} />
            <Text style={profile.btnSaveText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      <View style={profile.card}>
        <Text style={profile.cardTitle}>Mes qualifications ({items.length})</Text>
        {items.length === 0 ? (
          <Text style={profile.emptyText}>Aucune qualification ajoutée.</Text>
        ) : (
          <View style={[profile.chipRow, profile.qualList]}>
            {items.map((code) => (
              <View key={code} style={profile.qualChip}>
                <Text style={profile.qualText}>{code}</Text>
                <Pressable
                  accessibilityLabel="Retirer la qualification"
                  accessibilityRole="button"
                  hitSlop={6}
                  onPress={() => remove(code)}
                >
                  <Trash size={14} color="#bbb" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
        <View style={[profile.saveRow, profile.saveRowTight]}>
          <Pressable
            accessibilityRole="button"
            disabled={!dirty || saving}
            onPress={save}
            style={[profile.btnSave, (!dirty || saving) && profile.btnSaveDisabled]}
          >
            <Check size={14} color={colors.white} />
            <Text style={profile.btnSaveText}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
