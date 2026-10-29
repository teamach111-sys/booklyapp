/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : Disponibilite
 * **Associated Route/Context**: `/extras (Tab/Modal: Disponibilite)`  
 * **Total Discovered Backend Calls**: 4
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Disponibilite.jsx:65`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Disponibilite.jsx#L65) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Disponibilite.jsx:76`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Disponibilite.jsx#L76) | User Action Handler (`handleAdd`) | `handleAdd` | `POST` | `/extra/availability` | `{ availabilities: [{ ...form` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Disponibilite.jsx:80`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Disponibilite.jsx#L80) | User Action Handler (`handleAdd`) | `handleAdd` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Disponibilite.jsx:91`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Disponibilite.jsx#L91) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/extra/availability/' + id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */
import { useState, useEffect, useCallback } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Info, Plus, Trash2 } from 'lucide-react-native';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { disponibilite as styles } from './styles';
import {
  getMyAvailabilities,
  addAvailability,
  deleteAvailability,
} from '../../../api/extraService';

// Port of the web "extra unavailability" page
// (staffly-frontend/src/pages/extras/components/Disponibilite.jsx + .css):
// the "Espace extra" page heading, a "you are available by default" notice, a
// declare form and the list of declared unavailabilities.
const DEFAULT_START = '09:00';
const DEFAULT_END = '18:00';

const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

function buildDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

// The web form uses a native <input type="date">; here the same value is typed
// as mm/dd/yyyy (the design placeholder) or as an ISO date.
function parseDateInput(value) {
  const trimmed = value.trim();
  let match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return buildDate(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return buildDate(Number(match[3]), Number(match[1]), Number(match[2]));
  }
  return null;
}

