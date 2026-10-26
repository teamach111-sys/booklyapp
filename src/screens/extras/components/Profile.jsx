import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Profile() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Mon Profil</Text>
      <Text style={extras.pageDescription}>
        Gérez vos informations personnelles, vos documents, vos compétences et
        vos qualifications.
      </Text>
    </View>
  );
}
