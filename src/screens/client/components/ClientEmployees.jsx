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
  Ban,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Plus,
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

const defaultEmployees = [
  {
    id: 'emp-1',
    firstName: 'azeaeaze',
    lastName: 'zeazeaze',
    fullName: 'azeaeaze zeazeaze',
    email: 'zeazea@gmail.com',
    phone: '',
    initials: 'AZ',
    status: 'ACTIF',
  },
];

const MAX_EMPLOYEES = 3;

export default function ClientEmployees() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];

  const [employees, setEmployees] = useState(defaultEmployees);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
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
    setModalMode(null);
  }

  function openCreateModal() {
    if (employees.length >= MAX_EMPLOYEES) {
      Alert.alert(
        'Limite atteinte',
        `Vous ne pouvez pas ajouter plus de ${MAX_EMPLOYEES} employés pour ce site.`,
      );
      return;
    }
    resetForm();
    setModalMode('create');
  }

  function openEditModal(emp) {
    setEditingId(emp.id);
    setFirstName(emp.firstName || '');
    setLastName(emp.lastName || '');
    setEmail(emp.email || '');
    setPhone(emp.phone || '');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setModalMode('edit');
  }

  function closeModal() {
    resetForm();
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

    if (modalMode === 'create') {
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
      const newEmployee = {
        id: Date.now().toString(),
        firstName: trimmedFirst,
        lastName: trimmedLast,
        fullName: `${trimmedFirst} ${trimmedLast}`,
        email: trimmedEmail,
        phone: phone.trim(),
        initials,
        status: 'ACTIF',
      };

      setEmployees(current => [newEmployee, ...current]);
      closeModal();
    } else if (modalMode === 'edit') {
      const initials = (trimmedFirst[0] + trimmedLast[0]).toUpperCase();
      setEmployees(current =>
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

  function handleBan(id, name) {
    Alert.alert(
      'Bannir l’employé',
      `Êtes-vous sûr de vouloir bannir ${name} ? Cet employé n’aura plus accès à ce site.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Bannir',
          style: 'destructive',
          onPress: () => {
            setEmployees(current => current.filter(item => item.id !== id));
          },
        },
      ],
    );
  }

  const count = employees.length;

  return (
    <View style={styles.container}>
      {/* ── Action Button (Full Button matching original design) ── */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel="Ajouter un employé"
          accessibilityRole="button"
          disabled={count >= MAX_EMPLOYEES}
          onPress={openCreateModal}
          style={[
            styles.addButton,
            count >= MAX_EMPLOYEES && styles.addButtonDisabled,
          ]}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Ajouter un employé</Text>
        </Pressable>
      </View>

      {/* ── Segmented Capacity Bar (1/3 slots) ── */}
      <View style={styles.capacityBarRow}>
        <View
          style={[
            styles.capacitySegment,
            count >= 1 ? styles.segmentFilled : styles.segmentEmpty,
          ]}
        />
        <View
          style={[
            styles.capacitySegment,
            count >= 2 ? styles.segmentFilled : styles.segmentEmpty,
          ]}
        />
        <View
          style={[
            styles.capacitySegment,
            count >= 3 ? styles.segmentFilled : styles.segmentEmpty,
          ]}
        />
        <Text style={styles.capacityText}>{`${count}/${MAX_EMPLOYEES}`}</Text>
      </View>

      {/* ── Content: Employee List or Empty State ── */}
      {count === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <UserRound size={22} color="#CCCCCC" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Aucun employé pour ce site</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez jusqu’à 3 employés pour gérer ce site avec vous.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {employees.map(item => (
            <View key={item.id} style={styles.employeeCard}>
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
                  accessibilityLabel="Bannir"
                  accessibilityRole="button"
                  onPress={() => handleBan(item.id, item.fullName)}
                  style={styles.actionBtn}
                >
                  <Ban size={13} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Bottom Sheet Modal (Slide-Up matching Messages.jsx) ── */}
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
              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalTitle}>
                  {modalMode === 'create'
                    ? 'Nouvel employé'
                    : 'Modifier l’employé'}
                </Text>
                {modalMode === 'create' ? (
                  <Text style={styles.modalSubtitle}>
                    Rattaché au site Dashboard Client 02
                  </Text>
                ) : null}
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
                  Téléphone{' '}
                  <Text style={styles.fieldLabelOptional}>(optionnel)</Text>
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

              {/* Mot de passe (create mode only) */}
              {modalMode === 'create' ? (
                <>
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.fieldLabel}>Mot de passe</Text>
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

                  <Text style={styles.infoNote}>
                    Le compte sera activé immédiatement, sans validation admin.
                    L’employé pourra se connecter et gérer ce site dès la
                    création.
                  </Text>
                </>
              ) : null}

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
                    <Check size={13} color={colors.white} strokeWidth={2.5} />
                  ) : null}
                  <Text style={styles.submitBtnText}>
                    {modalMode === 'create'
                      ? 'Créer l’employé'
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
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
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
