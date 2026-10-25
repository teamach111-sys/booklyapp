import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from 'lucide-react-native';
import { colors } from '../../../styles';

const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function startOfWeek(date) {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

function sameDay(first, second) {
  return first.toDateString() === second.toDateString();
}

function formatDateRange(start, end) {
  const firstDay = start.toLocaleDateString('fr-FR', { day: 'numeric' });
  const lastDay = end.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const month = start.toLocaleDateString('fr-FR', { month: 'short' });

  return `${firstDay} ${month} - ${lastDay}`;
}

function Metric({ label, value, icon: Icon }) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>
        <Icon size={17} color={colors.orangeDark} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function DateNavigation({ title, onPrevious, onNext, onToday }) {
  return (
    <View style={styles.dateNavigation}>
      <View style={styles.dateControls}>
        <Pressable
          accessibilityLabel="Période précédente"
          accessibilityRole="button"
          onPress={onPrevious}
          style={styles.arrowButton}
        >
          <ChevronLeft size={19} color={colors.brown} />
        </Pressable>
        <Text style={styles.dateTitle}>{title}</Text>
        <Pressable
          accessibilityLabel="Période suivante"
          accessibilityRole="button"
          onPress={onNext}
          style={styles.arrowButton}
        >
          <ChevronRight size={19} color={colors.brown} />
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onToday}
        style={styles.todayButton}
      >
        <Text style={styles.todayButtonText}>Aujourd’hui</Text>
      </Pressable>
    </View>
  );
}

