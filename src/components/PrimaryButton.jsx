import { Pressable, Text } from 'react-native';
import { buttonStyles as styles } from '../styles';

export default function PrimaryButton({
  accessibilityRole = 'button',
  disabled = false,
  icon,
  onPress,
  style,
  title,
}) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.big, disabled && styles.disabled, style]}
    >
      <Text style={styles.bigText}>{title}</Text>
      {icon || null}
    </Pressable>
  );
}
