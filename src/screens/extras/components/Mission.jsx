/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : Mission
 * **Associated Route/Context**: `/extras (Tab/Modal: Mission)`  
 * **Total Discovered Backend Calls**: 7
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Mission.jsx:114`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L114) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/show/' + mission.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:115`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L115) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/' + mission.id + '/files` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:793`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L793) | User Action Handler (`Mission`) | `Mission` | `GET` | `/extras/missions/matching` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:794`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L794) | User Action Handler (`Mission`) | `Mission` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:833`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L833) | Action Button / Moderation Action (`handleAccept`) | `handleAccept` | `POST` | `/extras/missions/respond/' + missionId` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:849`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L849) | User Action Handler (`handleDecline`) | `handleDecline` | `POST` | `/extras/missions/respond/' + missionId` | `{ status:'refusee'` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Mission.jsx:626`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L626) | Document Download / Preview (`Block / Inline`) | `Block / Inline` | `GET` | `/api/files/extra-doc/... (`/files/mission/${f.id}`)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |
 * 
 * =====================================================================
 */
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Paperclip,
  Search,
  Tag,
  Timer,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { mission as styles } from './styles';
import DatePicker from '../../../components/DatePicker';
import RetourPrestation from './RetourPrestation';
import {
  getMatchingMissions,
  getMyAvailabilities,
  respondMission,
  getMissionShow,
  getMissionFiles,
} from '../../../api/extraService';

const TABS = [
  { key: 'proposees', label: 'Prestations proposées' },
  { key: 'a_venir', label: 'À venir' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'terminees', label: 'Terminées' },
  { key: 'toutes', label: 'Toutes' },
];

// Group matching missions by mission id — the backend returns one row per
// mission (with an `available_slots` array and a `my_slots` array already
// grouped), so we merge duplicates without losing those arrays.
function groupByMission(rows) {
  const map = {};
  for (const row of rows) {
    const id = row.mission_id || row.id;
    if (!map[id]) {
      map[id] = {
        id,
        prestation_nom: row.prestation_nom || row.title || 'Mission',
        title: row.title || row.prestation_nom,
        statut: row.statut || (row.date_fin && new Date(row.date_fin) < new Date() ? 'terminee' : 'en_attente'),
        statut_reponse: row.statut_reponse || null,
        type_id: row.type_id || '',
        prestation_type_detail: row.prestation_type_detail || '',
        date_debut: row.date_debut || null,
        date_fin: row.date_fin || null,
        date: (row.date_debut || '').slice(0, 10),
        total_hours: row.total_hours || null,
        adresse_exacte: row.adresse_exacte || '',
        space_name: row.space_name || '',
        city: row.city || '',
        client_name: row.client_name || '',
        tenue_exigee: row.tenue_exigee || '',
        commentaires: row.commentaires || '',
        languages: (() => { try { return JSON.parse(row.langues_requises || '[]'); } catch { return []; } })(),
        // Preserve the slots the backend already grouped for this extra.
        available_slots: Array.isArray(row.available_slots) ? [...row.available_slots] : [],
        my_slots: Array.isArray(row.my_slots) ? [...row.my_slots] : [],
        attachments: [],
        qualification_code: row.qualification_code || null,
        matching_qualification: row.matching_qualification || row.qualification_code || null,
        heure_debut: row.heure_debut || row.slot_debut || null,
        heure_fin: row.heure_fin || row.slot_fin || null,
        slot_debut: row.slot_debut || null,
        slot_fin: row.slot_fin || null,
        coupure_debut: row.coupure_debut || null,
        coupure_fin: row.coupure_fin || null,
      };
      continue;
    }

    // Duplicate row for the same mission: merge its slots (dedup by hours).
    const existing = map[id];
    const addSlots = (list) => {
      if (!Array.isArray(list)) return;
      for (const sl of list) {
        const dup = existing.available_slots.some(
          x => x.heure_debut === sl.heure_debut && x.heure_fin === sl.heure_fin,
        );
        if (!dup) existing.available_slots.push(sl);
      }
    };
    addSlots(row.available_slots);

    const addMySlots = (list) => {
      if (!Array.isArray(list)) return;
      for (const sl of list) {
        const dup = existing.my_slots.some(
          x => x.heure_debut === sl.heure_debut && x.heure_fin === sl.heure_fin,
        );
        if (!dup) existing.my_slots.push(sl);
      }
    };
    addMySlots(row.my_slots);

    // Fallback for legacy rows that only carry flat slot fields.
    if (
      !existing.available_slots.length &&
      row.qualification_code &&
      row.heure_debut &&
      row.heure_fin
    ) {
      existing.available_slots.push({
        qualification_code: row.qualification_code,
        libelle: row.matching_qualification || row.qualification_libelle || row.qualification_code,
        heure_debut: row.heure_debut,
        heure_fin: row.heure_fin,
        coupure_debut: row.coupure_debut || null,
        coupure_fin: row.coupure_fin || null,
        quantity: row.quantity || 1,
        taken: row.taken || 0,
      });
    }
  }
  return Object.values(map);
}

