import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from './AuthLayout';
import { colors, formStyles } from '../../styles';

const styles = formStyles.recovery;
const loginStyles = formStyles.login;

export default function ForgotPasswordScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email ?? '');

  return (
    <AuthLayout>
      <ScrollView
        style={loginStyles.card}
        contentContainerStyle={loginStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={loginStyles.title}>Mot de passe oublié</Text>
          <Text style={loginStyles.description}>
            Entrez votre email pour recevoir un code de vérification.
          </Text>

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
            />
            <PrimaryButton style={styles.submitButton} title="Recevoir un code" />
          </View>

          <View style={styles.divider} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Login')}
            style={styles.returnButton}
          >
            <ArrowLeft size={18} color={colors.orangeDark} />
            <Text style={styles.returnText}>Retour à la connexion</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
