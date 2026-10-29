/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : MissionList
 * **Associated Route/Context**: `/client (Tab/Modal: MissionList)`  
 * **Total Discovered Backend Calls**: 9
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`MissionList.jsx:248`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L248) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/'+m.id+'/files` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:252`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L252) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/client/missions/'+m.id+'/retour` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:774`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L774) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/missions/'+mission.id+'/finish` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:805`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L805) | User Action Handler (`handleEvaluate`) | `handleEvaluate` | `POST` | `/missions/'+mission.id+'/evaluation` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:987`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L987) | User Action Handler (`MissionList`) | `MissionList` | `GET` | `/modification-conversations/unread` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:998`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L998) | Background Polling Interval (`poll`) | `poll` | `GET` | `/modification-conversations/unread` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:1229`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L1229) | Immediate execution | `Block / Inline` | `GET` | `/modification-conversations/unread` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionList.jsx:1046`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L1046) | Delete / Cancel Button (`handleCancelConfirm`) | `handleCancelConfirm` | `POST` | `/missions/' + id + '/cancel` | `cancelModal.id, cancelReason` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionList.jsx:621`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionList.jsx#L621) | Document Download / Preview (`Block / Inline`) | `Block / Inline` | `GET` | `/api/files/extra-doc/... (`/files/mission/${f.id}`)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |
 * 
 * =====================================================================
 */
