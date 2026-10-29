/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : ExtraFactures
 * **Associated Route/Context**: `/extras (Tab/Modal: ExtraFactures)`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`ExtraFactures.jsx:160`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L160) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/invoices/' + invoiceId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`ExtraFactures.jsx:305`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L305) | User Action Handler (`ExtraFactures`) | `ExtraFactures` | `GET` | `/extra/invoices` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`ExtraFactures.jsx:38`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraFactures.jsx#L38) | User Action Handler (`svgToBase64`) | `svgToBase64` | `GET` | `url` | `None` | Public (No auth) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
import { useState, useEffect, useCallback } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { CircleCheck, FileText, Search, Wallet } from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { extraFactures as styles } from './styles';
import { getExtraInvoices } from '../../../api/extraService';

// Port of the web "extra invoices" page
// (staffly-frontend/src/pages/extras/components/Factures.jsx): statistics cards,
// a tab + search toolbar and the invoice list (empty until prestations are
// invoiced). The cards and tabs drive the same status filter.
const TABS = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'a_recevoir', label: 'À recevoir' },
  { key: 'en_retard', label: 'En retard' },
  { key: 'payees', label: 'Payées' },
];

function formatEuro(amount) {
  return `${Number(amount || 0).toFixed(2).replace('.', ',')}\u00A0€`;
}

export default function ExtraFactures() {
  const [filter, setFilter] = useState('toutes');
  const [query, setQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExtraInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInvoices(); }, [loadInvoices]);

  const year = new Date().getFullYear();
  const pendingInvoices = invoices.filter(
    invoice => invoice.status === 'a_recevoir' || invoice.status === 'en_retard',
  );
  const paidThisYear = invoices.filter(
    invoice =>
      invoice.status === 'payee' &&
      new Date(invoice.paid_at || invoice.updated_at || invoice.created_at).getFullYear() === year,
  );
  const pendingTotal = pendingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0,
  );
  const paidTotal = paidThisYear.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0,
  );

  return (
    <View>
      {/* Page heading, same block as the other extras pages */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Mes factures</Text>
        <Text style={extras.pageDescription}>
          Suivez les montants à recevoir, en retard et payés.
        </Text>
      </View>

      {/* Statistics cards */}
      <View style={styles.statsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: filter === 'a_recevoir' }}
          onPress={() => setFilter('a_recevoir')}
          style={[
            styles.statCard,
            filter === 'a_recevoir' && styles.statCardBlueActive,
          ]}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconTile, styles.statIconTileBlue]}>
              <Wallet size={15} color="#1565C0" />
            </View>
            <Text style={styles.statLabel}>À recevoir</Text>
          </View>
          <Text style={[styles.statValue, styles.statValueBlue]}>
            {formatEuro(pendingTotal)}
          </Text>
          <Text style={styles.statSub}>
            {pendingInvoices.length} facture(s) en attente
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: filter === 'payees' }}
          onPress={() => setFilter('payees')}
          style={[
            styles.statCard,
            filter === 'payees' && styles.statCardGreenActive,
          ]}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconTile, styles.statIconTileGreen]}>
              <CircleCheck size={15} color="#15803D" />
            </View>
            <Text style={styles.statLabel}>Reçu en {year}</Text>
          </View>
          <Text style={[styles.statValue, styles.statValueGreen]}>
            {formatEuro(paidTotal)}
          </Text>
        </Pressable>

        <View style={styles.statCard}>
          <View style={styles.statTop}>
            <View style={[styles.statIconTile, styles.statIconTileOrange]}>
              <FileText size={15} color={colors.orange} />
            </View>
            <Text style={styles.statLabel}>Factures</Text>
          </View>
          <Text style={[styles.statValue, styles.statValueOrange]}>
            {invoices.length}
          </Text>
          <Text style={styles.statSub}>au total</Text>
        </View>
      </View>

      {/* Tabs + search */}
      <View style={styles.toolbar}>
        <View style={styles.tabs}>
          {TABS.map(tab => {
            const active = filter === tab.key;
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setFilter(tab.key)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.searchBox}>
          <Search size={13} color="#bbb" />
          <TextInput
            onChangeText={setQuery}
            placeholder="Numéro, client…"
            placeholderTextColor="#bbb"
            style={styles.searchInput}
            value={query}
          />
        </View>
      </View>

      {/* Invoice list / empty state */}
      {loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Chargement…</Text>
        </View>
      ) : (() => {
        const filtered = invoices.filter(invoice => {
          if (filter === 'toutes') return true;
          if (filter === 'en_retard') return invoice.status === 'en_retard';
          if (filter === 'a_recevoir') return invoice.status === 'a_recevoir' || invoice.status === 'en_retard';
          if (filter === 'payees') return invoice.status === 'payee';
          return true;
        }).filter(invoice => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return (
            (invoice.number || invoice.invoice_number || '').toLowerCase().includes(q) ||
            (invoice.client_name || invoice.space_name || '').toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          return (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconTile}>
                <FileText size={22} color={colors.orange} />
              </View>
              <Text style={styles.emptyTitle}>Aucune facture pour le moment</Text>
              <Text style={styles.emptySubtitle}>
                Vos factures apparaissent ici dès que vos prestations sont facturées.
              </Text>
            </View>
          );
        }

        return (
          <View style={styles.invoiceList}>
            {filtered.map(invoice => {
              const status = invoice.status || 'a_recevoir';
              const statusLabel = {
                a_recevoir: 'À recevoir',
                en_retard: 'En retard',
                payee: 'Payée',
              }[status] || status;
              const statusColor = {
                a_recevoir: '#1565C0',
                en_retard: '#DC2626',
                payee: '#15803D',
              }[status] || '#888';
              return (
                <View key={invoice.id} style={styles.invoiceCard}>
                  <View style={styles.invoiceLeft}>
                    <View style={[styles.invoiceIconTile, { backgroundColor: statusColor + '15' }]}>
                      <FileText size={14} color={statusColor} />
                    </View>
                    <View style={styles.invoiceInfo}>
                      <Text style={styles.invoiceNumber}>
                        {invoice.number || invoice.invoice_number || `#${invoice.id}`}
                      </Text>
                      <Text style={styles.invoiceClient}>
                        {invoice.client_name || invoice.space_name || '—'}
                      </Text>
                      <Text style={styles.invoiceDate}>
                        {invoice.paid_at || invoice.updated_at || invoice.created_at
                          ? new Date(invoice.paid_at || invoice.updated_at || invoice.created_at).toLocaleDateString('fr-FR')
                          : '—'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.invoiceRight}>
                    <Text style={[styles.invoiceAmount, { color: statusColor }]}>
                      {formatEuro(invoice.amount)}
                    </Text>
                    <View style={[styles.invoiceBadge, { backgroundColor: statusColor + '15' }]}>
                      <Text style={[styles.invoiceBadgeText, { color: statusColor }]}>
                        {statusLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })()}
    </View>
  );
}
