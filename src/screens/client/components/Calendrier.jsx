/*
### Screen: Extras Portal : Calendrier
**Associated Route/Context**: `/extras (Tab/Modal: Calendrier)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Calendrier.jsx:158`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L158) | User Action Handler (`Calendrier`) | `Calendrier` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Calendrier.jsx:202`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L202) | User Action Handler (`handleAdd`) | `handleAdd` | `POST` | `/extra/availability` | `{ availabilities:[{ available_date:form.available_date` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Calendrier.jsx:213`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Calendrier.jsx#L213) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/extra/availability/'+id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

/*
### Screen: Admin Portal : AdminCalendrierMissions
**Associated Route/Context**: `/admin (Tab/Modal: AdminCalendrierMissions)`  
**Total Discovered Backend Calls**: 1

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminCalendrierMissions.jsx:162`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminCalendrierMissions.jsx#L162) | User Action Handler (`AdminCalendrierMissions`) | `AdminCalendrierMissions` | `GET` | `/admin/calendar/missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Calendrier
 * **Associated Route/Context**: `/client (Tab/Modal: Calendrier)`  
 * **Total Discovered Backend Calls**: 1
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Calendrier.jsx:195`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Calendrier.jsx#L195) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/client/calendar/missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
 * 
 * =====================================================================
 */
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { createBrandStyles } from '../theme/clientStyles';
import { useClientSites } from '../state/SitesContext';
import BottomSheet from './BottomSheet';
import { getClientCalendarMissions } from '../../../api/clientService';

const weekdays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

const STATUS_CONFIG = {
  upcoming: { label: 'Prestation à venir', color: '#e65100', bg: '#FFF3E0', dot: '#FB8C00' },
  ongoing: { label: 'Prestation en cours', color: '#2e7d32', bg: '#EAF5EA', dot: '#43A047' },
  past: { label: 'Prestation passée', color: '#757575', bg: '#F0F0F0', dot: '#BDBDBD' },
};

function getStatus(m) {
  const now = new Date();
  const start = new Date(m.date_debut);
  const end = new Date(m.date_fin);
  if (end < now) return 'past';
  if (start <= now && end >= now) return 'ongoing';
  return 'upcoming';
}

