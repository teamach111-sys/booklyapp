/*
### Screen: Extras Portal : ExtraFactures
**Associated Route/Context**: `/extras (Tab/Modal: ExtraFactures)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`ExtraFactures.jsx:160`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L160) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/invoices/' + invoiceId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`ExtraFactures.jsx:305`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L305) | User Action Handler (`ExtraFactures`) | `ExtraFactures` | `GET` | `/extra/invoices` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`ExtraFactures.jsx:38`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L38) | User Action Handler (`svgToBase64`) | `svgToBase64` | `GET` | `url` | `None` | Public (No auth) | Inferred / Dynamic |


*/

/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Factures
 * **Associated Route/Context**: `/client (Tab/Modal: Factures)`  
 * **Total Discovered Backend Calls**: 5
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Factures.jsx:68`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Factures.jsx#L68) | User Action Handler (`Factures`) | `Factures` | `GET` | `/missions/space/' + selectedSpace.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Factures.jsx:82`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Factures.jsx#L82) | User Action Handler (`Factures`) | `Factures` | `GET` | `/client/invoices/summary?' + params.toString(` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Factures.jsx:99`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Factures.jsx#L99) | User Action Handler (`openMissionInvoice`) | `openMissionInvoice` | `GET` | `/invoice/mission/' + m.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Factures.jsx:109`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Factures.jsx#L109) | User Action Handler (`openMonthlyInvoice`) | `openMonthlyInvoice` | `GET` | `/client/invoices/monthly/' + year + '/' + month + '?' + params.toString(` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Factures.jsx:42`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Factures.jsx#L42) | User Action Handler (`svgToDataUrl`) | `svgToDataUrl` | `GET` | `url` | `None` | Public (No auth) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useClientSites } from '../state/SitesContext';
import { createBrandStyles } from '../theme/clientStyles';
import clientService from '../../../api/clientService';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

// Maps the backend's `statut_paiement` values (paye / en_attente / litige /
// non_generee) to the three filter buckets the UI uses.
const STATUT_PAIEMENT_MAP = {
  paye: { key: 'paid', label: 'Payée' },
  en_attente: { key: 'to_pay', label: 'En attente' },
  litige: { key: 'overdue', label: 'Litige' },
  non_generee: { key: 'to_pay', label: 'Non générée' },
};

const STATUS_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'to_pay', label: 'À régler' },
  { key: 'overdue', label: 'Litige' },
  { key: 'paid', label: 'Réglées' },
];

