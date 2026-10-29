/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Inscription Extra (Avec Quiz)
 * **Associated Route/Context**: `/inscription/extra`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`RegisterExtra.jsx:231`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/RegisterExtra.jsx#L231) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `BASE_URL + '/qualifications/public` | `None` | Public (No auth) | Confirmed |
 * | [`RegisterExtra.jsx:307`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/RegisterExtra.jsx#L307) | User Action Handler (`handleNextFromStep0`) | `handleNextFromStep0` | `POST` | `BASE_URL + '/check-email` | `None` | Public (No auth) | Confirmed |
 * | [`RegisterExtra.jsx:373`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/RegisterExtra.jsx#L373) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `BASE_URL + '/extra/register` | `formData` | Public (No auth) | Confirmed |
 * 
 * =====================================================================
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
  pick,
  types,
} from '@react-native-documents/picker';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  CircleX,
  Clock4,
  CloudUpload,
  Info,
  ListChecks,
  LogIn,
  Mail,
  Paperclip,
  Star,
  User,
} from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import DatePicker from '../../components/DatePicker';
import { clickableStyles, colors, formStyles } from '../../styles';
import AuthLayout from './AuthLayout';
import authService from '../../api/authService';

const styles = formStyles.extraRegistration;
const loginForm = formStyles.login;
const pickerStyles = formStyles.optionPicker;

// Total wizard steps without the optional skills questionnaire (step 6).
const baseStepCount = 6;

const personalFields = {
  firstname: {
    name: 'firstname',
    label: 'Prénom',
    placeholder: 'Jean',
    autoComplete: 'given-name',
  },
  name: {
    name: 'name',
    label: 'Nom',
    placeholder: 'Dupont',
    autoComplete: 'family-name',
  },
  email: {
    name: 'email',
    label: 'Email',
    placeholder: 'jean.dupont@email.com',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
  },
  password: {
    name: 'password',
    label: 'Mot de passe',
    placeholder: '••••••••',
    secureTextEntry: true,
    autoCapitalize: 'none',
    helper: 'Minimum 6 caractères',
  },
  birth_date: {
    name: 'birth_date',
    label: 'Date de naissance',
    placeholder: 'JJ/MM/AAAA',
    type: 'date',
  },
  phone: {
    name: 'phone',
    label: 'Téléphone',
    placeholder: '+33 6 00 00 00 00',
    keyboardType: 'phone-pad',
  },
  address: {
    name: 'address',
    label: 'Adresse',
    placeholder: '10 Rue de la Paix, Paris',
  },
  postal_code: {
    name: 'postal_code',
    label: 'Code postal',
    placeholder: '75001',
    keyboardType: 'number-pad',
  },
};

const eligibilityOptions = [
  {
    key: 'active',
    title: 'Oui, je suis auto-entrepreneur',
    icon: CircleCheck,
    iconColor: colors.orange,
  },
  {
    key: 'pending',
    title: 'En cours de création',
    icon: Clock4,
    iconColor: '#F57F17',
  },
  {
    key: 'none',
    title: 'Non, pas encore',
    icon: CircleX,
    iconColor: '#DC2626',
  },
];

const cities = [
  'Paris',
  'Boulogne-Billancourt',
  'Saint-Denis',
  'Argenteuil',
  'Montreuil',
  'Créteil',
  'Nanterre',
  'Versailles',
  'Vitry-sur-Seine',
  'Colombes',
  'Aulnay-sous-Bois',
  'Asnières-sur-Seine',
  'Courbevoie',
  'Rueil-Malmaison',
  'Aubervilliers',
  'Champigny-sur-Marne',
  'Saint-Maur-des-Fossés',
  'Drancy',
  'Issy-les-Moulineaux',
  'Noisy-le-Grand',
  'Levallois-Perret',
  'Antony',
  'Neuilly-sur-Seine',
  'Sarcelles',
  'Vénissieux',
  'Ivry-sur-Seine',
  'Clichy',
  'Cergy',
  'Villejuif',
  'Pantin',
  'Le Blanc-Mesnil',
  'Maisons-Alfort',
  'Fontenay-sous-Bois',
  'Meaux',
  'Melun',
  'Chelles',
  'Évry-Courcouronnes',
  'Corbeil-Essonnes',
  'Massy',
  'Mantes-la-Jolie',
  'Sartrouville',
  'Sainte-Geneviève-des-Bois',
  'Fontainebleau',
  'Rambouillet',
  'Pontoise',
  'Franconville',
  'Goussainville',
];

// Langues parlées — `code` must exist in the `langues` table (FK constraint
// on extras_langues.code_langue), `label` is what we display to the user.
const languages = [
  { code: 'FR', label: 'Français' },
  { code: 'EN', label: 'Anglais' },
  { code: 'ES', label: 'Espagnol' },
  { code: 'AR', label: 'Arabe' },
  { code: 'DE', label: 'Allemand' },
  { code: 'IT', label: 'Italien' },
  { code: 'PT', label: 'Portugais' },
  { code: 'ZH', label: 'Chinois' },
];

