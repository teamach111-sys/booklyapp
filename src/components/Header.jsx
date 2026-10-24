import { Text, View } from 'react-native';
import { headerStyles as styles } from '../styles';

export default function Header({ rightContent }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>bookly</Text>
      {rightContent || null}
    </View>
  );
}