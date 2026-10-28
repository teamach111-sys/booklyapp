/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Inscription Client / Établissement
 * **Associated Route/Context**: `/inscription/client`  
 * **Total Discovered Backend Calls**: 2
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Clients.jsx:123`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Clients.jsx#L123) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/envoyerVerficationEmail` | `{` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
 * | [`Clients.jsx:103`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Clients.jsx#L103) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `${import.meta.env.VITE_API_URL}/register/client` | `None` | Public (No auth) | Confirmed |
 * 
 * =====================================================================
 */
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
import { Check, ChevronDown, X } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import DatePicker from '../../components/DatePicker';
import { colors, formStyles } from '../../styles';
import AuthLayout from './AuthLayout';
import authService from '../../api/authService';

const registerStyles = formStyles.clientRegistration;
const loginStyles = formStyles.login;
const pickerStyles = formStyles.optionPicker;

const fields = [
  { name: 'name', label: 'Nom', placeholder: 'Votre nom' },
  { name: 'firstname', label: 'Prénom', placeholder: 'Votre prénom' },
  {
    name: 'email',
    label: 'Adresse e-mail',
    placeholder: 'contact@entreprise.com',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
  },
  {
    name: 'phone',
    label: 'Téléphone',
    placeholder: '01 23 45 67 89',
    keyboardType: 'phone-pad',
  },
  {
    name: 'address',
    label: 'Adresse du siège social',
    placeholder: "Adresse de l'entreprise",
  },
  {
    name: 'birth_date',
    label: 'Date de naissance',
    placeholder: 'JJ/MM/AAAA',
    type: 'date',
  },
  {
    name: 'password',
    label: 'Mot de passe',
    placeholder: 'Choisissez un mot de passe',
    secureTextEntry: true,
    autoCapitalize: 'none',
  },
  {
    name: 'password_confirmation',
    label: 'Confirmation du mot de passe',
    placeholder: 'Confirmez le mot de passe',
    secureTextEntry: true,
    autoCapitalize: 'none',
  },
];

const companyFields = [
  {
    name: 'raison_sociale',
    label: 'Raison sociale',
    placeholder: 'Nom de votre entreprise',
  },
  {
    name: 'siret',
    label: 'Numéro SIRET',
    placeholder: '123 456 789 00012',
    keyboardType: 'number-pad',
  },
  {
    name: 'tva_number',
    label: 'N° TVA',
    placeholder: 'FR12345678901',
    optional: true,
    autoCapitalize: 'characters',
  },
  {
    name: 'billing_conditions',
    label: 'Conditions de facturation',
    placeholder: 'Ex : Net 30 jours',
    optional: true,
  },
];

const outfitOptions = [
  'Chemise noire + pantalon noir + chaussures de ville',
  'Chemise noire + pantalon noir + baskets',
  'Chemise blanche + pantalon noir + chaussures de ville',
  'Chemise blanche + pantalon noir + baskets',
  'T-shirt noir + pantalon noir + chaussures de ville',
  'T-shirt noir + pantalon noir + baskets',
];

const partnerOptions = [
  { value: 'bookly', label: 'Bookly' },
  { value: 'staffly', label: 'Staffly' },
];

function FormField({ field, value, onChange }) {
  return (
    <View style={registerStyles.field}>
      <Text style={loginStyles.label}>
        {field.label}
        {field.optional ? (
          <Text style={registerStyles.optional}> (optionnel)</Text>
        ) : (
          <Text style={{ color: colors.orangeDark }}> *</Text>
        )}
      </Text>
      {field.type === 'date' ? (
        <DatePicker
          accessibilityLabel={field.label}
          colors={colors}
          maximumDate={new Date()}
          onChange={onChange}
          outputFormat="iso"
          placeholder={field.placeholder}
          style={loginStyles.input}
          value={value}
        />
      ) : (
        <TextInput
          accessibilityLabel={field.label}
          autoCapitalize={field.autoCapitalize || 'sentences'}
          autoCorrect={false}
          keyboardType={field.keyboardType || 'default'}
          placeholder={field.placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={field.secureTextEntry}
          style={loginStyles.input}
          value={value}
          onChangeText={onChange}
        />
      )}
    </View>
  );
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  open,
  onToggle,
  optional = false,
}) {
  const selectedOption = options.find(option =>
    typeof option === 'string' ? option === value : option.value === value,
  );
  const selectedLabel =
    typeof selectedOption === 'string' ? selectedOption : selectedOption?.label;

  return (
    <View style={registerStyles.field}>
      <Text style={loginStyles.label}>
        {label}
        {optional ? (
          <Text style={registerStyles.optional}> (optionnel)</Text>
        ) : (
          <Text style={{ color: colors.orangeDark }}> *</Text>
        )}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel || 'Sélectionner'}`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={registerStyles.selectButton}
      >
        <Text
          style={
            selectedLabel
              ? registerStyles.selectText
              : registerStyles.selectPlaceholder
          }
        >
          {selectedLabel || '— Sélectionner une tenue —'}
        </Text>
        <ChevronDown size={18} color={colors.orangeDark} />
      </Pressable>
      <Modal
        animationType="fade"
        onRequestClose={onToggle}
        transparent
        visible={open}
      >
        <Pressable
          accessibilityLabel="Fermer la liste"
          accessibilityRole="button"
          onPress={onToggle}
          style={pickerStyles.backdrop}
        >
          <Pressable
            onPress={event => event.stopPropagation()}
            style={pickerStyles.sheet}
          >
            <Text style={pickerStyles.title}>{label}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map(option => {
                const optionValue =
                  typeof option === 'string' ? option : option.value;
                const optionLabel =
                  typeof option === 'string' ? option : option.label;
                const isSelected = optionValue === value;

                return (
                  <Pressable
                    key={optionValue}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => onChange(name, optionValue)}
                    style={pickerStyles.option}
                  >
                    <Text
                      style={[
                        pickerStyles.optionText,
                        isSelected && pickerStyles.optionTextActive,
                      ]}
                    >
                      {optionLabel}
                    </Text>
                    {isSelected ? (
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

export default function ClientRegisterScreen({ navigation }) {
  const [values, setValues] = useState({
    name: '',
    firstname: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    password: '',
    password_confirmation: '',
    raison_sociale: '',
    siret: '',
    tva_number: '',
    billing_conditions: '',
    tenue_staff: '',
    platform_partner: 'bookly',
  });
  const [sites, setSites] = useState(['']);
  const [openSelect, setOpenSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }));
    if (name === 'tenue_staff' || name === 'platform_partner') {
      setOpenSelect(null);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError('');

    // Validation
    if (!values.name.trim()) { setError('Le nom est requis.'); return; }
    if (!values.firstname.trim()) { setError('Le prénom est requis.'); return; }
    if (!values.email.trim()) { setError("L'adresse e-mail est requise."); return; }
    if (!values.phone.trim()) { setError('Le numéro de téléphone est requis.'); return; }
    if (!values.address.trim()) { setError("L'adresse du siège est requise."); return; }
    if (!values.birth_date) { setError('La date de naissance est requise.'); return; }
    if (!values.password) { setError('Le mot de passe est requis.'); return; }
    if (values.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (values.password !== values.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!values.raison_sociale.trim()) { setError("Le nom de l'entreprise est requis."); return; }
    if (!values.siret.trim()) { setError('Le numéro SIRET est requis.'); return; }

    const cleanedSpaces = sites.map(s => s.trim()).filter(Boolean);
    if (!cleanedSpaces.length) {
      setError('Au moins un nom de site est requis.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        email: values.email.trim().toLowerCase(),
        cities: cleanedSpaces,
      };

      const res = await authService.registerClient(payload);

      try {
        await authService.sendVerificationEmail({
          email: payload.email,
          user_id: res?.data?.user_id,
          message: 'Votre inscription est en attente de validation.',
        });
      } catch {
        // Non-fatal
      }

      Alert.alert(
        'Compte créé avec succès',
        res?.message || 'Votre inscription a bien été prise en compte.',
        [
          {
            text: 'Se connecter',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err) {
      const status = err?.status;
      if (status === 422) {
        const errors = err?.data?.errors;
        const first = errors ? Object.values(errors).flat()[0] : null;
        setError(first || 'Veuillez corriger les erreurs dans le formulaire.');
      } else if (status === 429) {
        setError('Trop de tentatives. Merci de patienter quelques instants.');
      } else {
        setError(err?.message || 'Une erreur est survenue lors de l’inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScrollView
        style={loginStyles.card}
        contentContainerStyle={loginStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={registerStyles.sectionCard}>
          <Text style={registerStyles.title}>Inscription Client</Text>
          <View style={registerStyles.form}>
            {fields.map(field => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={value => updateValue(field.name, value)}
              />
            ))}

            <Text style={registerStyles.sectionTitle}>
              Informations entreprise
            </Text>
            {companyFields.map(field => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={value => updateValue(field.name, value)}
              />
            ))}

            <Text style={registerStyles.sectionTitle}>
              Informations tenue client
            </Text>
            <SelectField
              label="Tenue staff demandée"
              name="tenue_staff"
              options={outfitOptions}
              value={values.tenue_staff}
              optional
              open={openSelect === 'tenue_staff'}
              onToggle={() =>
                setOpenSelect(current =>
                  current === 'tenue_staff' ? null : 'tenue_staff',
                )
              }
              onChange={updateValue}
            />
            <Text style={registerStyles.helperText}>
              La tenue sera pré-remplie automatiquement lors de l'ajout d'une
              prestation et pourra être modifiée pour certaines missions.
            </Text>

            <Text style={registerStyles.sectionTitle}>Vos sites</Text>
            <Text style={loginStyles.label}>
              Nom du site <Text style={{ color: colors.orangeDark }}>*</Text>
            </Text>
            {sites.map((site, index) => (
              <View key={index} style={registerStyles.siteRow}>
                <TextInput
                  accessibilityLabel={`Nom du site ${index + 1}`}
                  autoCapitalize="words"
                  placeholder={
                    index === 0
                      ? 'Ex : Siège social, Boutique Marais...'
                      : 'Nom du site supplémentaire'
                  }
                  placeholderTextColor={colors.muted}
                  style={[loginStyles.input, registerStyles.siteInput]}
                  value={site}
                  onChangeText={value =>
                    setSites(current =>
                      current.map((currentSite, siteIndex) =>
                        siteIndex === index ? value : currentSite,
                      ),
                    )
                  }
                />
                {sites.length > 1 ? (
                  <Pressable
                    accessibilityLabel={`Supprimer le site ${index + 1}`}
                    accessibilityRole="button"
                    onPress={() =>
                      setSites(current =>
                        current.filter((_, siteIndex) => siteIndex !== index),
                      )
                    }
                    style={registerStyles.removeSiteButton}
                  >
                    <X size={18} color={colors.orangeDark} />
                  </Pressable>
                ) : null}
              </View>
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => setSites(current => [...current, ''])}
              style={registerStyles.addSiteButton}
            >
              <Text style={registerStyles.addSiteText}>
                + Ajouter un autre site
              </Text>
            </Pressable>
            <Text style={registerStyles.helperText}>
              Indiquez le nom de votre site principal. Si vous avez plusieurs
              sites, ajoutez-les avec le bouton ci-dessus.
            </Text>

            <SelectField
              label="Plateforme partenaire"
              name="platform_partner"
              options={partnerOptions}
              value={values.platform_partner}
              open={openSelect === 'platform_partner'}
              onToggle={() =>
                setOpenSelect(current =>
                  current === 'platform_partner' ? null : 'platform_partner',
                )
              }
              onChange={updateValue}
            />

            {error ? (
              <View style={{ marginTop: 14, padding: 10, backgroundColor: '#FFF5F5', borderRadius: 8 }}>
                <Text style={{ color: colors.orangeDark, fontSize: 13, lineHeight: 18 }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <PrimaryButton
              disabled={loading}
              loading={loading}
              onPress={handleSubmit}
              style={registerStyles.submitButton}
              title="Créer mon compte"
            />

            <View style={registerStyles.footer}>
              <Text style={registerStyles.footerText}>Déjà inscrit ?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={registerStyles.footerLink}>Se connecter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