function computeTotalHours(debut, fin) {
  if (!debut || !fin) return null;
  const ms = new Date(fin).getTime() - new Date(debut).getTime();
  if (isNaN(ms) || ms <= 0) return null;
  return Math.round((ms / 3600000) * 10) / 10;
}

// Minutes since midnight for a "HH:MM" string.
function toMinutes(t) {
  if (!t) return null;
  const parts = String(t).split(':');
  const h = Number(parts[0]);
  const min = Number(parts[1] || 0);
  if (isNaN(h) || isNaN(min)) return null;
  return h * 60 + min;
}

// Duration of a slot, minus its break (mirrors the web's calcH).
function computeSlotHours(debut, fin, coupureDebut, coupureFin) {
  const start = toMinutes(debut);
  const end = toMinutes(fin);
  if (start === null || end === null) return null;
  let diff = end - start;
  if (diff <= 0) diff += 1440; // overnight slot (e.g. 18:00 → 03:00)
  const breakStart = toMinutes(coupureDebut);
  const breakEnd = toMinutes(coupureFin);
  if (breakStart !== null && breakEnd !== null) {
    let breakDiff = breakEnd - breakStart;
    if (breakDiff <= 0) breakDiff += 1440;
    diff = Math.max(0, diff - breakDiff);
  }
  return Math.round((diff / 60) * 10) / 10;
}

function isNow(debut, fin) {
  if (!debut || !fin) return false;
  const now = Date.now();
  return new Date(debut).getTime() <= now && now <= new Date(fin).getTime();
}

function isPastDate(d) {
  if (!d) return false;
  return new Date(d) < new Date(new Date().setHours(0, 0, 0, 0));
}

// Retour prestation: available from the event day onwards.
function isEventDayOrLater(dateDebut) {
  if (!dateDebut) return false;
  const eventDay = new Date(dateDebut);
  eventDay.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today >= eventDay;
}

