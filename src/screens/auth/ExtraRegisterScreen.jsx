import { useState } from 'react';
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

const languages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Arabe',
  'Allemand',
  'Italien',
  'Portugais',
  'Chinois',
];

const qualifications = [
  'Barista',
  'Chef de cuisine',
  'Chef de partie',
  'Chef de rang',
  'Commis',
  'Commis de salle',
  'Équipier MK',
  'Maître d’hôtel CKDIN',
  'Maître d’hôtel référent',
  'Maître d’hôtel responsable',
  'Maître d’hôtel',
  'Mixologue',
  'Plongeur',
];

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

// Step 6 shows the validation questionnaire matching each qualification the
// extra selected. Only the roles below have a questionnaire today — add a new
// entry here to support another qualification.
const questionnaires = {
  Barista: [
    {
      question:
        'Q1. Pendant une pause de séminaire, 40 personnes arrivent en même temps au stand café.',
      answers: [
        'Servir uniquement les cafés simples',
        "Dire aux invités d'attendre",
        'Prendre chaque commande sans organisation',
        'Organiser les commandes par type (espresso, allongé, cappuccino) pour fluidifier le service',
      ],
    },
    {
      question: 'Q2. Entre deux vagues de service, vous devez :',
      answers: [
        'Vous éloigner du poste',
        'Laisser le plan de travail encombré',
        'Attendre la prochaine demande',
        'Nettoyer et réorganiser votre poste pour rester efficace',
      ],
    },
    {
      question: "Q3. Un client se plaint que son café n'est 'pas assez chaud'.",
      answers: [
        "Ajouter de l'eau chaude",
        "Dire que c'est la température standard",
        'Refaire le café immédiatement avec professionnalisme',
        'Ignorer',
      ],
    },
  ],
  'Chef de cuisine': [
    {
      question:
        'Q1. Pour un événement de 400 couverts avec envoi simultané, votre priorité en amont est :',
      answers: [
        "Déléguer toute l'organisation",
        'Structurer la production (planning, répartition des postes, volumes, timing) en amont',
        'Vous concentrer uniquement sur les recettes',
        "Attendre d'être sur site pour ajuster",
      ],
    },
    {
      question:
        "Q2. Le maître d'hôtel annonce que le client souhaite accélérer le rythme du dîner.",
      answers: [
        'Évaluer immédiatement la faisabilité avec vos équipes et coordonner un ajustement réaliste',
        'Ignorer la demande',
        'Refuser catégoriquement',
        'Envoyer plus vite sans prévenir',
      ],
    },
    {
      question: 'Q3. Après le service, votre rôle est :',
      answers: [
        'Laisser les chefs de partie gérer seuls',
        "Vérifier que la cuisine est rangée, propre et que l'équipe a terminé correctement avant départ",
        "Partir une fois l'envoi terminé",
        'Vous concentrer uniquement sur le démontage matériel',
      ],
    },
  ],
  'Chef de partie': [
    {
      question:
        'Q1. Pour un dîner de 250 couverts avec envoi simultané, votre priorité est :',
      answers: [
        'Soigner uniquement le premier envoi',
        'Aller le plus vite possible',
        'Organiser votre poste et briefer les équipes',
        "Préparer un maximum d'assiettes en avance",
      ],
    },
    {
      question:
        "Q2. Le maître d'hôtel responsable annonce que le client avance le plat de 15 minutes.",
      answers: [
        "Adapter immédiatement l'organisation du poste et prévenir les équipes en cuisine",
        "Refuser car ce n'était pas prévu",
        'Continuer comme prévu',
        'Prioriser la vitesse, même si la qualité diminue',
      ],
    },
    {
      question:
        "Q3. Le service est terminé mais votre poste n'est pas totalement nettoyé.",
      answers: [
        "Attendre qu'on vous dise quoi faire",
        'Partir car le service est terminé',
        'Nettoyer et laisser un poste propre avant de quitter la prestation',
        'Laisser les commis terminer seuls',
      ],
    },
  ],
  'Chef de rang': [
    {
      question:
        'Q1. Le buffet commence à se vider rapidement et la présentation se dégrade. Que faites-vous ?',
      answers: [
        'Organiser le réassort, maintenir la présentation et anticiper la rupture',
        'Laisser les responsables gérer',
        'Fermer le buffet temporairement',
        'Attendre le réassort cuisine',
      ],
    },
    {
      question: 'Q2. Le bar est saturé et les invités attendent.',
      answers: [
        'Laisser le barman gérer seul',
        "Venir en renfort et réorganiser le flux avec l'accord du maître d'hôtel responsable",
        'Quitter son poste pour venir en renfort',
        "Dire aux invités d'attendre",
      ],
    },
    {
      question:
        "Q3. Lors d'un cocktail, vous remarquez que la consommation de vin blanc est beaucoup plus rapide que prévu. Que faites-vous ?",
      answers: [
        "Continuer normalement, ce n'est pas votre responsabilité",
        'Réduire les quantités servies sans prévenir',
        'Attendre que le stock soit totalement vide',
        "Prévenir immédiatement le maître d'hôtel responsable et anticiper une solution",
      ],
    },
  ],
};

