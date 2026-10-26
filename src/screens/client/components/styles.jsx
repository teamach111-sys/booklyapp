import { StyleSheet } from 'react-native';
import { createBrandStyles } from '../theme/clientStyles';

export const calendrier = StyleSheet.create({});
export const clientCoOwners = StyleSheet.create({});
export const clientcustomrates = StyleSheet.create({});
export const clientEmployees = StyleSheet.create({});
export const clientHistorique = StyleSheet.create({});
export const espaces = StyleSheet.create({});
export const evaluation_modal = StyleSheet.create({});
export const evaluation_retard_heurssupp_modal = StyleSheet.create({});
export const factures = StyleSheet.create({});
export const fav_extra = StyleSheet.create({});
export const missionForm = StyleSheet.create({});
export const missionList = StyleSheet.create({});
export const modification_conversation_client = StyleSheet.create({});
export const prestations = StyleSheet.create({});

const createPrestationsStyles = colors => StyleSheet.create({
  section: {
    gap: 14,
  },

  /* ---------- En-tête de liste ---------- */
  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  headerTitleBlock: {
    flex: 1,
  },
  pageTitle: {
    color: colors.orangeDark,
    fontSize: 17,
    fontWeight: '700',
  },
  pageSubtitle: {
    marginTop: 4,
    color: '#AAA',
    fontSize: 12,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.orange,
  },
  newButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  /* ---------- Bandeau de confirmation ---------- */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  bannerBody: {
    flex: 1,
  },
  bannerTitle: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerSub: {
    marginTop: 1,
    color: '#B45309',
    fontSize: 11,
  },
  bannerButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: colors.orange,
  },
  bannerButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  /* ---------- Onglets ---------- */
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F5EDE8',
  },
  tab: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabSelected: {
    backgroundColor: colors.white,
    flexGrow: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabText: {
    color: '#888',
    fontSize: 10,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: colors.orange,
    fontWeight: '700',
  },
  tabBadge: {
    flexShrink: 0,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 20,
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  tabBadgeSelected: {
    backgroundColor: colors.orange,
  },
  tabBadgeIdle: {
    backgroundColor: '#BBB',
  },

  /* ---------- Filtres ---------- */
  filtersBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  filterInput: {
    width: 104,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    color: '#333',
    fontSize: 12,
  },
  filterSearch: {
    flex: 1,
    minWidth: 160,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    color: '#333',
    fontSize: 12,
  },

  /* ---------- Cartes de prestation ---------- */
  missionList: {
    gap: 12,
  },
  missionCard: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FDE8CC',
  },
  missionMain: {
    flex: 1,
    minWidth: 180,
  },
  missionTitle: {
    marginBottom: 6,
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '700',
  },
  missionStatus: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    color: '#F57F17',
    fontSize: 10,
    fontWeight: '700',
  },
  missionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#888',
    fontSize: 11,
  },
  missionPoster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  missionPosterText: {
    color: '#BBA695',
    fontSize: 10,
    fontStyle: 'italic',
  },
  missionSide: {
    alignItems: 'flex-end',
    gap: 8,
  },
  missionPrice: {
    color: colors.orange,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },
  missionPriceCaption: {
    color: '#BBB',
    fontSize: 9,
    letterSpacing: 0.4,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  missionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  },
  cardIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  cardIconButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  msgButton: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  viewButton: {
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  viewButtonText: {
    color: colors.orangeDark,
  },
  dupButton: {
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  cancelButton: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FDF0F0',
  },

  /* ---------- État vide ---------- */
  emptyCard: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 48,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.palePink,
  },
  emptyTitle: {
    color: colors.orangeDark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  /* ---------- Bouton retour ---------- */
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
  },
  backButtonText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ---------- Détail ---------- */
  detailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  detailHead: {
    flex: 1,
  },
  detailTitle: {
    color: colors.orangeDark,
    fontSize: 16,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  badge: {
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: '700',
  },
  badgePending: {
    backgroundColor: '#FFF8E1',
    color: '#F57F17',
  },
  badgeType: {
    backgroundColor: colors.palePink,
    color: colors.orange,
  },
  badgeCode: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },

  card: {
    marginBottom: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  cardTitle: {
    color: colors.orangeDark,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  countBadge: {
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 20,
    backgroundColor: colors.palePink,
    color: colors.orange,
    fontSize: 10,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  infoLabel: {
    minWidth: 130,
    color: '#AAA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  infoValue: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '500',
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FAF6F4',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.orangeDark,
  },
  commentIcon: {
    marginTop: 4,
  },
  commentText: {
    flex: 1,
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 21,
  },

  clientHours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  clientHoursText: {
    color: '#888',
    fontSize: 11,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FAF6F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  jobName: {
    flex: 2,
  },
  jobNameText: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '700',
  },
  jobCode: {
    color: '#BBB',
    fontSize: 10,
  },
  jobQty: {
    width: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobQtyText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '700',
  },
  jobTimes: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#E8F4FD',
  },
  timeBadgeText: {
    color: '#1565C0',
    fontSize: 11,
    fontWeight: '600',
  },
  pauseBadge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FFF8E1',
  },
  pauseBadgeText: {
    color: '#F57F17',
    fontSize: 10,
    fontWeight: '600',
  },

  langPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  langPill: {
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '600',
  },
  mutedText: {
    color: '#BBB',
    fontSize: 12,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  priceLabel: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '700',
  },
  priceSub: {
    marginTop: 2,
    color: '#888',
    fontSize: 12,
  },
  priceRight: {
    alignItems: 'flex-end',
  },
  priceValue: {
    color: colors.orange,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  priceCaption: {
    marginTop: 3,
    color: '#BBB',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* ---------- Formulaire ---------- */
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  formTitleBlock: {
    flex: 1,
  },
  formTitle: {
    color: colors.orangeDark,
    fontSize: 15,
    fontWeight: '700',
  },
  formSub: {
    marginTop: 2,
    color: '#AAA',
    fontSize: 12,
  },
  cardTitlePlain: {
    marginBottom: 16,
    paddingBottom: 10,
    color: colors.orangeDark,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  cardTitleMuted: {
    color: '#BBB',
    fontWeight: '400',
    letterSpacing: 0,
    textTransform: 'none',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 5,
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelInline: {
    marginBottom: 0,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    color: '#333',
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
  },
  dateInputFlex: {
    flex: 1.8,
    paddingHorizontal: 8,
  },
  timeInputFlex: {
    flex: 1,
    paddingHorizontal: 8,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  addressToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressToggleText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  checkbox: {
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#F0E4DD',
    backgroundColor: '#FAF6F4',
  },
  addressBoxInput: {
    flex: 1,
    padding: 0,
    color: '#555',
    fontSize: 13,
  },

  clothingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F0E4DD',
    backgroundColor: colors.white,
  },
  clothingCheckbox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  clothingCheckboxChecked: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  clothingRowText: {
    flex: 1,
    color: '#3A2A1F',
    fontSize: 14,
  },
  helper: {
    marginVertical: 8,
    color: '#888',
    fontSize: 12,
  },
  helperTop: {
    marginBottom: 16,
    color: '#AAA',
    fontSize: 12,
  },
  helperCenter: {
    marginTop: 6,
    color: '#BBB',
    fontSize: 11,
    textAlign: 'center',
  },

  langPillToggle: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  langPillSelected: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  langPillIdle: {
    borderColor: '#DDD',
    backgroundColor: 'transparent',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  langPillTextSelected: {
    color: colors.white,
  },
  langPillTextIdle: {
    color: '#888',
  },

  eventBlock: {
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.divider,
  },
  eventHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  eventNumber: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.orange,
  },
  eventNumberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  eventSelect: {
    flex: 1,
  },
  eventRemove: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clientHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  clientHoursLabel: {
    color: '#888',
    fontSize: 12,
  },
  clientTimeInput: {
    width: 76,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    color: '#333',
    fontSize: 12,
  },
  arrow: {
    color: '#CCC',
    fontSize: 13,
  },

  jobGridLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  gridLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  jobGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  colQualification: {
    flex: 2,
    minWidth: 0,
  },
  colNb: {
    width: 60,
  },
  colTime: {
    flex: 1,
    minWidth: 0,
  },
  colBreak: {
    width: 90,
  },
  colAction: {
    width: 32,
  },
  gridInput: {
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    color: '#333',
    fontSize: 12,
  },
  breakToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  removeStaffButton: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FDF0F0',
  },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  breakLabel: {
    color: '#888',
    fontSize: 11,
  },
  breakNote: {
    color: '#AAA',
    fontSize: 11,
  },

  addStaffButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E0D0C8',
  },
  addStaffButtonFull: {
    marginTop: 14,
  },
  addStaffText: {
    color: colors.orangeDark,
    fontSize: 12,
    fontWeight: '600',
  },

  selectWrap: {
    flex: 1,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  selectFieldCompact: {
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  selectText: {
    flex: 1,
    color: '#333',
    fontSize: 12,
  },
  selectPlaceholder: {
    color: '#AAA',
  },

  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.cream,
  },
  fileName: {
    flex: 1,
    color: '#555',
    fontSize: 11,
  },
  dashedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0D0C8',
  },
  dashedButtonText: {
    color: colors.orangeDark,
    fontSize: 13,
    fontWeight: '600',
  },

  formActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  actionCancel: {
    borderColor: '#DDD',
  },
  actionCancelText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  actionDraft: {
    borderColor: '#E0D0C8',
  },
  actionDraftText: {
    color: colors.orangeDark,
    fontSize: 13,
    fontWeight: '600',
  },
  actionSubmit: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  actionSubmitText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ---------- Extras / vue d'ensemble (duplication) ---------- */
  extraBlock: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  extraHead: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  codeChip: {
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#FAF6F4',
    color: '#AAA',
    fontSize: 10,
    fontWeight: '700',
  },
  codeChipWhite: {
    backgroundColor: colors.white,
  },
  jobNameChip: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '700',
  },
  timeChip: {
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#E8F4FD',
    color: '#1565C0',
    fontSize: 11,
    fontWeight: '600',
  },
  pauseChip: {
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    color: '#F57F17',
    fontSize: 11,
    fontWeight: '600',
  },
  assignText: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '600',
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: '#FAF6F4',
  },
  overviewBody: {
    flex: 1,
    minWidth: 0,
  },
  overviewChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  overviewNote: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },

  /* ---------- Superpositions ---------- */
  pickerOption: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  pickerOptionText: {
    flex: 1,
    color: '#333',
    fontSize: 13,
  },

  /* ---------- Conversation ---------- */
  convSheet: {
    minHeight: 520,
    paddingTop: 0,
    paddingBottom: 0,
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  convAvatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.palePink,
  },
  convAvatarText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '700',
  },
  convName: {
    flex: 1,
    color: colors.orangeDark,
    fontSize: 15,
    fontWeight: '700',
  },
  convClose: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F0EC',
  },
  convTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  convTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  convTabActive: {
    borderBottomColor: colors.orange,
  },
  convTabText: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },
  convTabTextActive: {
    color: colors.orange,
  },
  convBody: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF7F5',
  },
  convEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  convEmptyTitle: {
    marginTop: 12,
    color: colors.orangeDark,
    fontSize: 14,
    fontWeight: '700',
  },
  convEmptySub: {
    marginTop: 4,
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  convScroll: {
    flex: 1,
  },
  convList: {
    gap: 12,
  },
  convMessageMine: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    backgroundColor: colors.orange,
  },
  convMessageOther: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F0E4DD',
  },
  convMessageTextMine: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
  },
  convMessageTextOther: {
    color: '#333',
    fontSize: 13,
    lineHeight: 18,
  },
  convInfoSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F0E4DD',
  },
  convInfoTitle: {
    marginBottom: 12,
    color: '#BBB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  convInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
  },
  convInfoRowFirst: {
    borderTopWidth: 0,
  },
  convInfoLabel: {
    flex: 1,
    color: '#BBB',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  convInfoValue: {
    flex: 1.5,
    color: '#333',
    fontSize: 13,
    textAlign: 'right',
  },
  convComposer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
    backgroundColor: colors.white,
  },
  convComposerInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5EDE8',
    color: '#333',
    fontSize: 13,
  },
  convSend: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.orange,
  },
  convSendDisabled: {
    backgroundColor: '#E0D0C8',
  },

  /* ---------- Annulation ---------- */
  cancelText: {
    marginBottom: 16,
    color: '#888',
    fontSize: 13,
  },
  cancelStrong: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  cancelInput: {
    marginBottom: 16,
  },
  cancelButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBack: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#DDD',
  },
  cancelBackText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelConfirm: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#9B1C1C',
  },
  cancelConfirmText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

