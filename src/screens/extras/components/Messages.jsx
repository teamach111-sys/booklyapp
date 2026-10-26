import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Messages() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Messages</Text>
      <Text style={extras.pageDescription}>
        Échangez avec les clients et consultez vos signalements.
      </Text>
    </View>
  );
}
