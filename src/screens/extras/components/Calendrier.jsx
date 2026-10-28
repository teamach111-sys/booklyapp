/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : Calendrier
 * **Associated Route/Context**: `/extras (Tab/Modal: Calendrier)`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Calendrier.jsx:158`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L158) | User Action Handler (`Calendrier`) | `Calendrier` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Calendrier.jsx:202`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L202) | User Action Handler (`handleAdd`) | `handleAdd` | `POST` | `/extra/availability` | `{ availabilities:[{ available_date:form.available_date` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Calendrier.jsx:213`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L213) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/extra/availability/'+id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Ban,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  MessageSquare,
  Plus,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { calendrier as styles } from './styles';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';

// Port of the web "extra calendar" page
// (staffly-frontend/src/pages/extras/components/Calendrier.jsx + .css):
// month view, legend / summary / selected-day panels and the
// "Déclarer une indisponibilité" modal.
const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_NAMES = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const SHORT_MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];
const LONG_DAYS = [
  'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
];

const LEGEND = [
  { label: 'Mission à venir', color: '#EA580C' },
  { label: 'Mission en cours', color: '#16A34A' },
  { label: 'Mission passée', color: '#6B7280' },
  { label: 'Indisponible', color: '#DC2626' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '18:00';

function pad(value) {
  return String(value).padStart(2, '0');
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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

// The design uses native date/time inputs; on mobile the same values are typed
// as mm/dd/yyyy (or ISO) and as 09:00 AM / 06:00 PM.
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
  return `${pad(Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}`;
}

function formatMonthLabel(date) {
  const month = MONTH_NAMES[date.getMonth()];
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

// Card header in the design: "lundi 26 oct.".
function formatDayLabel(date) {
  return `${LONG_DAYS[date.getDay()]} ${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

// Month grid, weeks starting on Monday (the design's LUN → DIM columns).
function buildMonthGrid(viewMonth) {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();
  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from(
    { length: cellCount },
    (_, index) =>
      new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1 - offset + index),
  );
}

export default function Calendrier() {
  const [today] = useState(startOfToday);
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftDate, setDraftDate] = useState('');
  const [draftStart, setDraftStart] = useState(DEFAULT_START);
  const [draftEnd, setDraftEnd] = useState(DEFAULT_END);
  const [draftReason, setDraftReason] = useState('');

  // No mission data on the extras calendar yet; the design shows 0 as well.
  const missionCount = 0;
  const indispoCount = unavailabilities.length;

  const weeks = useMemo(() => {
    const cells = buildMonthGrid(viewMonth);
    const rows = [];
    for (let index = 0; index < cells.length; index += 7) {
      rows.push(cells.slice(index, index + 7));
    }
    return rows;
  }, [viewMonth]);

  const selectedItems = useMemo(
    () =>
      unavailabilities
        .filter(item => sameDay(item.day, selectedDate))
        .sort((a, b) => a.start - b.start),
    [unavailabilities, selectedDate],
  );

  function shiftMonth(delta) {
    setViewMonth(
      previous => new Date(previous.getFullYear(), previous.getMonth() + delta, 1),
    );
  }

  function goToToday() {
    const current = startOfToday();
    setSelectedDate(current);
    setViewMonth(new Date(current.getFullYear(), current.getMonth(), 1));
  }

  function selectDay(day) {
    setSelectedDate(day);
    if (
      day.getMonth() !== viewMonth.getMonth() ||
      day.getFullYear() !== viewMonth.getFullYear()
    ) {
      setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    }
  }

  function openModal() {
    setDraftDate(
      `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`,
    );
    setDraftStart(DEFAULT_START);
    setDraftEnd(DEFAULT_END);
    setDraftReason('');
    setModalOpen(true);
  }

  function handleSave() {
    const day = parseDateInput(draftDate);
    if (!day) {
      Alert.alert('Date requise', 'Choisissez une date.');
      return;
    }
    if (day < startOfToday()) {
      Alert.alert('Date invalide', 'Choisissez une date à venir.');
      return;
    }

    const start = parseTimeInput(draftStart);
    const end = parseTimeInput(draftEnd);
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

    setUnavailabilities(previous => [
      ...previous,
      { id: `${Date.now()}`, day, start, end, reason: draftReason.trim() },
    ]);
    setSelectedDate(day);
    setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    setModalOpen(false);
  }

  return (
    <View>
      {/* Page heading, same block as the other extras pages */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Calendrier</Text>
        <Text style={extras.pageDescription}>
          Visualisez vos missions et vos disponibilités mois par mois.
        </Text>
      </View>

      {/* "Vous êtes disponible par défaut" notice */}
      <View style={styles.notice}>
        <CircleAlert size={15} color="#f59e0b" />
        <Text style={styles.noticeText}>
          Vous êtes{' '}
          <Text style={styles.noticeStrong}>disponible par défaut</Text>.
          Cliquez sur un jour pour déclarer une indisponibilité.
        </Text>
      </View>

      {/* Mon calendrier + actions */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconTile}>
            <Calendar size={18} color={colors.orange} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mon calendrier</Text>
            <Text style={styles.headerSub}>
              {indispoCount} indisponibilité(s) · {missionCount} mission(s)
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            onPress={goToToday}
            style={styles.btnToday}
          >
            <Text style={styles.btnTodayText}>Aujourd'hui</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={openModal}
            style={styles.btnAccent}
          >
            <Ban size={13} color={colors.white} />
            <Text style={styles.btnAccentText}>Indisponibilité</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={openModal}
            style={styles.btnAdd}
          >
            <Plus size={13} color={colors.white} />
            <Text style={styles.btnAddText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      {/* Month view */}
      <View style={styles.calendarCard}>
        <View style={styles.toolbar}>
          <Pressable
            accessibilityLabel="Mois précédent"
            accessibilityRole="button"
            onPress={() => shiftMonth(-1)}
            style={styles.toolbarNav}
          >
            <ChevronLeft size={15} color="#888" />
          </Pressable>
          <Text style={styles.monthLabel}>{formatMonthLabel(viewMonth)}</Text>
          <Pressable
            accessibilityLabel="Mois suivant"
            accessibilityRole="button"
            onPress={() => shiftMonth(1)}
            style={styles.toolbarNav}
          >
            <ChevronRight size={15} color="#888" />
          </Pressable>
        </View>

        <View style={styles.weekHeaderRow}>
          {WEEKDAY_LABELS.map((label, index) => (
            <View key={label} style={styles.weekHeaderCell}>
              <Text
                style={[
                  styles.weekHeaderText,
                  index >= 5 && styles.weekHeaderTextWeekend,
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const inMonth =
                day.getMonth() === viewMonth.getMonth() &&
                day.getFullYear() === viewMonth.getFullYear();
              const isToday = sameDay(day, today);
              const isSelected = sameDay(day, selectedDate);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const hasUnavailability = unavailabilities.some(item =>
                sameDay(item.day, day),
              );

              return (
                <Pressable
                  key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => selectDay(day)}
                  style={[
                    styles.dayCell,
                    dayIndex < 6 && styles.dayCellRightBorder,
                    !inMonth && styles.dayCellOutside,
                    hasUnavailability && styles.dayCellUnavailable,
                    isToday && styles.dayCellToday,
                    isSelected && styles.dayCellSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.dayNumberWrap,
                      isToday && styles.dayNumberWrapToday,
                      isSelected && styles.dayNumberWrapSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        isWeekend && styles.dayNumberWeekend,
                        (isToday || isSelected) && styles.dayNumberOnAccent,
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Légende */}
      <View style={styles.sideCard}>
        <Text style={styles.sideCardTitle}>Légende</Text>
        <View style={styles.legendItems}>
          {LEGEND.map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Résumé */}
      <View style={styles.sideCard}>
        <Text style={styles.sideCardTitle}>Résumé</Text>
        <View style={styles.summaryRow}>
          <Briefcase size={13} color="#EA580C" />
          <Text style={styles.summaryLabel}>Missions</Text>
          <Text style={[styles.summaryValue, styles.summaryValueMission]}>
            {missionCount}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ban size={13} color="#DC2626" />
          <Text style={styles.summaryLabel}>Indisponibilités</Text>
          <Text style={[styles.summaryValue, styles.summaryValueUnavail]}>
            {indispoCount}
          </Text>
        </View>
      </View>

      {/* Selected day */}
      <View style={styles.dayCard}>
        <View style={styles.dayCardHeader}>
          <Text style={styles.dayCardDate}>{formatDayLabel(selectedDate)}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={openModal}
            style={styles.btnMiniIndispo}
          >
            <Plus size={10} color={colors.white} />
            <Text style={styles.btnMiniIndispoText}>Indispo</Text>
          </Pressable>
        </View>

        {selectedItems.length === 0 ? (
          <View style={styles.dayCardEmpty}>
            <CircleCheck size={20} color="#d1fae5" />
            <Text style={styles.dayCardEmptyText}>Libre ce jour</Text>
          </View>
        ) : (
          <View style={styles.shiftList}>
            {selectedItems.map(item => (
              <View key={item.id} style={styles.shiftItem}>
                <View style={styles.shiftTime}>
                  <Text style={styles.shiftTimeStart}>{formatTime(item.start)}</Text>
                  <Text style={styles.shiftTimeSep}>—</Text>
                  <Text style={styles.shiftTimeEnd}>{formatTime(item.end)}</Text>
                </View>
                <View style={styles.shiftInfo}>
                  <Text style={styles.shiftTitle}>Indisponible</Text>
                  {item.reason ? (
                    <Text style={styles.shiftDesc}>{item.reason}</Text>
                  ) : null}
                </View>
                <View style={styles.shiftBadge}>
                  <Text style={styles.shiftBadgeText}>Indisponible</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Déclarer une indisponibilité */}
      <Modal
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
        transparent
        visible={modalOpen}
      >
        <Pressable
          accessibilityLabel="Fermer la fenêtre"
          accessibilityRole="button"
          onPress={() => setModalOpen(false)}
          style={styles.sheetBackdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={styles.sheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Déclarer une indisponibilité</Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setModalOpen(false)}
                style={styles.sheetClose}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.sheetScroll}
            >
              <View style={styles.modalField}>
                <View style={styles.modalLabelRow}>
                  <Calendar size={11} color="#888" />
                  <Text style={styles.modalLabel}>Date</Text>
                </View>
                <DatePicker
                  accessibilityLabel="Date de l'indisponibilité"
                  colors={colors}
                  onChange={setDraftDate}
                  outputFormat="iso"
                  placeholder="JJ/MM/AAAA"
                  style={styles.modalInput}
                  value={draftDate}
                />
              </View>

              <View style={styles.modalFieldRow}>
                <View style={styles.modalFieldHalf}>
                  <View style={styles.modalLabelRow}>
                    <Clock size={11} color="#888" />
                    <Text style={styles.modalLabel}>Heure début</Text>
                  </View>
                  <TimePicker
                    accessibilityLabel="Heure de début"
                    colors={colors}
                    onChange={setDraftStart}
                    outputFormat="24h"
                    placeholder="09:00"
                    style={styles.modalInput}
                    value={draftStart}
                  />
                </View>
                <View style={styles.modalFieldHalf}>
                  <View style={styles.modalLabelRow}>
                    <Clock size={11} color="#888" />
                    <Text style={styles.modalLabel}>Heure fin</Text>
                  </View>
                  <TimePicker
                    accessibilityLabel="Heure de fin"
                    colors={colors}
                    onChange={setDraftEnd}
                    outputFormat="24h"
                    placeholder="18:00"
                    style={styles.modalInput}
                    value={draftEnd}
                  />
                </View>
              </View>

              <View style={styles.modalField}>
                <View style={styles.modalLabelRow}>
                  <MessageSquare size={11} color="#888" />
                  <Text style={styles.modalLabel}>
                    Raison <Text style={styles.modalOptional}>(optionnel)</Text>
                  </Text>
                </View>
                <TextInput
                  onChangeText={setDraftReason}
                  placeholder="Ex: rendez-vous médical, vacances..."
                  placeholderTextColor="#bbb"
                  style={styles.modalInput}
                  value={draftReason}
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setModalOpen(false)}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnCancelText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSave}
                  style={styles.btnSave}
                >
                  <CircleCheck size={14} color={colors.white} />
                  <Text style={styles.btnSaveText}>Enregistrer</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
