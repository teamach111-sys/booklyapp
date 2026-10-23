import { StyleSheet } from 'react-native';

const colors = {
  background: '#FDF5E4',
  white: '#FFFFFF',
  orange: '#D47A31',
  border: '#EBDCC0',
};

const fontFamilies = {
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
};

export const primaryButton = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    backgroundColor: colors.orange,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    elevation: 3,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.extraBold,
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'center',
  },
});

export const header = StyleSheet.create({
  container: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  brand: {
    color: colors.orange,
    fontFamily: fontFamilies.black,
    fontSize: 24,
    letterSpacing: -0.8,
  },
});

export const datePicker = StyleSheet.create({});
export const footer = StyleSheet.create({});
export const timePicker = StyleSheet.create({});

export default StyleSheet.create({});
