import { Text, View } from 'react-native';
import { extras } from '../styles';

export default function Notifications() {
  return (
    <View style={extras.pageHeading}>
      <Text style={extras.pageEyebrow}>Espace extra</Text>
      <Text style={extras.pageTitle}>Notifications</Text>
      <Text style={extras.pageDescription}>
        Restez informé de vos missions, vos factures et vos actualités.
      </Text>
    </View>
  );
}
