import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import ClientRegisterScreen from './src/screens/auth/ClientRegisterScreen';
import ExtraRegisterScreen from './src/screens/auth/ExtraRegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ClientScreen from './src/screens/client/Client';
import ExtrasScreen from './src/screens/extras/Extras';
import { colors } from './src/styles';

const Stack = createNativeStackNavigator();

// Holds a splash until the saved session has been read from disk, so a
// logged-in user never sees the login screen flash on launch.
function BootGate({ children }) {
  const { booting } = useAuth();

  if (booting) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BootGate>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClientDashboard"
              component={ClientScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExtraDashboard"
              component={ExtrasScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClientRegister"
              component={ClientRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExtraRegister"
              component={ExtraRegisterScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BootGate>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