// Fallback catalog used when the API is unreachable. Mirrors the shape
// returned by GET /qualifications/public: [{ code, libelle, description, quiz }].
// The quiz is [{ question, options[] }] — options are NOT shuffled here (the
// web app shuffles at render time; we do the same via useMemo below).
const FALLBACK_QUALIFICATIONS = [
  { code: 'BARISTA', libelle: 'Barista', quiz: [] },
  { code: 'CHEF_DE_CUISINE', libelle: 'Chef de cuisine', quiz: [] },
  { code: 'CHEF_DE_PARTIE', libelle: 'Chef de partie', quiz: [] },
  { code: 'CHEF_DE_RANG', libelle: 'Chef de rang', quiz: [] },
  { code: 'COMMIS', libelle: 'Commis', quiz: [] },
  { code: 'MK_POLYVALENT_DTD', libelle: 'Commis de salle', quiz: [] },
  { code: 'EQUIPIER_MK', libelle: 'Équipier MK', quiz: [] },
  { code: 'MAITRE_HOTEL_CKDIN', libelle: 'Maître d’hôtel CKDIN', quiz: [] },
  { code: 'MAITRE_HOTEL_REFERENT', libelle: 'Maître d’hôtel référent', quiz: [] },
  { code: 'MAITRE_HOTEL_RESPONSABLE', libelle: 'Maître d’hôtel responsable', quiz: [] },
  { code: 'MAITRE_HOTEL', libelle: 'Maitre d’hôtel', quiz: [] },
  { code: 'MIXOLOGUE', libelle: 'Mixologue', quiz: [] },
  { code: 'PLONGEUR', libelle: 'Plongeur', quiz: [] },
];

const ANSWER_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const skills = [
  {
    code: 'CAFES',
    label: 'Cafés classiques',
    description:
      'Savoir utiliser différents types de machines à café (traditionnelles et automatiques), préparer les cafés classiques (espresso, allongé, cappuccino, etc.).',
  },
  {
    code: 'LATTE_ART',
    label: 'Latte Art',
    description:
      'Être capable de réaliser une mousse de lait de qualité et de créer des motifs simples ou avancés (cœur, rosette, tulipe…).',
  },
  {
    code: 'SERVICE_BOISSON',
    label: 'Service boisson',
    description:
      'Savoir utiliser un limonadier, ouvrir et servir vin, champagne et boissons, utiliser un Liteau, respecter les règles de service et de présentation.',
  },
  {
    code: 'COCKTAILS_CLASSIQUES',
    label: 'Cocktails classiques',
    description:
      'Maîtriser les recettes des cocktails incontournables (Mojito, Spritz, Moscow Mule, Negroni, etc.) et leurs dosages.',
  },
  {
    code: 'COCKTAILS_SUR_MESURE',
    label: 'Cocktails sur-mesure',
    description:
      'Être capable de créer des cocktails personnalisés, adapter les recettes aux demandes des clients et travailler avec des produits variés.',
  },
  {
    code: 'VINS_ALCOOLS',
    label: 'Type de vin & alcool',
    description:
      'Connaître les principaux vins, champagnes, spiritueux et alcools, savoir les identifier, les servir correctement et répondre aux questions les plus courantes des clients.',
  },
  {
    code: 'MANAGEMENT',
    label: 'Management',
    description:
      'Savoir encadrer une équipe, répartir les postes, gérer les priorités, communiquer avec le client et assurer le bon déroulement de la prestation.',
  },
  {
    code: 'PASSAGE_PLATEAU',
    label: 'Passage plateau',
    description:
      'Être à l’aise pour porter un plateau chargé en toute sécurité et effectuer un service fluide auprès des invités.',
  },
  {
    code: 'RUN_DEBARRASSAGE',
    label: 'Run / débarrassage',
    description:
      'Être rapide, organisé et autonome pour maintenir la salle propre, débarrasser les tables et accompagner le bon déroulement du service.',
  },
];

const documentGroups = [
  {
    files: [{ key: 'photo_profil', label: 'Photo de profil' }],
  },
  {
    title: "Pièce d’identité",
    files: [
      { key: 'cni_recto', label: 'CNI Recto' },
      { key: 'cni_verso', label: 'CNI Verso' },
    ],
  },
  {
    title: 'Titre de séjour',
    files: [
      { key: 'titre_sejour_recto', label: 'Recto' },
      { key: 'titre_sejour_verso', label: 'Verso' },
    ],
  },
  {
    title: 'Documents professionnels',
    files: [
      { key: 'attestation_urssaf', label: 'Attestation de vigilance URSSAF' },
      { key: 'kbis', label: 'KBIS ou attestation d’affiliation' },
      { key: 'cv', label: 'CV' },
      { key: 'diplomes', label: 'Diplômes divers' },
    ],
  },
  {
    title: 'Permis de conduire',
    files: [
      { key: 'permis_recto', label: 'Recto' },
      { key: 'permis_verso', label: 'Verso' },
    ],
  },
];

