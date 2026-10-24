import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from './AuthLayout';
import {
  colors,
  forgotPasswordScreenStyles as styles,
  loginScreenStyles,
} from '../../styles';

export default function ForgotPasswordScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email ?? '');

  return (
    <AuthLayout>
      <ScrollView
        style={loginScreenStyles.card}
        contentContainerStyle={loginScreenStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={loginScreenStyles.title}>Réinitialisation</Text>
        <Text style={loginScreenStyles.description}>
          Entrez votre email pour continuer
        </Text>

        <View style={loginScreenStyles.form}>
          <Text style={loginScreenStyles.label}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="email@bookly.fr"
            placeholderTextColor={colors.muted}
            returnKeyType="done"
            style={[loginScreenStyles.input, styles.input]}
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
          <PrimaryButton
            style={styles.submitButton}
            title="Recevoir un lien"
          />
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
      </ScrollView>
    </AuthLayout>
  );
}
