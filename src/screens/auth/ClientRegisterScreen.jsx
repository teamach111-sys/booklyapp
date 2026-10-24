import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import {
  clientRegisterScreenStyles as registerStyles,
  colors,
  loginScreenStyles as loginStyles,
} from '../../styles';
import AuthLayout from './AuthLayout';

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
    keyboardType: 'numbers-and-punctuation',
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
        {field.optional ? ' (optionnel)' : ' *'}
      </Text>
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
        {optional ? ' (optionnel)' : ' *'}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel || 'Sélectionner'}`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={registerStyles.selectButton}
      >
        <Text style={registerStyles.selectText}>
          {selectedLabel || '— Sélectionner —'}
        </Text>
        <ChevronDown size={18} color={colors.orangeDark} />
      </Pressable>
      {open ? (
        <View style={registerStyles.optionList}>
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
                style={[
                  registerStyles.option,
                  isSelected && registerStyles.selectedOption,
                ]}
              >
                <Text style={registerStyles.optionText}>{optionLabel}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
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

  const updateValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }));
    if (name === 'tenue_staff' || name === 'platform_partner') {
      setOpenSelect(null);
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
        <Text style={loginStyles.title}>Inscription client</Text>
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
            La tenue sera pré-remplie lors de l'ajout d'une prestation et pourra
            être modifiée pour certaines missions.
          </Text>

          <Text style={registerStyles.sectionTitle}>Vos sites</Text>
          <Text style={loginStyles.label}>Nom du site *</Text>
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
            <Text style={registerStyles.addSiteText}>+ Ajouter un autre site</Text>
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
      </ScrollView>
    </AuthLayout>
  );
}
