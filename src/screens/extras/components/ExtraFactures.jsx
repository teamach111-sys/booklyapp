import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function ExtraFactures() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Mes factures</Text>
      <Text style={extras.pageDescription}>
        Suivez les montants à recevoir, en retard et payés.
      </Text>
    </View>
  );
}
