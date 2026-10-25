import { useState } from 'react';
import {
  Alert,
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
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { profileStyles as styles } from './styles';

const emptyProfile = {
  firstName: 'Client',
  lastName: '02',
  email: 'client02@example.test',
  phone: '0611110002',
  company: 'Client Test 02',
  siret: '09900000000002',
  address: '1 Rue du Test 02, Paris',
  vat: '—',
  attire: '—',
  billing: '—',
};

function Field({ label, value, icon: Icon, editing, onChange, multiline, fullWidth }) {
  return (
    <View style={fullWidth ? styles.gridItemFull : styles.gridItem}>
      <View style={styles.fieldLabel}>
        {Icon && <Icon size={13} color="#AAA" />}
        <Text style={styles.fieldLabelText}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          accessibilityLabel={label}
          multiline={multiline}
          onChangeText={onChange}
          style={[styles.input, multiline && styles.textarea]}
          value={value === '—' ? '' : value}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle, placeholder }) {
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
  const [activeTab, setActiveTab] = useState('information');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = name
    ? name
        .split(/\s+/)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'C0';

  function updatePassword() {
    if (!password.current || !password.next || !password.confirm) {
      Alert.alert('Champs requis', 'Renseignez les trois champs.');
    } else if (password.next.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.');
    } else if (password.next !== password.confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
    } else {
      Alert.alert('Succès', 'Mot de passe mis à jour.');
      setPassword({ current: '', next: '', confirm: '' });
    }
  }

  function renderInformation() {
    return (
      <>
        <View style={styles.groupCard}>
          <Text style={styles.groupTitle}>Informations personnelles</Text>
          <View style={styles.grid}>
            <Field
              editing={editing}
              icon={User}
              label="Prénom"
              onChange={val => setDraft(curr => ({ ...curr, firstName: val }))}
              value={editing ? draft.firstName : profile.firstName}
            />
            <Field
              editing={editing}
              icon={User}
              label="Nom"
              onChange={val => setDraft(curr => ({ ...curr, lastName: val }))}
              value={editing ? draft.lastName : profile.lastName}
            />
            <Field
              editing={editing}
              fullWidth
              icon={Mail}
              label="Email"
              onChange={val => setDraft(curr => ({ ...curr, email: val }))}
              value={editing ? draft.email : profile.email}
            />
            <Field
              editing={editing}
              icon={Phone}
              label="Téléphone"
              onChange={val => setDraft(curr => ({ ...curr, phone: val }))}
              value={editing ? draft.phone : profile.phone}
            />
          </View>

          <Text style={[styles.groupTitle, styles.groupTitleSpacing]}>
            Informations de l'entreprise
          </Text>
          <View style={styles.grid}>
            <Field
              editing={editing}
              icon={Building2}
              label="Raison sociale"
              onChange={val => setDraft(curr => ({ ...curr, company: val }))}
              value={editing ? draft.company : profile.company}
            />
            <Field
              editing={editing}
              icon={LayoutGrid}
              label="SIRET"
              onChange={val => setDraft(curr => ({ ...curr, siret: val }))}
              value={editing ? draft.siret : profile.siret}
            />
            <Field
              editing={editing}
              icon={MapPin}
              label="Adresse de siège"
              onChange={val => setDraft(curr => ({ ...curr, address: val }))}
              value={editing ? draft.address : profile.address}
            />
            <Field
              editing={editing}
              icon={LayoutGrid}
              label="N° TVA"
              onChange={val => setDraft(curr => ({ ...curr, vat: val }))}
              value={editing ? draft.vat : profile.vat}
            />
            <Field
              editing={editing}
              icon={LayoutGrid}
              label="Tenue exigée par défaut"
              onChange={val => setDraft(curr => ({ ...curr, attire: val }))}
              value={editing ? draft.attire : profile.attire}
            />
            <Field
              editing={editing}
              fullWidth
              icon={LayoutGrid}
              label="Conditions de facturation"
              multiline
              onChange={val => setDraft(curr => ({ ...curr, billing: val }))}
              value={editing ? draft.billing : profile.billing}
            />
          </View>
        </View>
      </>
    );
  }

  function renderPassword() {
    return (
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>Changer le mot de passe</Text>
        <PasswordField
          label="Mot de passe actuel"
          onChange={val => setPassword(curr => ({ ...curr, current: val }))}
          onToggle={() =>
            setVisiblePasswords(curr => ({ ...curr, current: !curr.current }))
          }
          placeholder="••••••••"
          value={password.current}
          visible={visiblePasswords.current}
        />
        <PasswordField
          label="Nouveau mot de passe"
          onChange={val => setPassword(curr => ({ ...curr, next: val }))}
          onToggle={() =>
            setVisiblePasswords(curr => ({ ...curr, next: !curr.next }))
          }
          placeholder="Minimum 6 caractères"
          value={password.next}
          visible={visiblePasswords.next}
        />
        <PasswordField
          label="Confirmer"
          onChange={val => setPassword(curr => ({ ...curr, confirm: val }))}
          onToggle={() =>
            setVisiblePasswords(curr => ({ ...curr, confirm: !curr.confirm }))
          }
          placeholder="••••••••"
          value={password.confirm}
          visible={visiblePasswords.confirm}
        />
        <Pressable
          accessibilityRole="button"
          onPress={updatePassword}
          style={styles.saveButton}
        >
          <Check size={17} color={colors.white} />
          <Text style={styles.saveButtonText}>Mettre à jour le mot de passe</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.section}>
      <View style={styles.identityCard}>
        <View style={styles.identityTop}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.identityName}>{name}</Text>
            <Text style={styles.identityEmail}>{profile.email}</Text>
            <View style={styles.tagRow}>
              <Text style={[styles.tag, styles.tagBlue]}>bookly</Text>
              <Text style={[styles.tag, styles.tagBrown]}>Client</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            {editing ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setEditing(false);
                    setDraft(profile);
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setProfile(draft);
                    setEditing(false);
                  }}
                  style={styles.saveButton}
                >
                  <Save size={14} color={colors.white} />
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                style={styles.modifierButton}
              >
                <Edit3 size={14} color={colors.white} />
                <Text style={styles.modifierButtonText}>Modifier</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setActiveTab('information');
          }}
          style={[
            styles.tab,
            activeTab === 'information' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'information'
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Informations
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setActiveTab('password');
          }}
          style={[
            styles.tab,
            activeTab === 'password' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'password'
                ? styles.tabTextActive
                : styles.tabTextInactive,
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
