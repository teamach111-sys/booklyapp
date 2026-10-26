import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Calendrier() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Calendrier</Text>
      <Text style={extras.pageDescription}>
        Visualisez vos missions et vos disponibilités mois par mois.
      </Text>
    </View>
  );
}
