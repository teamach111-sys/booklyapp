/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : ExtraRecapGlobal
 * **Associated Route/Context**: `/extras (Tab/Modal: ExtraRecapGlobal)`
 * **Total Discovered Backend Calls**: 2
 *
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`ExtraRecapGlobal.jsx:36`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraRecapGlobal.jsx#L36) | User Action Handler (`handleConfirm`) | `handleConfirm` | `POST` | `/extra/invoices/generate` | `{ mission_ids, month, year }` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`ExtraRecapGlobal.jsx:150`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraRecapGlobal.jsx#L150) | User Action Handler (`ExtraRecapGlobal`) | `ExtraRecapGlobal` | `GET` | `/extra/completed-missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 *
 * =====================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Briefcase,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  FileText,
  Filter,
  Square,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { extraRecapGlobal as styles } from './styles';
import {
  getCompletedMissions,
  generateExtraInvoice,
} from '../../../api/extraService';

const MONTHS_FR = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const YEARS = [2024, 2025, 2026, 2027];

function formatEuro(amount) {
  return `${Number(amount || 0).toFixed(2).replace('.', ',')} €`;
}

function formatDateFr(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ExtraRecapGlobal({ onGoToInvoice }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [showGenModal, setShowGenModal] = useState(false);
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);

  const [filters, setFilters] = useState({ year: '', month: '', statut: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompletedMissions();
      setMissions(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les missions terminées.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSelected(new Set()); }, [filters]);

  const filtered = missions.filter(m => {
    if (filters.statut && m.statut_paiement !== filters.statut) return false;
    if (filters.year && m.date_debut && new Date(m.date_debut).getFullYear() !== parseInt(filters.year, 10)) return false;
    if (filters.month && m.date_debut && new Date(m.date_debut).getMonth() + 1 !== parseInt(filters.month, 10)) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(m => selected.has(m.id));
  const selectedMissions = missions.filter(m => selected.has(m.id));
  const selectedTotal = selectedMissions.reduce((acc, m) => acc + Number(m.subtotal ?? 0), 0);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(m => m.id)));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateExtraInvoice({
        mission_ids: [...selected],
        month: genMonth,
        year: genYear,
      });
      setShowGenModal(false);
      setSelected(new Set());
      Alert.alert('Succès', 'Facture générée !');
      await load();
      if (onGoToInvoice && res?.invoice_id) onGoToInvoice(res.invoice_id);
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Erreur lors de la génération.');
    } finally {
      setGenerating(false);
    }
  };

  const hasFilters = filters.year || filters.month || filters.statut;

  return (
    <View>
      {/* Page heading */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Mes missions terminées</Text>
        <Text style={extras.pageDescription}>
          {filtered.length} mission(s) · {selected.size} sélectionnée(s)
        </Text>
      </View>

      {/* Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{missions.length} à facturer</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View style={styles.filterHeaderLeft}>
            <Filter size={13} color={colors.brown} />
            <Text style={styles.filterHeaderText}>Filtres</Text>
          </View>
          {hasFilters ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setFilters({ year: '', month: '', statut: '' })}
              style={styles.clearBtn}
            >
              <X size={11} color="#888" />
              <Text style={styles.clearBtnText}>Effacer</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.filterGrid}>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Année</Text>
            <View style={styles.filterSelectWrap}>
              {['', ...YEARS].map(y => (
                <Pressable
                  key={y || 'all'}
                  accessibilityRole="button"
                  onPress={() => setFilters(p => ({ ...p, year: String(y) }))}
                  style={[styles.filterChip, filters.year === String(y) && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, filters.year === String(y) && styles.filterChipTextActive]}>
                    {y || 'Toutes'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Paiement</Text>
            <View style={styles.filterSelectWrap}>
              {[
                  { value: '', label: 'Tous' },
                  { value: 'paye', label: 'Payées' },
                  { value: 'en_attente', label: 'En attente' },
              ].map(opt => (
                <Pressable
                  key={opt.value || 'all'}
                  accessibilityRole="button"
                  onPress={() => setFilters(p => ({ ...p, statut: opt.value }))}
                  style={[styles.filterChip, filters.statut === opt.value && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, filters.statut === opt.value && styles.filterChipTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Selection action bar */}
      {selected.size > 0 ? (
        <View style={styles.selectionBar}>
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionCount}>{selected.size} sélectionnée(s)</Text>
            <Text style={styles.selectionTotal}>Total : {formatEuro(selectedTotal)}</Text>
          </View>
          <View style={styles.selectionActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelected(new Set())}
              style={styles.selectionCancelBtn}
            >
              <X size={12} color={colors.white} />
              <Text style={styles.selectionCancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowGenModal(true)}
              style={styles.selectionGenBtn}
            >
              <FileText size={13} color={colors.orange} />
              <Text style={styles.selectionGenText}>Générer</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* List */}
      {loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Chargement…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            {hasFilters ? 'Aucun résultat' : 'Aucune mission à facturer'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {hasFilters ? 'Modifiez les filtres.' : 'Vos missions terminées apparaîtront ici.'}
          </Text>
        </View>
      ) : (
        <View>
          {/* Select all */}
          <Pressable
            accessibilityRole="button"
            onPress={toggleAll}
            style={styles.selectAllRow}
          >
            {allSelected ? (
              <CheckSquare size={16} color={colors.orange} />
            ) : (
              <Square size={16} color="#ccc" />
            )}
            <Text style={styles.selectAllText}>
              {allSelected ? 'Tout désélectionner' : `Tout sélectionner (${filtered.length})`}
            </Text>
          </Pressable>

          {/* Mission cards */}
          <View style={styles.missionList}>
            {filtered.map(m => {
              const isSel = selected.has(m.id);
              const isPaid = m.statut_paiement === 'paye';
              return (
                <Pressable
                  key={m.id}
                  accessibilityRole="button"
                  onPress={() => toggleSelect(m.id)}
                  style={[styles.missionCard, isSel && styles.missionCardSelected]}
                >
                  {/* Checkbox */}
                  {isSel ? (
                    <CheckSquare size={16} color={colors.orange} />
                  ) : (
                    <Square size={16} color="#ccc" />
                  )}

                  {/* Info */}
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionName} numberOfLines={1}>
                      {m.prestation_nom || 'Mission'}
                    </Text>
                    <View style={styles.missionMetaRow}>
                      <View style={styles.missionMetaItem}>
                        <Calendar size={11} color="#888" />
                        <Text style={styles.missionMetaText}>{formatDateFr(m.date_debut)}</Text>
                      </View>
                      <View style={styles.missionMetaItem}>
                        <Clock size={11} color="#888" />
                        <Text style={styles.missionMetaText}>{m.total_hours}h</Text>
                      </View>
                      {m.prestation_type_detail ? (
                        <View style={styles.missionMetaItem}>
                          <Briefcase size={11} color="#888" />
                          <Text style={styles.missionMetaText}>{m.prestation_type_detail}</Text>
                        </View>
                      ) : null}
                    </View>
                    {m.heures_supp > 0 ? (
                      <View style={styles.suppBadge}>
                        <Text style={styles.suppBadgeText}>+{m.heures_supp}h suppl.</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Amount + status */}
                  <View style={styles.missionRight}>
                    <Text style={styles.missionAmount}>
                      {formatEuro(m.subtotal)}
                    </Text>
                    <Text style={styles.missionRate}>
                      {m.total_hours}h × {formatEuro(m.taux_horaire)}
                    </Text>
                    <View style={[styles.paiementBadge, isPaid ? styles.paiementBadgePaid : styles.paiementBadgePending]}>
                      <Text style={[styles.paiementBadgeText, isPaid ? styles.paiementBadgeTextPaid : styles.paiementBadgeTextPending]}>
                        {isPaid ? 'Payée' : 'En attente'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Generate modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setShowGenModal(false)}
        transparent
        visible={showGenModal}
      >
        <Pressable
          accessibilityLabel="Fermer"
          accessibilityRole="button"
          onPress={() => setShowGenModal(false)}
          style={styles.modalBackdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={e => e.stopPropagation()}
            style={styles.modalSheet}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Générer ma facture</Text>
                <Text style={styles.modalSub}>
                  {selected.size} mission(s) sélectionnée(s)
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setShowGenModal(false)}
                style={styles.modalClose}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.modalScroll}
            >
              {/* Period picker */}
              <Text style={styles.modalSectionLabel}>Période de facturation</Text>
              <View style={styles.modalPeriodRow}>
                <View style={styles.modalPeriodField}>
                  <Text style={styles.modalPeriodLabel}>Mois</Text>
                  <View style={styles.modalChipsRow}>
                    {MONTHS_FR.slice(1).map((m, i) => (
                      <Pressable
                        key={i + 1}
                        accessibilityRole="button"
                        onPress={() => setGenMonth(i + 1)}
                        style={[styles.modalChip, genMonth === i + 1 && styles.modalChipActive]}
                      >
                        <Text style={[styles.modalChipText, genMonth === i + 1 && styles.modalChipTextActive]}>
                          {m.slice(0, 4)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.modalPeriodRow}>
                <View style={styles.modalPeriodField}>
                  <Text style={styles.modalPeriodLabel}>Année</Text>
                  <View style={styles.modalChipsRow}>
                    {YEARS.map(y => (
                      <Pressable
                        key={y}
                        accessibilityRole="button"
                        onPress={() => setGenYear(y)}
                        style={[styles.modalChip, genYear === y && styles.modalChipActive]}
                      >
                        <Text style={[styles.modalChipText, genYear === y && styles.modalChipTextActive]}>
                          {y}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Mission list */}
              <Text style={styles.modalSectionLabel}>Missions incluses</Text>
              <View style={styles.modalMissionList}>
                {selectedMissions.map(m => (
                  <View key={m.id} style={styles.modalMissionItem}>
                    <Briefcase size={12} color={colors.brown} />
                    <View style={styles.modalMissionInfo}>
                      <Text style={styles.modalMissionName} numberOfLines={1}>
                        {m.prestation_nom}
                      </Text>
                      <Text style={styles.modalMissionDate}>
                        {formatDateFr(m.date_debut)} · {m.total_hours}h
                      </Text>
                    </View>
                    <Text style={styles.modalMissionAmount}>
                      {formatEuro(m.subtotal)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Estimated total */}
              <View style={styles.modalTotalRow}>
                <Text style={styles.modalTotalLabel}>Total estimé</Text>
                <Text style={styles.modalTotalValue}>
                  {formatEuro(selectedTotal)}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={generating}
                  onPress={() => setShowGenModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={generating}
                  onPress={handleGenerate}
                  style={[styles.modalConfirmBtn, generating && { opacity: 0.6 }]}
                >
                  <FileText size={13} color={colors.white} />
                  <Text style={styles.modalConfirmText}>
                    {generating ? 'Génération…' : 'Générer la facture'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