const createProfileStyles = colors => StyleSheet.create({
  section: {
    gap: 14,
  },

  /* ---------- Identity Card ---------- */
  identityCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingHorizontal: 26,
    paddingVertical: 22,
    marginBottom: 14,
  },
  identityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.palePink,
    borderWidth: 3,
    borderColor: '#ECDDD6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.orange,
    fontFamily: 'Georgia',
  },
  identityInfo: {
    flex: 1,
    minWidth: 200,
  },
  identityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Georgia',
  },
  identityEmail: {
    fontSize: 13,
    color: '#AAA',
    marginTop: 3,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tagBlue: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  tagBrown: {
    backgroundColor: '#F0E4DD',
    color: colors.orangeDark,
  },
  modifierButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: colors.orange,
  },
  modifierButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ---------- Tabs ---------- */
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: colors.orange,
  },
  tabInactive: {
    backgroundColor: '#F5F0EC',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.white,
  },
  tabTextInactive: {
    color: '#888',
  },

  /* ---------- Information Groups ---------- */
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingHorizontal: 26,
    paddingVertical: 22,
    marginBottom: 14,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orangeDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 16,
  },
  groupTitleSpacing: {
    marginTop: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '47%',
    marginBottom: 16,
  },
  gridItemFull: {
    width: '100%',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  fieldLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    fontSize: 13,
    backgroundColor: colors.white,
    color: '#1A1A1A',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* ---------- Mot de passe ---------- */
  passwordHelp: {
    color: '#AAA',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  passwordField: {
    marginBottom: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
  },
  passwordToggle: {
    paddingHorizontal: 12,
  },

  /* ---------- Action Buttons ---------- */
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    flexShrink: 0,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: colors.orange,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

const createMessagesStyles = colors => StyleSheet.create({
  section: {
    gap: 14,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F5EDE8',
  },
  tab: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabSelected: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: colors.orange,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F5EDE8',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    padding: 0,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  emptyIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.palePink,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orangeDark,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#AAA',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  /* ---------- Modals ---------- */
  modalTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  modalTab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomColor: colors.orange,
  },
  modalTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#AAA',
  },
  modalTabTextActive: {
    color: colors.orange,
  },
  modalBody: {
    flexShrink: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF6F4',
  },
  emptyContacts: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContactsText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.palePink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orange,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  contactRole: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 2,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BBB',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
  },

  /* ---------- Report Form ---------- */
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAF6F4',
    borderWidth: 1.5,
    borderColor: '#F0E4DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F0E4DD',
    backgroundColor: colors.white,
  },
  typePillActive: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  typePillTextActive: {
    color: colors.white,
  },
  formActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  submitButton: {
    flex: 1.2,
    backgroundColor: colors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F0EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '700',
  },
});

export const profile = StyleSheet.create({});
export const recap_global = StyleSheet.create({});
export const retourPrestation = StyleSheet.create({});

export const prestationsStylesByBrand = createBrandStyles(createPrestationsStyles);
export const profileStylesByBrand = createBrandStyles(createProfileStyles);
export const messagesStylesByBrand = createBrandStyles(createMessagesStyles);

export default StyleSheet.create({});
