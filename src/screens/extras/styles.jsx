import { StyleSheet } from 'react-native';
import { colors, typography } from '../../styles';

// Extras dashboard shell.
//
// The design source (src/pages/extras/Extras.css) is a desktop layout with a
// solid brand-coloured sidebar. On mobile the same idea is expressed as a
// slide-in drawer: same brand background, light text, matching nav items.
export const extras = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.cream,
  },
  brand: {
    color: colors.orange,
    ...typography.branding.wordmark,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24,
    gap: 18,
  },
  // Page heading shared by every extras page until they get their own design.
  pageHeading: {
    gap: 4,
  },
  pageEyebrow: {
    color: colors.orangeDark,
    ...typography.labels.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  pageTitle: {
    color: colors.brown,
    ...typography.headings.h1,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  pageDescription: {
    color: colors.muted,
    ...typography.body.regular,
  },
  // ── Drawer (mobile equivalent of the design sidebar) ──
  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.brown,
    opacity: 0.45,
  },
  drawer: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: colors.orange,
  },
  drawerHeader: {
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.18)',
  },
  drawerBrand: {
    marginBottom: 16,
    color: colors.white,
    ...typography.branding.wordmark,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: colors.palePink,
  },
  drawerAvatarText: {
    color: colors.orange,
    ...typography.labels.bold,
    fontSize: 20,
  },
  drawerName: {
    marginTop: 10,
    color: colors.white,
    ...typography.labels.bold,
    fontSize: 14,
  },
  drawerRole: {
    marginTop: 4,
    color: colors.palePink,
    ...typography.body.regular,
  },
  drawerStatus: {
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  drawerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.successDot,
  },
  drawerStatusText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    ...typography.body.regular,
  },
  drawerClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  drawerList: {
    padding: 12,
    gap: 3,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerItem: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  drawerItemText: {
    flex: 1,
    color: 'rgba(255,255,255,0.7)',
    ...typography.labels.regular,
    fontSize: 13,
  },
  drawerItemTextActive: {
    color: colors.white,
    ...typography.labels.bold,
    fontSize: 13,
  },
  drawerBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#E53935',
  },
  drawerBadgeText: {
    color: colors.white,
    ...typography.labels.bold,
    fontSize: 10,
  },
  drawerFooter: {
    padding: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },
  logoutButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoutText: {
    color: 'rgba(255,255,255,0.75)',
    ...typography.labels.regular,
    fontSize: 13,
  },
  // ── Bottom navigation (same treatment as the client dashboard) ──
  bottomNavigation: {
    minHeight: 62,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  bottomTab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bottomTabActive: {
    borderTopWidth: 2,
    borderTopColor: colors.orange,
  },
  bottomTabIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  bottomTabText: {
    color: colors.muted,
    ...typography.body.regular,
    fontSize: 10,
  },
  bottomTabTextActive: {
    color: colors.orangeDark,
    ...typography.labels.bold,
    fontSize: 10,
  },
});

export default StyleSheet.create({});
