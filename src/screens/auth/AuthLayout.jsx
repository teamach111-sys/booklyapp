import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { layoutStyles as styles, colors } from '../../styles';

export default function AuthLayout({
  children,
  contentStyle = styles.authContent,
  headerAction,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.screen}>
        <Header rightContent={headerAction} />
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
