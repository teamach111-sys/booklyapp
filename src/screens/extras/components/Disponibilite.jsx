import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Disponibilite() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Indisponibilités</Text>
      <Text style={extras.pageDescription}>
        Déclarez vos indisponibilités et gardez votre planning à jour.
      </Text>
    </View>
  );
}
