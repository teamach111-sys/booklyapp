import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useClientColors } from '../theme/ClientThemeContext';

// Shared bottom sheet matching the "Site actif" / select-input picker:
// fade-in on a dimmed backdrop, white panel with rounded top corners and a
// centred title. Every client modal is built on this shell so lists, forms and
// detail sheets share the same surface and animation.
export default function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = '70%',
  showClose = false,
  closeLabel = 'Fermer la fenêtre',
  sheetStyle,
}) {
  const colors = useClientColors();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel={closeLabel}
        accessibilityRole="button"
        onPress={onClose}
        style={styles.backdrop}
      >
        <Pressable
          accessibilityRole="none"
          onPress={event => event.stopPropagation()}
          style={[
            styles.sheet,
            { backgroundColor: colors.white, maxHeight },
            sheetStyle,
          ]}
        >
          {title ? (
            <View style={[styles.header, showClose && styles.headerWithClose]}>
              <Text style={[styles.title, { color: colors.orangeDark }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ) : null}
            </View>
          ) : null}
          {showClose ? (
            <Pressable
              accessibilityLabel={closeLabel}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.close}
            >
              <X size={18} color="#999999" />
            </Pressable>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingTop: 18,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerWithClose: {
    paddingRight: 46,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#AAAAAA',
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});
