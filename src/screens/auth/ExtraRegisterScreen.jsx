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
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  FileText,
  Star,
  Upload,
} from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { clickableStyles, colors, formStyles, iconStyles } from '../../styles';
import AuthLayout from './AuthLayout';

const clientStyles = formStyles.clientRegistration;
const styles = formStyles.extraRegistration;
const loginForm = formStyles.login;

const baseStepCount = 6;

const formFields = [
  {
    name: 'firstname',
    label: 'Prénom',
    placeholder: 'Votre prénom',
    autoComplete: 'given-name',
  },
  {
    name: 'name',
    label: 'Nom',
    placeholder: 'Votre nom',
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'jean.dupont@email.com',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
  },
  {
    name: 'password',
    label: 'Mot de passe',
    placeholder: 'Minimum 6 caractères',
    secureTextEntry: true,
    autoCapitalize: 'none',
  },
  {
    name: 'birth_date',
    label: 'Date de naissance',
    placeholder: 'JJ/MM/AAAA',
    keyboardType: 'numbers-and-punctuation',
  },
  {
    name: 'phone',
    label: 'Téléphone',
    placeholder: '+33 6 00 00 00 00',
    keyboardType: 'phone-pad',
  },
  { name: 'address', label: 'Adresse', placeholder: 'Votre adresse' },
  {
    name: 'postal_code',
    label: 'Code postal',
    placeholder: '75001',
    keyboardType: 'number-pad',
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
  'Serveur / Serveuse',
  'Chef de rang',
  'Barman / Barmaid',
  'Barista',
  'Commis de cuisine',
  'Chef de partie',
  'Plongeur',
  'Runner',
  'Sommelier',
  'Maître d’hôtel',
];

const skills = [
  {
    code: 'CAFES',
    label: 'Cafés classiques',
    description:
      'Utiliser différents types de machines et préparer les cafés classiques.',
  },
  {
    code: 'LATTE_ART',
    label: 'Latte Art',
    description: 'Réaliser une mousse de lait et créer des motifs.',
  },
  {
    code: 'SERVICE_BOISSON',
    label: 'Service boisson',
    description:
      'Servir vins, champagnes et boissons selon les règles du service.',
  },
  {
    code: 'COCKTAILS_CLASSIQUES',
    label: 'Cocktails classiques',
    description: 'Maîtriser les cocktails incontournables et leurs dosages.',
  },
  {
    code: 'COCKTAILS_SUR_MESURE',
    label: 'Cocktails sur-mesure',
    description: 'Créer des cocktails personnalisés selon les demandes.',
  },
  {
    code: 'VINS_ALCOOLS',
    label: 'Types de vin & alcool',
    description: 'Identifier et servir les vins, champagnes et spiritueux.',
  },
  {
    code: 'MANAGEMENT',
    label: 'Management',
    description: 'Encadrer une équipe et gérer les priorités.',
  },
  {
    code: 'PASSAGE_PLATEAU',
    label: 'Passage plateau',
    description: 'Porter un plateau chargé et assurer un service fluide.',
  },
  {
    code: 'RUN_DEBARRASSAGE',
    label: 'Run / débarrassage',
    description: 'Maintenir la salle propre et accompagner le service.',
  },
];

const baristaQuestions = [
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
      'Nettoyer et réorganiser votre poste pour rester efficace',
      'Attendre la prochaine demande',
      'Laisser le plan de travail encombré',
      'Vous éloigner du poste',
    ],
  },
  {
    question: "Q3. Un client se plaint que son café n'est 'pas assez chaud'.",
    answers: [
      'Ignorer',
      "Ajouter de l'eau chaude",
      'Refaire le café immédiatement avec professionnalisme',
      'Dire que c’est la température standard',
    ],
  },
];

