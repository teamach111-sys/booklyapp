/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Connexion & Mot de Passe Oublié
 * **Associated Route/Context**: `/login`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Login.jsx:226`](file:///C:/Users/Workspace/staffly-frontend/src/pages/auth/Login.jsx#L226) | User Action Handler (`handleSendResetLink`) | `handleSendResetLink` | `POST` | `/forgot-password` | `{ email: resetEmail }` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
 * | [`Login.jsx:251`](file:///C:/Users/Workspace/staffly-frontend/src/pages/auth/Login.jsx#L251) | User Action Handler (`handleUpdatePassword`) | `handleUpdatePassword` | `POST` | `/reset-password` | `{` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
 * | [`Login.jsx:148`](file:///C:/Users/Workspace/staffly-frontend/src/pages/auth/Login.jsx#L148) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `${API}/login` | `None` | Public (No auth) | Confirmed |
 * 
 * =====================================================================
 */
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from './AuthLayout';
import { colors, fontFamilies, formStyles } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/Authstorage';

const styles = formStyles.login;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// Turns a fetchClient ApiError into the same wording the web login uses.
function describeError(error) {
  switch (error?.type) {
    case 'network':
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    case 'timeout':
      return 'Le serveur met trop de temps à répondre. Réessayez dans un instant.';
    case 'rate_limit':
      return 'Trop de tentatives. Merci de patienter quelques instants avant de réessayer.';
    case 'unauthorized':
      return 'Le mot de passe saisi est incorrect.';
    default:
      break;
  }

  if (error?.status === 401) {
    return 'Le mot de passe saisi est incorrect.';
  }
  if (error?.status === 403) {
    return 'Ce compte a été supprimé. Contactez le support.';
  }
  if (error?.status === 422) {
    // Laravel validation payload: { errors: { email: ['...'] } }
    const errors = error?.data?.errors;
    const first = errors ? Object.values(errors).flat()[0] : null;
    return first || 'Identifiants invalides. Vérifiez vos informations.';
  }

  return error?.message || 'Une erreur est survenue. Merci de réessayer.';
}

export default function LoginScreen({ navigation }) {
  const { booting, isAuthenticated, signIn, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Single place that leaves this screen: a session restored from disk on
  // launch and a session created a second ago both land here.
  useEffect(() => {
    if (booting || !isAuthenticated) {
      return;
    }

    const route = getDashboardRoute(user?.role);
    if (route) {
      // The account's platform decides the client area palette (bookly vs
      // staffly); both brands share the same screens.
      navigation.replace(route, { partner: user?.platform_partner });
    }
  }, [booting, isAuthenticated, user, navigation]);

  const handleConnect = async () => {
    if (loading) {
      return;
    }

    setError(null);

    const value = email.trim().toLowerCase();
    if (!value) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Cette adresse e-mail n'est pas valide.");
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const account = await signIn({ email: value, password, remember: rememberMe });

      // No mobile screen for this role yet — say so instead of navigating
      // into a route that does not exist.
      if (!getDashboardRoute(account?.role)) {
        setError(
          "Votre compte n'a pas de tableau de bord dans l'application. Contactez le support.",
        );
      }
      // Navigation happens in the effect above.
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBanner}>
          <View style={styles.brandHeaderRow}>
            <View style={styles.brandLogoRow}>
              <Text style={styles.brandLogoBook}>book</Text>
              <Text style={styles.brandLogoLy}>ly</Text>
            </View>
            <View style={styles.brandStatsCompact}>
              <Text style={styles.brandStatNumberCompact}>1 000+</Text>
              <Text style={styles.brandStatLabelCompact}>extras</Text>
              <Text style={styles.brandStatDot}>•</Text>
              <Text style={styles.brandStatNumberCompact}>98%</Text>
              <Text style={styles.brandStatLabelCompact}>missions</Text>
            </View>
          </View>
          <Text style={styles.brandTagline}>
            Le staffing événementiel, simplifié.
          </Text>
          <View style={styles.brandPillsRow}>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>Prestations</Text>
            </View>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>Gestion</Text>
            </View>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>Facturation</Text>
            </View>
            <View style={[styles.brandPill, styles.brandPillSolid]}>
              <Text style={styles.brandPillSolidText}>Tout en un</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.description}>Ravi de vous revoir sur Bookly.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!loading}
              keyboardType="email-address"
              placeholder="email@bookly.fr"
              placeholderTextColor={colors.muted}
              returnKeyType="next"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Mot de passe</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('ForgotPassword', { email })}
              >
                <Text style={styles.link}>Oublié ?</Text>
              </Pressable>
            </View>
            <View style={styles.passwordInput}>
              <TextInput
                accessibilityLabel="Mot de passe"
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
                placeholder="••••••••••"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                secureTextEntry={!showPassword}
                style={styles.passwordTextInput}
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleConnect}
              />
              <Pressable
                accessibilityLabel={
                  showPassword
                    ? 'Masquer le mot de passe'
                    : 'Afficher le mot de passe'
                }
                accessibilityRole="button"
                onPress={() => setShowPassword(current => !current)}
                style={styles.visibilityButton}
              >
                {showPassword ? (
                  <EyeOff size={19} color={colors.muted} />
                ) : (
                  <Eye size={19} color={colors.muted} />
                )}
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              onPress={() => setRememberMe(current => !current)}
              style={styles.rememberRow}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe ? <Text style={styles.checkboxCheck}>✓</Text> : null}
              </View>
              <Text style={styles.rememberText}>Rester connecté</Text>
            </Pressable>

            {error ? (
              <View style={localStyles.errorBox}>
                <Text style={localStyles.errorText}>{error}</Text>
              </View>
            ) : null}

            <PrimaryButton
              disabled={loading}
              onPress={handleConnect}
              style={styles.submitButton}
              title={loading ? 'Connexion…' : 'Se connecter'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.registration}>
            <Text style={styles.registrationPrompt}>Pas encore de compte ?</Text>
            <View style={styles.registrationButtons}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('ExtraRegister')}
                style={styles.registrationButton}
              >
                <Text style={styles.registrationButtonText}>Devenir Extra</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('ClientRegister')}
                style={styles.registrationButton}
              >
                <Text style={styles.registrationButtonText}>Espace Client</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}

const localStyles = StyleSheet.create({
  errorBox: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F0C2BC',
    borderRadius: 10,
    backgroundColor: '#FCEDEA',
  },
  errorText: {
    color: '#A02A1C',
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
