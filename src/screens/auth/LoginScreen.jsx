import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from './AuthLayout';
import { colors, formStyles } from '../../styles';

const styles = formStyles.login;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleConnect = () => {
    if (email.trim().toLowerCase().includes('client')) {
      navigation.replace('ClientDashboard');
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
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.description}>Ravi de vous revoir sur Bookly.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
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
              placeholder="••••••••••"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
              secureTextEntry={!showPassword}
              style={styles.passwordTextInput}
              textContentType="password"
              value={password}
              onChangeText={setPassword}
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

          <PrimaryButton
            onPress={handleConnect}
            style={styles.submitButton}
            title="Se connecter"
          />
        </View>

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
      </ScrollView>
    </AuthLayout>
  );
}