const MONTHS_FR = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export default function Factures() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const { activeSite } = useClientSites();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadInvoices = useCallback(async () => {
    if (!activeSite?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getMissionsForSpace(activeSite.id);
      const list = Array.isArray(data) ? data : data?.missions || [];
      // The web frontend filters on `etat_mission === 'Terminée'`.
      const finished = list.filter(m => m.etat_mission === 'Terminée');

      const mapped = finished.map(m => {
        // Map the backend's statut_paiement to our UI status.
        const sp = m.statut_paiement || 'non_generee';
        const mappedStatus = STATUT_PAIEMENT_MAP[sp] || STATUT_PAIEMENT_MAP.non_generee;
        const status = mappedStatus.key;
        const statusLabel = mappedStatus.label;

        // The backend returns `total_ht` (a number or null). TTC = HT * 1.2.
        const ht = parseFloat(m.total_ht) || 0;
        const ttc = Math.round(ht * 1.2 * 100) / 100;

        // Period label from date_debut_raw (ISO) for filtering.
        const rawDate = m.date_debut_raw || m.date_debut;
        const parsed = rawDate ? new Date(rawDate) : null;
        const period = parsed && !isNaN(parsed.getTime())
          ? `${MONTHS_FR[parsed.getMonth() + 1]} ${parsed.getFullYear()}`
          : 'Période inconnue';

        return {
          id: m.id,
          number: `FAC-M-${m.id}`,
          // Backend returns `nom`, not `prestation_nom`.
          missionTitle: m.nom || m.prestation_nom || `Mission #${m.id}`,
          // Backend returns `date` already formatted as d/m/Y.
          date: m.date || '—',
          status,
          statusLabel,
          // The list endpoint doesn't return extra info — show staff count.
          extraName: m.staff || `${m.staff_accepted || 0} extra(s)`,
          amountHT: `${ht.toFixed(2)} €`,
          amountTTC: `${ttc.toFixed(2)} €`,
          period,
          // Keep raw fields for the detail modal.
          _raw: m,
        };
      });

      setInvoices(mapped);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [activeSite?.id]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Reset filters when the active site changes — the period list is rebuilt.
  useEffect(() => {
    setSelectedStatus('all');
    setSelectedPeriodIndex(0);
    setSearchQuery('');
  }, [activeSite?.id]);

  const openInvoiceDetail = async inv => {
    setLoadingDetail(true);
    try {
      const detail = await clientService.getClientInvoice(inv.id);
      // Backend returns { mission, breakdown, total_to_pay }
      setSelectedInvoiceDetail({ invoice: inv, detail });
    } catch (err) {
      Alert.alert(
        'Facture',
        `Facture ${inv.number}\nMontant: ${inv.amountTTC}\nStatut: ${inv.statusLabel}`,
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  function closeInvoiceDetail() {
    setSelectedInvoiceDetail(null);
  }

  // Build periods dynamically from loaded invoices — mirrors the web's
  // "Par mois" tab which derives months from the data.
  const PERIODS = ['Toutes les périodes', ...Array.from(
    new Set(invoices.map(inv => inv.period).filter(p => p !== 'Période inconnue'))
  ).sort((a, b) => {
    // Sort descending: "Octobre 2026" before "Septembre 2026"
    const ma = a.match(/(\w+)\s+(\d{4})/);
    const mb = b.match(/(\w+)\s+(\d{4})/);
    if (!ma || !mb) return b.localeCompare(a);
    const ya = parseInt(ma[2]), yb = parseInt(mb[2]);
    if (ya !== yb) return yb - ya;
    return MONTHS_FR.indexOf(mb[1]) - MONTHS_FR.indexOf(ma[1]);
  })];

  const selectedPeriod = PERIODS[selectedPeriodIndex] || PERIODS[0];

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
      {loading ? (
        <View style={[styles.emptyCard, { paddingVertical: 40 }]}>
          <ActivityIndicator size="small" color={colors.orange} />
        </View>
      ) : filteredInvoices.length === 0 ? (
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
            <Pressable
              key={invoice.id}
              style={styles.invoiceCard}
              onPress={() => openInvoiceDetail(invoice)}
            >
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
                  onPress={() => openInvoiceDetail(invoice)}
                  style={styles.downloadBtn}
                >
                  <Download size={13} color={colors.orangeDark} />
                  <Text style={styles.downloadBtnText}>PDF</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Invoice Detail Modal ── */}
      <Modal
        animationType="slide"
        onRequestClose={closeInvoiceDetail}
        transparent
        visible={!!selectedInvoiceDetail}
      >
        <View style={styles.detailBackdrop}>
          <View style={styles.detailSheet}>
            {selectedInvoiceDetail ? (
              (() => {
                const { invoice: inv, detail } = selectedInvoiceDetail;
                const mission = detail?.mission;
                const breakdown = detail?.breakdown || [];
                const totalToPay = parseFloat(detail?.total_to_pay) || 0;
                const ht = Math.round(totalToPay / 1.2 * 100) / 100;

                return (
                  <>
                    <View style={styles.detailHeader}>
                      <Pressable
                        accessibilityLabel="Retour"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={closeInvoiceDetail}
                        style={styles.detailBackBtn}
                      >
                        <ChevronLeft size={18} color={colors.orangeDark} />
                        <Text style={styles.detailBackText}>Retour</Text>
                      </Pressable>
                      <View style={styles.detailTitleWrap}>
                        <Text style={styles.detailTitle}>
                          Facture — {mission?.prestation_nom || inv.missionTitle}
                        </Text>
                        <Text style={styles.detailSubtitle}>
                          {inv.number} · {inv.date}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.invoiceStatusBadge,
                          inv.status === 'paid' && styles.statusBadgePaid,
                          inv.status === 'to_pay' && styles.statusBadgeToPay,
                          inv.status === 'overdue' && styles.statusBadgeOverdue,
                        ]}
                      >
                        <Text
                          style={[
                            styles.invoiceStatusText,
                            inv.status === 'paid' && styles.statusTextPaid,
                            inv.status === 'to_pay' && styles.statusTextToPay,
                            inv.status === 'overdue' && styles.statusTextOverdue,
                          ]}
                        >
                          {inv.statusLabel}
                        </Text>
                      </View>
                    </View>

                    <ScrollView
                      style={styles.detailScroll}
                      contentContainerStyle={styles.detailScrollContent}
                      showsVerticalScrollIndicator={false}
                    >
                      {/* Mission info */}
                      <View style={styles.detailInfoCard}>
                        <Text style={styles.detailInfoTitle}>
                          {mission?.prestation_nom || inv.missionTitle}
                        </Text>
                        <Text style={styles.detailInfoMeta}>
                          {inv.date}
                          {mission?.prestation_type_detail
                            ? ` · ${mission.prestation_type_detail}`
                            : ''}
                          {mission?.adresse_exacte
                            ? ` · ${mission.adresse_exacte}`
                            : ''}
                        </Text>
                      </View>

                      {/* Breakdown table */}
                      {breakdown.length > 0 ? (
                        <View style={styles.breakdownWrap}>
                          <View style={styles.breakdownHeaderRow}>
                            <Text style={[styles.breakdownCol, styles.breakdownColExtra]}>Extra</Text>
                            <Text style={[styles.breakdownCol, styles.breakdownColSmall]}>Poste</Text>
                            <Text style={[styles.breakdownCol, styles.breakdownColTiny]}>Total h</Text>
                            <Text style={[styles.breakdownCol, styles.breakdownColTiny]}>Taux</Text>
                            <Text style={[styles.breakdownCol, styles.breakdownColTiny]}>Sous-total</Text>
                          </View>
                          {breakdown.map((s, i) => (
                            <View key={i} style={styles.breakdownRow}>
                              <Text style={[styles.breakdownCol, styles.breakdownColExtra, styles.breakdownCellText]}>
                                {s.extra_name}
                              </Text>
                              <Text style={[styles.breakdownCol, styles.breakdownColSmall, styles.breakdownCellText]}>
                                {s.job_title}
                              </Text>
                              <Text style={[styles.breakdownCol, styles.breakdownColTiny, styles.breakdownCellText]}>
                                {s.total_hours}h
                              </Text>
                              <Text style={[styles.breakdownCol, styles.breakdownColTiny, styles.breakdownCellText]}>
                                {s.hourly_rate}€/h
                              </Text>
                              <Text style={[styles.breakdownCol, styles.breakdownColTiny, styles.breakdownCellBold]}>
                                {Number(s.subtotal || 0).toFixed(2)}€
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.noBreakdownText}>
                          Aucun détail de staffing disponible.
                        </Text>
                      )}

                      {/* Reviews */}
                      {breakdown.some(s => s.review) ? (
                        <View style={styles.reviewsBox}>
                          {breakdown.filter(s => s.review).map((s, i) => (
                            <Text key={i} style={styles.reviewText}>
                              <Text style={styles.reviewAuthor}>{s.extra_name} : </Text>
                              "{s.review}"
                            </Text>
                          ))}
                        </View>
                      ) : null}
                    </ScrollView>

                    {/* Grand total */}
                    <View style={styles.detailTotalRow}>
                      <View>
                        <Text style={styles.detailTotalLabel}>TOTAL À PAYER</Text>
                        <Text style={styles.detailTotalHT}>{ht.toFixed(2)} € HT</Text>
                      </View>
                      <Text style={styles.detailTotalAmount}>
                        {totalToPay.toFixed(2)} € TTC
                      </Text>
                    </View>
                  </>
                );
              })()
            ) : null}
          </View>
        </View>
      </Modal>

      {/* ── Loading detail overlay ── */}
      {loadingDetail ? (
        <Modal animationType="fade" transparent visible>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        </Modal>
      ) : null}
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

  /* ── Invoice Detail Modal ── */
  detailBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    maxHeight: '92%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 12,
    paddingBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  detailBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
  },
  detailBackText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.orangeDark,
  },
  detailTitleWrap: {
    flex: 1,
    gap: 2,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orangeDark,
    fontFamily: serifFont,
  },
  detailSubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  detailScroll: {
    maxHeight: 400,
  },
  detailScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  detailInfoCard: {
    backgroundColor: '#FAF6F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    padding: 12,
    gap: 4,
  },
  detailInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  detailInfoMeta: {
    fontSize: 11,
    color: '#888888',
  },
  breakdownWrap: {
    borderWidth: 1,
    borderColor: '#ECDDD6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF6F4',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  breakdownRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F0EB',
  },
  breakdownCol: {
    fontSize: 10,
  },
  breakdownColExtra: {
    flex: 2.5,
  },
  breakdownColSmall: {
    flex: 2,
  },
  breakdownColTiny: {
    flex: 1.3,
    textAlign: 'right',
  },
  breakdownCellText: {
    color: '#555555',
  },
  breakdownCellBold: {
    fontWeight: '700',
    color: colors.orange,
  },
  noBreakdownText: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
    paddingVertical: 20,
  },
  reviewsBox: {
    backgroundColor: '#FAF6F4',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  reviewAuthor: {
    fontWeight: '700',
    fontStyle: 'normal',
  },
  detailTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
  },
  detailTotalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
  },
  detailTotalHT: {
    fontSize: 11,
    color: '#BBBBBB',
    marginTop: 2,
  },
  detailTotalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.orange,
    fontFamily: serifFont,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const stylesByBrand = createBrandStyles(createStyles);