const consents = [
  ['accept_cga', 'J’accepte les Conditions Générales d’Adhésion (CGA)'],
  ['accept_cgv', 'J’accepte les Conditions Générales de Vente (CGV)'],
  ['accept_mentions', 'J’accepte les Mentions légales'],
  ['accept_cookies', 'J’accepte la Politique de cookies'],
];

const stepTitles = [
  'Informations personnelles',
  'Documents',
  'Attestation URSSAF',
  'Vos qualifications',
  'Vos compétences',
  'Questionnaire de compétences',
  'Validation du profil',
];

const successSteps = [
  'Validation de vos documents par l’équipe',
  'Activation de votre profil (sous 48h)',
  'Accès aux propositions de missions',
];

function FieldLabel({ label, required }) {
  return (
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

function FormField({ field, value, onChange, style }) {
  return (
    <View style={[styles.field, style]}>
      <FieldLabel label={field.label} required />
      {field.type === 'date' ? (
        <DatePicker
          accessibilityLabel={field.label}
          colors={colors}
          maximumDate={new Date()}
          onChange={onChange}
          outputFormat="iso"
          placeholder={field.placeholder}
          style={styles.input}
          value={value}
        />
      ) : (
        <TextInput
          accessibilityLabel={field.label}
          autoCapitalize={field.autoCapitalize || 'sentences'}
          autoComplete={field.autoComplete}
          autoCorrect={false}
          keyboardType={field.keyboardType || 'default'}
          placeholder={field.placeholder}
          placeholderTextColor="#AAAAAA"
          secureTextEntry={field.secureTextEntry}
          style={styles.input}
          value={value}
          onChangeText={onChange}
        />
      )}
      {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
    </View>
  );
}

function OptionCard({ title, icon, iconColor, selected, onPress }) {
  const Icon = icon;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.optionCard, selected && styles.selectedOptionCard]}
    >
      <Icon size={20} color={iconColor} />
      <Text style={[styles.optionTitle, selected && styles.selectedOptionTitle]}>
        {title}
      </Text>
      {selected ? (
        <Check size={14} color={colors.orange} strokeWidth={3} />
      ) : null}
    </Pressable>
  );
}

