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
  Check,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  UserRound,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const defaultCoOwners = [
  {
    id: 'demo-coprop-1',
    firstName: 'Client',
    lastName: '02',
    fullName: 'Client 02',
    email: 'client02@example.test',
    phone: '06 11 11 00 02',
    initials: 'CO',
    status: 'ACTIF',
  },
];

export default function ClientCoOwners() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];

  const [coOwners, setCoOwners] = useState(defaultCoOwners);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function resetForm() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setEditingId(null);
  }

  function openCreateModal() {
    resetForm();
    setModalVisible(true);
  }

  function openEditModal(coOwner) {
    setEditingId(coOwner.id);
    setFirstName(coOwner.firstName || '');
    setLastName(coOwner.lastName || '');
    setEmail(coOwner.email || '');
    setPhone(coOwner.phone || '');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setModalVisible(true);
  }

  function closeModal() {
    resetForm();
    setModalVisible(false);
  }

  function handleSubmit() {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast) {
      Alert.alert('Champs requis', 'Veuillez renseigner le prénom et le nom.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Email invalide', 'Veuillez saisir une adresse email valide.');
      return;
    }

    if (!editingId) {
      if (!password || password.length < 6) {
        Alert.alert(
          'Mot de passe requis',
          'Le mot de passe doit comporter au moins 6 caractères.',
        );
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(
          'Erreur de confirmation',
          'Les mots de passe ne correspondent pas.',
        );
        return;
      }

      const initials = (trimmedFirst[0] + trimmedLast[0]).toUpperCase();
      const newCoOwner = {
        id: Date.now().toString(),
        firstName: trimmedFirst,
        lastName: trimmedLast,
        fullName: `${trimmedFirst} ${trimmedLast}`,
        email: trimmedEmail,
        phone: phone.trim(),
        initials,
        status: 'ACTIF',
      };

      setCoOwners(current => [newCoOwner, ...current]);
      closeModal();
    } else {
      if (password) {
        if (password.length < 6) {
          Alert.alert(
            'Mot de passe',
            'Le mot de passe doit comporter au moins 6 caractères.',
          );
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert(
            'Erreur de confirmation',
            'Les mots de passe ne correspondent pas.',
          );
          return;
        }
      }

      const initials = (trimmedFirst[0] + trimmedLast[0]).toUpperCase();
      setCoOwners(current =>
        current.map(item =>
          item.id === editingId
            ? {
                ...item,
                firstName: trimmedFirst,
                lastName: trimmedLast,
                fullName: `${trimmedFirst} ${trimmedLast}`,
                email: trimmedEmail,
                phone: phone.trim(),
                initials,
              }
            : item,
        ),
      );
      closeModal();
    }
  }

  function handleDelete(id, name) {
    Alert.alert(
      'Supprimer le co-propriétaire',
      `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setCoOwners(current => current.filter(item => item.id !== id));
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Action Button (Full Button matching original design) ── */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel="Ajouter un co-propriétaire"
          accessibilityRole="button"
          onPress={openCreateModal}
          style={styles.addButton}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un co-propriétaire</Text>
        </Pressable>
      </View>

      {/* ── Content: Co-Owners List or Empty State ── */}
      {coOwners.length === 0 ? (
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
        <View style={styles.listContainer}>
          {coOwners.map(item => (
            <View key={item.id} style={styles.coOwnerCard}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text numberOfLines={1} style={styles.nameText}>
                    {item.fullName}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                </View>
                <Text numberOfLines={1} style={styles.emailText}>
                  {item.email}
                </Text>
                {item.phone ? (
                  <Text numberOfLines={1} style={styles.phoneText}>
                    {item.phone}
                  </Text>
                ) : null}
              </View>
              <View style={styles.actionsRow}>
                <Pressable
                  accessibilityLabel="Modifier"
                  accessibilityRole="button"
                  onPress={() => openEditModal(item)}
                  style={styles.actionBtn}
                >
                  <Edit3 size={13} color={colors.orange} />
                </Pressable>
                <Pressable
                  accessibilityLabel="Supprimer"
                  accessibilityRole="button"
                  onPress={() => handleDelete(item.id, item.fullName)}
                  style={styles.actionBtn}
                >
                  <Trash2 size={13} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Modal: Slide-Up Bottom Sheet (matching Messages.jsx) ── */}
      <Modal
        animationType="slide"
        onRequestClose={closeModal}
        transparent
        visible={modalVisible}
      >
        <View style={styles.modalOverlay}>
          <Pressable onPress={closeModal} style={styles.modalScrim} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalTitle}>
                  {editingId
                    ? 'Modifier le co-propriétaire'
                    : 'Nouveau co-propriétaire'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingId
                    ? 'Modifier les informations d’accès'
                    : 'Accès complet à l’entreprise, identique au vôtre'}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Fermer la modal"
                accessibilityRole="button"
                onPress={closeModal}
                style={styles.modalClose}
              >
                <X size={20} color="#888" />
              </Pressable>
            </View>

            {/* Modal Form Scrollable */}
            <ScrollView
              contentContainerStyle={styles.modalFormContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Row 1: Prénom + Nom */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Prénom</Text>
                  <TextInput
                    accessibilityLabel="Prénom"
                    autoCapitalize="words"
                    onChangeText={setFirstName}
                    placeholder="Prénom"
                    placeholderTextColor="#BBBBBB"
                    style={styles.textInput}
                    value={firstName}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Nom</Text>
                  <TextInput
                    accessibilityLabel="Nom"
                    autoCapitalize="words"
                    onChangeText={setLastName}
                    placeholder="Nom"
                    placeholderTextColor="#BBBBBB"
                    style={styles.textInput}
                    value={lastName}
                  />
                </View>
              </View>

              {/* Field 2: Email */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="nom@exemple.com"
                  placeholderTextColor="#BBBBBB"
                  style={styles.textInput}
                  value={email}
                />
              </View>

              {/* Field 3: Téléphone (optionnel) */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Téléphone <Text style={styles.fieldLabelOptional}>(optionnel)</Text>
                </Text>
                <TextInput
                  accessibilityLabel="Téléphone (optionnel)"
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                  placeholder="06 12 34 56 78"
                  placeholderTextColor="#BBBBBB"
                  style={styles.textInput}
                  value={phone}
                />
              </View>

              {/* Row 4: Mot de passe + Confirmer */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>
                    {editingId ? 'Mot de passe (optionnel)' : 'Mot de passe'}
                  </Text>
                  <View style={styles.passwordInputWrap}>
                    <TextInput
                      accessibilityLabel="Mot de passe"
                      autoCapitalize="none"
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#BBBBBB"
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                      value={password}
                    />
                    <Pressable
                      accessibilityLabel={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                      accessibilityRole="button"
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.passwordToggleBtn}
                    >
                      {showPassword ? (
                        <EyeOff size={15} color="#BBBBBB" />
                      ) : (
                        <Eye size={15} color="#BBBBBB" />
                      )}
                    </Pressable>
                  </View>
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Confirmer</Text>
                  <TextInput
                    accessibilityLabel="Confirmer le mot de passe"
                    autoCapitalize="none"
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#BBBBBB"
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                    value={confirmPassword}
                  />
                </View>
              </View>

              {/* Note */}
              <Text style={styles.infoNote}>
                Le compte sera activé immédiatement. Le co-propriétaire aura le même
                accès que vous sur toute l’entreprise (tous les sites, employés,
                prestations, factures...).
              </Text>

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
                  <Check size={13} color={colors.white} strokeWidth={2.5} />
                  <Text style={styles.submitBtnText}>
                    {editingId
                      ? 'Enregistrer'
                      : 'Créer le co-propriétaire'}
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
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FDF3EE',
    alignItems: 'center',
    justifyContent: 'center',
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
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
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

  /* ── Bottom Sheet Modal (matching Messages.jsx) ── */
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
  modalTitleBlock: {
    flex: 1,
    paddingRight: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 2,
  },
  modalClose: {
    padding: 4,
  },
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
