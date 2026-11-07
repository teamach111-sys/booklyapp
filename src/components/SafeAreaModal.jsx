import { useContext } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

export default function SafeAreaModal({ children, ...modalProps }) {
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <Modal {...modalProps}>
      <View style={[styles.content, { paddingBottom: insets?.bottom ?? 0 }]}>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
