import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/auth/LoginScreen';
import ClientRegisterScreen from './src/screens/auth/ClientRegisterScreen';
import ExtraRegisterScreen from './src/screens/auth/ExtraRegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
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
  );
}