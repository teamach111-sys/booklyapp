import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors as appColors } from '../styles';

// Themed date picker used everywhere a date is typed in the app.
//
// The app ships two brand palettes (bookly / staffly), so this picker takes the
// palette of the screen it is rendered in and paints its calendar with it —
// something the native Android dialog cannot do. It reads the same string
// formats the screens already use and writes back in `outputFormat`, so
// swapping an input for it needs no data-model change.

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const pad = value => String(value).padStart(2, '0');

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const french = /^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/.exec(String(value));
  if (french) {
    return new Date(Number(french[3]), Number(french[2]) - 1, Number(french[1]));
  }
  return null;
}

function formatDate(date, format) {
  if (!date) return '';
  if (format === 'iso') {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function buildMonth(monthDate) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  const count = Math.ceil((offset + daysInMonth) / 7) * 7;
  const cells = Array.from(
    { length: count },
    (_, index) =>
      new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 - offset + index),
  );
  const weeks = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'JJ/MM/AAAA',
  outputFormat = 'iso',
  displayFormat = 'dmy',
  minimumDate,
  maximumDate,
  colors = appColors,
  style,
  textStyle,
  disabled = false,
  allowClear = false,
  accessibilityLabel,
  iconColor,
  showIcon = true,
}) {
  const selected = useMemo(() => parseDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() =>
    new Date(
      (selected || new Date()).getFullYear(),
      (selected || new Date()).getMonth(),
      1,
    ),
  );

  useEffect(() => {
    if (!open) return;
    const base = selected || new Date();
    setMonth(new Date(base.getFullYear(), base.getMonth(), 1));
  }, [open, selected]);

  const today = startOfDay(new Date());
  const weeks = useMemo(() => buildMonth(month), [month]);

  const isDisabled = day => {
    const min = parseDate(minimumDate);
    const max = parseDate(maximumDate);
    const stamp = startOfDay(day).getTime();
    if (min && stamp < startOfDay(min).getTime()) return true;
    if (max && stamp > startOfDay(max).getTime()) return true;
    return false;
  };

  const commit = day => {
    if (isDisabled(day)) return;
    onChange(formatDate(day, outputFormat));
    setOpen(false);
  };

  const display = selected
    ? displayFormat === 'mdy'
      ? `${pad(selected.getMonth() + 1)}/${pad(selected.getDate())}/${selected.getFullYear()}`
      : formatDate(selected, 'dmy')
    : '';

  const triggerColor = { color: display ? colors.brown : '#bbb' };
  const selectedCircle = { backgroundColor: colors.orange };
  const todayCircle = { borderWidth: 1.5, borderColor: colors.orange };
  const disabledText = { color: '#ddd' };

  return (
    <>
      <Pressable
        accessibilityLabel={accessibilityLabel || placeholder}
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { borderColor: colors.border, backgroundColor: colors.white },
          !showIcon && styles.triggerCentered,
          style,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.triggerText, triggerColor, textStyle]}
        >
          {display || placeholder}
        </Text>
        {showIcon ? (
          <CalendarDays size={14} color={iconColor || colors.orangeDark} />
        ) : null}
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <Pressable
          accessibilityLabel="Fermer le calendrier"
          accessibilityRole="button"
          onPress={() => setOpen(false)}
          style={styles.backdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={[styles.sheet, { backgroundColor: colors.white }]}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.orangeDark }]}>
                Sélectionner une date
              </Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setOpen(false)}
                style={styles.close}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            <View style={styles.monthRow}>
              <Pressable
                accessibilityLabel="Mois précédent"
                accessibilityRole="button"
                onPress={() =>
                  setMonth(
                    previous =>
                      new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
                  )
                }
                style={[styles.navButton, { borderColor: colors.border }]}
              >
                <ChevronLeft size={16} color={colors.orangeDark} />
              </Pressable>
              <Text style={[styles.monthLabel, { color: colors.orangeDark }]}>
                {MONTHS[month.getMonth()]} {month.getFullYear()}
              </Text>
              <Pressable
                accessibilityLabel="Mois suivant"
                accessibilityRole="button"
                onPress={() =>
                  setMonth(
                    previous =>
                      new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
                  )
                }
                style={[styles.navButton, { borderColor: colors.border }]}
              >
                <ChevronRight size={16} color={colors.orangeDark} />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {WEEKDAYS.map((day, index) => (
                <Text
                  key={`${day}-${index}`}
                  style={[styles.weekday, { color: colors.muted }]}
                >
                  {day}
                </Text>
              ))}
            </View>

            {weeks.map((week, weekIndex) => (
              <View key={`week-${weekIndex}`} style={styles.week}>
                {week.map(day => {
                  const outside = day.getMonth() !== month.getMonth();
                  const isSelected = !!(selected && isSameDay(day, selected));
                  const isToday = isSameDay(day, today);
                  const dayDisabled = isDisabled(day);
                  return (
                    <Pressable
                      key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      disabled={dayDisabled}
                      onPress={() => commit(day)}
                      style={styles.dayCell}
                    >
                      <View
                        style={[
                          styles.dayCircle,
                          isSelected && selectedCircle,
                          !isSelected && isToday && todayCircle,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            {
                              color: isSelected
                                ? colors.white
                                : outside
                                  ? '#c9b8a8'
                                  : colors.brown,
                            },
                            dayDisabled && disabledText,
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

            <View style={styles.footer}>
              {allowClear ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onChange('');
                    setOpen(false);
                  }}
                  style={styles.footerButton}
                >
                  <Text style={[styles.footerText, { color: colors.muted }]}>
                    Effacer
                  </Text>
                </Pressable>
              ) : (
                <View />
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => commit(new Date())}
                style={styles.footerButton}
              >
                <Text style={[styles.footerText, { color: colors.orangeDark }]}>
                  Aujourd'hui
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 38,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  triggerText: {
    flexShrink: 1,
    fontSize: 13,
  },
  triggerCentered: {
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  close: {
    padding: 4,
  },
  monthRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  navButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    borderWidth: 1.5,
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
  },
  week: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