export default function Calendrier() {
  const [view, setView] = useState('month');
  const [focusedDate, setFocusedDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

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
  const weekStart = startOfWeek(focusedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const isToday = sameDay(selectedDate, new Date());
  const monthTitle = focusedDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
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
    setSelectedDate(next);
  }

  function goToToday() {
    const today = new Date();
    setFocusedDate(today);
    setSelectedDate(today);
  }

  function chooseDate(date) {
    setSelectedDate(date);
    setFocusedDate(date);
  }

  return (
    <View style={styles.section}>
      <View style={styles.filterCard}>
        <View style={styles.filterIcon}>
          <MapPin size={17} color={colors.orangeDark} />
        </View>
        <View style={styles.filterCopy}>
          <Text style={styles.filterLabel}>Filtrer par espace</Text>
          <Text style={styles.filterValue}>Tous les espaces</Text>
        </View>
        <Text style={styles.activeSpace}>Site actif</Text>
      </View>

      <View style={styles.metrics}>
        {view === 'month' ? (
          <>
            <Metric
              label="Total prestations"
              value="0"
              icon={BriefcaseBusiness}
            />
            <Metric label="À venir" value="0" icon={CalendarDays} />
            <Metric label="En cours" value="0" icon={Clock3} />
            <Metric label="Passées" value="0" icon={Check} />
          </>
        ) : (
          <>
            <Metric label="Prestations" value="0" icon={BriefcaseBusiness} />
            <Metric
              label="Total estimé HT"
              value="0,00 €"
              icon={CalendarDays}
            />
            <Metric label="Jours travaillés" value="0/7" icon={Clock3} />
          </>
        )}
      </View>

      <View style={styles.calendarCard}>
        <DateNavigation
          title={
            view === 'month'
              ? monthTitle
              : formatDateRange(weekStart, weekDays[6])
          }
          onPrevious={() => movePeriod(-1)}
          onNext={() => movePeriod(1)}
          onToday={goToToday}
        />

        <View style={styles.viewToggle}>
          {['month', 'week'].map(mode => {
            const active = view === mode;
            return (
              <Pressable
                key={mode}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setView(mode)}
                style={[styles.viewOption, active && styles.viewOptionActive]}
              >
                <Text
                  style={[
                    styles.viewOptionText,
                    active && styles.viewOptionTextActive,
                  ]}
                >
                  {mode === 'month' ? 'Mois' : 'Semaine'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {view === 'month' ? (
          <>
            <View style={styles.monthGrid}>
              {weekdays.map(day => (
                <View key={day} style={styles.monthWeekday}>
                  <Text style={styles.monthWeekdayText}>{day}</Text>
                </View>
              ))}
              {monthDays.map(date => {
                const selected = sameDay(date, selectedDate);
                const inMonth = date.getMonth() === focusedDate.getMonth();
                const today = sameDay(date, new Date());
                return (
                  <Pressable
                    key={date.toISOString()}
                    accessibilityLabel={date.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => chooseDate(date)}
                    style={styles.monthDay}
                  >
                    <Text
                      style={[
                        styles.monthDayText,
                        !inMonth && styles.otherMonthDay,
                        today && styles.todayDay,
                        selected && styles.selectedDayText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.legend}>
              {[
                ['À venir', colors.orange],
                ['En cours', colors.success],
                ['Passée', colors.muted],
              ].map(([label, color]) => (
                <View key={label} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: color }]}
                  />
                  <Text style={styles.legendText}>{label}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.weekList}>
            {weekDays.map(date => {
              const selected = sameDay(date, selectedDate);
              return (
                <Pressable
                  key={date.toISOString()}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => chooseDate(date)}
                  style={[styles.weekDay, selected && styles.weekDaySelected]}
                >
                  <View style={styles.weekDayDate}>
                    <Text
                      style={[
                        styles.weekDayName,
                        selected && styles.selectedDayText,
                      ]}
                    >
                      {date.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text
                      style={[
                        styles.weekDayNumber,
                        selected && styles.selectedDayText,
                      ]}
                    >
                      {date.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.noAppointments,
                      selected && styles.selectedDayText,
                    ]}
                  >
                    Aucune prestation
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.upcomingCard}>
        <View style={styles.upcomingHeading}>
          <Text style={styles.upcomingTitle}>Prochaines prestations</Text>
          <Text style={styles.upcomingCount}>0</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <CalendarDays size={21} color={colors.orangeDark} />
          </View>
          <Text style={styles.emptyTitle}>Aucune prestation à venir</Text>
          <Text style={styles.emptyDescription}>
            Vos prochaines missions apparaîtront ici.
          </Text>
        </View>
      </View>

      <Text style={styles.selectedDate}>
        {selectedDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        {isToday ? ' · Aujourd’hui' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  filterCard: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  filterIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.palePink,
  },
  filterCopy: {
    flex: 1,
    gap: 3,
  },
  filterLabel: {
    color: colors.muted,
    fontSize: 11,
  },
  filterValue: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '600',
  },
  activeSpace: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    overflow: 'hidden',
    borderRadius: 9,
    backgroundColor: colors.cream,
    color: colors.orangeDark,
    fontSize: 10,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  metric: {
    width: '48%',
    minHeight: 76,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  metricIcon: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.palePink,
  },
  metricValue: {
    color: colors.brown,
    fontSize: 17,
    fontWeight: '700',
  },
  metricLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  calendarCard: {
    padding: 13,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrowButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  dateTitle: {
    flex: 1,
    color: colors.brown,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.cream,
  },
  todayButtonText: {
    color: colors.orangeDark,
    fontSize: 11,
    fontWeight: '600',
  },
  viewToggle: {
    padding: 3,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colors.cream,
  },
  viewOption: {
    flex: 1,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  viewOptionActive: {
    backgroundColor: colors.orange,
  },
  viewOptionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  viewOptionTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthWeekday: {
    width: '14.2857%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthWeekdayText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  monthDay: {
    width: '14.2857%',
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDayText: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    borderRadius: 15,
    color: colors.brown,
    fontSize: 12,
    lineHeight: 30,
    textAlign: 'center',
  },
  otherMonthDay: {
    color: colors.border,
  },
  todayDay: {
    borderWidth: 1,
    borderColor: colors.orange,
  },
  selectedDayText: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
    color: colors.white,
  },
  legend: {
    paddingTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    color: colors.muted,
    fontSize: 10,
  },
  weekList: {
    gap: 7,
  },
  weekDay: {
    minHeight: 48,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  weekDaySelected: {
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  weekDayDate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekDayName: {
    color: colors.brown,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  weekDayNumber: {
    color: colors.muted,
    fontSize: 10,
  },
  noAppointments: {
    color: colors.muted,
    fontSize: 10,
  },
  upcomingCard: {
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  upcomingHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingTitle: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '700',
  },
  upcomingCount: {
    color: colors.orangeDark,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 13,
    gap: 7,
  },
  emptyIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.cream,
  },
  emptyTitle: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyDescription: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
  selectedDate: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