/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : MissionForm
 * **Associated Route/Context**: `/client (Tab/Modal: MissionForm)`  
 * **Total Discovered Backend Calls**: 10
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`MissionForm.jsx:279`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L279) | Immediate execution | `Block / Inline` | `GET` | `/missions/${editMissionId}/files` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`MissionForm.jsx:489`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L489) | Delete / Cancel Button (`removeUploaded`) | `removeUploaded` | `DELETE` | `/missions/${draftIdRef.current}/files/${fileId}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`MissionForm.jsx:551`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L551) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/missions/' + missionId + '/nominate` | `{ nominations: buildNominationsPayload(form)` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`MissionForm.jsx:499`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L499) | Data Fetch / Revalidation (`uploadPendingFiles`) | `uploadPendingFiles` | `POST` | `${BASE_URL}/api/missions/${missionId}/files` | `None` | Bearer token (Authorization header) | Confirmed |
 * | [`MissionForm.jsx:199`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L199) | Data Fetch / Revalidation (`load`) | `load` | `GET` | `/client/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionForm.jsx:199`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L199) | Data Fetch / Revalidation (`load`) | `load` | `GET` | `/employee/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionForm.jsx:197`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L197) | Data Fetch / Revalidation (`load`) | `load` | `GET` | `/missions/form-options' + (siteId ? `?site_id=${siteId}` : ` | `selectedSpace.id` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionForm.jsx:388`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L388) | Periodic Background Polling Timer (`setInterval`) | `setInterval callback` | `PUT` | `/missions/update/' + missionId` | `draftIdRef.current, payload` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionForm.jsx:542`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L542) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/missions/update/' + missionId` | `missionId, payload` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * | [`MissionForm.jsx:1002`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/MissionForm.jsx#L1002) | Document Download / Preview (`Block / Inline`) | `Block / Inline` | `GET` | `/api/files/extra-doc/... (`/files/mission/${f.id}`)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |
 * 
 * =====================================================================
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import {
  Archive,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleAlert,
  Clock,
  Coffee,
  Copy,
  Edit2,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  Paperclip,
  Plus,
  Save,
  Send,
  Star,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react-native';
import { prestationsStylesByBrand } from './styles';
import { useClientTheme } from '../theme/ClientThemeContext';
import { useAuth } from '../../../context/AuthContext';
import BottomSheet from './BottomSheet';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import clientService from '../../../api/clientService';
import { API_BASE_URL } from '../../../config/env';

/* ── Constants (mirrors staffly-frontend MissionList/MissionForm) ── */

const STATUS_MAP = {
  'Waiting Approval': { label: 'En attente admin', color: '#F57F17', bg: '#FFF8E1' },
  'Approved': { label: 'Approuvée', color: '#2E7D32', bg: '#EAF5EA' },
  'Draft': { label: 'Brouillon', color: '#888888', bg: '#F5F5F5' },
  'Not Approved': { label: 'Non approuvée', color: '#9B1C1C', bg: '#FDF0F0' },
  'Unknown': { label: 'Inconnu', color: '#888888', bg: '#F5F5F5' },
};

const TENUE_OPTIONS = [
  'Chemise blanche',
  'Pantalon noir',
  'Chaussures de ville noires',
  'Tablier fourni',
  'Veste de cuisine blanche',
];

const PRESTATION_DETAIL_OPTIONS = [
  { code: 'PDJ', label: 'PDJ — Petit Déjeuner' },
  { code: 'CKDEJ', label: 'CKDEJ — Cocktail Déjeunatoire' },
  { code: 'AW', label: 'AW — After Work' },
  { code: 'CKDIN', label: 'CKDIN — Cocktail Dînatoire' },
  { code: 'DTD', label: 'DTD — Day to day' },
  { code: 'MK', label: 'MK — Micro Kitchen' },
  { code: 'PLG', label: 'PLG — Plonge' },
  { code: 'CDC', label: 'CDC — Chef de cuisine' },
  { code: 'CDP', label: 'CDP — Chef de partie' },
  { code: 'PG', label: 'PG — Pause gourmande' },
];

const PRESTATION_DETAIL_OPTIONS_OTHER = [
  { code: 'EVENT', label: 'EVENT - Event' },
  { code: 'CKDEJ', label: 'CKDEJ — Cocktail Déjeunatoire' },
  { code: 'CKDIN', label: 'CKDIN — Cocktail Dînatoire' },
  { code: 'AUTRE', label: 'AUTRE — Autre' },
];

let uidCounter = 0;
const genUid = () => `uid_${Date.now()}_${uidCounter++}`;

const emptyStaffReq = () => ({
  uid: genUid(),
  qualification_code: '',
  count: 1,
  heure_debut: '',
  heure_fin: '',
  coupure_debut: '',
  coupure_fin: '',
  has_coupure: false,
});

const emptyBlock = () => ({
  uid: genUid(),
  prestation_type_detail: '',
  heure_debut_client: '',
  heure_fin_client: '',
  staff_requirements: [emptyStaffReq()],
});

/* ── Helpers ── */

// "Chemise blanche + Pantalon noir | précision" -> { items, note }
function parseTenue(str) {
  if (!str) return { tenue_items: [], tenue_note: '' };
  const [head, ...rest] = str.split(' | ');
  const items = [];
  const extra = [];
  head
    .split('+')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(part => {
      const opt = TENUE_OPTIONS.find(o => o.toLowerCase() === part.toLowerCase());
      if (opt) items.push(opt);
      else extra.push(part);
    });
  return {
    tenue_items: items,
    tenue_note: [extra.join(' + '), ...rest].filter(Boolean).join(' | '),
  };
}

function buildTenue(items = [], note = '') {
  return [
    TENUE_OPTIONS.filter(o => items.includes(o)).join(' + '),
    String(note || '').trim(),
  ]
    .filter(Boolean)
    .join(' | ');
}

// Extracts a leading YYYY-MM-DD from any backend date string
// ("2026-10-24 22:15:00", "2026-10-24T22:15", "24/10/2026").
function isoDate(value) {
  if (!value) return '';
  const s = String(value);
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  if (iso) return iso[1];
  const fr = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  return fr ? `${fr[3]}-${fr[2]}-${fr[1]}` : '';
}

// "2026-10-24 22:15:00" -> { date: '2026-10-24', time: '22:15' }
function splitDateTime(value) {
  if (!value) return { date: '', time: '' };
  const s = String(value);
  const time = /(\d{2}:\d{2})/.exec(s);
  return { date: isoDate(s), time: time ? time[1] : '' };
}

function parseStart(m) {
  const raw = m?.date_debut_raw;
  if (raw) return new Date(String(raw).replace(' ', 'T'));
  if (m?.date) return new Date(String(m.date).split('/').reverse().join('-'));
  return null;
}

// Falls back to the end of the start day when the payload has no date_fin
// (the list endpoint omits it; the detail endpoint returns it).
function parseEnd(m) {
  if (m?.date_fin) {
    const fin = new Date(String(m.date_fin).replace(' ', 'T'));
    if (!Number.isNaN(fin.getTime())) return fin;
  }
  const d = parseStart(m);
  if (!d || Number.isNaN(d.getTime())) return null;
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
}

function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function fmtLongDate(value) {
  if (!value) return '—';
  const d = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Screen ── */

export default function Prestations({ activeSite }) {
  const { partner, colors } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];

  const [view, setView] = useState('LIST');
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailMission, setDetailMission] = useState(null);
  const [formTarget, setFormTarget] = useState(null); // { mission, mode }
  const [tab, setTab] = useState('ajoutees');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { mission, mode }
  const [convMission, setConvMission] = useState(null);

  const loadMissions = useCallback(async () => {
    if (!activeSite?.id) {
      setMissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getMissionsForSpace(activeSite.id);
      setMissions(Array.isArray(data) ? data : data?.missions || []);
    } catch (err) {
      console.error('Failed to load missions:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSite?.id]);

  const loadUnread = useCallback(async () => {
    try {
      const data = await clientService.getModificationConversationsUnread();
      setUnreadCounts(data && typeof data === 'object' ? data : {});
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  useEffect(() => {
    if (view === 'LIST') loadUnread();
  }, [view, loadUnread]);

  const runAction = async (fn, errorMessage) => {
    try {
      await fn();
      await loadMissions();
    } catch (err) {
      Alert.alert('Erreur', err?.error || err?.message || errorMessage);
    }
  };

  const handleNew = () => {
    setFormTarget({ mission: null, mode: 'new' });
    setView('FORM');
  };
  const handleEdit = mission => {
    setFormTarget({ mission, mode: 'edit' });
    setView('FORM');
  };
  const handleDuplicate = mission => {
    setFormTarget({ mission, mode: 'duplicate' });
    setView('FORM');
  };
  const handleView = mission => {
    setDetailMission(mission);
    setView('DETAIL');
  };
  const backToList = () => {
    setView('LIST');
    setDetailMission(null);
    setFormTarget(null);
  };

  const openCancel = mission => {
    setCancelReason('');
    setCancelTarget(mission);
  };
  const confirmCancel = async () => {
    const reason = cancelReason.trim();
    if (!reason) {
      Alert.alert('Motif requis', "Merci d'indiquer le motif d'annulation.");
      return;
    }
    const id = cancelTarget?.id;
    setCancelTarget(null);
    await runAction(() => clientService.cancelMission(id, reason), "Impossible d'annuler la prestation.");
  };

  const handleDelete = mission => {
    Alert.alert(
      'Supprimer le brouillon',
      'Cette prestation sera définitivement supprimée.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => runAction(() => clientService.deleteMission(mission.id), 'Impossible de supprimer.'),
        },
      ],
    );
  };

  const handleArchive = mission =>
    runAction(() => clientService.archiveMission(mission.id), "Impossible d'archiver.");

  const handleMessage = mission => {
    setUnreadCounts(prev => ({ ...prev, [mission.id]: 0 }));
    setConvMission(mission);
  };

  const openFeedback = (mission, mode) => setFeedbackTarget({ mission, mode });

  if (!activeSite) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <MapPin size={22} color={colors.orange} />
        </View>
        <Text style={styles.emptyTitle}>Aucun espace sélectionné</Text>
        <Text style={styles.emptySub}>Sélectionnez un espace pour gérer les prestations.</Text>
      </View>
    );
  }

  /* ── Buckets (mirrors staffly-frontend MissionList tab logic) ── */
  const now = new Date();
  const notArchived = missions.filter(m => !m.client_archived);
  const isDatePassed = m => {
    const end = parseEnd(m);
    return !!end && end < now;
  };

  const matchFilters = m => {
    const d = parseStart(m);
    if (fromDate && d && d < new Date(`${fromDate}T00:00`)) return false;
    if (toDate && d && d > new Date(`${toDate}T23:59`)) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${m.nom || m.prestation_nom || ''}`.toLowerCase().includes(q)) return false;
    return true;
  };

  const ajoutees = notArchived.filter(m => ['Draft', 'Waiting Approval'].includes(m.validation_admin));
  const avenir = notArchived.filter(
    m => m.validation_admin === 'Approved' && parseStart(m) && parseStart(m) > now,
  );
  const enCours = notArchived.filter(
    m =>
      m.validation_admin === 'Approved' &&
      parseStart(m) &&
      parseStart(m) <= now &&
      parseEnd(m) &&
      parseEnd(m) >= now &&
      m.etat_mission !== 'Terminée' &&
      m.etat_mission !== 'Annulée',
  );
  const passees = notArchived
    .filter(
      m =>
        !['Draft', 'Waiting Approval'].includes(m.validation_admin) &&
        (m.etat_mission === 'Terminée' || isDatePassed(m)),
    )
    .sort((a, b) => (parseStart(b) || 0) - (parseStart(a) || 0));

  const tabsConfig = [
    { key: 'ajoutees', label: 'Prestations ajoutées', badge: '#F57F17', data: ajoutees.filter(matchFilters) },
    { key: 'avenir', label: 'À venir', badge: '#1565C0', data: avenir.filter(matchFilters) },
    { key: 'encours', label: 'En cours', badge: '#15803D', data: enCours.filter(matchFilters) },
    { key: 'passees', label: 'Passées', badge: '#888888', data: passees.filter(matchFilters) },
    { key: 'toutes', label: 'Toutes', badge: colors.orange, data: notArchived.filter(matchFilters) },
  ];

  const hasFilters = !!(fromDate || toDate || search);

  const cardActions = {
    onView: handleView,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onCancel: openCancel,
    onFinish: m => openFeedback(m, 'finish'),
    onEvaluate: m => openFeedback(m, 'evaluate'),
    onArchive: handleArchive,
    onMessage: handleMessage,
  };

  return (
    <View style={styles.section}>
      {view === 'LIST' && (
        <MissionList
          siteName={activeSite.name || activeSite.city}
          totalCount={notArchived.length}
          tabsConfig={tabsConfig}
          tab={tab}
          onTabChange={setTab}
          pendingCount={ajoutees.length}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          hasFilters={hasFilters}
          onResetFilters={() => {
            setFromDate('');
            setToDate('');
            setSearch('');
          }}
          onRefresh={loadMissions}
          onNew={handleNew}
          unreadCounts={unreadCounts}
          actions={cardActions}
          styles={styles}
          colors={colors}
        />
      )}

      {view === 'DETAIL' && (
        <MissionDetailView
          mission={detailMission}
          onBack={backToList}
          onEdit={handleEdit}
          styles={styles}
          colors={colors}
        />
      )}

      {view === 'FORM' && (
        <MissionForm
          mission={formTarget?.mission}
          mode={formTarget?.mode}
          activeSite={activeSite}
          onBack={backToList}
          onSaved={() => {
            backToList();
            loadMissions();
          }}
          styles={styles}
          colors={colors}
        />
      )}

      <CancelSheet
        target={cancelTarget}
        reason={cancelReason}
        onChangeReason={setCancelReason}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        styles={styles}
      />

      <FeedbackSheet
        target={feedbackTarget}
        onClose={() => setFeedbackTarget(null)}
        onDone={() => {
          setFeedbackTarget(null);
          loadMissions();
        }}
        styles={styles}
        colors={colors}
      />

      <ConversationSheet
        mission={convMission}
        onClose={() => {
          setConvMission(null);
          loadUnread();
        }}
        styles={styles}
        colors={colors}
      />
    </View>
  );
}

/* ══════════════════════════════════════════════
   LIST
══════════════════════════════════════════════ */

function MissionList({
  siteName,
  totalCount,
  tabsConfig,
  tab,
  onTabChange,
  pendingCount,
  loading,
  search,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  hasFilters,
  onResetFilters,
  onRefresh,
  onNew,
  unreadCounts,
  actions,
  styles,
  colors,
}) {
  const current = tabsConfig.find(t => t.key === tab) || tabsConfig[0];
  const list = current?.data || [];

  return (
    <View>
      <View style={styles.listHeader}>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.pageTitle} numberOfLines={1}>Prestations — {siteName}</Text>
          <Text style={styles.pageSubtitle}>{totalCount} prestation(s)</Text>
        </View>
        <Pressable onPress={onNew} style={styles.newButton}>
          <Plus size={14} color={colors.white} />
          <Text style={styles.newButtonText}>Nouvelle prestation</Text>
        </Pressable>
      </View>

      {pendingCount > 0 && tab !== 'ajoutees' ? (
        <View style={styles.banner}>
          <CircleAlert size={18} color="#F57F17" />
          <View style={styles.bannerBody}>
            <Text style={styles.bannerTitle}>
              {pendingCount} prestation{pendingCount > 1 ? 's' : ''} ajoutée{pendingCount > 1 ? 's' : ''} en attente de validation
            </Text>
            <Text style={styles.bannerSub}>En attente de validation par l'administration Bookly.</Text>
          </View>
          <Pressable onPress={() => onTabChange('ajoutees')} style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Voir →</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={styles.tabs}
      >
        {tabsConfig.map(t => {
          const selected = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => onTabChange(t.key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text
                numberOfLines={1}
                style={[styles.tabText, selected && styles.tabTextSelected]}
              >
                {t.label}
              </Text>
              {t.data.length > 0 ? (
                <Text
                  style={[
                    styles.tabBadge,
                    { backgroundColor: selected ? t.badge : '#BBB' },
                  ]}
                >
                  {t.data.length}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.filtersBar}>
        <DatePicker
          value={fromDate}
          onChange={onFromDateChange}
          placeholder="Depuis"
          style={styles.filterInput}
          colors={colors}
          allowClear
        />
        <DatePicker
          value={toDate}
          onChange={onToDateChange}
          placeholder="Jusqu'au"
          style={styles.filterInput}
          colors={colors}
          allowClear
        />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Rechercher une prestation..."
          placeholderTextColor="#AAA"
          style={styles.filterSearch}
        />
        {hasFilters ? (
          <Pressable onPress={onResetFilters} style={styles.resetButton}>
            <X size={11} color="#888" />
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onRefresh} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Actualiser</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.orange} style={{ marginTop: 24, marginBottom: 24 }} />
      ) : list.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <FileText size={22} color={colors.orange} />
          </View>
          <Text style={styles.emptyTitle}>Aucune prestation dans cet onglet</Text>
          {tab === 'ajoutees' ? (
            <Text style={styles.emptySub}>
              Cliquez sur « Nouvelle prestation » pour en créer une.
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.missionList}>
          {list.map(m => (
            <MissionCard
              key={m.id}
              m={m}
              unread={unreadCounts?.[m.id] || 0}
              {...actions}
              styles={styles}
              colors={colors}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function MissionCard({
  m,
  unread,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onCancel,
  onFinish,
  onEvaluate,
  onArchive,
  onMessage,
  styles,
  colors,
}) {
  const statusStyle = STATUS_MAP[m.validation_admin] || STATUS_MAP['Unknown'];
  const isDraft = m.validation_admin === 'Draft';
  const isWaiting = m.validation_admin === 'Waiting Approval';
  const isCancelled = m.etat_mission === 'Annulée';
  const isFinished = m.etat_mission === 'Terminée';
  const isArchived = !!m.client_archived;
  const start = parseStart(m);
  const isPassed = !!start && start < new Date();

  const canFinish = isPassed && m.validation_admin === 'Approved' && !isFinished && !isCancelled;
  const canEvaluate = isPassed && m.validation_admin === 'Approved' && !isCancelled && !isFinished;
  const canEdit =
    (isDraft || isWaiting || m.validation_admin === 'Approved') && !isFinished && !isCancelled && !isPassed;
  const canCancel = !isCancelled && !isFinished && !isArchived;

  return (
    <View
      style={[
        styles.missionCard,
        {
          borderColor: isDraft || isWaiting ? '#FDE8CC' : '#ECDDD6',
          opacity: isArchived ? 0.65 : 1,
        },
      ]}
    >
      <View style={styles.missionMain}>
        <View style={styles.missionTitleRow}>
          <Text style={styles.missionTitle} numberOfLines={2}>
            {m.nom || m.prestation_nom}
          </Text>
          {isArchived ? <Text style={styles.archivedBadge}>Archivée</Text> : null}
          {m.total_ht != null ? (
            <View style={styles.missionPriceBlock}>
              <Text style={styles.missionPrice}>{Number(m.total_ht).toFixed(2)} €</Text>
              <Text style={styles.missionPriceCaption}>HT / prestation</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.missionMeta}>
          <View style={[styles.missionStatus, { backgroundColor: statusStyle.bg }]}>
            <Text style={{ color: statusStyle.color, fontSize: 10, fontWeight: '700' }}>
              {statusStyle.label}
            </Text>
          </View>
          {m.date ? (
            <View style={styles.metaItem}>
              <CalendarDays size={11} color="#888" />
              <Text style={styles.metaText}>{m.date}</Text>
            </View>
          ) : null}
          {m.heure ? (
            <View style={styles.metaItem}>
              <Clock size={11} color="#888" />
              <Text style={styles.metaText}>{m.heure}</Text>
            </View>
          ) : null}
          {m.staff ? (
            <View style={styles.metaItem}>
              <Users size={11} color="#888" />
              <Text style={styles.metaText}>{m.staff}</Text>
            </View>
          ) : null}
          {m.type_id ? (
            <View style={styles.metaItem}>
              <Tag size={11} color="#888" />
              <Text style={styles.metaText}>{m.type_id}</Text>
            </View>
          ) : null}
          {m.adresse_exacte ? (
            <View style={styles.metaItem}>
              <MapPin size={11} color="#888" />
              <Text style={styles.metaText}>
                {String(m.adresse_exacte).slice(0, 40)}
                {String(m.adresse_exacte).length > 40 ? '...' : ''}
              </Text>
            </View>
          ) : null}
        </View>

        {isCancelled && m.cancel_reason ? (
          <View style={styles.cancelReasonRow}>
            <CircleAlert size={11} color="#9B1C1C" />
            <Text style={styles.cancelReasonText}>Motif : {m.cancel_reason}</Text>
          </View>
        ) : null}

        {(m.created_by_name ||
          (m.updated_by_name && m.updated_by_name.trim() !== (m.created_by_name || '').trim())) && (
          <View style={styles.posterStack}>
            {m.created_by_name ? (
              <View style={styles.missionPoster}>
                <User size={10} color="#BBA695" />
                <Text style={styles.missionPosterText}>Posté par : {m.created_by_name}</Text>
              </View>
            ) : null}
            {m.updated_by_name && m.updated_by_name.trim() !== (m.created_by_name || '').trim() ? (
              <View style={styles.missionPoster}>
                <Edit2 size={10} color="#BBA695" />
                <Text style={styles.missionPosterText}>Modifié par : {m.updated_by_name}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.missionActions}>
        <Pressable
          onPress={() => onMessage(m)}
          style={[styles.cardIconButton, styles.msgButton]}
          accessibilityLabel="Message"
        >
          <View style={styles.cardIconGlyph}>
            <MessageSquare size={12} color="#1565C0" />
          </View>
          {unread > 0 ? <Text style={styles.msgBadge}>{unread}</Text> : null}
        </Pressable>

        <Pressable onPress={() => onView(m)} style={[styles.cardIconButton, styles.viewButton]}>
          <View style={styles.cardIconGlyph}>
            <Eye size={12} color={colors.orangeDark} />
          </View>
          <Text style={[styles.cardIconButtonText, styles.viewButtonText]}>Voir</Text>
        </Pressable>

        <Pressable
          onPress={() => onDuplicate(m)}
          style={[styles.cardIconButton, styles.dupButton]}
          accessibilityLabel="Dupliquer"
        >
          <View style={styles.cardIconGlyph}>
            <Copy size={12} color="#555" />
          </View>
          <Text style={[styles.cardIconButtonText, styles.dupButtonText]}>Dupliquer</Text>
        </Pressable>

        {canEvaluate ? (
          <Pressable onPress={() => onEvaluate(m)} style={[styles.cardIconButton, styles.evalButton]}>
            <View style={styles.cardIconGlyph}>
              <Star size={12} color="#B45309" />
            </View>
            <Text style={[styles.cardIconButtonText, styles.evalButtonText]}>Évaluer</Text>
          </Pressable>
        ) : null}

        {canFinish ? (
          <Pressable onPress={() => onFinish(m)} style={[styles.cardIconButton, styles.finishButton]}>
            <View style={styles.cardIconGlyph}>
              <Check size={12} color="#FFF" />
            </View>
            <Text style={[styles.cardIconButtonText, styles.finishButtonText]}>Terminer</Text>
          </Pressable>
        ) : null}

        {canEdit ? (
          <Pressable onPress={() => onEdit(m)} style={[styles.cardIconButton, styles.editButton]}>
            <View style={styles.cardIconGlyph}>
              <Edit2 size={12} color="#555" />
            </View>
            <Text style={[styles.cardIconButtonText, styles.editButtonText]}>Modifier</Text>
          </Pressable>
        ) : null}

        {isDraft ? (
          <Pressable onPress={() => onDelete(m)} style={[styles.cardIconButton, styles.cancelButton]}>
            <View style={styles.cardIconGlyph}>
              <Trash2 size={12} color="#9B1C1C" />
            </View>
          </Pressable>
        ) : null}

        {canCancel && !isDraft ? (
          <Pressable onPress={() => onCancel(m)} style={[styles.cardIconButton, styles.cancelButton]}>
            <View style={styles.cardIconGlyph}>
              <X size={12} color="#9B1C1C" />
            </View>
          </Pressable>
        ) : null}

        {isCancelled && !isArchived ? (
          <Pressable onPress={() => onArchive(m)} style={[styles.cardIconButton, styles.archiveButton]}>
            <View style={styles.cardIconGlyph}>
              <Archive size={12} color="#888" />
            </View>
            <Text style={[styles.cardIconButtonText, styles.archiveButtonText]}>Archiver</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   DETAIL
══════════════════════════════════════════════ */

function MissionDetailView({ mission, onBack, onEdit, styles, colors }) {
  const [details, setDetails] = useState(mission);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mission?.id) return;
    let alive = true;
    setLoading(true);
    clientService
      .getMissionDetails(mission.id)
      .then(data => {
        if (!alive) return;
        const src = data?.mission || data;
        if (src) setDetails({ ...mission, ...src, _extras: data?.extras });
      })
      .catch(err => console.error('Failed to load mission details:', err))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [mission]);

  const m = details || mission;
  const statusStyle = STATUS_MAP[m.validation_admin] || STATUS_MAP['Unknown'];

  const row = (label, val) =>
    val ? (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{val}</Text>
      </View>
    ) : null;

  const blocks = m.event_blocks?.length
    ? m.event_blocks
    : m.staff_requirements?.length
      ? [{ prestation_type_detail: '', staff_requirements: m.staff_requirements }]
      : [];

  return (
    <View>
      <View style={styles.detailTop}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={16} color="#888" />
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
        <View style={styles.detailHead}>
          <Text style={styles.detailTitle}>{m.prestation_nom || m.nom}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text style={{ color: statusStyle.color, fontSize: 10, fontWeight: '700' }}>
                {statusStyle.label}
              </Text>
            </View>
            {m.type_id ? (
              <View style={[styles.badge, styles.badgeType]}>
                <Text style={{ color: colors.orange, fontSize: 10, fontWeight: '700' }}>{m.type_id}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {loading ? <ActivityIndicator color={colors.orange} style={{ marginBottom: 16 }} /> : null}

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Informations générales</Text>
          </View>
          {row('Nom', m.prestation_nom || m.nom)}
          {row('Adresse', m.adresse_exacte)}
          {row('Début', m.date_debut ? `${fmtLongDate(m.date_debut)} à ${splitDateTime(m.date_debut).time}` : null)}
          {row('Fin', m.date_fin ? `${fmtLongDate(m.date_fin)} à ${splitDateTime(m.date_fin).time}` : null)}
          {row('Type mission', m.type_id)}
          {m.tenue_exigee ? row('Tenue', m.tenue_exigee) : null}
          {m.commentaires ? (
            <View style={styles.commentBox}>
              <MessageSquare size={12} color={colors.orangeDark} style={styles.commentIcon} />
              <Text style={styles.commentText}>{m.commentaires}</Text>
            </View>
          ) : null}
        </View>

        {blocks.length ? (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Besoins en staff</Text>
              {m.staff ? <Text style={styles.countBadge}>{m.staff} poste(s)</Text> : null}
            </View>
            {blocks.map((block, bi) => (
              <View key={bi} style={{ marginBottom: 16 }}>
                {block.prestation_type_detail ? (
                  <View style={styles.clientHours}>
                    <Clock size={11} color="#888" />
                    <Text style={styles.clientHoursText}>
                      {block.prestation_type_detail}
                      {block.heure_debut_client && block.heure_fin_client
                        ? ` : ${block.heure_debut_client} → ${block.heure_fin_client}`
                        : ''}
                    </Text>
                  </View>
                ) : null}
                {(block.staff_requirements || []).map((r, ri) => (
                  <View key={ri} style={styles.jobRow}>
                    <View style={styles.jobName}>
                      <Text style={styles.jobNameText}>{r.libelle || r.qualification_code}</Text>
                      <Text style={styles.jobCode}>{r.qualification_code}</Text>
                    </View>
                    <View style={styles.jobQty}>
                      <Users size={11} color="#888" />
                      <Text style={styles.jobQtyText}>{r.count}</Text>
                    </View>
                    <View style={styles.jobTimes}>
                      <View style={styles.timeBadge}>
                        <Clock size={10} color="#1565C0" />
                        <Text style={styles.timeBadgeText}>
                          {r.heure_debut || '—'} → {r.heure_fin || '—'}
                        </Text>
                      </View>
                      {r.coupure_debut && r.coupure_fin ? (
                        <View style={styles.pauseBadge}>
                          <Text style={styles.pauseBadgeText}>
                            Pause {r.coupure_debut} → {r.coupure_fin}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Estimation totale</Text>
              <Text style={styles.priceSub}>Basé sur les besoins</Text>
            </View>
            <View style={styles.priceRight}>
              <Text style={styles.priceValue}>{Number(m.total_ht || 0).toFixed(2)} €</Text>
              <Text style={styles.priceCaption}>HT / prestation</Text>
            </View>
          </View>
        </View>

        {['Draft', 'Waiting Approval', 'Approved'].includes(m.validation_admin) &&
        m.etat_mission !== 'Terminée' &&
        m.etat_mission !== 'Annulée' ? (
          <Pressable onPress={() => onEdit(mission)} style={[styles.newButton, { marginTop: 10, alignSelf: 'flex-start' }]}>
            <Edit2 size={16} color={colors.white} />
            <Text style={styles.newButtonText}>Modifier la prestation</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SELECT FIELD (bottom sheet picker)
══════════════════════════════════════════════ */

function SelectField({ label, value, options = [], onSelect, placeholder, compact, hideLabel, styles, colors }) {
  const [show, setShow] = useState(false);
  const selected = options.find(o => (o?.code ?? o?.value ?? o) === value);
  const displayValue = selected
    ? selected.libelle || selected.label || selected.name || selected.code || selected
    : placeholder || '-- Sélectionner --';

  return (
    <View style={styles.selectWrap}>
      {!hideLabel && label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setShow(true)}
        style={[styles.selectField, compact && styles.selectFieldCompact]}
      >
        <Text
          numberOfLines={1}
          style={[styles.selectText, !selected && styles.selectPlaceholder]}
        >
          {displayValue}
        </Text>
        <ChevronDown size={14} color="#888" />
      </Pressable>

      <BottomSheet visible={show} onClose={() => setShow(false)} title={label}>
        <ScrollView style={{ maxHeight: 400 }}>
          {options.map((opt, i) => {
            const optVal = opt?.code ?? opt?.value ?? opt;
            const optLabel = opt?.libelle || opt?.label || opt?.name || opt;
            return (
              <Pressable
                key={`${optVal}-${i}`}
                onPress={() => {
                  onSelect(optVal);
                  setShow(false);
                }}
                style={styles.pickerOption}
              >
                <Text style={styles.pickerOptionText}>{optLabel}</Text>
                {value === optVal ? <Check size={16} color={colors.orange} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

/* ══════════════════════════════════════════════
   FORM
══════════════════════════════════════════════ */

function MissionForm({ mission, mode, activeSite, onBack, onSaved, styles, colors }) {
  const isEdit = mode === 'edit';
  const isDuplicate = mode === 'duplicate';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [options, setOptions] = useState({ qualifications: [], languages: [], types: [] });
  const [detailOptions, setDetailOptions] = useState(PRESTATION_DETAIL_OPTIONS_OTHER);
  const [clientId, setClientId] = useState('');
  const [customAddress, setCustomAddress] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [autoSavedAt, setAutoSavedAt] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const draftIdRef = useRef(isEdit ? mission?.id : null);
  const lastSnapshotRef = useRef(null);

  const [form, setForm] = useState({
    prestation_nom: '',
    adresse_exacte: activeSite?.address || '',
    date_debut: '',
    startTime: '',
    date_fin: '',
    endTime: '',
    type_id: '',
    tenue_items: [],
    tenue_note: '',
    languages: ['FR'],
    commentaires: '',
    event_blocks: [emptyBlock()],
    nominations: [],
  });

  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);
  const clientIdRef = useRef(clientId);
  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const [opts, profile, favData] = await Promise.all([
          clientService.getMissionFormOptions(activeSite.id),
          clientService.getClientProfile(),
          clientService.getFavoritesBySpace(activeSite.id),
        ]);
        if (!alive) return;

        setOptions({
          qualifications: opts?.qualifications || [],
          languages: opts?.languages || [],
          types: opts?.types || [],
        });
        setClientId(String(profile?.personal_info?.client_id || ''));
        setFavorites(favData?.favorites || []);

        const isComet = (profile?.business_info?.raison_sociale || '')
          .toUpperCase()
          .includes('COMET');
        setDetailOptions(isComet ? PRESTATION_DETAIL_OPTIONS : PRESTATION_DETAIL_OPTIONS_OTHER);

        if (!mission) {
          const habit = profile?.business_info?.tenue_staff;
          if (habit) setForm(p => ({ ...p, ...parseTenue(habit) }));
          const fr = (opts?.languages || []).find(
            l => (l.libelle || '').toLowerCase() === 'français' || (l.code || '').toUpperCase() === 'FR',
          );
          if (fr) setForm(p => ({ ...p, languages: [fr.code] }));
          return;
        }

        const res = await clientService.getMissionDetails(mission.id);
        if (!alive) return;
        const src = res?.mission || res || mission;

        draftIdRef.current = isEdit ? mission.id : null;
        setIsApproved(src.is_approved === 1 || src.validation_admin === 'Approved');

        const addr = src.adresse_exacte || '';
        const siteAddr = activeSite?.address || activeSite?.adresse || '';
        if (addr && addr !== siteAddr) setCustomAddress(true);

        const blocksRaw = src.event_blocks || [];
        const blocks = blocksRaw.length
          ? blocksRaw.map(b => ({
              uid: genUid(),
              prestation_type_detail: b.prestation_type_detail || '',
              heure_debut_client: b.heure_debut_client || '',
              heure_fin_client: b.heure_fin_client || '',
              staff_requirements: (b.staff_requirements || []).length
                ? b.staff_requirements.map(r => ({
                    uid: genUid(),
                    qualification_code: r.qualification_code || '',
                    count: r.count || 1,
                    heure_debut: r.heure_debut || '',
                    heure_fin: r.heure_fin || '',
                    coupure_debut: r.coupure_debut || '',
                    coupure_fin: r.coupure_fin || '',
                    has_coupure: !!(r.coupure_debut || r.coupure_fin),
                  }))
                : [emptyStaffReq()],
            }))
          : [emptyBlock()];

        const debut = splitDateTime(src.date_debut);
        const fin = splitDateTime(src.date_fin);
        let langs = src.languages;
        if (!langs && src.langues_requises) {
          try {
            langs = JSON.parse(src.langues_requises);
          } catch {
            langs = [];
          }
        }

        setForm({
          prestation_nom: isEdit ? src.prestation_nom || '' : `${src.prestation_nom || ''} (copie)`.trim(),
          adresse_exacte: addr || siteAddr,
          date_debut: debut.date,
          startTime: debut.time,
          date_fin: fin.date,
          endTime: fin.time,
          type_id: src.type_id || '',
          ...parseTenue(src.tenue_exigee),
          languages: Array.isArray(langs) ? langs : [],
          commentaires: src.commentaires || '',
          event_blocks: blocks,
          nominations: [],
        });

        if (isEdit) {
          try {
            const files = await clientService.getMissionFiles(mission.id);
            if (alive && Array.isArray(files)) setUploadedFiles(files);
          } catch {
            // files are optional
          }
        }
      } catch (err) {
        console.error('Mission form load failed:', err);
        Alert.alert('Erreur', 'Erreur lors du chargement du formulaire.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [activeSite?.id, activeSite?.address, activeSite?.adresse, mission?.id, isEdit, mission]);

  /* ── Re-fetch favorites with availability when dates change (mirrors web) ── */
  useEffect(() => {
    if (loading || !clientId || !form.date_debut || !form.date_fin) return;
    const debut = form.startTime ? `${form.date_debut} ${form.startTime}` : form.date_debut;
    const fin = form.endTime ? `${form.date_fin} ${form.endTime}` : form.date_fin;
    clientService
      .getFavoritesBySpace(activeSite.id, debut, fin)
      .then(data => setFavorites(data?.favorites || []))
      .catch(() => {});
  }, [form.date_debut, form.date_fin, form.startTime, form.endTime, activeSite.id, loading, clientId]);

  const patch = useCallback((key, value) => setForm(p => ({ ...p, [key]: value })), []);

  const toggleTenue = opt =>
    setForm(p => ({
      ...p,
      tenue_items: p.tenue_items.includes(opt)
        ? p.tenue_items.filter(t => t !== opt)
        : [...p.tenue_items, opt],
    }));

  const toggleLanguage = code =>
    setForm(p => ({
      ...p,
      languages: p.languages.includes(code)
        ? p.languages.filter(l => l !== code)
        : [...p.languages, code],
    }));

  const toggleCustomAddress = next => {
    setCustomAddress(next);
    setForm(p => ({ ...p, adresse_exacte: next ? p.adresse_exacte : activeSite?.address || '' }));
  };

  const patchBlock = (bIdx, key, value) =>
    setForm(p => ({
      ...p,
      event_blocks: p.event_blocks.map((b, i) => (i === bIdx ? { ...b, [key]: value } : b)),
    }));

  const addBlock = () => setForm(p => ({ ...p, event_blocks: [...p.event_blocks, emptyBlock()] }));

  const removeBlock = bIdx =>
    setForm(p => ({ ...p, event_blocks: p.event_blocks.filter((_, i) => i !== bIdx) }));

  const addReq = bIdx =>
    setForm(p => ({
      ...p,
      event_blocks: p.event_blocks.map((b, i) =>
        i === bIdx ? { ...b, staff_requirements: [...b.staff_requirements, emptyStaffReq()] } : b,
      ),
    }));

  const patchReq = (bIdx, rIdx, key, value) =>
    setForm(p => ({
      ...p,
      event_blocks: p.event_blocks.map((b, i) =>
        i === bIdx
          ? {
              ...b,
              staff_requirements: b.staff_requirements.map((r, j) =>
                j === rIdx ? { ...r, [key]: value } : r,
              ),
            }
          : b,
      ),
    }));

  const removeReq = (bIdx, rIdx) =>
    setForm(p => ({
      ...p,
      event_blocks: p.event_blocks.map((b, i) =>
        i === bIdx
          ? { ...b, staff_requirements: b.staff_requirements.filter((_, j) => j !== rIdx) }
          : b,
      ),
    }));

  const toggleCoupure = (bIdx, rIdx, enabled) =>
    setForm(p => ({
      ...p,
      event_blocks: p.event_blocks.map((b, i) =>
        i === bIdx
          ? {
              ...b,
              staff_requirements: b.staff_requirements.map((r, j) =>
                j === rIdx
                  ? {
                      ...r,
                      has_coupure: enabled,
                      coupure_debut: enabled ? r.coupure_debut : '',
                      coupure_fin: enabled ? r.coupure_fin : '',
                    }
                  : r,
              ),
            }
          : b,
      ),
    }));

  /* ── Payload (mirrors staffly-frontend buildPayload) ── */
  const buildPayload = useCallback(
    (f, cid, submitForApproval) => {
      const payload = { client_id: cid, site_id: activeSite.id };
      if (submitForApproval !== undefined) payload.submit_for_approval = submitForApproval;
      if (f.prestation_nom?.trim()) payload.prestation_nom = f.prestation_nom;
      if (f.adresse_exacte?.trim()) payload.adresse_exacte = f.adresse_exacte;
      if (f.date_debut) {
        payload.date_debut = f.startTime ? `${f.date_debut} ${f.startTime}` : f.date_debut;
      }
      if (f.date_fin) {
        payload.date_fin = f.endTime ? `${f.date_fin} ${f.endTime}` : f.date_fin;
      }
      if (f.type_id) payload.type_id = f.type_id;
      payload.tenue_exigee = buildTenue(f.tenue_items, f.tenue_note) || null;
      if (f.commentaires?.trim()) payload.commentaires = f.commentaires;
      if (f.languages?.length) payload.languages = f.languages;

      const validBlocks = (f.event_blocks || [])
        .filter(b => b.prestation_type_detail)
        .map(b => ({
          prestation_type_detail: b.prestation_type_detail,
          heure_debut_client: b.heure_debut_client || null,
          heure_fin_client: b.heure_fin_client || null,
          staff_requirements: (b.staff_requirements || [])
            .filter(r => r.qualification_code)
            .map(r => ({
              qualification_code: r.qualification_code,
              count: r.count,
              heure_debut: r.heure_debut || null,
              heure_fin: r.heure_fin || null,
              coupure_debut: r.coupure_debut || null,
              coupure_fin: r.coupure_fin || null,
            })),
        }));
      if (validBlocks.length) payload.event_blocks = validBlocks;
      return payload;
    },
    [activeSite.id],
  );

  /* ── Flat list of all staff slots across blocks (for nominations UI) ── */
  const flatSlots = form.event_blocks.flatMap(b =>
    b.staff_requirements.map(r => ({
      ...r,
      blockLabel: (b.prestation_type_detail || ''),
    })),
  );
  const requiredQuals = flatSlots.map(r => r.qualification_code).filter(Boolean);

  /* ── Nomination helpers (mirrors staffly-frontend MissionForm) ── */
  const slotsOverlap = (aS, aE, bS, bE) => {
    const m = t => {
      if (!t) return null;
      const [h, mi] = String(t).split(':').map(Number);
      return h * 60 + (mi || 0);
    };
    const as = m(aS), ae0 = m(aE), bs = m(bS), be0 = m(bE);
    if (as === null || ae0 === null || bs === null || be0 === null) return true;
    const ae = ae0 <= as ? ae0 + 1440 : ae0;
    const be = be0 <= bs ? be0 + 1440 : be0;
    return [-1440, 0, 1440].some(off => as < be + off && bs + off < ae);
  };

  const extraClashes = (extraId, requirementUid) => {
    const all = form.event_blocks.flatMap(b => b.staff_requirements);
    const target = all.find(r => r.uid === requirementUid);
    if (!target) return false;
    return form.nominations.some(n => {
      if (n.extra_id !== extraId || n.requirement_uid === requirementUid) return false;
      const o = all.find(r => r.uid === n.requirement_uid);
      return o && slotsOverlap(o.heure_debut, o.heure_fin, target.heure_debut, target.heure_fin);
    });
  };

  const toggleNomination = (extraId, qualCode, requirementUid) => {
    const exists = form.nominations.find(
      n => n.extra_id === extraId && n.requirement_uid === requirementUid,
    );
    if (exists) {
      setForm(p => ({
        ...p,
        nominations: p.nominations.filter(
          n => !(n.extra_id === extraId && n.requirement_uid === requirementUid),
        ),
      }));
      return;
    }
    if (extraClashes(extraId, requirementUid)) {
      Alert.alert('Conflit', "Cet extra a déjà un créneau qui chevauche celui-ci.");
      return;
    }
    setForm(p => ({
      ...p,
      nominations: [
        ...p.nominations,
        { extra_id: extraId, qualification_code: qualCode, requirement_uid: requirementUid },
      ],
    }));
  };

  const buildNominationsPayload = useCallback(currentForm => {
    const allSlots = currentForm.event_blocks.flatMap(b => b.staff_requirements);
    return currentForm.nominations.map(n => {
      const slot = allSlots.find(r => r.uid === n.requirement_uid);
      return {
        extra_id: n.extra_id,
        qualification_code: n.qualification_code,
        heure_debut: slot?.heure_debut || null,
        heure_fin: slot?.heure_fin || null,
      };
    });
  }, []);

  /* ── 30 s autosave (draft) ── */
  useEffect(() => {
    if (loading) return;
    const id = setInterval(async () => {
      const f = formRef.current;
      const cid = clientIdRef.current;
      if (!cid) return;
      if (!f.prestation_nom?.trim() && !f.adresse_exacte?.trim() && !f.date_debut && !f.type_id) return;
      const snapshot = JSON.stringify(f);
      if (snapshot === lastSnapshotRef.current) return;
      try {
        const payload = buildPayload(f, cid, isApproved ? undefined : false);
        if (draftIdRef.current) {
          await clientService.updateMission(draftIdRef.current, payload);
        } else {
          const res = await clientService.insertMission(payload);
          if (res?.id) draftIdRef.current = res.id;
        }
        lastSnapshotRef.current = snapshot;
        setAutoSavedAt(new Date());
      } catch {
        // autosave is best-effort
      }
    }, 30000);
    return () => clearInterval(id);
  }, [loading, buildPayload, isApproved]);

  /* ── Files ── */
  const handlePickFiles = async () => {
    try {
      const res = await pick({ type: [types.allFiles], allowMultiSelection: true });
      const files = (Array.isArray(res) ? res : [res]).filter(Boolean);
      const valid = files.filter(f => !f.size || f.size <= 10 * 1024 * 1024);
      if (valid.length < files.length) {
        Alert.alert('Fichiers ignorés', 'Certains fichiers dépassent la limite de 10 Mo.');
      }
      setPendingFiles(p => [...p, ...valid]);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert('Erreur', 'Impossible de sélectionner les fichiers.');
    }
  };

  const uploadPendingFiles = async missionId => {
    if (!pendingFiles.length) return;
    const formData = new FormData();
    pendingFiles.forEach(f => {
      formData.append('files[]', {
        uri: f.uri,
        name: f.name || 'fichier',
        type: f.type || 'application/octet-stream',
      });
    });
    await clientService.uploadMissionFiles(missionId, formData);
    setPendingFiles([]);
  };

  const removeUploaded = async fileId => {
    const missionId = draftIdRef.current || mission?.id;
    if (!missionId) return;
    try {
      await clientService.deleteMissionFile(missionId, fileId);
      setUploadedFiles(p => p.filter(f => f.id !== fileId));
    } catch {
      Alert.alert('Erreur', 'Erreur lors de la suppression.');
    }
  };

  /* ── Save ── */
  const handleSave = async saveMode => {
    const strict = saveMode !== 'draft';

    if (!strict) {
      if (
        !form.prestation_nom.trim() &&
        !form.adresse_exacte.trim() &&
        !form.date_debut &&
        !form.type_id
      ) {
        Alert.alert('Brouillon', 'Ajoutez au moins une information avant de sauvegarder.');
        return;
      }
    } else {
      if (!form.prestation_nom.trim()) return Alert.alert('Champ requis', 'Nom de la prestation requis.');
      if (!form.adresse_exacte.trim()) return Alert.alert('Champ requis', 'Adresse de la prestation requise.');
      if (!form.date_debut || !form.date_fin) {
        return Alert.alert('Champ requis', "Les dates de l'évènement sont requises.");
      }
      if (!form.languages.length) {
        return Alert.alert('Champ requis', 'Sélectionnez au moins une langue requise.');
      }
      if (!form.event_blocks.some(b => b.prestation_type_detail)) {
        return Alert.alert('Champ requis', "Ajoutez au moins un type d'événement.");
      }
      for (const b of form.event_blocks) {
        if (!b.prestation_type_detail) continue;
        if (b.staff_requirements.some(r => !r.qualification_code)) {
          return Alert.alert('Champ requis', 'Tous les postes doivent avoir un intitulé.');
        }
      }
      if (!form.type_id) return Alert.alert('Champ requis', 'Type de mission requis.');
      const start = new Date(`${form.date_debut} ${form.startTime || '00:00'}`.replace(' ', 'T'));
      const end = new Date(`${form.date_fin} ${form.endTime || '00:00'}`.replace(' ', 'T'));
      if (end < start) {
        return Alert.alert('Dates', 'La date de fin doit être après le début.');
      }
    }

    setSaving(saveMode);
    try {
      const submitForApproval =
        saveMode === 'draft' ? false : saveMode === 'submit' ? true : undefined;
      const payload = buildPayload(form, clientId, submitForApproval);
      let missionId = draftIdRef.current;
      if (missionId) {
        await clientService.updateMission(missionId, payload);
      } else {
        const res = await clientService.insertMission(payload);
        missionId = res?.id;
        draftIdRef.current = missionId;
      }
      if (pendingFiles.length && missionId) await uploadPendingFiles(missionId);

      if (form.nominations.length > 0 && missionId) {
        try {
          await clientService.nominateExtras(missionId, buildNominationsPayload(form));
        } catch {
          Alert.alert('Nominations', "Mission enregistrée mais certaines nominations ont échoué.");
        }
      }
      onSaved();
    } catch (err) {
      Alert.alert('Erreur', err?.error || err?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center' }}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  const siteAddress = activeSite?.address || activeSite?.adresse || '';

  return (
    <View>
      <View style={styles.formHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={14} color="#888" />
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
        <View style={styles.formTitleBlock}>
          <Text style={styles.formTitle}>
            {isEdit
              ? 'Modifier la prestation'
              : isDuplicate
                ? 'Dupliquer la prestation'
                : 'Nouvelle prestation'}
          </Text>
          <Text style={styles.formSub}>
            {activeSite?.name || activeSite?.space_name || ''}
            {activeSite?.city ? ` · ${activeSite.city}` : ''}
          </Text>
          {autoSavedAt ? (
            <Text style={styles.autosaveText}>
              ✓ Sauvegardé à{' '}
              {autoSavedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Informations générales */}
        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Informations générales</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nom de la prestation *</Text>
            <TextInput
              value={form.prestation_nom}
              onChangeText={v => patch('prestation_nom', v)}
              placeholder="Ex: Soirée gala annuelle"
              placeholderTextColor="#AAA"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.addressRow}>
              <Text style={[styles.label, styles.labelInline]}>Adresse de la prestation *</Text>
              <Pressable style={styles.addressToggle} onPress={() => toggleCustomAddress(!customAddress)}>
                <View style={[styles.checkbox, customAddress && styles.checkboxChecked]}>
                  {customAddress ? <Check size={9} color="#FFF" /> : null}
                </View>
                <Text style={styles.addressToggleText}>Adresse différente</Text>
              </Pressable>
            </View>
            {customAddress ? (
              <TextInput
                value={form.adresse_exacte}
                onChangeText={v => patch('adresse_exacte', v)}
                placeholder="Ex: 10 Place de la Concorde, 75008 Paris"
                placeholderTextColor="#AAA"
                style={styles.input}
              />
            ) : (
              <View style={styles.addressBox}>
                <MapPin size={14} color={colors.orangeDark} />
                <Text style={styles.addressBoxInput} numberOfLines={2}>
                  {siteAddress || 'Aucune adresse renseignée pour ce site'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date & heure de début de l'évènement *</Text>
            <View style={styles.twoColumns}>
              <DatePicker
                value={form.date_debut}
                onChange={v => patch('date_debut', v)}
                style={styles.dateInputFlex}
                colors={colors}
              />
              <TimePicker
                value={form.startTime}
                onChange={v => patch('startTime', v)}
                placeholder="Heure"
                style={styles.timeInputFlex}
                colors={colors}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date & heure de fin de l'évènement *</Text>
            <View style={styles.twoColumns}>
              <DatePicker
                value={form.date_fin}
                onChange={v => patch('date_fin', v)}
                minimumDate={form.date_debut || undefined}
                style={styles.dateInputFlex}
                colors={colors}
              />
              <TimePicker
                value={form.endTime}
                onChange={v => patch('endTime', v)}
                placeholder="Heure"
                style={styles.timeInputFlex}
                colors={colors}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <SelectField
              label="Type de mission *"
              value={form.type_id}
              options={options.types}
              onSelect={v => patch('type_id', v)}
              placeholder="-- Sélectionner --"
              styles={styles}
              colors={colors}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Tenue exigée <Text style={styles.cardTitleMuted}>(optionnel)</Text>
            </Text>
            {TENUE_OPTIONS.map(opt => {
              const checked = form.tenue_items.includes(opt);
              return (
                <Pressable
                  key={opt}
                  onPress={() => toggleTenue(opt)}
                  style={[styles.clothingRow, checked && styles.clothingRowChecked]}
                >
                  <View style={[styles.clothingCheckbox, checked && styles.clothingCheckboxChecked]}>
                    {checked ? <Check size={12} color="#FFF" /> : null}
                  </View>
                  <Text style={styles.clothingRowText}>{opt}</Text>
                </Pressable>
              );
            })}
            <Text style={styles.helper}>
              Pré-cochée d'après les habitudes de ce client. Décochez ou ajoutez une précision ci-dessous.
            </Text>
            <TextInput
              value={form.tenue_note}
              onChangeText={v => patch('tenue_note', v)}
              placeholder="Précision libre sur la tenue"
              placeholderTextColor="#AAA"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Commentaires <Text style={styles.cardTitleMuted}>(optionnel)</Text>
            </Text>
            <TextInput
              value={form.commentaires}
              onChangeText={v => patch('commentaires', v)}
              placeholder="Instructions particulières, accès, contact sur place..."
              placeholderTextColor="#AAA"
              multiline
              style={[styles.input, styles.multilineInput]}
            />
          </View>
        </View>

        {/* Langues requises */}
        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Langues requises *</Text>
          {options.languages.length === 0 ? (
            <Text style={styles.mutedText}>Aucune langue disponible.</Text>
          ) : (
            <View style={styles.langPillRow}>
              {options.languages.map(lang => {
                const sel = form.languages.includes(lang.code);
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => toggleLanguage(lang.code)}
                    style={[styles.langPillToggle, sel ? styles.langPillSelected : styles.langPillIdle]}
                  >
                    <Text style={[styles.langPillText, sel ? styles.langPillTextSelected : styles.langPillTextIdle]}>
                      {lang.libelle || lang.code}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          {form.languages.length === 0 ? (
            <Text style={styles.helperWarn}>Sélectionnez au moins une langue.</Text>
          ) : null}
        </View>

        {/* Types d'événement */}
        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Types d'événement</Text>
          <Text style={styles.helperTop}>
            Une prestation peut comprendre plusieurs types d'événement (ex : PDJ + CKDIN + AW). Ajoutez un bloc par type.
          </Text>

          {form.event_blocks.map((block, bIdx) => (
            <View key={block.uid} style={styles.eventBlock}>
              <View style={styles.eventHead}>
                <View style={styles.eventNumber}>
                  <Text style={styles.eventNumberText}>{bIdx + 1}</Text>
                </View>
                <View style={styles.eventSelect}>
                  <SelectField
                    hideLabel
                    compact
                    value={block.prestation_type_detail}
                    options={detailOptions}
                    onSelect={v => patchBlock(bIdx, 'prestation_type_detail', v)}
                    placeholder="-- Type d'événement --"
                    styles={styles}
                    colors={colors}
                  />
                </View>
                {form.event_blocks.length > 1 ? (
                  <Pressable onPress={() => removeBlock(bIdx)} style={styles.eventRemove}>
                    <Trash2 size={15} color="#9B1C1C" />
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.clientHoursRow}>
                <Clock size={12} color="#888" />
                <Text style={styles.clientHoursLabel}>
                  Horaires client <Text style={styles.cardTitleMuted}>(facultatif)</Text>
                </Text>
                <TimePicker
                  value={block.heure_debut_client}
                  onChange={v => patchBlock(bIdx, 'heure_debut_client', v)}
                  placeholder="De"
                  style={styles.clientTimeInput}
                  colors={colors}
                />
                <Text style={styles.arrow}>→</Text>
                <TimePicker
                  value={block.heure_fin_client}
                  onChange={v => patchBlock(bIdx, 'heure_fin_client', v)}
                  placeholder="À"
                  style={styles.clientTimeInput}
                  colors={colors}
                />
              </View>

              <View style={styles.jobGridLabels}>
                <Text style={[styles.gridLabel, styles.colQualification]}>Intitulé de poste</Text>
                <Text style={[styles.gridLabel, styles.colNb]}>Nb</Text>
                <Text style={[styles.gridLabel, styles.colTime]}>Départ</Text>
                <Text style={[styles.gridLabel, styles.colTime]}>Arrivée</Text>
                <Text style={[styles.gridLabel, styles.colBreak]}>Coupure</Text>
                <View style={styles.colAction} />
              </View>

              {block.staff_requirements.map((req, rIdx) => (
                <View key={req.uid} style={{ marginBottom: 8 }}>
                  <View style={styles.jobGrid}>
                    <View style={styles.colQualification}>
                      <SelectField
                        hideLabel
                        compact
                        value={req.qualification_code}
                        options={options.qualifications}
                        onSelect={v => patchReq(bIdx, rIdx, 'qualification_code', v)}
                        placeholder="-- Qualification --"
                        styles={styles}
                        colors={colors}
                      />
                    </View>
                    <TextInput
                      value={String(req.count)}
                      onChangeText={v => patchReq(bIdx, rIdx, 'count', Math.max(1, parseInt(v, 10) || 1))}
                      keyboardType="number-pad"
                      style={[styles.gridInput, styles.colNb]}
                    />
                    <TimePicker
                      value={req.heure_debut}
                      onChange={v => patchReq(bIdx, rIdx, 'heure_debut', v)}
                      placeholder="Départ"
                      style={[styles.gridInput, styles.colTime]}
                      colors={colors}
                    />
                    <TimePicker
                      value={req.heure_fin}
                      onChange={v => patchReq(bIdx, rIdx, 'heure_fin', v)}
                      placeholder="Arrivée"
                      style={[styles.gridInput, styles.colTime]}
                      colors={colors}
                    />
                    <Pressable
                      onPress={() => toggleCoupure(bIdx, rIdx, !req.has_coupure)}
                      style={[styles.breakToggle, styles.colBreak]}
                    >
                      <View style={[styles.checkbox, req.has_coupure && styles.checkboxChecked]}>
                        {req.has_coupure ? <Check size={9} color="#FFF" /> : null}
                      </View>
                      <Coffee size={12} color="#888" />
                    </Pressable>
                    {block.staff_requirements.length > 1 ? (
                      <Pressable onPress={() => removeReq(bIdx, rIdx)} style={styles.removeStaffButton}>
                        <Trash2 size={13} color="#9B1C1C" />
                      </Pressable>
                    ) : (
                      <View style={styles.colAction} />
                    )}
                  </View>

                  {req.has_coupure ? (
                    <View style={styles.breakBox}>
                      <Text style={styles.breakStrong}>Pause :</Text>
                      <TimePicker
                        value={req.coupure_debut}
                        onChange={v => patchReq(bIdx, rIdx, 'coupure_debut', v)}
                        placeholder="Début"
                        style={styles.clientTimeInput}
                        colors={colors}
                      />
                      <Text style={styles.breakStrong}>→</Text>
                      <TimePicker
                        value={req.coupure_fin}
                        onChange={v => patchReq(bIdx, rIdx, 'coupure_fin', v)}
                        placeholder="Fin"
                        style={styles.clientTimeInput}
                        colors={colors}
                      />
                      <Text style={styles.breakNoteInline}>déduite des heures facturées</Text>
                    </View>
                  ) : null}
                </View>
              ))}

              <View style={styles.addStaffRow}>
                <Pressable onPress={() => addReq(bIdx)} style={styles.addStaffButton}>
                  <Plus size={13} color={colors.orangeDark} />
                  <Text style={styles.addStaffText}>Ajouter une qualification</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable
            onPress={addBlock}
            style={[styles.addStaffButton, styles.addStaffButtonFull, { width: '100%' }]}
          >
            <Plus size={14} color={colors.orangeDark} />
            <Text style={styles.addStaffText}>Ajouter un type d'événement</Text>
          </Pressable>
        </View>

        {/* Choix des extras (nominations) */}
        {requiredQuals.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitlePlain}>
              Choix des extras{' '}
              <Text style={styles.cardTitleMuted}>(optionnel)</Text>
            </Text>

            {(!form.date_debut || !form.date_fin) && (
              <View style={styles.warnBanner}>
                <CircleAlert size={14} color="#f57f17" />
                <Text style={styles.warnText}>
                  Renseignez les dates de l'évènement pour voir la disponibilité des extras.
                </Text>
              </View>
            )}

            {flatSlots
              .filter(r => r.qualification_code)
              .map(req => {
                const qLabel =
                  options.qualifications.find(q => q.code === req.qualification_code)?.libelle ||
                  req.qualification_code;
                const slotNoms = form.nominations.filter(
                  n => n.requirement_uid === req.uid,
                );
                const isFull = slotNoms.length >= req.count;
                const eligible = favorites.filter(
                  fav => fav.qualifications?.includes(req.qualification_code),
                );
                const sameQualSlots = flatSlots.filter(
                  r => r.qualification_code === req.qualification_code,
                );
                const optionIndex = sameQualSlots.findIndex(r => r.uid === req.uid) + 1;
                const hasOptions = sameQualSlots.length > 1;

                return (
                  <View key={req.uid} style={styles.nomSlotWrap}>
                    <View style={styles.nomSlotHeader}>
                      {req.blockLabel ? (
                        <View style={styles.nomBlockBadge}>
                          <Text style={styles.nomBlockBadgeText}>{req.blockLabel}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.nomQualLabel}>{qLabel}</Text>
                      {hasOptions && (
                        <View style={styles.nomOptionBadge}>
                          <Text style={styles.nomOptionBadgeText}>Option {optionIndex}</Text>
                        </View>
                      )}
                      {req.heure_debut && req.heure_fin ? (
                        <View style={styles.nomTimeBadge}>
                          <Text style={styles.nomTimeBadgeText}>
                            {req.heure_debut} → {req.heure_fin}
                          </Text>
                        </View>
                      ) : null}
                      <Text
                        style={[
                          styles.nomCount,
                          { color: isFull ? '#2e7d32' : '#aaa' },
                        ]}
                      >
                        {slotNoms.length}/{req.count} assigné(s)
                      </Text>
                    </View>

                    {eligible.length === 0 ? (
                      <Text style={styles.nomEmpty}>
                        Aucun favori ne correspond à ce poste.
                      </Text>
                    ) : (
                      <View style={styles.nomList}>
                        {eligible.map(fav => {
                          const nominatedHere = slotNoms.find(
                            n => n.extra_id === fav.id,
                          );
                          const nominatedElsewhere =
                            !nominatedHere && extraClashes(fav.id, req.uid);
                          const status = fav.availability_status || 'unknown';
                          const isBlocked = status === 'busy' || status === 'unavailable';
                          const statusLabel =
                            status === 'available'
                              ? 'Disponible'
                              : status === 'busy'
                                ? 'Déjà réservé'
                                : status === 'unavailable'
                                  ? 'Non disponible'
                                  : null;
                          const statusColor =
                            status === 'available'
                              ? '#2e7d32'
                              : status === 'busy'
                                ? '#f57f17'
                                : status === 'unavailable'
                                  ? '#9b1c1c'
                                  : '#aaa';
                          const dimmed = isBlocked || nominatedElsewhere;

                          const favPhotoSrc = fav.profile_photo_url
                            ? fav.profile_photo_url.startsWith('http')
                              ? fav.profile_photo_url
                              : `${API_BASE_URL.replace('/api', '')}/${fav.profile_photo_url}`
                            : null;
                          const favInitials = (
                            (fav.firstname?.[0] || '') + (fav.name?.[0] || '')
                          ).toUpperCase();

                          return (
                            <View
                              key={fav.id}
                              style={[
                                styles.nomItem,
                                nominatedHere && styles.nomItemSelected,
                                { opacity: dimmed ? 0.6 : 1 },
                              ]}
                            >
                              {favPhotoSrc ? (
                                <Image
                                  source={{ uri: favPhotoSrc }}
                                  style={styles.nomAvatar}
                                />
                              ) : (
                                <View style={styles.nomAvatar}>
                                  <Text style={styles.nomAvatarText}>
                                    {favInitials || '?'}
                                  </Text>
                                </View>
                              )}

                              <View style={{ flex: 1, minWidth: 0 }}>
                                <Text style={styles.nomName} numberOfLines={1}>
                                  {fav.firstname} {fav.name}
                                </Text>
                                {statusLabel && (
                                  <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor }}>
                                    {statusLabel}
                                  </Text>
                                )}
                              </View>

                              {isBlocked ? (
                                <Text style={styles.nomDisabled}>Non disponible</Text>
                              ) : nominatedHere ? (
                                <Pressable
                                  onPress={() =>
                                    toggleNomination(fav.id, req.qualification_code, req.uid)
                                  }
                                  style={styles.nomRemoveBtn}
                                >
                                  <X size={12} color="#9b1c1c" />
                                </Pressable>
                              ) : nominatedElsewhere ? (
                                <Text style={styles.nomDisabled}>
                                  Chevauche un autre créneau
                                </Text>
                              ) : isFull ? (
                                <Text style={styles.nomDisabled}>Complet</Text>
                              ) : (
                                <Pressable
                                  onPress={() =>
                                    toggleNomination(fav.id, req.qualification_code, req.uid)
                                  }
                                  style={styles.nomChooseBtn}
                                >
                                  <User size={11} color={colors.orangeDark} />
                                  <Text style={styles.nomChooseText}>
                                    {req.heure_debut && req.heure_fin
                                      ? `${req.heure_debut} → ${req.heure_fin}`
                                      : 'Choisir'}
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        )}

        {/* Pièces jointes */}
        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>
            Pièces jointes{' '}
            <Text style={styles.cardTitleMuted}>(optionnel — menus, photos, briefings...)</Text>
          </Text>

          {uploadedFiles.map(f => (
            <View key={f.id} style={styles.fileRow}>
              <FileText size={15} color={colors.orangeDark} />
              <Text style={styles.fileName} numberOfLines={1}>
                {f.name || f.file_name || f.original_name || 'Fichier'}
              </Text>
              {f.size || f.file_size ? (
                <Text style={styles.fileSizeText}>{fmtSize(f.size || f.file_size)}</Text>
              ) : null}
              <Pressable onPress={() => removeUploaded(f.id)} style={styles.fileRemove}>
                <X size={12} color="#9B1C1C" />
              </Pressable>
            </View>
          ))}

          {pendingFiles.map((f, i) => (
            <View key={`${f.uri}-${i}`} style={styles.fileRow}>
              <Paperclip size={15} color={colors.orangeDark} />
              <Text style={styles.fileName} numberOfLines={1}>
                {f.name || 'Fichier'}
              </Text>
              <Text style={styles.fileBadgePending}>en attente</Text>
              {f.size ? <Text style={styles.fileSizeText}>{fmtSize(f.size)}</Text> : null}
              <Pressable
                onPress={() => setPendingFiles(p => p.filter((_, j) => j !== i))}
                style={styles.fileRemove}
              >
                <X size={12} color="#9B1C1C" />
              </Pressable>
            </View>
          ))}

          <Pressable onPress={handlePickFiles} style={styles.dashedButton}>
            <Paperclip size={15} color={colors.orangeDark} />
            <Text style={styles.dashedButtonText}>Ajouter des fichiers</Text>
          </Pressable>
          <Text style={styles.helperCenter}>PDF, Word, Images, Excel — 10 Mo max par fichier</Text>
        </View>

        {/* Actions */}
        <View style={styles.formActions}>
          <Pressable
            onPress={onBack}
            disabled={!!saving}
            style={[styles.actionButton, styles.actionCancel]}
          >
            <Text style={styles.actionCancelText}>Annuler</Text>
          </Pressable>

          {isEdit && isApproved ? (
            <Pressable
              onPress={() => handleSave('keep')}
              disabled={!!saving}
              style={[styles.actionButton, styles.actionSubmit]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Save size={14} color="#FFF" />
              )}
              <Text style={styles.actionSubmitText}>Enregistrer les modifications</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => handleSave('draft')}
                disabled={!!saving}
                style={[styles.actionButton, styles.actionDraft]}
              >
                {saving === 'draft' ? (
                  <ActivityIndicator size="small" color={colors.orangeDark} />
                ) : (
                  <Save size={14} color={colors.orangeDark} />
                )}
                <Text style={styles.actionDraftText}>Sauvegarder brouillon</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSave('submit')}
                disabled={!!saving}
                style={[styles.actionButton, styles.actionSubmit]}
              >
                {saving === 'submit' ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Send size={14} color="#FFF" />
                )}
                <Text style={styles.actionSubmitText}>Soumettre à l'admin</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ══════════════════════════════════════════════
   CANCEL SHEET
══════════════════════════════════════════════ */

function CancelSheet({ target, reason, onChangeReason, onClose, onConfirm, styles }) {
  return (
    <BottomSheet
      visible={!!target}
      onClose={onClose}
      title="Annuler la mission"
      showClose
    >
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.cancelText}>
          <Text style={styles.cancelStrong}>{target?.nom || target?.prestation_nom}</Text>
          {' — '}Les extras et admins seront notifiés.
        </Text>
        <Text style={styles.label}>Motif d'annulation *</Text>
        <TextInput
          value={reason}
          onChangeText={onChangeReason}
          placeholder="Ex: Événement reporté, contraintes budgétaires..."
          placeholderTextColor="#AAA"
          multiline
          style={[styles.input, styles.multilineInput, styles.cancelInput]}
        />
        <View style={styles.cancelButtons}>
          <Pressable onPress={onClose} style={styles.cancelBack}>
            <Text style={styles.cancelBackText}>Retour</Text>
          </Pressable>
          <Pressable onPress={onConfirm} style={styles.cancelConfirm}>
            <Text style={styles.cancelConfirmText}>Confirmer</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

/* ══════════════════════════════════════════════
   FEEDBACK SHEET (Terminer / Évaluation)
══════════════════════════════════════════════ */

function FeedbackSheet({ target, onClose, onDone, styles, colors }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(null);

  const isFinish = target?.mode === 'finish';
  const mission = target?.mission;

  useEffect(() => {
    if (target) {
      setRating(0);
      setFeedback('');
      setSaving(null);
    }
  }, [target]);

  const submit = async kind => {
    if (kind !== 'save') {
      if (!rating) return Alert.alert('Note requise', 'Veuillez donner une note globale.');
      if (!feedback.trim()) return Alert.alert('Champ requis', 'Veuillez laisser un commentaire global.');
    }
    setSaving(kind);
    const body = { mission_feedback: feedback, rating };
    try {
      if (isFinish) {
        await clientService.finishMissionWithFeedback(mission.id, body);
      } else {
        await clientService.evaluateMission(mission.id, { ...body, submit: kind === 'submit' });
      }
      onDone();
    } catch (err) {
      Alert.alert('Erreur', err?.error || err?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <BottomSheet
      visible={!!target}
      onClose={onClose}
      title={isFinish ? `Terminer — ${mission?.nom || mission?.prestation_nom || ''}` : `Évaluation — ${mission?.nom || mission?.prestation_nom || ''}`}
      subtitle={
        isFinish
          ? "Évaluez l'équipe et laissez un feedback global"
          : 'Enregistrez pour reprendre plus tard, validez pour l’envoyer en validation'
      }
      showClose
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        {mission?.date_debut ? (
          <View style={styles.clientHours}>
            <Clock size={13} color="#888" />
            <Text style={styles.clientHoursText}>
              Mission prévue : {fmtLongDate(mission.date_debut)}
              {splitDateTime(mission.date_debut).time ? ` ${splitDateTime(mission.date_debut).time}` : ''}
              {mission.date_fin ? ` → ${splitDateTime(mission.date_fin).time || '23:00'}` : ''}
            </Text>
          </View>
        ) : null}

        <Text style={styles.cardTitlePlain}>Note globale</Text>
        <View style={styles.evalStarRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <Pressable key={n} onPress={() => setRating(n)} style={styles.evalStar}>
              <Text style={{ fontSize: 24, color: n <= rating ? colors.orange : '#E0D0C8' }}>★</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.cardTitlePlain}>Feedback global *</Text>
        <TextInput
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Comment s'est déroulée la mission ?"
          placeholderTextColor="#AAA"
          multiline
          style={[styles.input, { minHeight: 100 }]}
        />

        <View style={[styles.formActions, { marginTop: 16, marginBottom: 0 }]}>
          <Pressable onPress={onClose} disabled={!!saving} style={[styles.actionButton, styles.actionCancel]}>
            <Text style={styles.actionCancelText}>Annuler</Text>
          </Pressable>
          {isFinish ? (
            <Pressable
              onPress={() => submit('submit')}
              disabled={!!saving}
              style={[styles.actionButton, styles.actionSubmit]}
            >
              {saving ? <ActivityIndicator size="small" color="#FFF" /> : null}
              <Text style={styles.actionSubmitText}>Terminer</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => submit('save')}
                disabled={!!saving}
                style={[styles.actionButton, styles.actionDraft]}
              >
                {saving === 'save' ? (
                  <ActivityIndicator size="small" color={colors.orangeDark} />
                ) : null}
                <Text style={styles.actionDraftText}>Enregistrer l'évaluation</Text>
              </Pressable>
              <Pressable
                onPress={() => submit('submit')}
                disabled={!!saving}
                style={[styles.actionButton, styles.actionSubmit]}
              >
                {saving === 'submit' ? <ActivityIndicator size="small" color="#FFF" /> : null}
                <Text style={styles.actionSubmitText}>Valider l'évaluation</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

/* ══════════════════════════════════════════════
   CONVERSATION SHEET
══════════════════════════════════════════════ */

function ConversationSheet({ mission, onClose, styles, colors }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [serverMeId, setServerMeId] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const meId = user?.id ?? serverMeId;

  const loadMessages = useCallback(async () => {
    if (!mission?.id) return;
    try {
      const data = await clientService.getModificationConversation(mission.id);
      setMessages(Array.isArray(data) ? data : data?.messages || []);
      if (data?.my_id != null) setServerMeId(data.my_id);
    } catch {
      // A failed refresh must not blank a thread that is already rendered.
    }
  }, [mission?.id]);

  useEffect(() => {
    if (!mission?.id) return;
    let alive = true;
    setLoading(true);
    setDraft('');
    setMessages([]);
    clientService
      .getModificationConversation(mission.id)
      .then(data => {
        if (!alive) return;
        setMessages(Array.isArray(data) ? data : data?.messages || []);
        if (data?.my_id != null) setServerMeId(data.my_id);
      })
      .catch(() => {
        if (alive) setMessages([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [mission?.id]);

  // Keep the newest message in view — the web conversation does the same.
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 50);
    return () => clearTimeout(t);
  }, [messages, loading]);

  const send = async () => {
    const content = draft.trim();
    if (!content || sending || !mission?.id) return;
    setSending(true);
    try {
      const res = await clientService.sendModificationConversation({
        receiver_id: null,
        prestation_id: mission.id,
        content,
      });
      setDraft('');
      // Render the sent message immediately, then reconcile with the server.
      if (res?.id) {
        setMessages(prev => [
          ...prev,
          {
            id: res.id,
            sender_id: res.sender_id ?? user?.id,
            receiver_id: res.receiver_id ?? null,
            content: res.content ?? content,
            created_at: res.created_at ?? new Date().toISOString(),
          },
        ]);
      } else {
        await loadMessages();
      }
      setTimeout(() => loadMessages(), 400);
    } catch (err) {
      Alert.alert('Erreur', err?.message || "Impossible d'envoyer le message.");
    } finally {
      setSending(false);
    }
  };

  const name = mission?.nom || mission?.prestation_nom || 'Conversation';
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <BottomSheet
      visible={!!mission}
      onClose={onClose}
      maxHeight="85%"
      sheetStyle={styles.convSheet}
    >
      <View style={styles.convHeader}>
        <View style={styles.convAvatar}>
          <Text style={styles.convAvatarText}>{initials}</Text>
        </View>
        <Text style={styles.convName} numberOfLines={1}>
          {name}
        </Text>
        <Pressable onPress={onClose} style={styles.convClose}>
          <X size={16} color="#888" />
        </Pressable>
      </View>

      <ScrollView ref={scrollRef} style={styles.convScroll} contentContainerStyle={styles.convBody}>
        {loading ? (
          <ActivityIndicator color={colors.orange} />
        ) : messages.length === 0 ? (
          <View style={styles.convEmpty}>
            <View style={styles.convAvatarSm}>
              <Text style={styles.convAvatarSmText}>{initials}</Text>
            </View>
            <Text style={styles.convEmptyTitle}>Aucun message</Text>
            <Text style={styles.convEmptySub}>
              Échangez avec l'administration au sujet de cette prestation.
            </Text>
          </View>
        ) : (
          <View style={styles.convList}>
            {messages.map((msg, i) => {
              const mine = meId != null && msg.sender_id === meId;
              const time = splitDateTime(msg.created_at).time;
              return (
                <View key={msg.id ?? i} style={[styles.convMsgRow, mine && styles.convMsgRowMine]}>
                  <View style={mine ? styles.convMessageMine : styles.convMessageOther}>
                    <Text style={mine ? styles.convMessageTextMine : styles.convMessageTextOther}>
                      {msg.content}
                    </Text>
                    {time ? <Text style={styles.convMsgTime}>{time}</Text> : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.convComposer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Écrire un message..."
          placeholderTextColor="#AAA"
          multiline
          style={styles.convComposerInput}
        />
        <Pressable
          onPress={send}
          disabled={sending || !draft.trim()}
          style={[styles.convSend, (sending || !draft.trim()) && styles.convSendDisabled]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Send size={16} color="#FFF" />
          )}
        </Pressable>
      </View>
    </BottomSheet>
  );
}
