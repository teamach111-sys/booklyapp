import { Pressable, Text } from 'react-native';
import { primaryButton as styles } from './styles';

export default function PrimaryButton({
  accessibilityRole = 'button',
  icon,
  onPress,
  style,
  title,
}) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Text style={styles.text}>{title}</Text>
      {icon || null}
    </Pressable>
  );
}