// The web form uses <input type="time">, displayed as 09:00 AM / 05:00 PM.
// Both 12-hour and 24-hour entries are accepted; minutes since midnight out.
function parseTimeInput(value) {
  const match = value.trim().match(/^(\d{1,2})[:h](\d{2})\s*(am|pm)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const suffix = match[3] ? match[3].toUpperCase() : null;
  if (suffix) {
    if (hours < 1 || hours > 12) return null;
    if (suffix === 'AM') hours = hours === 12 ? 0 : hours;
    else hours = hours === 12 ? 12 : hours + 12;
  }
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatDate(date) {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function daysLabel(date) {
  const days = Math.round((date - startOfToday()) / 86400000);
  if (days <= 0) return "Aujourd'hui";
  return `Dans ${days} jour${days > 1 ? 's' : ''}`;
}

export default function Disponibilite() {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [endTime, setEndTime] = useState(DEFAULT_END);
  const [reason, setReason] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyAvailabilities();
      const rows = Array.isArray(data) ? data : [];
      const unavail = rows
        .filter(r => r.type === 'unavailable' || (!r.type && !r.mission_id))
        .map(r => ({
          id: String(r.id),
          day: (() => { const d = new Date(r.available_date || r.date_debut || r.date); d.setHours(0,0,0,0); return d; })(),
          start: parseTimeInput(r.start || r.start_time || r.heure_debut || DEFAULT_START) ?? 9 * 60,
          end: parseTimeInput(r.end || r.end_time || r.heure_fin || DEFAULT_END) ?? 18 * 60,
          reason: r.description || r.comment || r.reason || r.commentaire || '',
        }))
        .filter(s => s.day >= startOfToday())
        .sort((a, b) => a.day - b.day);
      setSlots(unavail);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  async function handleAdd() {
    const day = parseDateInput(date);
    if (!day) {
      Alert.alert('Date requise', 'Choisissez une date.');
      return;
    }
    if (day < startOfToday()) {
      Alert.alert('Date invalide', 'Choisissez une date à venir.');
      return;
    }

    const start = parseTimeInput(startTime);
    const end = parseTimeInput(endTime);
    if (start === null || end === null) {
      Alert.alert('Horaires requis', 'Choisissez les heures de début et de fin.');
      return;
    }
    if (end <= start) {
      Alert.alert(
        'Horaires invalides',
        "L'heure de fin doit être postérieure à l'heure de début.",
      );
      return;
    }

    setAdding(true);
    try {
      const isoDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      await addAvailability({
        availabilities: [{
          available_date: isoDate,
          start_time: formatTime(start),
          end_time: formatTime(end),
          comment: reason.trim() || null,
        }],
      });
      setDate('');
      setReason('');
      setStartTime(DEFAULT_START);
      setEndTime(DEFAULT_END);
      await loadSlots();
      Alert.alert('Succès', 'Indisponibilité enregistrée.');
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d\'enregistrer l\'indisponibilité.');
    } finally {
      setAdding(false);
    }
  }

  function handleDelete(id) {
    Alert.alert(
      'Supprimer l\'indisponibilité',
      'Voulez-vous vraiment supprimer cette indisponibilité ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAvailability(id);
              await loadSlots();
              Alert.alert('Succès', 'Indisponibilité supprimée.');
            } catch (err) {
              Alert.alert('Erreur', err?.message || 'Impossible de supprimer.');
            }
          },
        },
      ],
    );
  }

  return (
    <View>
      {/* Page heading, same block as the other extras pages */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Indisponibilités</Text>
        <Text style={extras.pageDescription}>
          Déclarez vos indisponibilités et gardez votre planning à jour.
        </Text>
      </View>

      {/* "Vous êtes disponible par défaut" notice */}
      <View style={styles.notice}>
        <Info size={15} color="#B45309" />
        <Text style={styles.noticeText}>
          Vous êtes <Text style={styles.noticeStrong}>disponible par défaut</Text>
          . Indiquez uniquement les créneaux où vous n'êtes{' '}
          <Text style={styles.noticeStrong}>pas disponible</Text>.
        </Text>
      </View>

      {/* Déclarer une indisponibilité */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Déclarer une indisponibilité</Text>

        <View style={styles.formGrid}>
          <View style={styles.formRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Date</Text>
              <DatePicker
                accessibilityLabel="Date de l'indisponibilité"
                colors={colors}
                onChange={setDate}
                outputFormat="iso"
                placeholder="JJ/MM/AAAA"
                style={styles.pickerInput}
                textStyle={styles.pickerText}
                value={date}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Heure début</Text>
              <TimePicker
                accessibilityLabel="Heure de début de l'indisponibilité"
                colors={colors}
                onChange={setStartTime}
                outputFormat="24h"
                placeholder="09:00"
                style={styles.pickerInput}
                textStyle={styles.pickerText}
                value={startTime}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Heure fin</Text>
              <TimePicker
                accessibilityLabel="Heure de fin de l'indisponibilité"
                colors={colors}
                onChange={setEndTime}
                outputFormat="24h"
                placeholder="18:00"
                style={styles.pickerInput}
                textStyle={styles.pickerText}
                value={endTime}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                Raison{' '}
                <Text style={styles.fieldOptional}>(optionnel)</Text>
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={setReason}
                  placeholder="Ex: rendez-vous médical"
                  placeholderTextColor="#bbb"
                  style={styles.input}
                  value={reason}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formActions}>
          <Pressable
            accessibilityRole="button"
            disabled={adding}
            onPress={handleAdd}
            style={({ pressed }) => [
              styles.submitBtn,
              (pressed || adding) && styles.submitBtnPressed,
              adding && { opacity: 0.6 },
            ]}
          >
            <Plus size={14} color={colors.white} />
            <Text style={styles.submitText}>{adding ? 'Enregistrement…' : 'Marquer indisponible'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Indisponibilités déclarées */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Indisponibilités déclarées</Text>
          <Text style={styles.sectionCount}>{slots.length}</Text>
        </View>

        {loading ? (
          <Text style={styles.emptyState}>Chargement…</Text>
        ) : slots.length === 0 ? (
          <Text style={styles.emptyState}>Aucune indisponibilité à venir.</Text>
        ) : (
          <View style={styles.slotList}>
            {slots.map(slot => (
              <View key={slot.id} style={styles.slot}>
                <View style={styles.slotContent}>
                  <View style={styles.slotTypeRow}>
                    <View style={styles.slotDot} />
                    <Text style={styles.slotTypeLabel}>Indisponible</Text>
                  </View>
                  <Text style={styles.slotDate}>{formatDate(slot.day)}</Text>
                  <Text style={styles.slotTime}>
                    {formatTime(slot.start)} — {formatTime(slot.end)}
                  </Text>
                  {slot.reason ? (
                    <Text style={styles.slotNote}>{slot.reason}</Text>
                  ) : null}
                  <Text style={styles.slotDays}>{daysLabel(slot.day)}</Text>
                </View>

                <Pressable
                  accessibilityLabel={`Supprimer l'indisponibilité du ${formatDate(slot.day)}`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => handleDelete(slot.id)}
                  style={styles.slotDelete}
                >
                  <Trash2 size={14} color="#ccc" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