function startOfWeek(date) {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

function sameDay(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatMonthTitle(date) {
  const str = date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatWeekRange(start, end) {
  const startDay= start.getDate();
  const startMonth = start.toLocaleDateString('fr-FR', { month: 'short' });
  const endDay = end.getDate();
  const endMonth = end.toLocaleDateString('fr-FR', { month: 'short' });
  const year = end.getFullYear();

  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
}

function formatDayCardDate(date) {
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });
  return `${day} ${month}`;
}

function formatModalDate(date) {
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capitalizedWeekday} ${day} ${capitalizedMonth}`;
}

function fmtTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtMoney(n) {
  if (n == null) return '—';
  return (
    Number(n).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

function fmtHours(start, end) {
  if (!start || !end) return null;
  const h = (new Date(end) - new Date(start)) / 3600000;
  if (!h || h <= 0) return null;
  return (Number.isInteger(h) ? h : h.toFixed(1)) + 'h';
}

const PAIEMENT_LABELS = {
  en_attente: 'En attente',
  paye: 'Payé',
  litige: 'Litige',
  non_generee: 'Non générée',
};

export default function Calendrier() {
  const { partner, colors } = useClientTheme();
  const styles = stylesByBrand[partner];
  const { selectableSites } = useClientSites();

  const [view, setView] = useState('month');
  const [focusedDate, setFocusedDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientCalendarMissions()
      .then(data => setMissions(Array.isArray(data) ? data : []))
      .catch(() => setMissions([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter by space (mirrors the web frontend) ──
  const visibleMissions =
    activeFilter === 'ALL'
      ? missions
      : missions.filter(m => {
          const space = selectableSites.find(
            s => String(s.id) === String(activeFilter),
          );
          if (!space) return true;
          return (
            m.city === space.city || m.space_name === space.space_name
          );
        });

  // ── Index missions by date string for O(1) lookup ──
  const visibleByDate = {};
  visibleMissions.forEach(m => {
    const key = new Date(m.date_debut).toDateString();
    if (!visibleByDate[key]) visibleByDate[key] = [];
    visibleByDate[key].push(m);
  });

  // Month grid: 42 cells (6 weeks) starting from the Monday before/on the 1st
  const monthStart = new Date(
    focusedDate.getFullYear(),
    focusedDate.getMonth(),
    1,
  );
  const monthGridStart = new Date(monthStart);
  monthGridStart.setDate(
    monthStart.getDate() - ((monthStart.getDay() + 6) % 7),
  );
  const monthDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(monthGridStart);
    date.setDate(monthGridStart.getDate() + index);
    return date;
  });

  const monthWeeks = [
    monthDays.slice(0, 7),
    monthDays.slice(7, 14),
    monthDays.slice(14, 21),
    monthDays.slice(21, 28),
    monthDays.slice(28, 35),
    monthDays.slice(35, 42),
  ];

  // Week days: 7 days starting from Monday
  const weekStart = startOfWeek(focusedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  function movePeriod(direction) {
    const next = new Date(focusedDate);
    if (view === 'month') {
      next.setDate(1);
      next.setMonth(focusedDate.getMonth() + direction);
    } else {
      next.setDate(focusedDate.getDate() + direction * 7);
    }
    setFocusedDate(next);
  }

  function goToToday() {
    const today = new Date();
    setFocusedDate(today);
    setSelectedDate(today);
  }

  function onSelectDay(date) {
    setSelectedDate(date);
    setModalVisible(true);
  }

  // ── Stats by temporal status (month mode) ──
  const countTotal = visibleMissions.length;
  const countUpcoming = visibleMissions.filter(
    m => getStatus(m) === 'upcoming',
  ).length;
  const countOngoing = visibleMissions.filter(
    m => getStatus(m) === 'ongoing',
  ).length;
  const countPast = visibleMissions.filter(
    m => getStatus(m) === 'past',
  ).length;

  // ── Stats for the displayed week (week mode) ──
  const weekMissions =
    view === 'week'
      ? weekDays.flatMap(d => visibleByDate[d.toDateString()] || [])
      : [];
  const weekTotal = weekMissions.reduce(
    (s, m) => s + (Number(m.total_ht) || 0),
    0,
  );
  const weekJoursTravailles =
    view === 'week'
      ? weekDays.filter(
          d => (visibleByDate[d.toDateString()] || []).length > 0,
        ).length
      : 0;

  // ── Upcoming prestations for side panel ──
  const upcomingMissions = visibleMissions
    .filter(m => getStatus(m) !== 'past')
    .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
    .slice(0, 8);

  // ── Missions for the selected day (modal) ──
  const selectedDayMissions =
    visibleByDate[selectedDate.toDateString()] || [];
  const selectedDayTotal = selectedDayMissions.reduce(
    (s, m) => s + (Number(m.total_ht) || 0),
    0,
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingVertical: 60, alignItems: 'center' }]}>
        <ActivityIndicator size="small" color={colors.orange} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Filter Row */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>FILTRER :</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveFilter('ALL')}
          style={[
            styles.filterPill,
            activeFilter === 'ALL' && styles.filterPillActive,
          ]}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === 'ALL' && styles.filterPillTextActive,
            ]}
          >
            Tous les espaces
          </Text>
        </Pressable>
        {selectableSites.map(space => (
          <Pressable
            key={space.id}
            accessibilityRole="button"
            onPress={() => setActiveFilter(space.id)}
            style={[
              styles.filterPill,
              activeFilter === space.id && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === space.id && styles.filterPillTextActive,
              ]}
            >
              {space.city || space.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 2. Stat Cards Row */}
      {view === 'month' ? (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, styles.statNumPrimary]}>
                {countTotal}
              </Text>
              <Text style={styles.statLabel}>TOTAL PRESTATIONS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, styles.statNumWarning]}>
                {countUpcoming}
              </Text>
              <Text style={styles.statLabel}>PRESTATION À VENIR</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, styles.statNumSuccess]}>
                {countOngoing}
              </Text>
              <Text style={styles.statLabel}>PRESTATION EN COURS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, styles.statNumMuted]}>
                {countPast}
              </Text>
              <Text style={styles.statLabel}>PRESTATIONS PASSÉES</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, styles.statNumPrimary]}>
              {weekMissions.length}
            </Text>
            <Text style={styles.statLabel}>PRESTATIONS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, styles.statNumPrimary]}>
              {fmtMoney(weekTotal)}
            </Text>
            <Text style={styles.statLabel}>TOTAL ESTIMÉ HT</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, styles.statNumDark]}>
              {weekJoursTravailles}/7
            </Text>
            <Text style={styles.statLabel}>JOURS TRAVAILLÉS</Text>
          </View>
        </View>
      )}

      {/* 3. Main Calendar Container */}
      <View style={styles.calWrapper}>
        {/* Navigation Toolbar */}
        <View style={styles.calNav}>
          <View style={styles.calNavHeaderRow}>
            <Pressable
              accessibilityLabel="Période précédente"
              accessibilityRole="button"
              onPress={() => movePeriod(-1)}
              style={styles.calNavBtn}
            >
              <ChevronLeft size={16} color={colors.orange} />
            </Pressable>

            <Text numberOfLines={1} style={styles.calMonthTitle}>
              {view === 'month'
                ? formatMonthTitle(focusedDate)
                : formatWeekRange(weekStart, weekDays[6])}
            </Text>

            <Pressable
              accessibilityLabel="Période suivante"
              accessibilityRole="button"
              onPress={() => movePeriod(1)}
              style={styles.calNavBtn}
            >
              <ChevronRight size={16} color={colors.orange} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={goToToday}
              style={styles.calTodayBtn}
            >
              <Text style={styles.calTodayBtnText}>Aujourd'hui</Text>
            </Pressable>
          </View>

          {/* View Toggle */}
          <View style={styles.calNavToggle}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: view === 'month' }}
              onPress={() => setView('month')}
              style={[
                styles.calToggleOption,
                view === 'month' && styles.calToggleOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.calToggleOptionText,
                  view === 'month' && styles.calToggleOptionTextActive,
                ]}
              >
                Mois
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: view === 'week' }}
              onPress={() => setView('week')}
              style={[
                styles.calToggleOption,
                view === 'week' && styles.calToggleOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.calToggleOptionText,
                  view === 'week' && styles.calToggleOptionTextActive,
                ]}
              >
                Semaine
              </Text>
            </Pressable>
          </View>
        </View>

        {/* View Content */}
        {view === 'month' ? (
          <>
            {/* Weekday Header */}
            <View style={styles.calGridHeader}>
              {weekdays.map(day => (
                <View key={day} style={styles.calDayHeaderCell}>
                  <Text style={styles.calDayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Month Day Cells by Week Rows */}
            <View style={styles.calGrid}>
              {monthWeeks.map((week, wIdx) => (
                <View key={wIdx} style={styles.calWeekRow}>
                  {week.map((date, dIdx) => {
                    const inMonth = date.getMonth() === focusedDate.getMonth();
                    const today = sameDay(date, new Date());
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const dayMissions =
                      visibleByDate[date.toDateString()] || [];

                    return (
                      <Pressable
                        key={dIdx}
                        accessibilityLabel={date.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                        accessibilityRole="button"
                        onPress={() => onSelectDay(date)}
                        style={[
                          styles.calCell,
                          dIdx === 6 && styles.calCellLastInRow,
                          wIdx === 5 && styles.calCellLastRow,
                          !inMonth && styles.calCellOffRange,
                          today && styles.calCellToday,
                        ]}
                      >
                        <View
                          style={[
                            styles.calDayNumWrap,
                            today && styles.calDayNumWrapToday,
                          ]}
                        >
                          <Text
                            style={[
                              styles.calDayNum,
                              !inMonth && styles.calDayNumOffRange,
                              isWeekend &&
                                inMonth &&
                                !today &&
                                styles.calDayNumWeekend,
                              today && styles.calDayNumToday,
                            ]}
                          >
                            {date.getDate()}
                          </Text>
                        </View>
                        {/* Mission dots — colored by temporal status */}
                        <View style={styles.calDots}>
                          {dayMissions.slice(0, 3).map((m, mi) => {
                            const status = getStatus(m);
                            return (
                              <View
                                key={mi}
                                style={[
                                  styles.calDot,
                                  { backgroundColor: STATUS_CONFIG[status].dot },
                                ]}
                              />
                            );
                          })}
                          {dayMissions.length > 3 ? (
                            <Text style={styles.calDotMore}>
                              +{dayMissions.length - 3}
                            </Text>
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={styles.calLegend}>
              <View style={styles.calLegendItem}>
                <View style={[styles.calDot, styles.calDotUpcoming]} />
                <Text style={styles.calLegendText}>Prestation à venir</Text>
              </View>
              <View style={styles.calLegendItem}>
                <View style={[styles.calDot, styles.calDotOngoing]} />
                <Text style={styles.calLegendText}>Prestation en cours</Text>
              </View>
              <View style={styles.calLegendItem}>
                <View style={[styles.calDot, styles.calDotPast]} />
                <Text style={styles.calLegendText}>Prestation passée</Text>
              </View>
            </View>
          </>
        ) : (
          /* Week View: 7 Day Cards with mission items */
          <ScrollView
            style={styles.calDaygridScroll}
            contentContainerStyle={styles.calDaygrid}
            showsVerticalScrollIndicator={false}
          >
            {weekDays.map(date => {
              const today = sameDay(date, new Date());
              const dayName = date.toLocaleDateString('fr-FR', {
                weekday: 'long',
              });
              const capitalizedDayName =
                dayName.charAt(0).toUpperCase() + dayName.slice(1);
              const dayMissions =
                visibleByDate[date.toDateString()] || [];
              const dayTotal = dayMissions.reduce(
                (s, m) => s + (Number(m.total_ht) || 0),
                0,
              );

              return (
                <Pressable
                  key={date.toISOString()}
                  accessibilityRole="button"
                  onPress={() => onSelectDay(date)}
                  style={[styles.calDaycard, today && styles.calDaycardToday]}
                >
                  <View style={styles.calDaycardHeader}>
                    <Text style={styles.calDaycardName}>
                      {capitalizedDayName}
                    </Text>
                    <Text style={styles.calDaycardDate}>
                      {formatDayCardDate(date)}
                    </Text>
                  </View>
                  <View style={styles.calDaycardBody}>
                    {dayMissions.length === 0 ? (
                      <Text style={styles.calDaycardEmpty}>
                        Aucune prestation
                      </Text>
                    ) : (
                      dayMissions.map(m => (
                        <View key={m.id} style={styles.calDaycardItem}>
                          <Text
                            style={styles.calDaycardItemName}
                            numberOfLines={1}
                          >
                            {m.prestation_nom}
                          </Text>
                          <Text style={styles.calDaycardItemMeta}>
                            {fmtTime(m.date_debut)}–{fmtTime(m.date_fin)} ·{' '}
                            {m.staff_accepted || 0} extra
                            {(m.staff_accepted || 0) > 1 ? 's' : ''}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                  {dayMissions.length > 0 ? (
                    <Text style={styles.calDaycardTotal}>
                      {fmtMoney(dayTotal)}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* 4. Upcoming Prestations Panel (Month View Only) */}
      {view === 'month' ? (
        <View style={styles.calSide}>
          <Text style={styles.calSideTitle}>PROCHAINES PRESTATIONS</Text>
          {upcomingMissions.length === 0 ? (
            <Text style={styles.calSideEmpty}>
              Aucune prestation à venir.
            </Text>
          ) : (
            <View style={styles.calSideList}>
              {upcomingMissions.map(m => {
                const status = getStatus(m);
                const cfg = STATUS_CONFIG[status];
                return (
                  <View
                    key={m.id}
                    style={[
                      styles.eventCard,
                      { backgroundColor: cfg.bg, borderColor: cfg.color + '33' },
                    ]}
                  >
                    <View style={styles.eventCardLeft}>
                      <Text style={styles.eventCardName} numberOfLines={1}>
                        {m.prestation_nom}
                      </Text>
                      <Text style={styles.eventCardTime}>
                        {fmtTime(m.date_debut)} — {fmtTime(m.date_fin)}
                      </Text>
                      {m.space_name ? (
                        <Text style={[styles.eventCardSpace, { color: cfg.color }]}>
                          {m.space_name}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={[
                        styles.eventCardBadge,
                        { backgroundColor: cfg.bg, borderColor: cfg.color + '33' },
                      ]}
                    >
                      <Text style={[styles.eventCardBadgeText, { color: cfg.color }]}>
                        {cfg.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ) : null}

      {/* 5. Day Detail Modal */}
      <BottomSheet
        onClose={() => setModalVisible(false)}
        showClose
        title={formatModalDate(selectedDate)}
        visible={modalVisible}
      >
        <View style={styles.modalContent}>
          {selectedDayMissions.length === 0 ? (
            <Text style={styles.modalEmptyText}>
              Aucune prestation ce jour.
            </Text>
          ) : (
            <>
              <View style={styles.modalMissionList}>
                {selectedDayMissions.map(m => {
                  const hours = fmtHours(m.date_debut, m.date_fin);
                  return (
                    <View key={m.id} style={styles.modalMission}>
                      <View style={styles.modalMissionLeft}>
                        <Text style={styles.modalMissionName} numberOfLines={2}>
                          {m.prestation_nom}
                        </Text>
                        <Text style={styles.modalMissionMeta}>
                          {fmtTime(m.date_debut)} – {fmtTime(m.date_fin)}
                          {hours ? ` · ${hours}` : ''}
                          {' · '}
                          {m.staff_accepted || 0} extra
                          {(m.staff_accepted || 0) > 1 ? 's' : ''}
                        </Text>
                      </View>
                      <Text style={styles.modalMissionPrice}>
                        {fmtMoney(m.total_ht)}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.modalFooter}>
                <View>
                  <Text style={styles.modalFooterLabel}>
                    Total journée estimé
                  </Text>
                  <Text style={styles.modalFooterSub}>
                    {selectedDayMissions.length} prestation
                    {selectedDayMissions.length > 1 ? 's' : ''} · hors taxes
                  </Text>
                </View>
                <Text style={styles.modalFooterTotal}>
                  {fmtMoney(selectedDayTotal)}
                </Text>
              </View>
            </>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}

const createStyles = colors => StyleSheet.create({
  container: {
    gap: 12,
  },

  /* ── Filter Row ── */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  filterPillActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  filterPillTextActive: {
    color: colors.white,
  },

  /* ── Stats Container & Rows ── */
  statsContainer: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statNumPrimary: {
    color: colors.orange,
  },
  statNumWarning: {
    color: '#E65100',
  },
  statNumSuccess: {
    color: '#2E7D32',
  },
  statNumMuted: {
    color: '#757575',
  },
  statNumDark: {
    color: colors.orangeDark,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  /* ── Calendar Wrapper ── */
  calWrapper: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    overflow: 'hidden',
  },

  /* ── Calendar Nav Toolbar ── */
  calNav: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
    gap: 10,
  },
  calNavHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  calNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.orangeDark,
    textAlign: 'center',
    includeFontPadding: false,
  },
  calTodayBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0C8',
    backgroundColor: colors.white,
  },
  calTodayBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orange,
  },
  calNavToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F0EC',
    borderRadius: 22,
    padding: 3,
  },
  calToggleOption: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calToggleOptionActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  calToggleOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  calToggleOptionTextActive: {
    color: colors.orange,
    fontWeight: '700',
  },

  /* ── Month Grid Header ── */
  calGridHeader: {
    flexDirection: 'row',
    backgroundColor: '#FAF6F4',
    borderBottomWidth: 1,
    borderBottomColor: '#ECDDD6',
    paddingVertical: 8,
  },
  calDayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
  },

  /* ── Month Grid Days ── */
  calGrid: {
    flexDirection: 'column',
  },
  calWeekRow: {
    flexDirection: 'row',
  },
  calCell: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EDE9',
    borderRightWidth: 1,
    borderRightColor: '#F5EDE9',
  },
  calCellLastInRow: {
    borderRightWidth: 0,
  },
  calCellLastRow: {
    borderBottomWidth: 0,
  },
  calCellOffRange: {
    opacity: 0.35,
  },
  calCellToday: {
    backgroundColor: '#FEF5F0',
  },
  calDayNumWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  calDayNumWrapToday: {
    backgroundColor: colors.orange,
  },
  calDayNum: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  calDayNumOffRange: {
    color: '#999',
  },
  calDayNumWeekend: {
    color: '#C25E2E',
  },
  calDayNumToday: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  calDots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    minHeight: 6,
    alignItems: 'center',
  },
  calDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  calDotMore: {
    fontSize: 8,
    fontWeight: '700',
    color: '#AAA',
  },
  calDotUpcoming: {
    backgroundColor: '#FB8C00',
  },
  calDotOngoing: {
    backgroundColor: '#43A047',
  },
  calDotPast: {
    backgroundColor: '#BDBDBD',
  },

  /* ── Legend ── */
  calLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
  },
  calLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calLegendText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  /* ── Week View Day Cards ── */
  calDaygridScroll: {
    maxHeight: 380,
  },
  calDaygrid: {
    padding: 12,
    gap: 10,
  },
  calDaycard: {
    backgroundColor: '#FDF9F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  calDaycardToday: {
    borderColor: colors.orange,
    backgroundColor: '#FFF6F0',
  },
  calDaycardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  calDaycardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  calDaycardDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#BBB',
  },
  calDaycardBody: {
    paddingTop: 10,
    gap: 6,
  },
  calDaycardEmpty: {
    fontSize: 12,
    color: '#CCC',
  },
  calDaycardItem: {
    gap: 1,
  },
  calDaycardItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  calDaycardItemMeta: {
    fontSize: 11,
    color: '#888',
  },
  calDaycardTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orange,
    marginTop: 8,
    textAlign: 'right',
  },

  /* ── Upcoming Prestations Card (Month View) ── */
  calSide: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDDD6',
    padding: 16,
  },
  calSideTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orangeDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DD',
  },
  calSideEmpty: {
    fontSize: 13,
    color: '#BBB',
    paddingVertical: 12,
  },
  calSideList: {
    paddingTop: 10,
    gap: 8,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  eventCardLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eventCardName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  eventCardTime: {
    fontSize: 11,
    color: '#888',
  },
  eventCardSpace: {
    fontSize: 10,
    fontWeight: '600',
  },
  eventCardBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  eventCardBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  /* ── Day Detail Modal ── */
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalEmptyText: {
    fontSize: 13,
    color: '#BBB',
    paddingVertical: 16,
  },
  modalMissionList: {
    gap: 10,
    paddingVertical: 8,
  },
  modalMission: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FAF6F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECDDD6',
  },
  modalMissionLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  modalMissionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalMissionMeta: {
    fontSize: 11,
    color: '#888',
  },
  modalMissionPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orange,
    flexShrink: 0,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0E4DD',
  },
  modalFooterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
  },
  modalFooterSub: {
    fontSize: 11,
    color: '#BBB',
    marginTop: 2,
  },
  modalFooterTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.orange,
  },
});

const stylesByBrand = createBrandStyles(createStyles);
