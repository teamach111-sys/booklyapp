import { StyleSheet } from 'react-native';

export const authColors = {
  background: '#FDF5E4',
  white: '#FFFFFF',
  cream: '#FFF9EE',
  brown: '#4A3222',
  muted: '#6B584C',
  orange: '#D47A31',
  orangeDark: '#B9622C',
  border: '#EBDCC0',
};

const fontFamilies = {
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  black: 'Inter-Black',
  extraBold: 'Inter-ExtraBold',
};

export const authLayoutSpacing = {
  headerContentGap: 15,
};

export const authLayout = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  content: {
    flex: 1,
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: authLayoutSpacing.headerContentGap,
    paddingBottom: 24,
  },
});

export const loginScreen = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    color: authColors.brown,
    fontFamily: fontFamilies.black,
    fontWeight: 'normal',
    fontSize: 28,
    lineHeight: 34,
    includeFontPadding: false,
  },
  description: {
    marginTop: 6,
    color: authColors.muted,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  form: {
    marginTop: 28,
  },
  label: {
    color: authColors.brown,
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
  },
  input: {
    height: 46,
    marginTop: 8,
    marginBottom: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 12,
    backgroundColor: authColors.cream,
    color: authColors.brown,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    color: authColors.orangeDark,
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
  },
  passwordInput: {
    height: 46,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 12,
    backgroundColor: authColors.cream,
  },
  passwordTextInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    color: authColors.brown,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
  visibilityButton: {
    height: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 3,
    backgroundColor: authColors.white,
  },
  checkboxChecked: {
    borderColor: authColors.orange,
    backgroundColor: authColors.orange,
  },
  checkboxCheck: {
    color: authColors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    lineHeight: 15,
  },
  rememberText: {
    color: authColors.muted,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
  },
  submitButton: {
    marginTop: 22,
  },
  registration: {
    marginTop: 24,
    paddingTop: 19,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: authColors.border,
  },
  registrationPrompt: {
    color: authColors.muted,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    textAlign: 'center',
  },
  registrationButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  registrationButton: {
    minHeight: 40,
    paddingHorizontal: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: authColors.border,
    backgroundColor: authColors.white,
  },
  registrationButtonText: {
    color: authColors.orangeDark,
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    textAlign: 'center',
  },
});

export const clients = StyleSheet.create({});
export const registerExtra = StyleSheet.create({});
export const registernonquizz = StyleSheet.create({});

export default StyleSheet.create({});