// "Aujourd'hui" / "Demain" / "Dans X jour(s)" / "Hier" / "Il y a X jour(s)"
function getDaysUntil(d) {
  if (!d) return '';
  const diff = Math.ceil(
    (new Date(d) - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000,
  );
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  if (diff > 1) return `Dans ${diff} jour(s)`;
  if (diff === -1) return 'Hier';
  return `Il y a ${Math.abs(diff)} jour(s)`;
}

// Nominated = explicitly nominated by admin (en_attente / en_attente_admin).
function isNominatedStatus(statut) {
  return statut === 'en_attente' || statut === 'en_attente_admin';
}

// Format a "HH:MM[:SS]" time string as "HH:MM".
function fmtSlot(t) {
  if (!t) return '—';
  return String(t).slice(0, 5);
}

function fmtDateFr(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  const days = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const months = [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ];
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

function fmtTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function fmtTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Mission() {
  const [activeTab, setActiveTab] = useState('proposees');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [dateFilterEnd, setDateFilterEnd] = useState('');
  const [allMissions, setAllMissions] = useState([]); // proposed (from /extras/missions/matching)
  const [myMissions, setMyMissions] = useState([]);  // accepted (from /extra/my-availabilities)
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'retour'
  const [selectedMission, setSelectedMission] = useState(null);
  const [detail, setDetail] = useState(null); // /missions/show/:id response
  const [detailFiles, setDetailFiles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Merge proposed + accepted into one list. Accepted missions get
  // statut_reponse='acceptee' forced (the my-availabilities endpoint doesn't
  // return this field but only returns accepted missions).
  const missions = useMemo(() => {
    return [
      ...allMissions,
      ...myMissions.map(m => ({ ...m, statut_reponse: 'acceptee' })),
    ];
  }, [allMissions, myMissions]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [proposed, accepted] = await Promise.all([
        getMatchingMissions().catch(() => []),
        getMyAvailabilities().catch(() => []),
      ]);
      setAllMissions(groupByMission(Array.isArray(proposed) ? proposed : []));
      // my-availabilities returns missions (type==='mission') + unavailabilities (type==='unavailable')
      setMyMissions(
        groupByMission(
          (Array.isArray(accepted) ? accepted : [])
            .filter(s => s.type === 'mission')
            .map(s => ({ ...s, statut_reponse: 'acceptee' })),
        ),
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de charger vos prestations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Load mission detail + files when entering the detail view.
  useEffect(() => {
    if (view !== 'detail' || !selectedMission) return;
    let alive = true;
    setDetailLoading(true);
    setDetail(null);
    setDetailFiles([]);
    Promise.all([
      getMissionShow(selectedMission.id).catch(() => null),
      getMissionFiles(selectedMission.id).catch(() => []),
    ]).then(([d, f]) => {
      if (!alive) return;
      setDetail(d);
      setDetailFiles(Array.isArray(f) ? f : []);
    }).finally(() => { if (alive) setDetailLoading(false); });
    return () => { alive = false; };
  }, [view, selectedMission]);

  // Timer countdown for active mission
  const activeMission = useMemo(
    () => missions.find(m => isNow(m.date_debut, m.date_fin)),
    [missions],
  );
  const [timerSeconds, setTimerSeconds] = useState(0);
  useEffect(() => {
    if (!activeMission || !activeMission.date_fin) {
      setTimerSeconds(0);
      return;
    }
    const target = new Date(activeMission.date_fin).getTime();
    const tick = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setTimerSeconds(diff);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeMission]);

  const proposedCount = useMemo(() => {
    return allMissions.filter(m => !m.statut_reponse || m.statut_reponse === 'disponible').length;
  }, [allMissions]);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
      const isAccepted = m.statut_reponse === 'acceptee';
      const isDeclined = m.statut_reponse === 'refusee';
      const enCours = isNow(m.date_debut, m.date_fin);
      const termine = isPastDate(m.date_fin);

      // Tab filtering
      if (activeTab === 'proposees' && !isProposed) return false;
      if (activeTab === 'a_venir' && (!isAccepted || enCours || termine)) return false;
      if (activeTab === 'en_cours' && !enCours) return false;
      if (activeTab === 'terminees' && !termine) return false;
      if (isDeclined && activeTab !== 'toutes') return false;

      // Search filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nom = (m.prestation_nom || '').toLowerCase();
        const client = (m.client_name || '').toLowerCase();
        const adresse = (m.adresse_exacte || '').toLowerCase();
        const space = (m.space_name || '').toLowerCase();
        if (!nom.includes(q) && !client.includes(q) && !adresse.includes(q) && !space.includes(q)) {
          return false;
        }
      }

      // Date filtering
      if (dateFilterStart && m.date < dateFilterStart) return false;
      if (dateFilterEnd && m.date > dateFilterEnd) return false;

      return true;
    });
  }, [missions, activeTab, searchQuery, dateFilterStart, dateFilterEnd]);

  const handleAcceptSlot = async (missionId, slot) => {
    setActing(`${missionId}acceptee`);
    try {
      await respondMission(missionId, {
        status: 'acceptee',
        qualification_code: slot?.qualification_code || null,
        heure_debut: slot?.heure_debut || null,
        heure_fin: slot?.heure_fin || null,
      });
      Alert.alert('Succès', 'Prestation acceptée !');
      setView('list');
      await loadAll();
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Une erreur est survenue.');
    } finally {
      setActing(null);
    }
  };

  const handleRefuseMission = async (missionId) => {
    Alert.alert(
      'Refuser la prestation',
      'Êtes-vous sûr(e) de vouloir refuser cette prestation ? Elle ne vous sera plus proposée.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: async () => {
            setActing(`${missionId}refusee`);
            try {
              await respondMission(missionId, { status: 'refusee' });
              if (view === 'detail') setView('list');
              await loadAll();
              Alert.alert('Prestation refusée', 'La prestation a été marquée comme refusée.');
            } catch (err) {
              Alert.alert('Erreur', err?.message || 'Une erreur est survenue.');
            } finally {
              setActing(null);
            }
          },
        },
      ],
    );
  };

  // Render Retour View
  if (view === 'retour') {
    return (
      <RetourPrestation
        mission={selectedMission}
        onBack={() => setView('detail')}
        onSubmitted={() => {
          setView('list');
        }}
      />
    );
  }

  // Render Detail View
  if (view === 'detail' && selectedMission) {
    const baseMission = missions.find(item => item.id === selectedMission.id) || selectedMission;
    // Merge safe mission-wide fields from /missions/show (same as web).
    const d = detail?.mission || detail;
    const m = {
      ...baseMission,
      prestation_nom: d?.prestation_nom ?? baseMission.prestation_nom,
      adresse_exacte: d?.adresse_exacte ?? baseMission.adresse_exacte,
      date_debut: d?.date_debut ?? baseMission.date_debut,
      date_fin: d?.date_fin ?? baseMission.date_fin,
      type_id: d?.type_id ?? baseMission.type_id,
      prestation_type_detail: d?.event_blocks?.length
        ? d.event_blocks.map(b => b.prestation_type_detail).join(' + ')
        : (d?.prestation_type_detail ?? baseMission.prestation_type_detail),
      tenue_exigee: d?.tenue_exigee ?? baseMission.tenue_exigee,
      commentaires: d?.commentaires ?? baseMission.commentaires,
      space_name: d?.space_name ?? baseMission.space_name,
      city: d?.city ?? baseMission.city,
      client_name: d?.client_name ?? baseMission.client_name,
    };
    const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
    const isEnCours = isNow(m.date_debut, m.date_fin);
    const totalHours = m.total_hours || computeTotalHours(m.date_debut, m.date_fin) || 0;

    return (
      <View style={styles.detailContainer}>
        {/* Detail Header */}
        <View style={styles.detailHeader}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setView('list')}
            style={styles.btnBack}
          >
            <ArrowLeft size={13} color="#888" />
            <Text style={styles.btnBackText}>Retour</Text>
          </Pressable>

          <View style={styles.detailTitleWrap}>
            <Text style={styles.detailTitle}>{m.prestation_nom}</Text>
            <View style={styles.detailBadges}>
              {isProposed && (
                <View style={[styles.badge, styles.badgeDisponible]}>
                  <Text style={styles.badgeDisponibleText}>Disponible</Text>
                </View>
              )}
              {m.statut_reponse === 'acceptee' && (
                <View style={[styles.badge, styles.badgeAccepted]}>
                  <Text style={styles.badgeAcceptedText}>Acceptée</Text>
                </View>
              )}
              {m.statut_reponse === 'refusee' && (
                <View style={[styles.badge, styles.badgeDeclined]}>
                  <Text style={styles.badgeDeclinedText}>Refusée</Text>
                </View>
              )}
              {m.type_id ? (
                <View style={styles.badgeDtd}>
                  <Text style={styles.badgeDtdText}>{m.type_id}</Text>
                </View>
              ) : null}
              {m.prestation_type_detail ? (
                <View style={styles.badgeEvent}>
                  <Text style={styles.badgeEventText}>{m.prestation_type_detail}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Mission en cours Banner */}
        {isEnCours && (
          <View style={styles.activeBanner}>
            <View style={styles.activeBannerTop}>
              <View style={styles.activeIndicator}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeLabel}>Mission en cours</Text>
              </View>
              <View style={styles.activeTimerBlock}>
                <Text style={styles.activeTimerText}>{fmtTimer(timerSeconds)}</Text>
                <Text style={styles.activeTimerSub}>Temps restant</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(0, Math.min(100, 100 - (timerSeconds / (totalHours * 3600)) * 100)).toFixed(1)}%` },
                ]}
              />
            </View>
            <Text style={styles.activeTotalDuration}>
              Durée totale : {totalHours}h
            </Text>
          </View>
        )}

        {/* Retour prestation à compléter Banner */}
        <View style={styles.retourBanner}>
          <View style={styles.retourBannerIcon}>
            <ClipboardCheck size={18} color={colors.orangeDark} />
          </View>
          <View style={styles.retourBannerContent}>
            <Text style={styles.retourBannerTitle}>Retour prestation à compléter</Text>
            <Text style={styles.retourBannerSub}>
              Consommations, restes, satisfaction client, check-list de fermeture et photos.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setView('retour')}
            style={styles.btnCompleteRetour}
          >
            <Text style={styles.btnCompleteRetourText}>Compléter le retour</Text>
          </Pressable>
        </View>

        {/* Card 1: DATES & HORAIRES */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Calendar size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Dates & Horaires</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Calendar size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Date & Heure de début</Text>
              <Text style={styles.fieldValue}>
                {fmtDateFr(m.date_debut)} · {fmtTime(m.date_debut)}
              </Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Calendar size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Date & Heure de fin</Text>
              <Text style={styles.fieldValue}>
                {fmtDateFr(m.date_fin)} · {fmtTime(m.date_fin)}
              </Text>
            </View>
          </View>

          <View style={styles.durationBox}>
            <Timer size={14} color={colors.brown} />
            <View>
              <Text style={styles.durationLabel}>Durée totale de la prestation</Text>
              <Text style={styles.durationValue}>
                {totalHours} heures
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: LIEU & ADRESSE */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <MapPin size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Lieu & Adresse</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <MapPin size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Adresse de la prestation</Text>
              <Text style={[styles.fieldValue, styles.fieldValueHighlight]}>
                {m.adresse_exacte}
              </Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Building2 size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Site / Espace</Text>
              <Text style={styles.fieldValue}>{m.space_name}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <MapPin size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Ville</Text>
              <Text style={styles.fieldValue}>{m.city}</Text>
            </View>
          </View>
        </View>

        {/* Card 3: INFORMATIONS DE LA PRESTATION */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Briefcase size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Informations de la prestation</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <Text style={styles.fieldValue}>{m.prestation_nom}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Type de mission</Text>
              <Text style={styles.fieldValue}>{m.type_id}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Type de prestation</Text>
              <Text style={styles.fieldValue}>{m.prestation_type_detail}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <User size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Client</Text>
              <Text style={styles.fieldValue}>{m.client_name}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Briefcase size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tenue exigée</Text>
              <Text style={styles.fieldValue}>{m.tenue_exigee}</Text>
            </View>
          </View>

          {m.commentaires && (
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconWrap}>
                <MessageSquare size={12} color="#bbb" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Message & Instructions</Text>
                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsText}>{m.commentaires}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Card 4: CHOISISSEZ VOTRE CRÉNEAU */}
        {isProposed && (
          <View style={[styles.detailCard, styles.cardAccentBlue]}>
            <View style={styles.secHeader}>
              <Clock size={14} color="#1565c0" />
              <Text style={styles.secTitle}>Choisissez votre créneau</Text>
              <View style={styles.secBadge}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.orangeDark }}>
                  {m.available_slots?.length || 1} disponible
                </Text>
              </View>
            </View>

            {(m.available_slots || []).length === 0 ? (
              <Text style={styles.emptyAttachmentText}>
                Aucun créneau disponible pour votre métier sur cette prestation.
              </Text>
            ) : (
              (m.available_slots || []).map((slot, idx) => {
                const remaining = (slot.quantity || 1) - (slot.taken || 0);
                const netHours = computeSlotHours(
                  slot.heure_debut,
                  slot.heure_fin,
                  slot.coupure_debut,
                  slot.coupure_fin,
                );
                const isActingSlot = acting === `${m.id}acceptee`;
                return (
                  <View key={idx} style={styles.slotItem}>
                    <View style={styles.slotRow}>
                      <Award size={13} color={colors.orangeDark} />
                      <Text style={styles.slotLibelle}>{slot.libelle}</Text>
                      <View style={styles.slotHourPill}>
                        <Clock size={10} color="#1565c0" />
                        <Text style={styles.slotHourText}>
                          {slot.heure_debut} → {slot.heure_fin}
                        </Text>
                      </View>
                      {netHours ? (
                        <View style={styles.slotDurationPill}>
                          <Timer size={10} color={colors.brown} />
                          <Text style={styles.slotDurationText}>
                            {netHours.toFixed(1)}h{slot.coupure_debut ? ' net' : ''}
                          </Text>
                        </View>
                      ) : null}
                      <Text style={styles.slotRemainingText}>
                        {remaining} place{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
                      </Text>
                    </View>

                    {slot.coupure_debut && (
                      <View style={styles.slotPausePill}>
                        <Timer size={10} color="#f57f17" />
                        <Text style={styles.slotPauseText}>
                          Pause {slot.coupure_debut} → {slot.coupure_fin}
                        </Text>
                      </View>
                    )}

                    <Pressable
                      accessibilityRole="button"
                      disabled={isActingSlot}
                      onPress={() => handleAcceptSlot(m.id, slot)}
                      style={[styles.btnSlotAccept, isActingSlot && { opacity: 0.6 }]}
                    >
                      <CheckCircle2 size={12} color={colors.white} />
                      <Text style={styles.btnSlotAcceptText}>Accepter ce créneau</Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Card 5: LANGUES REQUISES */}
        {m.languages && m.languages.length > 0 && (
          <View style={styles.detailCard}>
            <View style={styles.secHeader}>
              <Globe size={14} color={colors.brown} />
              <Text style={styles.secTitle}>Langues requises</Text>
            </View>
            <View style={styles.languagesGrid}>
              {m.languages.map(lang => (
                <View key={lang} style={styles.langBadge}>
                  <Globe size={11} color="#1565c0" />
                  <Text style={styles.langBadgeText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Card 6: PIÈCES JOINTES */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Paperclip size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Pièces jointes</Text>
          </View>
          {detailLoading ? (
            <Text style={styles.emptyAttachmentText}>Chargement…</Text>
          ) : detailFiles.length > 0 ? (
            detailFiles.map((f, idx) => (
              <View key={f.id || idx} style={styles.fieldRow}>
                <View style={styles.fieldIconWrap}>
                  <Paperclip size={12} color="#bbb" />
                </View>
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldValue}>{f.name || f.original_name || `Fichier ${idx + 1}`}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyAttachmentText}>
              Aucune pièce jointe pour cette prestation.
            </Text>
          )}
        </View>

        {/* Bottom Action: Refuser cette prestation */}
        {isProposed && (
          <Pressable
            accessibilityRole="button"
            onPress={() => handleRefuseMission(m.id)}
            style={styles.btnRefuseFull}
          >
            <XCircle size={16} color="#9b1c1c" />
            <Text style={styles.btnRefuseFullText}>Refuser cette prestation</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Render Main List View
  return (
    <View>
      {/* Existing Page Heading */}
      <View style={[extras.pageHeading, { marginBottom: 16 }]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Prestations</Text>
        <Text style={extras.pageDescription}>
          Consultez et suivez vos prestations proposées, à venir, en cours et
          terminées.
        </Text>
      </View>

      {/* 5 Segmented Tabs matching screenshot-1 */}
      <View style={styles.tabsWrap}>
        <ScrollView
          contentContainerStyle={styles.tabsContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabItem,
                  tab.key === 'proposees' && styles.tabItemProposees,
                  active ? styles.tabItemActive : styles.tabItemInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.key === 'proposees' && proposedCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{proposedCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Bar with Date Inputs and Search Input */}
      <View style={styles.filterBar}>
        <DatePicker
          accessibilityLabel="Filtrer à partir du"
          allowClear
          colors={colors}
          onChange={setDateFilterStart}
          outputFormat="iso"
          placeholder="JJ/MM/AAAA"
          style={styles.filterDateBtn}
          textStyle={styles.filterDateText}
          value={dateFilterStart}
        />

        <DatePicker
          accessibilityLabel="Filtrer jusqu'au"
          allowClear
          colors={colors}
          onChange={setDateFilterEnd}
          outputFormat="iso"
          placeholder="JJ/MM/AAAA"
          style={styles.filterDateBtn}
          textStyle={styles.filterDateText}
          value={dateFilterEnd}
        />

        <View style={styles.filterSearchBox}>
          <Search size={13} color="#888" />
          <TextInput
            onChangeText={setSearchQuery}
            placeholder="Rechercher mission / client..."
            placeholderTextColor="#bbb"
            style={styles.filterSearchInput}
            value={searchQuery}
          />
          {searchQuery ? (
            <Pressable
              accessibilityLabel="Effacer la recherche"
              accessibilityRole="button"
              onPress={() => setSearchQuery('')}
            >
              <X size={14} color="#888" />
            </Pressable>
          ) : null}
        </View>

        {(dateFilterStart || dateFilterEnd || searchQuery) ? (
          <Pressable
            accessibilityLabel="Réinitialiser les filtres"
            accessibilityRole="button"
            onPress={() => {
              setDateFilterStart('');
              setDateFilterEnd('');
              setSearchQuery('');
            }}
            style={styles.filterClearBtn}
          >
            <X size={14} color={colors.brown} />
          </Pressable>
        ) : null}
      </View>

      {/* Mission Cards or Empty State */}
      {loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Chargement…</Text>
        </View>
      ) : filteredMissions.length === 0 ? (
        /* Empty State matching screenshot-1 */
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <Briefcase size={22} color={colors.orange} />
          </View>
          <Text style={styles.emptyTitle}>Aucune prestation disponible</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || dateFilterStart || dateFilterEnd
              ? 'Modifiez ou réinitialisez les filtres.'
              : activeTab === 'proposees'
              ? 'Vous serez notifié(e) quand une prestation correspond à votre profil.'
              : "Acceptez des missions depuis l'onglet Proposées."}
          </Text>
        </View>
      ) : (
        /* List of Mission Cards */
        <View style={styles.listContainer}>
          {filteredMissions.map(m => {
            const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
            const isAccepted = m.statut_reponse === 'acceptee';
            const isDeclined = m.statut_reponse === 'refusee';

            return (
              <View
                key={m.id}
                style={[
                  styles.card,
                  isProposed && styles.cardProposed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{m.prestation_nom}</Text>
                      {isProposed && (
                        <View style={[styles.badge, styles.badgeDisponible]}>
                          <Text style={styles.badgeDisponibleText}>Disponible</Text>
                        </View>
                      )}
                      {isAccepted && (
                        <View style={[styles.badge, styles.badgeAccepted]}>
                          <Text style={styles.badgeAcceptedText}>Acceptée</Text>
                        </View>
                      )}
                      {isDeclined && (
                        <View style={[styles.badge, styles.badgeDeclined]}>
                          <Text style={styles.badgeDeclinedText}>Refusée</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cardMetaRow}>
                      <View style={styles.cardMetaItem}>
                        <Calendar size={11} color="#888" />
                        <Text style={styles.cardMetaText}>{fmtDateFr(m.date_debut)}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Clock size={11} color="#888" />
                        <Text style={styles.cardMetaText}>
                          {fmtTime(m.date_debut)} — {fmtTime(m.date_fin)}
                        </Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <MapPin size={11} color="#888" />
                        <Text style={styles.cardMetaText}>{m.adresse_exacte}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Briefcase size={11} color={colors.orange} />
                        <Text style={styles.cardMetaText}>{m.space_name}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Text style={styles.cardMetaText}>
                          {[m.type_id, m.prestation_type_detail].filter(Boolean).join(' · ')}
                        </Text>
                      </View>
                    </View>

                    {/* Assigned slot if working */}
                    {m.my_slots && m.my_slots.length > 0 && (
                      <View style={styles.cardSlotTag}>
                        <Clock size={10} color="#1565c0" />
                        <Text style={styles.cardSlotTagText}>
                          Votre horaire de travail :{' '}
                          {m.my_slots
                            .map(sl => `${sl.heure_debut} → ${sl.heure_fin}`)
                            .join('  ·  ')}
                        </Text>
                      </View>
                    )}

                    {/* Available slot chip if available */}
                    {isProposed && m.available_slots && m.available_slots.length > 0 && (
                      <View style={styles.cardAvailSlotTag}>
                        <Users size={10} color="#4338ca" />
                        <Text style={styles.cardAvailSlotTagText}>
                          {m.available_slots.length} créneau
                          {m.available_slots.length > 1 ? 'x' : ''} pour votre métier
                        </Text>
                      </View>
                    )}

                    <Text style={styles.cardDaysUntil}>Aujourd'hui</Text>
                  </View>
                </View>

                {/* Card Action Buttons */}
                <View style={styles.cardActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedMission(m);
                      setView('detail');
                    }}
                    style={styles.btnVoir}
                  >
                    <Text style={styles.btnVoirText}>Voir</Text>
                    <ChevronRight size={12} color={colors.white} />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedMission(m);
                      setView('retour');
                    }}
                    style={styles.btnRetourAction}
                  >
                    <ClipboardCheck size={12} color={colors.white} />
                    <Text style={styles.btnRetourActionText}>Compléter le retour</Text>
                  </Pressable>

                  {isProposed && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleRefuseMission(m.id)}
                      style={styles.btnRefuseCard}
                    >
                      <XCircle size={11} color="#9b1c1c" />
                      <Text style={styles.btnRefuseCardText}>Refuser</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