const documentGroups = [
  {
    title: 'Photo de profil',
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
  'Validation du profil',
];

function FormField({ field, value, onChange }) {
  return (
    <View style={clientStyles.field}>
      <Text style={loginForm.label}>{field.label} *</Text>
      <TextInput
        accessibilityLabel={field.label}
        autoCapitalize={field.autoCapitalize || 'sentences'}
        autoComplete={field.autoComplete}
        autoCorrect={false}
        keyboardType={field.keyboardType || 'default'}
        placeholder={field.placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={field.secureTextEntry}
        style={loginForm.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function OptionCard({ title, description, icon, selected, onPress }) {
  const Icon = icon;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.optionCard, selected && styles.selectedOptionCard]}
    >
      <View style={iconStyles.optionIcon}>
        <Icon size={19} color={colors.orangeDark} />
      </View>
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      {selected ? <CircleCheck size={20} color={colors.orange} /> : null}
    </Pressable>
  );
}

function ChoiceRow({ label, value, onChange }) {
  return (
    <View style={[clientStyles.field, styles.choiceField]}>
      <Text style={loginForm.label}>{label} *</Text>
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
                  loginForm.checkbox,
                  selected && loginForm.checkboxChecked,
                ]}
              >
                {selected ? (
                  <Check size={12} color={colors.white} strokeWidth={3} />
                ) : null}
              </View>
              <Text style={styles.choiceText}>{title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SelectField({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={clientStyles.field}>
      <Text style={loginForm.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(current => !current)}
        style={clientStyles.selectButton}
      >
        <Text style={clientStyles.selectText}>
          {value || '— Sélectionner —'}
        </Text>
        <ChevronDown
          size={16}
          color={colors.orangeDark}
          style={open ? iconStyles.selectArrowOpen : undefined}
        />
      </Pressable>
      {open ? (
        <View style={clientStyles.optionList}>
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
                style={[
                  clientStyles.option,
                  selected && clientStyles.selectedOption,
                ]}
              >
                <Text style={clientStyles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
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
          <Check size={13} color={colors.white} strokeWidth={3} />
        ) : null}
      </View>
      <Text style={styles.consentText}>{label}</Text>
    </Pressable>
  );
}

export default function ExtraRegisterScreen() {
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
  const [baristaAnswers, setBaristaAnswers] = useState({});

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
  const hasBaristaQualification = selectedQualifications.includes('Barista');
  const validationStep = hasBaristaQualification ? 6 : baseStepCount - 1;
  const totalSteps = hasBaristaQualification
    ? baseStepCount + 1
    : baseStepCount;
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

  const renderEligibility = () => (
    <>
      <Text style={loginForm.title}>Avant de commencer</Text>
      <Text style={styles.description}>
        Une question rapide pour vérifier votre éligibilité.
      </Text>
      <Text style={styles.optionTitle}>
        Avez-vous un statut auto-entrepreneur ?
      </Text>
      <View style={styles.eligibilityOptions}>
        <OptionCard
          title="Oui, je suis auto-entrepreneur"
          description="Mon statut est déjà créé"
          icon={BadgeCheck}
          selected={eligibility === 'active'}
          onPress={() => setEligibility('active')}
        />
        <OptionCard
          title="En cours de création"
          description="Je finalise la création de mon statut"
          icon={BriefcaseBusiness}
          selected={eligibility === 'pending'}
          onPress={() => setEligibility('pending')}
        />
        <OptionCard
          title="Non, pas encore"
          description="Je n’ai pas encore de statut auto-entrepreneur"
          icon={AlertTriangle}
          selected={eligibility === 'none'}
          onPress={() => setEligibility('none')}
        />
      </View>
      <PrimaryButton
        icon={<ArrowRight size={17} color={colors.white} />}
        disabled={!eligibility}
        onPress={goNext}
        title="Commencer l'inscription"
      />
    </>
  );

  const renderPersonalDetails = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[0]}</Text>
      <Text style={styles.description}>
        Étape 1 sur {totalSteps} — Vos coordonnées
      </Text>
      {formFields.map(field => (
        <FormField
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={value => updateValue(field.name, value)}
        />
      ))}
      <SelectField
        label="Ville *"
        options={cities}
        value={values.ville}
        onChange={value => updateValue('ville', value)}
      />
      <SelectField
        label="Taille de tee-shirt *"
        options={['S', 'M', 'L', 'XL', 'XXL']}
        value={values.tshirt_size}
        onChange={value => updateValue('tshirt_size', value)}
      />
      <SelectField
        label="Pointure chaussure"
        options={Array.from({ length: 13 }, (_, index) => String(index + 35))}
        value={values.shoe_size}
        onChange={value => updateValue('shoe_size', value)}
      />
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
      <Text style={styles.documentSection}>Langues parlées *</Text>
      <Text style={styles.description}>Sélectionnez toutes vos langues.</Text>
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
                <Check size={14} color={colors.white} strokeWidth={3} />
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
    </>
  );

  const renderDocuments = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[1]}</Text>
      <Text style={styles.description}>
        Étape 2 sur {totalSteps} — Vous pouvez compléter plus tard
      </Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Information importante</Text>
        <Text style={styles.noticeText}>
          Vous pourrez ajouter vos documents plus tard depuis votre profil. Sans
          documents validés, vous ne pourrez pas recevoir de propositions de
          missions. Un rappel vous sera envoyé après votre inscription.
        </Text>
      </View>
      {documentGroups.map(group => (
        <View key={group.title}>
          <Text style={styles.documentSection}>{group.title}</Text>
          {group.files.map(file => {
            const selectedFile = documents[file.key];
            const isPicking = pickingDocument === file.key;
            return (
              <Pressable
                key={file.key}
                accessibilityRole="button"
                accessibilityLabel={`${file.label}: ${
                  selectedFile ? selectedFile.name : 'ajouter un fichier'
                }`}
                disabled={isPicking}
                onPress={() => pickDocument(file)}
                style={styles.documentButton}
              >
                {selectedFile ? (
                  <CircleCheck size={20} color={colors.success} />
                ) : (
                  <Upload size={20} color={colors.orange} />
                )}
                <View style={styles.documentCopy}>
                  <Text style={styles.documentTitle}>{file.label}</Text>
                  <Text style={styles.documentStatus}>
                    {isPicking
                      ? 'Ouverture des fichiers...'
                      : selectedFile?.name || 'Choisir un fichier'}
                  </Text>
                </View>
                {selectedFile ? (
                  <FileText size={17} color={colors.muted} />
                ) : (
                  <ArrowRight size={17} color={colors.muted} />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </>
  );

  const renderUrssafNotice = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[2]}</Text>
      <Text style={styles.description}>
        Étape 3 sur {totalSteps} — Information importante
      </Text>
      <View style={styles.notice}>
        <BriefcaseBusiness
          size={42}
          color={colors.orange}
          style={iconStyles.noticeIcon}
        />
        <View style={styles.noticeHeading}>
          <AlertTriangle size={18} color={colors.orangeDark} />
          <Text style={styles.noticeTitle}>
            Mise à jour obligatoire 2× par an
          </Text>
        </View>
        <Text style={styles.noticeBody}>
          Chaque année, les <Text style={styles.optionTitle}>10 janvier</Text>{' '}
          et <Text style={styles.optionTitle}>10 juillet</Text>, vous devez
          fournir votre attestation de vigilance URSSAF la plus récente.
        </Text>
        <View style={[clientStyles.optionList, styles.noticeFootnote]}>
          <Text style={styles.noticeText}>
            Cette démarche est obligatoire pour continuer à recevoir des
            propositions de missions. Sans attestation valide, votre profil sera
            temporairement suspendu.
          </Text>
        </View>
      </View>
    </>
  );

  const renderQualifications = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[3]}</Text>
      <Text style={styles.description}>
        Étape 4 sur {totalSteps} — Sélectionnez au moins une qualification
      </Text>
      <Text style={styles.documentSection}>
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
              <View
                style={[
                  loginForm.checkbox,
                  selected && loginForm.checkboxChecked,
                ]}
              >
                {selected ? (
                  <Check size={12} color={colors.white} strokeWidth={3} />
                ) : null}
              </View>
              <Text style={styles.choiceText}>{qualification}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const renderSkills = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[4]}</Text>
      <Text style={styles.description}>
        Étape 5 sur {totalSteps} — Évaluez vos compétences (optionnel)
      </Text>
      <Text style={styles.skillsLead}>
        Notez vos compétences de 1 (débutant) à 5 (expert). Laissez à 0 si non
        applicable.
      </Text>
      {skills.map(skill => (
        <View key={skill.code} style={styles.skillRow}>
          <Text style={styles.optionTitle}>{skill.label}</Text>
          <Text style={styles.skillDescription}>{skill.description}</Text>
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
                    color={selected ? colors.gold : colors.border}
                    fill={selected ? colors.gold : 'transparent'}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </>
  );

  const renderValidation = () => (
    <>
      <Text style={loginForm.title}>{stepTitles[5]}</Text>
      <Text style={styles.description}>
        Étape {validationStep + 1} sur {totalSteps} — Dernière étape avant
        soumission
      </Text>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        <Text style={styles.summaryText}>
          {values.firstname || 'Prénom'} {values.name || 'Nom'}
        </Text>
        <Text style={styles.summaryText}>
          {selectedQualifications.length} qualification(s) sélectionnée(s)
        </Text>
        <Text style={styles.summaryText}>
          {values.languages.length} langue(s) renseignée(s)
        </Text>
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

  const renderBaristaQuestionnaire = () => (
    <>
      <Text style={loginForm.title}>Questionnaire de compétences</Text>
      <Text style={styles.description}>
        Étape 6 sur 7 — Répondez à toutes les questions
      </Text>
      <Text style={styles.skillsLead}>
        Vos réponses seront évaluées par notre équipe pour valider vos
        qualifications. Il n'y a pas de temps limite.
      </Text>
      <Text style={styles.questionnaireQualification}>Barista</Text>
      {baristaQuestions.map((item, questionIndex) => (
        <View key={item.question} style={styles.questionCard}>
          <Text style={styles.questionText}>{item.question}</Text>
          <View style={styles.questionAnswers}>
            {item.answers.map((answer, answerIndex) => {
              const selected = baristaAnswers[questionIndex] === answerIndex;
              return (
                <Pressable
                  key={answer}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() =>
                    setBaristaAnswers(current => ({
                      ...current,
                      [questionIndex]: answerIndex,
                    }))
                  }
                  style={[
                    styles.questionAnswer,
                    selected && styles.selectedQuestionAnswer,
                  ]}
                >
                  <Text
                    style={[
                      styles.questionAnswerLetter,
                      selected && styles.selectedQuestionAnswerLetter,
                    ]}
                  >
                    {String.fromCharCode(65 + answerIndex)}.
                  </Text>
                  <Text style={styles.questionAnswerText}>{answer}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </>
  );

  const renderSuccess = () => (
    <View style={styles.success}>
      <CircleCheck size={58} color={colors.success} />
      <Text style={styles.successTitle}>Inscription réussie !</Text>
      <Text style={styles.successText}>
        Votre profil a bien été enregistré et sera étudié par notre équipe.
      </Text>
      {[
        'Validation de vos documents par l’équipe',
        'Activation de votre profil (sous 48h)',
        'Accès aux propositions de missions',
      ].map(item => (
        <View key={item} style={styles.successItem}>
          <CircleCheck size={17} color={colors.success} />
          <Text style={styles.successText}>{item}</Text>
        </View>
      ))}
      <PrimaryButton
        icon={<ArrowRight size={17} color={colors.white} />}
        onPress={() => setStep(-1)}
        title="Terminer"
        style={styles.successButton}
      />
    </View>
  );

  const renderCurrentStep = () => {
    if (step === -2) {
      return (
        <>
          <Text style={loginForm.title}>Rejoins-nous vite !</Text>
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
    if (step === 5 && hasBaristaQualification) {
      return renderBaristaQuestionnaire();
    }
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
        <Text style={loginForm.title}>Inscription extra</Text>
        {isWizardStep ? (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((step + 1) / totalSteps) * 100}%` },
              ]}
            />
          </View>
        ) : null}
        <View style={styles.form}>
          {renderCurrentStep()}
          {isWizardStep ? (
            <View style={styles.footerButtons}>
              <Pressable
                accessibilityRole="button"
                onPress={goBack}
                style={[clickableStyles.bigSecondary, styles.footerButton]}
              >
                <ArrowLeft size={16} color={colors.orangeDark} />
                <Text style={clickableStyles.bigSecondaryText}>Retour</Text>
              </Pressable>
              <PrimaryButton
                icon={
                  isValidationStep ? (
                    <Check size={17} color={colors.white} />
                  ) : (
                    <ArrowRight size={17} color={colors.white} />
                  )
                }
                disabled={
                  (step === 3 && selectedQualifications.length === 0) ||
                  (step === 5 &&
                    hasBaristaQualification &&
                    baristaQuestions.some(
                      (_, questionIndex) =>
                        baristaAnswers[questionIndex] === undefined,
                    )) ||
                  (isValidationStep &&
                    !consents.every(([name]) => accepted[name]))
                }
                onPress={isValidationStep ? finish : goNext}
                style={styles.footerButton}
                title={isValidationStep ? 'Soumettre' : 'Suivant'}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