const documentGroups = [
  {
    files: [{ key: 'photo_profil', label: 'Photo de profil' }],
  },
  {
    title: "Pièce d'identité",
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

  const updateValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }));
  };
  const toggleLanguage = language => {
    setValues(current => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter(item => item !== language)
        : [...current.languages, language],
    }));
  };
  const toggleQualification = qualification => {
    setSelectedQualifications(current =>
      current.includes(qualification)
        ? current.filter(item => item !== qualification)
        : [...current, qualification],
    );
  };
  const toggleConsent = name => {
    setAccepted(current => ({ ...current, [name]: !current[name] }));
  };
  const setQuestionnaireAnswer = (qualification, questionIndex, answerIndex) => {
    setQuestionnaireAnswers(current => ({
      ...current,
      [qualification]: {
        ...current[qualification],
        [questionIndex]: answerIndex,
      },
    }));
  };

  const questionnaireQualifications = selectedQualifications.filter(
    qualification => questionnaires[qualification],
  );
  const hasQuestionnaire = questionnaireQualifications.length > 0;
  const questionnaireComplete = questionnaireQualifications.every(
    qualification =>
      questionnaires[qualification].every(
        (_, questionIndex) =>
          questionnaireAnswers[qualification]?.[questionIndex] !== undefined,
      ),
  );
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

  const goNext = () => {
    if (step === -1 && eligibility === 'none') {
      setStep(-2);
      return;
    }
    setStep(current => Math.min(current + 1, totalSteps));
  };
  const goBack = () => {
    setStep(current => (current === -2 ? -1 : Math.max(-1, current - 1)));
  };
  const finish = () => setStep(totalSteps);

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
        title="Commencer l'inscription"
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
        label="Seriez-vous d'accord de conduire un camion ?"
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
            const selected = values.languages.includes(language);
            return (
              <Pressable
                key={language}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleLanguage(language)}
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
                  {language}
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
          const selected = selectedQualifications.includes(qualification);
          return (
            <Pressable
              key={qualification}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleQualification(qualification)}
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
                {qualification}
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
        qualifications. Il n'y a pas de temps limite.
      </Text>
      {questionnaireQualifications.map(qualification => (
        <View key={qualification}>
          <Text style={styles.questionnaireQualification}>{qualification}</Text>
          {questionnaires[qualification].map((item, questionIndex) => (
            <View key={item.question} style={styles.questionCard}>
              <Text style={styles.questionText}>{item.question}</Text>
              <View style={styles.questionAnswers}>
                {item.answers.map((answer, answerIndex) => {
                  const selected =
                    questionnaireAnswers[qualification]?.[questionIndex] ===
                    answerIndex;
                  return (
                    <Pressable
                      key={answer}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() =>
                        setQuestionnaireAnswer(
                          qualification,
                          questionIndex,
                          answerIndex,
                        )
                      }
                      style={[
                        styles.questionAnswer,
                        selected && styles.selectedQuestionAnswer,
                      ]}
                    >
                      <Text
                        style={[
                          styles.questionAnswerLetter,
                          selected && styles.selectedQuestionAnswerText,
                        ]}
                      >
                        {String.fromCharCode(65 + answerIndex)}.
                      </Text>
                      <Text
                        style={[
                          styles.questionAnswerText,
                          selected && styles.selectedQuestionAnswerText,
                        ]}
                      >
                        {answer}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      ))}
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
              ? selectedQualifications.join(' · ')
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
                icon={
                  isValidationStep ? (
                    <Check size={15} color={colors.white} />
                  ) : (
                    <ArrowRight size={15} color={colors.white} />
                  )
                }
                disabled={
                  (step === 3 && selectedQualifications.length === 0) ||
                  (step === 5 && hasQuestionnaire && !questionnaireComplete) ||
                  (isValidationStep &&
                    !consents.every(([name]) => accepted[name]))
                }
                onPress={isValidationStep ? finish : goNext}
                style={[styles.footerButton, styles.footerPrimary]}
                title={
                  isValidationStep
                    ? 'Soumettre mon profil'
                    : step === 2
                    ? "J'ai compris"
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
