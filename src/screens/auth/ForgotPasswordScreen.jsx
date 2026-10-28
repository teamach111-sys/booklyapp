/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Réinitialisation Mot de Passe (Code)
 * **Associated Route/Context**: `/password/reset`  
 * **Total Discovered Backend Calls**: 2
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`PasswordReset.jsx:68`](file:///C:/Users/Workspace/staffly-frontend/src/pages/auth/PasswordReset.jsx#L68) | User Action Handler (`sendCode`) | `sendCode` | `POST` | `/password/forgot` | `{ email: email.trim(` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
 * | [`PasswordReset.jsx:96`](file:///C:/Users/Workspace/staffly-frontend/src/pages/auth/PasswordReset.jsx#L96) | Form Submit / Create Button (`submitReset`) | `submitReset` | `POST` | `/password/reset` | `{` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
 * 
 * =====================================================================
 */
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
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from './AuthLayout';
import { colors, formStyles } from '../../styles';
import authService from '../../api/authService';

const styles = formStyles.recovery;
const loginStyles = formStyles.login;

const RESEND_DELAY = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation, route }) {
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const handleSendCode = async () => {
    if (loading) return;
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("L'adresse e-mail n'est pas valide.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(trimmed);
      Alert.alert(
        'Code envoyé',
        res?.message || 'Un code de réinitialisation vous a été envoyé par e-mail.',
      );
      setStep('code');
      setCooldown(RESEND_DELAY);
    } catch (err) {
      const status = err?.status;
      if (status === 422) {
        const firstErr = err?.data?.errors?.email?.[0];
        setError(firstErr || "L'adresse e-mail n'est pas valide.");
      } else if (status === 429) {
        setError('Trop de tentatives. Merci de patienter quelques instants.');
      } else {
        setError(err?.message || 'Impossible de contacter le serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (loading) return;
    setError('');

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError('Veuillez saisir le code reçu par e-mail.');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre nouveau mot de passe.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        code: trimmedCode,
        password,
        password_confirmation: confirm,
      });
      Alert.alert(
        'Succès',
        res?.message || 'Votre mot de passe a été modifié avec succès.',
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
        const validation = err?.data?.errors;
        const first = validation ? Object.values(validation).flat()[0] : null;
        setError(first || 'Informations invalides.');
      } else if (status === 429) {
        setError('Trop de tentatives. Merci de patienter quelques instants.');
      } else {
        setError(err?.message || 'Une erreur est survenue lors de la réinitialisation.');
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
        <View style={styles.sectionCard}>
          <Text style={loginStyles.title}>
            {step === 'email' ? 'Mot de passe oublié' : 'Réinitialisation'}
          </Text>
          <Text style={loginStyles.description}>
            {step === 'email'
              ? 'Entrez votre email pour recevoir un code de vérification.'
              : `Entrez le code envoyé à ${email} et votre nouveau mot de passe.`}
          </Text>

          {error ? (
            <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#FFF5F5', borderRadius: 8 }}>
              <Text style={{ color: colors.orangeDark, fontSize: 13, lineHeight: 18 }}>
                {error}
              </Text>
            </View>
          ) : null}

          {step === 'email' ? (
            <View style={loginStyles.form}>
              <Text style={loginStyles.label}>Email</Text>
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="email@bookly.fr"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                style={[loginStyles.input, styles.input]}
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <PrimaryButton
                disabled={loading}
                loading={loading}
                onPress={handleSendCode}
                style={styles.submitButton}
                title="Recevoir un code"
              />
            </View>
          ) : (
            <View style={loginStyles.form}>
              <Text style={loginStyles.label}>Code à 6 chiffres</Text>
              <TextInput
                accessibilityLabel="Code de vérification"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
                style={[loginStyles.input, styles.input]}
                value={code}
                onChangeText={setCode}
                editable={!loading}
              />

              <Text style={[loginStyles.label, { marginTop: 12 }]}>Nouveau mot de passe</Text>
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                  accessibilityLabel="Nouveau mot de passe"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Minimum 8 caractères"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                  style={[loginStyles.input, styles.input, { paddingRight: 40 }]}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  onPress={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 12 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.muted} />
                  ) : (
                    <Eye size={18} color={colors.muted} />
                  )}
                </Pressable>
              </View>

              <Text style={[loginStyles.label, { marginTop: 12 }]}>Confirmer le mot de passe</Text>
              <TextInput
                accessibilityLabel="Confirmer le mot de passe"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Confirmez le mot de passe"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                style={[loginStyles.input, styles.input]}
                value={confirm}
                onChangeText={setConfirm}
                editable={!loading}
              />

              <PrimaryButton
                disabled={loading}
                loading={loading}
                onPress={handleResetPassword}
                style={styles.submitButton}
                title="Réinitialiser le mot de passe"
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 14 }}>
                <Pressable
                  disabled={cooldown > 0 || loading}
                  onPress={handleSendCode}
                >
                  <Text style={{ color: cooldown > 0 ? colors.muted : colors.orange, fontSize: 13, fontWeight: '500' }}>
                    {cooldown > 0
                      ? `Renvoyer le code (${cooldown}s)`
                      : 'Renvoyer un nouveau code'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.divider} />
          <Pressable
            accessibilityRole="button"
            onPress={() => (step === 'code' ? setStep('email') : navigation.navigate('Login'))}
            style={styles.returnButton}
          >
            <ArrowLeft size={18} color={colors.orangeDark} />
            <Text style={styles.returnText}>
              {step === 'code' ? 'Modifier l’email' : 'Retour à la connexion'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
