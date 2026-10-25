import { StyleSheet } from 'react-native';
import { colors } from '../../../styles';

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

export const prestationsStyles = StyleSheet.create({
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
    backgroundColor: '#F57F17',
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
    flexBasis: 0,
    minWidth: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabSelected: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabText: {
    color: '#888',
    fontSize: 11,
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
    backgroundColor: '#F57F17',
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
    borderColor: '#F5B942',
    backgroundColor: '#F5B942',
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
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlayScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  pickerSheet: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '75%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  pickerTitle: {
    paddingVertical: 12,
    color: '#999',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
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
  convModal: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '92%',
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  convAvatar: {
    width: 40,
    height: 40,
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
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.palePink,
  },
  convTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  convTab: {
    marginBottom: -1,
    paddingHorizontal: 8,
    paddingVertical: 10,
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
    maxHeight: 280,
    padding: 12,
    backgroundColor: '#FAF7F5',
  },
  convEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingHorizontal: 16,
  },
  convEmptyTitle: {
    marginTop: 12,
    color: '#555',
    fontSize: 14,
    fontWeight: '700',
  },
  convEmptySub: {
    marginTop: 4,
    color: '#AAA',
    fontSize: 12,
  },
  convMessageMine: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderBottomRightRadius: 4,
    backgroundColor: colors.orange,
  },
  convMessageTextMine: {
    color: colors.white,
    fontSize: 13,
  },
  convInfoSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
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
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
  },
  convInfoRowFirst: {
    borderTopWidth: 0,
  },
  convInfoLabel: {
    flex: 1,
    color: '#BBB',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  convInfoValue: {
    flex: 1.4,
    color: '#333',
    fontSize: 13,
    textAlign: 'right',
  },
  convComposer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  convComposerInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#F5EDE8',
    color: '#333',
    fontSize: 13,
  },
  convSend: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.orange,
  },
  convSendDisabled: {
    backgroundColor: '#E0D0C8',
  },

  /* ---------- Annulation ---------- */
  cancelModal: {
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  cancelTitle: {
    marginBottom: 6,
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
  },
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
export const profile = StyleSheet.create({});
export const recap_global = StyleSheet.create({});
export const retourPrestation = StyleSheet.create({});

export default StyleSheet.create({});