function ChoiceRow({ label, value, onChange, style }) {
  return (
    <View style={[styles.field, style]}>
      <FieldLabel label={label} required />
      <View style={styles.choiceList}>
        {[
          ['1', 'Oui'],
          ['0', 'Non'],
        ].map(([choice, title]) => {
          const selected = value === choice;
          return (
            <Pressable
              key={choice}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(choice)}
              style={[styles.choice, selected && styles.selectedChoice]}
            >
              <View
                style={[
                  styles.choiceRadio,
                  selected && styles.choiceRadioChecked,
                ]}
              >
                {selected ? <View style={styles.choiceRadioDot} /> : null}
              </View>
              <Text style={styles.choiceText}>{title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
  style,
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.field, style]}>
      <FieldLabel label={label} required={required} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(current => !current)}
        style={styles.selectButton}
      >
        <Text
          numberOfLines={1}
          style={[styles.selectText, !value && styles.selectPlaceholder]}
        >
          {value || placeholder || '— Sélectionner —'}
        </Text>
        <ChevronDown
          size={16}
          color={colors.orangeDark}
          style={open ? styles.selectArrowOpen : undefined}
        />
      </Pressable>
      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <Pressable
          accessibilityLabel="Fermer la liste"
          accessibilityRole="button"
          onPress={() => setOpen(false)}
          style={pickerStyles.backdrop}
        >
          <Pressable
            onPress={event => event.stopPropagation()}
            style={pickerStyles.sheet}
          >
            <Text style={pickerStyles.title}>{label}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map(option => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    style={pickerStyles.option}
                  >
                    <Text
                      style={[
                        pickerStyles.optionText,
                        selected && pickerStyles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {selected ? (
                      <Check size={16} color={colors.orange} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function ConsentRow({ label, checked, onPress }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={styles.consentRow}
    >
      <View style={[styles.consentBox, checked && styles.consentBoxChecked]}>
        {checked ? (
          <Check size={12} color={colors.white} strokeWidth={3} />
        ) : null}
      </View>
      <Text style={styles.consentText}>{label}</Text>
    </Pressable>
  );
}

export default function ExtraRegisterScreen({ navigation }) {
  const [step, setStep] = useState(-1);
  const [eligibility, setEligibility] = useState('');
  const [values, setValues] = useState({
    firstname: '',
    name: '',
    email: '',
    password: '',
    birth_date: '',
    phone: '',
    address: '',
    postal_code: '',
    ville: '',
    tshirt_size: 'M',
    shoe_size: '',
    has_permis_b: '',
    accepte_camion: '',
    vehicule_perso: '',
    languages: [],
  });
  const [documents, setDocuments] = useState({});
  const [pickingDocument, setPickingDocument] = useState(null);
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [ratings, setRatings] = useState({});
  const [accepted, setAccepted] = useState({});
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [catalogQualifications, setCatalogQualifications] = useState(null);

  useEffect(() => {
    authService
      .getPublicQualifications()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalize: API returns { code, libelle, description, quiz }
          setCatalogQualifications(
            data.map(q => ({
              code: q.code,
              libelle: q.libelle || q.label || q.name || q.code,
              description: q.description || '',
              quiz: Array.isArray(q.quiz) ? q.quiz : [],
            })),
          );
        }
      })
      .catch(() => {
        // Fall back to hardcoded catalog (FALLBACK_QUALIFICATIONS)
      });
  }, []);

  // The qualification list the user picks from: API catalog if loaded,
  // fallback otherwise. Same shape [{ code, libelle, quiz }] either way.
  const qualifications = catalogQualifications || FALLBACK_QUALIFICATIONS;

  const updateValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }));
    if (name === 'email') setEmailError('');
  };
  const toggleLanguage = code => {
    setValues(current => ({
      ...current,
      languages: current.languages.includes(code)
        ? current.languages.filter(item => item !== code)
        : [...current.languages, code],
    }));
  };
  const toggleQualification = code => {
    setSelectedQualifications(current =>
      current.includes(code)
        ? current.filter(item => item !== code)
        : [...current, code],
    );
    // Clear quiz answers for a qualification that was just deselected,
    // so stale answers don't linger if the user re-selects it later.
    setQuestionnaireAnswers(current => {
      if (!current[code]) return current;
      const next = { ...current };
      delete next[code];
      return next;
    });
  };
  const toggleConsent = name => {
    setAccepted(current => ({ ...current, [name]: !current[name] }));
  };

  // Quiz answers: { QUAL_CODE: { questionIndex: "A"|"B"|"C"|"D" } }
  // — letters, not indices, matching what the backend compares against
  // correct_option in qualification_quiz_questions.
  const setQuizAnswer = (qualCode, questionIndex, letter) => {
    setQuestionnaireAnswers(current => ({
      ...current,
      [qualCode]: {
        ...(current[qualCode] || {}),
        [questionIndex]: letter,
      },
    }));
  };

  // Which selected quals actually have a quiz in the catalog?
  const qualsWithQuiz = selectedQualifications.filter(code => {
    const q = qualifications.find(item => item.code === code);
    return q && Array.isArray(q.quiz) && q.quiz.length > 0;
  });
  const hasQuestionnaire = qualsWithQuiz.length > 0;

  // Stable per-question answer shuffle order (like the web app's quizOrder).
  // Computed once when the catalog loads, never re-shuffled during the session.
  const quizOrder = useMemo(() => {
    const order = {};
    qualifications.forEach(q => {
      order[q.code] = (q.quiz || []).map(question => {
        const n = question.options?.length || 0;
        return Array.from({ length: n }, (_, i) => i);
      });
    });
    return order;
  }, [qualifications]);

  const quizComplete = qualsWithQuiz.every(code => {
    const q = qualifications.find(item => item.code === code);
    return (q?.quiz || []).every((_, questionIndex) =>
      Boolean(questionnaireAnswers[code]?.[questionIndex]),
    );
  });

  const validationStep = hasQuestionnaire ? baseStepCount : baseStepCount - 1;
  const totalSteps = hasQuestionnaire ? baseStepCount + 1 : baseStepCount;

  const pickDocument = async file => {
    setPickingDocument(file.key);
    try {
      const [pickedFile] = await pick({
        type:
          file.key === 'photo_profil'
            ? [types.images]
            : [types.pdf, types.images],
      });
      setDocuments(current => ({ ...current, [file.key]: pickedFile }));
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      Alert.alert(
        'Impossible d’ouvrir les fichiers',
        isErrorWithCode(error)
          ? error.message
          : 'Une erreur inattendue est survenue. Réessayez.',
      );
    } finally {
      setPickingDocument(null);
    }
  };

  const goNext = async () => {
    if (step === -1 && eligibility === 'none') {
      setStep(-2);
      return;
    }

    // Step 0: Personal details -> check email availability before advancing
    if (step === 0) {
      const emailVal = values.email.trim();
      if (!emailVal) {
        Alert.alert('Email requis', 'Veuillez renseigner votre adresse email.');
        return;
      }
      if (!values.firstname.trim() || !values.name.trim() || !values.password) {
        Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
        return;
      }

      setCheckingEmail(true);
      try {
        const check = await authService.checkEmail(emailVal);
        if (check?.exists) {
          setEmailError('Cette adresse email est déjà utilisée.');
          Alert.alert(
            'Email déjà utilisé',
            'Cette adresse email est déjà enregistrée. Veuillez vous connecter ou utiliser une autre adresse.',
          );
          setCheckingEmail(false);
          return;
        }
      } catch {
        // Backend unavailable or error: let through, backend validates on final submit
      } finally {
        setCheckingEmail(false);
      }
    }

    setStep(current => Math.min(current + 1, totalSteps));
  };

  const goBack = () => {
    setStep(current => (current === -2 ? -1 : Math.max(-1, current - 1)));
  };

  const finish = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Personal fields
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'languages') {
          (v || []).forEach(lang => formData.append('languages[]', lang));
        } else if (k === 'shoe_size') {
          if (v) formData.append('shoe_size', v);
        } else if (v !== undefined && v !== null) {
          formData.append(k, String(v));
        }
      });

      // AE status — eligibility keys are 'active' | 'pending' | 'none'.
      // Backend validation only accepts 'active' or 'en_cours'. The 'none'
      // case is blocked by the wizard (step -2) and never reaches finish().
      formData.append(
        'statut_ae',
        eligibility === 'active' ? 'active' : eligibility === 'pending' ? 'en_cours' : 'non',
      );

      // Qualifications
      selectedQualifications.forEach(q => formData.append('qualifications[]', q));

      // Skills / Ratings
      Object.entries(ratings).forEach(([code, note]) => {
        if (note > 0) {
          formData.append('skills[]', JSON.stringify({ code, note }));
        }
      });

      // Questionnaire / Quiz
      formData.append('quiz_answers', JSON.stringify(questionnaireAnswers));

      // Consents
      formData.append('accept_cga', accepted.accept_cga ? '1' : '0');
      formData.append('accept_cgv', accepted.accept_cgv ? '1' : '0');
      formData.append('accept_mentions', accepted.accept_mentions ? '1' : '0');
      formData.append('accept_cookies', accepted.accept_cookies ? '1' : '0');

      // Documents attached
      Object.entries(documents).forEach(([key, file]) => {
        if (file && file.uri) {
          formData.append(key, {
            uri: file.uri,
            name: file.name || `${key}.pdf`,
            type: file.type || 'application/octet-stream',
          });
        }
      });

      await authService.registerExtra(formData);
      setStep(totalSteps); // Success screen
    } catch (err) {
      const status = err?.status;
      if (status === 422) {
        const errors = err?.data?.errors;
        const msgs = errors
          ? Object.values(errors).flat()
          : [err?.message || 'Erreur de validation'];
        Alert.alert('Erreur', msgs[0]);
        if (errors?.email) {
          setEmailError(errors.email[0]);
          setStep(0);
        }
      } else if (status === 429) {
        Alert.alert('Patientez', 'Trop de tentatives. Merci de patienter quelques instants.');
      } else {
        Alert.alert('Erreur', err?.message || 'Impossible d’enregistrer votre profil.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepHeader = (title, subtitle) => (
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderEligibility = () => (
    <>
      {renderStepHeader(
        'Avant de commencer',
        'Une question rapide pour vérifier votre éligibilité',
      )}
      <Text style={styles.questionLead}>
        Avez-vous un statut auto-entrepreneur ?
      </Text>
      <View style={styles.eligibilityOptions}>
        {eligibilityOptions.map(option => (
          <OptionCard
            key={option.key}
            title={option.title}
            icon={option.icon}
            iconColor={option.iconColor}
            selected={eligibility === option.key}
            onPress={() => setEligibility(option.key)}
          />
        ))}
      </View>
      <PrimaryButton
        icon={<ArrowRight size={15} color={colors.white} />}
        disabled={!eligibility}
        onPress={goNext}
        title="Commencer l’inscription"
        style={styles.eligibilityButton}
      />
    </>
  );

  const renderPersonalDetails = () => (
    <>
      {renderStepHeader(
        stepTitles[0],
        `Étape 1 sur ${totalSteps} — Vos coordonnées`,
      )}
      <View style={styles.fieldRow}>
        <FormField
          field={personalFields.firstname}
          style={styles.fieldHalf}
          value={values.firstname}
          onChange={value => updateValue('firstname', value)}
        />
        <FormField
          field={personalFields.name}
          style={styles.fieldHalf}
          value={values.name}
          onChange={value => updateValue('name', value)}
        />
      </View>
      <FormField
        field={personalFields.email}
        value={values.email}
        onChange={value => updateValue('email', value)}
      />
      <FormField
        field={personalFields.password}
        value={values.password}
        onChange={value => updateValue('password', value)}
      />
      <View style={styles.fieldRow}>
        <FormField
          field={personalFields.birth_date}
          style={styles.fieldHalf}
          value={values.birth_date}
          onChange={value => updateValue('birth_date', value)}
        />
        <FormField
          field={personalFields.phone}
          style={styles.fieldHalf}
          value={values.phone}
          onChange={value => updateValue('phone', value)}
        />
      </View>
      <FormField
        field={personalFields.address}
        value={values.address}
        onChange={value => updateValue('address', value)}
      />
      <View style={styles.fieldRow}>
        <FormField
          field={personalFields.postal_code}
          style={styles.fieldHalf}
          value={values.postal_code}
          onChange={value => updateValue('postal_code', value)}
        />
        <View style={styles.fieldHalf}>
          <SelectField
            label="Ville"
            required
            options={cities}
            value={values.ville}
            onChange={value => updateValue('ville', value)}
            placeholder="— Sélectionner votre ville —"
          />
          <Text style={styles.helper}>
            La ville où vous souhaitez principalement intervenir
          </Text>
        </View>
      </View>
      <View style={[styles.fieldRow, styles.field]}>
        <SelectField
          label="Taille de tee-shirt"
          required
          style={styles.fieldHalf}
          options={['S', 'M', 'L', 'XL', 'XXL']}
          value={values.tshirt_size}
          onChange={value => updateValue('tshirt_size', value)}
        />
        <SelectField
          label="Pointure chaussure"
          style={styles.fieldHalf}
          options={Array.from({ length: 13 }, (_, index) => String(index + 35))}
          value={values.shoe_size}
          onChange={value => updateValue('shoe_size', value)}
        />
      </View>
      <ChoiceRow
        label="Avez-vous le permis B ?"
        value={values.has_permis_b}
        onChange={value => updateValue('has_permis_b', value)}
      />
      <ChoiceRow
        label="Seriez-vous d’accord de conduire un camion ?"
        value={values.accepte_camion}
        onChange={value => updateValue('accepte_camion', value)}
      />
      <ChoiceRow
        label="Disposez-vous de votre propre véhicule ?"
        value={values.vehicule_perso}
        onChange={value => updateValue('vehicule_perso', value)}
      />
      <View style={styles.field}>
        <FieldLabel label="Langues parlées" required />
        <View style={styles.languageOptions}>
          {languages.map(language => {
            const selected = values.languages.includes(language.code);
            return (
              <Pressable
                key={language.code}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleLanguage(language.code)}
                style={[
                  styles.languageButton,
                  selected && styles.selectedLanguageButton,
                ]}
              >
                {selected ? (
                  <Check size={12} color={colors.white} strokeWidth={3} />
                ) : null}
                <Text
                  style={[
                    styles.languageButtonText,
                    selected && styles.selectedLanguageButtonText,
                  ]}
                >
                  {language.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.helper}>Sélectionnez toutes vos langues</Text>
      </View>
    </>
  );

  const renderDocumentSlot = (file, extraStyle) => {
    const selectedFile = documents[file.key];
    const isPicking = pickingDocument === file.key;
    return (
      <View
        key={file.key}
        style={[styles.documentItem, extraStyle]}
      >
        <Text style={styles.documentLabel}>{file.label}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${file.label}: ${
            selectedFile ? selectedFile.name : 'ajouter un fichier'
          }`}
          disabled={isPicking}
          onPress={() => pickDocument(file)}
          style={styles.documentSlot}
        >
          {selectedFile ? (
            <CircleCheck size={18} color={colors.success} />
          ) : (
            <CloudUpload size={18} color="#BBBBBB" />
          )}
          <Text numberOfLines={1} style={styles.documentSlotText}>
            {isPicking
              ? 'Ouverture des fichiers...'
              : selectedFile?.name || 'Cliquez pour ajouter un fichier'}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderDocuments = () => (
    <>
      {renderStepHeader(
        stepTitles[1],
        `Étape 2 sur ${totalSteps} — Vous pouvez compléter plus tard`,
      )}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>⚠️ Information importante</Text>
        <Text style={styles.noticeText}>
          Vous pouvez ajouter vos documents plus tard depuis votre profil. Sans
          documents validés, vous ne pourrez pas recevoir de propositions de
          missions. Un rappel vous sera envoyé 4 jours après votre inscription
          si vos documents ne sont pas soumis.
        </Text>
      </View>
      {documentGroups.map((group, index) => (
        <View key={group.title || `group-${index}`}>
          {group.title ? (
            <Text style={styles.documentSection}>{group.title}</Text>
          ) : null}
          {group.files.length === 2 ? (
            <View style={styles.documentRow}>
              {group.files.map(file =>
                renderDocumentSlot(file, styles.documentItemHalf),
              )}
            </View>
          ) : (
            group.files.map(file => renderDocumentSlot(file))
          )}
        </View>
      ))}
    </>
  );

  const renderUrssafNotice = () => (
    <>
      {renderStepHeader(
        stepTitles[2],
        `Étape 3 sur ${totalSteps} — Information importante`,
      )}
      <View style={styles.urssafCard}>
        <BriefcaseBusiness
          size={48}
          color={colors.orange}
          style={styles.urssafIcon}
        />
        <View style={styles.urssafHeading}>
          <AlertTriangle size={18} color="#F57F17" />
          <Text style={styles.urssafTitle}>
            Mise à jour obligatoire 2× par an
          </Text>
        </View>
        <Text style={styles.urssafBody}>
          Chaque année, les <Text style={styles.urssafStrong}>10 janvier</Text>{' '}
          et <Text style={styles.urssafStrong}>10 juillet</Text>, vous recevrez
          une notification vous demandant d’uploader votre{' '}
          <Text style={styles.urssafStrong}>
            attestation de vigilance URSSAF la plus récente
          </Text>
          .
        </Text>
        <View style={styles.urssafFootnote}>
          <Text style={styles.urssafFootnoteText}>
            Cette démarche est obligatoire pour continuer à recevoir des
            propositions de missions. Sans attestation valide, votre profil
            sera temporairement suspendu.
          </Text>
        </View>
      </View>
    </>
  );

  const renderQualifications = () => (
    <>
      {renderStepHeader(
        stepTitles[3],
        `Étape 4 sur ${totalSteps} — Sélectionnez au moins une qualification`,
      )}
      <View style={styles.infoBanner}>
        <Info size={13} color="#F57F17" />
        <Text style={styles.infoBannerText}>
          Un questionnaire de validation de vos compétences apparaîtra à la fin
          en fonction de vos choix.
        </Text>
      </View>
      <Text style={styles.sectionLabel}>
        Niveau 1 — Obligatoire (plusieurs choix possibles)
      </Text>
      <View style={styles.qualificationGrid}>
        {qualifications.map(qualification => {
          const selected = selectedQualifications.includes(qualification.code);
          return (
            <Pressable
              key={qualification.code}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleQualification(qualification.code)}
              style={[
                styles.qualificationCard,
                selected && styles.selectedQualification,
              ]}
            >
              <Text
                style={[
                  styles.qualificationText,
                  selected && styles.selectedQualificationText,
                ]}
              >
                {qualification.libelle}
              </Text>
              <View
                style={[
                  styles.qualificationBox,
                  selected && styles.qualificationBoxChecked,
                ]}
              >
                {selected ? (
                  <Check size={11} color={colors.white} strokeWidth={3} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const renderSkills = () => (
    <>
      {renderStepHeader(
        stepTitles[4],
        `Étape 5 sur ${totalSteps} — Évaluez vos compétences (optionnel)`,
      )}
      <Text style={styles.description}>
        Notez vos compétences de 1 (débutant) à 5 (expert). Laissez à 0 si non
        applicable.
      </Text>
      {skills.map((skill, index) => (
        <View
          key={skill.code}
          style={[styles.skillRow, index % 2 === 1 && styles.skillRowAlt]}
        >
          <View style={styles.skillCopy}>
            <Text style={styles.skillLabel}>{skill.label}</Text>
            <Text style={styles.skillDescription}>{skill.description}</Text>
          </View>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(rating => {
              const selected = rating <= (ratings[skill.code] || 0);
              return (
                <Pressable
                  key={rating}
                  accessibilityLabel={`${skill.label}, ${rating} sur 5`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() =>
                    setRatings(current => ({
                      ...current,
                      [skill.code]: current[skill.code] === rating ? 0 : rating,
                    }))
                  }
                  style={styles.starButton}
                >
                  <Star
                    size={22}
                    color={selected ? '#F59E0B' : colors.border}
                    fill={selected ? '#F59E0B' : 'transparent'}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </>
  );

  const renderQuestionnaire = () => (
    <>
      {renderStepHeader(
        stepTitles[5],
        `Étape 6 sur ${totalSteps} — Répondez à toutes les questions`,
      )}
      <Text style={styles.description}>
        Vos réponses seront évaluées par notre équipe pour valider vos
        qualifications. Il n’y a pas de temps limite.
      </Text>
      {qualsWithQuiz.map(qualCode => {
        const qual = qualifications.find(q => q.code === qualCode);
        const questions = qual?.quiz || [];
        return (
          <View key={qualCode}>
            <Text style={styles.questionnaireQualification}>
              {qual?.libelle || qualCode}
            </Text>
            {questions.map((item, questionIndex) => {
              const order = quizOrder[qualCode]?.[questionIndex] ||
                Array.from({ length: item.options?.length || 0 }, (_, i) => i);
              const selectedLetter = questionnaireAnswers[qualCode]?.[questionIndex];
              return (
                <View key={questionIndex} style={styles.questionCard}>
                  <Text style={styles.questionText}>
                    Q{questionIndex + 1}. {item.question}
                  </Text>
                  <View style={styles.questionAnswers}>
                    {order.map((origIdx, displayPos) => {
                      const displayLetter = ANSWER_LABELS[displayPos];
                      const origLetter = ANSWER_LABELS[origIdx];
                      const isSelected = selectedLetter === origLetter;
                      return (
                        <Pressable
                          key={displayLetter}
                          accessibilityRole="radio"
                          accessibilityState={{ selected: isSelected }}
                          onPress={() =>
                            setQuizAnswer(qualCode, questionIndex, origLetter)
                          }
                          style={[
                            styles.questionAnswer,
                            isSelected && styles.selectedQuestionAnswer,
                          ]}
                        >
                          <Text
                            style={[
                              styles.questionAnswerLetter,
                              isSelected && styles.selectedQuestionAnswerText,
                            ]}
                          >
                            {displayLetter}.
                          </Text>
                          <Text
                            style={[
                              styles.questionAnswerText,
                              isSelected && styles.selectedQuestionAnswerText,
                            ]}
                          >
                            {item.options[origIdx]}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );

  const renderValidation = () => (
    <>
      {renderStepHeader(
        stepTitles[6],
        `Étape ${validationStep + 1} sur ${totalSteps} — Dernière étape avant soumission`,
      )}
      <View style={styles.summary}>
        <View style={styles.summaryHeading}>
          <ListChecks size={15} color="#1565C0" />
          <Text style={styles.summaryTitle}>Récapitulatif</Text>
        </View>
        <View style={styles.summaryRow}>
          <User size={14} color="#888888" />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryStrong}>
              {`${values.firstname || 'Prénom'} ${values.name || 'Nom'}`}
            </Text>
            {` · ${values.ville || 'Ville non renseignée'}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Mail size={14} color="#888888" />
          <Text style={styles.summaryText}>
            {values.email || 'Email non renseigné'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <BriefcaseBusiness size={14} color="#888888" />
          <Text style={styles.summaryText}>
            {selectedQualifications.length
              ? selectedQualifications
                  .map(
                    code =>
                      qualifications.find(q => q.code === code)?.libelle ||
                      code,
                  )
                  .join(' · ')
              : 'Aucune qualification sélectionnée'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Paperclip size={14} color="#888888" />
          <Text style={styles.summaryText}>
            {`${Object.keys(documents).length} document(s) joint(s)`}
          </Text>
        </View>
      </View>
      {consents.map(([name, label]) => (
        <ConsentRow
          key={name}
          label={label}
          checked={Boolean(accepted[name])}
          onPress={() => toggleConsent(name)}
        />
      ))}
    </>
  );

  const renderSuccess = () => (
    <View style={styles.success}>
      <View style={styles.successBadge}>
        <Check size={36} color={colors.white} strokeWidth={3} />
      </View>
      <Text style={styles.successTitle}>Inscription réussie !</Text>
      <Text style={styles.successWelcome}>
        Bienvenue sur Bookly,{' '}
        <Text style={styles.summaryStrong}>{values.firstname || 'Extra'}</Text>{' '}
        !
      </Text>
      <Text style={styles.successText}>
        Votre profil est en cours de validation par notre équipe.{'\n'}
        Vous recevrez une notification dès que votre compte sera activé.
      </Text>
      <View style={styles.successSteps}>
        <View style={styles.successStepsHeading}>
          <ListChecks size={14} color="#F57F17" />
          <Text style={styles.successStepsTitle}>Prochaines étapes</Text>
        </View>
        {successSteps.map(item => (
          <View key={item} style={styles.successStepRow}>
            <View style={styles.successBullet} />
            <Text style={styles.successStepText}>{item}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        icon={<LogIn size={14} color={colors.white} />}
        onPress={() => navigation?.navigate('Login')}
        title="Se connecter"
        style={styles.successButton}
      />
    </View>
  );

  const renderCurrentStep = () => {
    if (step === -2) {
      return (
        <>
          {renderStepHeader(
            'Rejoins-nous vite !',
            'Votre statut est obligatoire pour rejoindre Bookly',
          )}
          <Text style={styles.description}>
            Quand tu auras créé ton statut auto-entrepreneur, reviens
            t’inscrire. On t’attend !
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setStep(-1)}
            style={[clickableStyles.bigSecondary, styles.blockedBackButton]}
          >
            <ArrowLeft size={16} color={colors.orangeDark} />
            <Text style={clickableStyles.bigSecondaryText}>Retour</Text>
          </Pressable>
        </>
      );
    }
    if (step === -1) return renderEligibility();
    if (step === 0) return renderPersonalDetails();
    if (step === 1) return renderDocuments();
    if (step === 2) return renderUrssafNotice();
    if (step === 3) return renderQualifications();
    if (step === 4) return renderSkills();
    if (step === 5 && hasQuestionnaire) return renderQuestionnaire();
    if (step === validationStep) return renderValidation();
    return renderSuccess();
  };

  const isWizardStep = step >= 0 && step <= validationStep;
  const isValidationStep = step === validationStep;

  return (
    <AuthLayout>
      <ScrollView
        style={loginForm.card}
        contentContainerStyle={loginForm.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {isWizardStep ? (
            <View style={styles.progressRow}>
              {Array.from({ length: totalSteps }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressSegment,
                    index <= step && styles.progressSegmentDone,
                  ]}
                />
              ))}
            </View>
          ) : null}
          {renderCurrentStep()}
          {isWizardStep ? (
            <View style={styles.footerButtons}>
              <Pressable
                accessibilityRole="button"
                onPress={goBack}
                style={[
                  clickableStyles.bigSecondary,
                  styles.footerButton,
                  styles.footerSecondary,
                ]}
              >
                <ArrowLeft size={15} color={colors.orangeDark} />
                <Text style={clickableStyles.bigSecondaryText}>Retour</Text>
              </Pressable>
              <PrimaryButton
                loading={submitting || checkingEmail}
                icon={
                  isValidationStep ? (
                    <Check size={15} color={colors.white} />
                  ) : (
                    <ArrowRight size={15} color={colors.white} />
                  )
                }
                disabled={
                  submitting ||
                  checkingEmail ||
                  (step === 3 && selectedQualifications.length === 0) ||
                  (step === 5 && hasQuestionnaire && !quizComplete) ||
                  (isValidationStep &&
                    !consents.every(([name]) => accepted[name]))
                }
                onPress={isValidationStep ? finish : goNext}
                style={[styles.footerButton, styles.footerPrimary]}
                title={
                  isValidationStep
                    ? 'Soumettre mon profil'
                    : step === 2
                    ? "J’ai compris"
                    : 'Suivant'
                }
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
