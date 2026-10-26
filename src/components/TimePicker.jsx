import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { colors as appColors } from '../styles';

// Themed time picker, companion of DatePicker. Two scrollable columns (hours /
// minutes) painted with the palette of the current dashboard, so the extras
// area stays orange while the staffly client area gets its green accents.

const ITEM_HEIGHT = 38;
const pad = value => String(value).padStart(2, '0');

function parseTime(value) {
  if (value instanceof Date) {
    return { hours: value.getHours(), minutes: value.getMinutes() };
  }
  if (!value) return null;
  const match = /^(\d{1,2})[:h.]?(\d{2})(?::\d{2})?\s*(am|pm)?$/i.exec(
    String(value).trim(),
  );
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
  return { hours, minutes };
}

function formatTime(hours, minutes, format) {
  if (format === '12h') {
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${pad(hour12)}:${pad(minutes)} ${suffix}`;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = 'HH:MM',
  outputFormat = '24h',
  minuteStep = 5,
  colors = appColors,
  style,
  textStyle,
  disabled = false,
  accessibilityLabel,
  iconColor,
  showIcon = true,
}) {
  const parsed = parseTime(value);
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(parsed ? parsed.hours : 9);
  const [minutes, setMinutes] = useState(parsed ? parsed.minutes : 0);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  const minuteOptions = [];
  for (let minute = 0; minute < 60; minute += minuteStep) {
    minuteOptions.push(minute);
  }
  if (!minuteOptions.includes(minutes)) {
    minuteOptions.push(minutes);
    minuteOptions.sort((a, b) => a - b);
  }

  useEffect(() => {
    if (!open) return;
    const current = parseTime(value);
    setHours(current ? current.hours : 9);
    setMinutes(current ? current.minutes : 0);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const options = [];
      for (let minute = 0; minute < 60; minute += minuteStep) {
        options.push(minute);
      }
      if (!options.includes(minutes)) {
        options.push(minutes);
        options.sort((a, b) => a - b);
      }
      hoursRef.current?.scrollTo({
        y: Math.max(0, hours * ITEM_HEIGHT - ITEM_HEIGHT * 2),
        animated: false,
      });
      minutesRef.current?.scrollTo({
        y: Math.max(0, options.indexOf(minutes) * ITEM_HEIGHT - ITEM_HEIGHT * 2),
        animated: false,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [open, hours, minutes, minuteStep]);

  const display = parsed ? formatTime(parsed.hours, parsed.minutes, outputFormat) : '';
  const triggerColor = { color: display ? colors.brown : '#bbb' };

  const confirm = () => {
    onChange(formatTime(hours, minutes, outputFormat));
    setOpen(false);
  };

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
        <Text numberOfLines={1} style={[styles.triggerText, triggerColor, textStyle]}>
          {display || placeholder}
        </Text>
        {showIcon ? (
          <Clock size={14} color={iconColor || colors.orangeDark} />
        ) : null}
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <Pressable
          accessibilityLabel="Fermer le sélecteur d'heure"
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
                Sélectionner une heure
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

            <View style={styles.preview}>
              <Text style={[styles.previewText, { color: colors.orangeDark }]}>
                {pad(hours)}
              </Text>
              <Text style={[styles.previewColon, { color: colors.muted }]}>:</Text>
              <Text style={[styles.previewText, { color: colors.orangeDark }]}>
                {pad(minutes)}
              </Text>
            </View>

            <View style={styles.columns}>
              <ScrollView
                ref={hoursRef}
                showsVerticalScrollIndicator={false}
                style={styles.column}
              >
                {Array.from({ length: 24 }, (_, hour) => hour).map(hour => {
                  const active = hour === hours;
                  return (
                    <Pressable
                      key={`hour-${hour}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => setHours(hour)}
                      style={[
                        styles.option,
                        active && { backgroundColor: colors.orange },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: active ? colors.white : colors.brown },
                        ]}
                      >
                        {pad(hour)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <ScrollView
                ref={minutesRef}
                showsVerticalScrollIndicator={false}
                style={styles.column}
              >
                {minuteOptions.map(minute => {
                  const active = minute === minutes;
                  return (
                    <Pressable
                      key={`minute-${minute}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => setMinutes(minute)}
                      style={[
                        styles.option,
                        active && { backgroundColor: colors.orange },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: active ? colors.white : colors.brown },
                        ]}
                      >
                        {pad(minute)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setOpen(false)}
                style={[styles.button, styles.cancel, { borderColor: colors.border }]}
              >
                <Text style={[styles.buttonText, { color: colors.muted }]}>
                  Annuler
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirm}
                style={[styles.button, { backgroundColor: colors.orange }]}
              >
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  Valider
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
    marginBottom: 10,
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
  preview: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  previewText: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  previewColon: {
    fontSize: 26,
    fontWeight: '700',
  },
  columns: {
    height: ITEM_HEIGHT * 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  column: {
    width: 110,
    flexGrow: 0,
    flexShrink: 0,
  },
  option: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cancel: {
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
