import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Search,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const PERIODS = [
  'Toutes les périodes',
  'Octobre 2026',
  'Septembre 2026',
  'Août 2026',
  'Juillet 2026',
  'Juin 2026',
];

const STATUS_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'to_pay', label: 'À régler' },
  { key: 'overdue', label: 'En retard' },
  { key: 'paid', label: 'Réglées' },
];

export default function Factures() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const [invoices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const selectedPeriod = PERIODS[selectedPeriodIndex];

  function resetFilters() {
    setSelectedStatus('all');
    setSelectedPeriodIndex(0);
    setSearchQuery('');
    setShowPeriodDropdown(false);
  }

  const isFiltered =
    selectedStatus !== 'all' ||
    selectedPeriodIndex !== 0 ||
    searchQuery.trim().length > 0;

  function prevPeriod() {
    if (selectedPeriodIndex > 0) {
      setSelectedPeriodIndex(current => current - 1);
    }
  }

  function nextPeriod() {
    if (selectedPeriodIndex < PERIODS.length - 1) {
      setSelectedPeriodIndex(current => current + 1);
    }
  }

  // Filter count calculations
  const totalCount = invoices.length;
  const toPayCount = invoices.filter(inv => inv.status === 'to_pay').length;
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;

  function getStatusCount(key) {
    if (key === 'all') return totalCount;
    if (key === 'to_pay') return toPayCount;
    if (key === 'overdue') return overdueCount;
    if (key === 'paid') return paidCount;
    return 0;
  }

  // Filtered invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus =
      selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesPeriod =
      selectedPeriodIndex === 0 || invoice.period === selectedPeriod;
    const matchesSearch =
      searchQuery.trim() === '' ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.missionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.extraName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPeriod && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* ── Top Summary Card ("Mes factures") ── */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconWrap}>
          <FileText size={18} color={colors.white} strokeWidth={2} />
        </View>
        <View style={styles.summaryTextCol}>
          <Text style={styles.summaryTitle}>Mes factures</Text>
          <Text style={styles.summarySubtitle}>
            Prestations facturées par la plateforme
          </Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryBadgeText}>{totalCount}</Text>
        </View>
      </View>

      {/* ── Search & Filter Card ── */}
      <View style={styles.filterCard}>
        {/* Row 1: Period Navigator & Search Input */}
        <View style={styles.filterTopRow}>
          {/* Period Navigator */}
          <View style={styles.periodNavigator}>
            <Pressable
              accessibilityLabel="Période précédente"
              accessibilityRole="button"
              disabled={selectedPeriodIndex === 0}
              onPress={prevPeriod}
              style={[
                styles.navArrow,
                selectedPeriodIndex === 0 && styles.navArrowDisabled,
              ]}
            >
              <ChevronLeft
                size={15}
                color={selectedPeriodIndex === 0 ? '#CCCCCC' : colors.orangeDark}
              />
            </Pressable>

            <Pressable
              accessibilityLabel={`Période: ${selectedPeriod}`}
              accessibilityRole="button"
              onPress={() => setShowPeriodDropdown(true)}
              style={styles.periodBtn}
            >
              <Text numberOfLines={1} style={styles.periodText}>
                {selectedPeriod}
              </Text>
              <ChevronDown size={13} color={colors.orangeDark} />
            </Pressable>

            <Pressable
              accessibilityLabel="Période suivante"
              accessibilityRole="button"
              disabled={selectedPeriodIndex === PERIODS.length - 1}
              onPress={nextPeriod}
              style={[
                styles.navArrow,
                selectedPeriodIndex === PERIODS.length - 1 &&
                  styles.navArrowDisabled,
              ]}
            >
              <ChevronRight
                size={15}
                color={
                  selectedPeriodIndex === PERIODS.length - 1
                    ? '#CCCCCC'
                    : colors.orangeDark
                }
              />
            </Pressable>
          </View>

          {/* Search Input */}
          <View style={styles.searchInputWrap}>
            <Search size={13} color="#BBBBBB" />
            <TextInput
              accessibilityLabel="Rechercher une facture"
              onChangeText={setSearchQuery}
              placeholder="N° de facture, extra…"
              placeholderTextColor="#BBBBBB"
              style={styles.searchInput}
              value={searchQuery}
            />
          </View>
        </View>

        {/* Period options bottom sheet */}
        <Modal
          animationType="fade"
          onRequestClose={() => setShowPeriodDropdown(false)}
          transparent
          visible={showPeriodDropdown}
        >
          <Pressable
            accessibilityLabel="Fermer la liste"
            accessibilityRole="button"
            onPress={() => setShowPeriodDropdown(false)}
            style={styles.pickerBackdrop}
          >
            <Pressable
              onPress={event => event.stopPropagation()}
              style={styles.pickerSheet}
            >
              <Text style={styles.pickerTitle}>Période</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {PERIODS.map((period, index) => {
                  const isSelected = selectedPeriodIndex === index;
                  return (
                    <Pressable
                      key={period}
                      accessibilityLabel={`Sélectionner ${period}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        setSelectedPeriodIndex(index);
                        setShowPeriodDropdown(false);
                      }}
                      style={styles.pickerOption}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          isSelected && styles.pickerOptionTextActive,
                        ]}
                      >
                        {period}
                      </Text>
                      {isSelected ? (
                        <Check size={16} color={colors.orange} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Row 2: Status Pills + Reset Button */}
        <View style={styles.filterBottomRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusPillsScroll}
          >
            {STATUS_FILTERS.map(filter => {
              const isSelected = selectedStatus === filter.key;
              const count = getStatusCount(filter.key);
              return (
                <Pressable
                  key={filter.key}
                  accessibilityLabel={`${filter.label} (${count})`}
                  accessibilityRole="button"
                  onPress={() => setSelectedStatus(filter.key)}
                  style={[
                    styles.statusPill,
                    isSelected
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillLabel,
                      isSelected
                        ? styles.statusPillLabelActive
                        : styles.statusPillLabelInactive,
                    ]}
                  >
                    {filter.label}{' '}
                    <Text
                      style={[
                        styles.statusPillCount,
                        isSelected
                          ? styles.statusPillCountActive
                          : styles.statusPillCountInactive,
                      ]}
                    >
                      {count}
                    </Text>
                  </Text>
                </Pressable>
              );
            })}

            {/* Réinitialiser button matching screenshot-2 */}
            {isFiltered ? (
              <Pressable
                accessibilityLabel="Réinitialiser les filtres"
                accessibilityRole="button"
                onPress={resetFilters}
                style={styles.resetBtn}
              >
                <X size={11} color="#888888" />
                <Text style={styles.resetBtnText}>Réinitialiser</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      </View>

      {/* ── Content: Invoice List or Empty State ── */}
      {filteredInvoices.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <FileText size={22} color={colors.orange} strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Aucune facture pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Vos factures apparaissent ici dès leur émission.
          </Text>
        </View>
      ) : (
        <View style={styles.invoicesList}>
          {filteredInvoices.map(invoice => (
            <View key={invoice.id} style={styles.invoiceCard}>
              <View style={styles.invoiceCardHeader}>
                <View style={styles.invoiceNumberBlock}>
                  <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                </View>
                <View
                  style={[
                    styles.invoiceStatusBadge,
                    invoice.status === 'paid' && styles.statusBadgePaid,
                    invoice.status === 'to_pay' && styles.statusBadgeToPay,
                    invoice.status === 'overdue' && styles.statusBadgeOverdue,
                  ]}
                >
                  <Text
                    style={[
                      styles.invoiceStatusText,
                      invoice.status === 'paid' && styles.statusTextPaid,
                      invoice.status === 'to_pay' && styles.statusTextToPay,
                      invoice.status === 'overdue' && styles.statusTextOverdue,
                    ]}
                  >
                    {invoice.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.invoiceCardBody}>
                <Text style={styles.invoiceMissionTitle}>
                  {invoice.missionTitle}
                </Text>
                <Text style={styles.invoiceExtraName}>{invoice.extraName}</Text>
              </View>

              <View style={styles.invoiceCardFooter}>
                <View>
                  <Text style={styles.invoiceAmountTTC}>
                    {invoice.amountTTC} TTC
                  </Text>
                  <Text style={styles.invoiceAmountHT}>
                    {invoice.amountHT} HT
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Télécharger la facture"
                  accessibilityRole="button"
                  style={styles.downloadBtn}
                >
                  <Download size={13} color={colors.orangeDark} />
                  <Text style={styles.downloadBtnText}>PDF</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 14,
  },

  /* ── Top Summary Card ("Mes factures") ── */
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryTextCol: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orange,
    fontFamily: serifFont,
  },
  summarySubtitle: {
    fontSize: 11,
    color: '#999999',
    marginTop: 1,
  },
  summaryBadge: {
    backgroundColor: colors.orange,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    flexShrink: 0,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
  },

  /* ── Search & Filter Card ── */
  filterCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  filterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  periodNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#F5EDE8',
  },
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    opacity: 0.4,
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 130,
    justifyContent: 'center',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  /* ── Period options bottom sheet ── */
  pickerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    maxHeight: '70%',
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.white,
  },
  pickerTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4dd',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  pickerOptionTextActive: {
    fontWeight: '700',
    color: colors.orange,
  },
  searchInputWrap: {
    flex: 1,
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.orangeDark,
    padding: 0,
  },
  filterBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  statusPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillActive: {
    backgroundColor: colors.orangeDark,
  },
  statusPillInactive: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#ECDDD6',
  },
  statusPillLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusPillLabelActive: {
    color: colors.white,
  },
  statusPillLabelInactive: {
    color: '#777777',
  },
  statusPillCount: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillCountActive: {
    opacity: 0.8,
    color: colors.white,
  },
  statusPillCountInactive: {
    opacity: 0.8,
    color: '#777777',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  resetBtnText: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },

  /* ── Content / Empty State Card (matches screenshot-1 & screenshot-2) ── */
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FAF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
    marginTop: 10,
    fontFamily: serifFont,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
    textAlign: 'center',
  },

  /* ── Invoices List ── */
  invoicesList: {
    gap: 10,
  },
  invoiceCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    padding: 14,
    gap: 10,
  },
  invoiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  invoiceNumberBlock: {
    gap: 2,
  },
  invoiceNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  invoiceDate: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  invoiceStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgePaid: {
    backgroundColor: '#F0FDF4',
  },
  statusBadgeToPay: {
    backgroundColor: '#FFFBEB',
  },
  statusBadgeOverdue: {
    backgroundColor: '#FEF2F2',
  },
  invoiceStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPaid: {
    color: '#15803D',
  },
  statusTextToPay: {
    color: '#D97706',
  },
  statusTextOverdue: {
    color: '#DC2626',
  },
  invoiceCardBody: {
    gap: 2,
  },
  invoiceMissionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  invoiceExtraName: {
    fontSize: 12,
    color: '#666666',
  },
  invoiceCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FAF3EF',
  },
  invoiceAmountTTC: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.orange,
  },
  invoiceAmountHT: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: '#FAF5F2',
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orangeDark,
  },
});
const stylesByBrand = createBrandStyles(createStyles);
