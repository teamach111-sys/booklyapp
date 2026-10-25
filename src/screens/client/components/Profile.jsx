import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  BriefcaseBusiness,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from 'lucide-react-native';
import { colors } from '../../../styles';

const fields = {
  personal: [
    ['firstName', 'Prénom', 'words'],
    ['lastName', 'Nom', 'words'],
    ['email', 'Email', 'email-address'],
    ['phone', 'Téléphone', 'phone-pad'],
  ],
  company: [
    ['company', 'Raison sociale'],
    ['siret', 'SIRET', 'number-pad'],
    ['address', 'Adresse de siège'],
    ['vat', 'N° TVA'],
  ],
  preferences: [
    [
      'attire',
      'Tenue exigée par défaut',
      undefined,
      'Ex. Chemise blanche, pantalon noir',
    ],
    [
      'billing',
      'Conditions de facturation',
      undefined,
      'Ex. Paiement à 30 jours...',
    ],
  ],
};

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  siret: '',
  address: '',
  vat: '',
  attire: '',
  billing: '',
};

function Card({ title, icon: Icon, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <View style={styles.cardIcon}>
          <Icon size={18} color={colors.orangeDark} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ProfileField({ definition, value, editing, onChange, last }) {
  const [key, label, keyboardType, placeholder] = definition;
  const multiline = key === 'attire' || key === 'billing';

  return (
    <View
      style={[
        styles.fieldRow,
        multiline && styles.multilineRow,
        last && styles.lastRow,
      ]}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={
            key === 'email'
              ? 'none'
              : keyboardType === 'words'
              ? 'words'
              : 'sentences'
          }
          autoCorrect={key !== 'email'}
          keyboardType={keyboardType === 'words' ? 'default' : keyboardType}
          multiline={multiline}
          onChangeText={onChange}
          placeholder={placeholder || 'À renseigner'}
          placeholderTextColor={colors.muted}
          style={[styles.fieldInput, multiline && styles.multilineInput]}
          value={value}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'À renseigner'}</Text>
      )}
    </View>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle }) {
  return (
    <View style={styles.passwordField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordInput}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          onChangeText={onChange}
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          secureTextEntry={!visible}
          style={styles.passwordText}
          value={value}
        />
        <Pressable
          accessibilityLabel={
            visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
          }
          accessibilityRole="button"
          onPress={onToggle}
          style={styles.passwordToggle}
        >
          {visible ? (
            <EyeOff size={18} color={colors.muted} />
          ) : (
            <Eye size={18} color={colors.muted} />
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
    : 'B';

  function updateDraft(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function togglePassword(key) {
    setVisiblePasswords(current => ({ ...current, [key]: !current[key] }));
  }

  function updatePassword() {
    if (!password.current || !password.next || !password.confirm) {
      Alert.alert(
        'Champs requis',
        'Renseignez les trois champs du mot de passe.',
      );
    } else if (password.next.length < 6) {
      Alert.alert(
        'Mot de passe trop court',
        'Le nouveau mot de passe doit contenir au moins 6 caractères.',
      );
    } else if (password.next !== password.confirm) {
      Alert.alert(
        'Confirmation incorrecte',
        'Les deux nouveaux mots de passe ne correspondent pas.',
      );
    } else {
      Alert.alert(
        'Service indisponible',
        'La modification du mot de passe nécessite la connexion au service de compte.',
      );
    }
  }

  function renderGroup(group, title, icon) {
    return (
      <Card key={group} title={title} icon={icon}>
        {fields[group].map((definition, index) => {
          const [key] = definition;
          return (
            <ProfileField
              key={key}
              definition={definition}
              value={editing ? draft[key] : profile[key]}
              editing={editing}
              onChange={value => updateDraft(key, value)}
              last={index === fields[group].length - 1}
            />
          );
        })}
      </Card>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.identityCard}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.identityName}>{name || 'Mon Profil'}</Text>
            <Text style={styles.identityEmail}>
              {profile.email || 'Complétez vos informations'}
            </Text>
            <Text style={styles.accountType}>Client</Text>
          </View>
        </View>
        {activeTab === 'information' ? (
          <View style={styles.actions}>
            {editing ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setDraft(profile);
                    setEditing(false);
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
                  <Check size={16} color={colors.white} />
                  <Text style={styles.buttonText}>Sauvegarder</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Modifier</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>

      <View style={styles.tabs}>
        {[
          ['information', 'Informations', UserRound],
          ['password', 'Mot de passe', LockKeyhole],
        ].map(([key, label, Icon]) => {
          const selected = activeTab === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                setActiveTab(key);
                setEditing(false);
              }}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Icon
                size={16}
                color={selected ? colors.orangeDark : colors.muted}
              />
              <Text
                style={[styles.tabText, selected && styles.tabTextSelected]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'information' ? (
        <>
          {renderGroup('personal', 'Informations personnelles', UserRound)}
          {renderGroup('company', 'Informations de l’entreprise', Building2)}
          {renderGroup('preferences', 'Préférences', BriefcaseBusiness)}
        </>
      ) : (
        <Card title="Changer le mot de passe" icon={LockKeyhole}>
          <Text style={styles.passwordHelp}>
            Choisissez un nouveau mot de passe d’au moins 6 caractères.
          </Text>
          {[
            ['current', 'Mot de passe actuel'],
            ['next', 'Nouveau mot de passe'],
            ['confirm', 'Confirmer'],
          ].map(([key, label]) => (
            <PasswordField
              key={key}
              label={label}
              value={password[key]}
              onChange={value =>
                setPassword(current => ({ ...current, [key]: value }))
              }
              visible={Boolean(visiblePasswords[key])}
              onToggle={() => togglePassword(key)}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={updatePassword}
            style={styles.saveButton}
          >
            <Check size={17} color={colors.white} />
            <Text style={styles.buttonText}>Mettre à jour le mot de passe</Text>
          </Pressable>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  identityCard: {
    padding: 15,
    gap: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.palePink,
  },
  avatarText: { color: colors.orangeDark, fontSize: 18, fontWeight: '700' },
  identityCopy: { flex: 1, gap: 3 },
  identityName: { color: colors.brown, fontSize: 16, fontWeight: '700' },
  identityEmail: { color: colors.muted, fontSize: 11 },
  accountType: { color: colors.orangeDark, fontSize: 10, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  cancelButton: {
    minHeight: 39,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
  },
  cancelButtonText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  saveButton: {
    minHeight: 40,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 11,
    backgroundColor: colors.orange,
  },
  buttonText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  tabs: {
    padding: 4,
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: colors.cream,
  },
  tab: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 9,
  },
  tabSelected: { backgroundColor: colors.white },
  tabText: { color: colors.muted, fontSize: 11, fontWeight: '500' },
  tabTextSelected: { color: colors.orangeDark, fontWeight: '700' },
  card: {
    padding: 15,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.palePink,
  },
  cardTitle: { flex: 1, color: colors.brown, fontSize: 14, fontWeight: '700' },
  fieldRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  lastRow: { borderBottomWidth: 0 },
  multilineRow: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingVertical: 8,
    gap: 5,
  },
  fieldLabel: { flex: 1, color: colors.muted, fontSize: 11 },
  fieldValue: {
    flex: 1,
    color: colors.brown,
    fontSize: 11,
    textAlign: 'right',
  },
  fieldInput: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.cream,
    color: colors.brown,
    fontSize: 11,
    textAlign: 'right',
  },
  multilineInput: {
    width: '100%',
    minHeight: 64,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  passwordHelp: { color: colors.muted, fontSize: 11, lineHeight: 17 },
  passwordField: { gap: 7 },
  passwordInput: {
    minHeight: 44,
    paddingLeft: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.cream,
  },
  passwordText: {
    flex: 1,
    minHeight: 42,
    paddingVertical: 8,
    color: colors.brown,
    fontSize: 12,
  },
  passwordToggle: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
