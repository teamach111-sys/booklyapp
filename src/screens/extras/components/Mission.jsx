import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Mission() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Prestations</Text>
      <Text style={extras.pageDescription}>
        Consultez et suivez vos prestations proposées, à venir, en cours et
        terminées.
      </Text>
    </View>
  );
}
