import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { SCHEDULE, CALENDAR_2026 } from '@/lib/ministry-data';
import type { CalendarEventType } from '@/lib/ministry-data';
import { useResponsiveLayout } from '@/lib/layout';

const DAY_COLORS = [Colors.primary, Colors.accentBlue, Colors.accent, Colors.gold];

const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  primary: Colors.primary,
  blue: Colors.accentBlue,
  gold: Colors.gold,
  red: Colors.accent,
};

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const currentMonth = new Date().toLocaleString('en-ZA', { month: 'long' });

  const sorted = [...SCHEDULE].sort((a, b) => {
    if (a.day === today) return -1;
    if (b.day === today) return 1;
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Schedule & Calendar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>

          {/* ── Weekly Service Schedule ── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.primary }]} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Services</Text>
            </View>
            <View style={{ gap: 14 }}>
              {sorted.map((day) => {
                const origIdx = days.indexOf(day.day);
                const color = DAY_COLORS[origIdx % DAY_COLORS.length];
                const isToday = day.day === today;

                if (isToday) {
                  return (
                    <LinearGradient
                      key={day.day}
                      colors={[color + 'EE', color + 'AA']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.todayCard}
                    >
                      <View style={styles.todayCardHeader}>
                        <View style={styles.todayLabelRow}>
                          <Ionicons name="today" size={16} color="#fff" />
                          <Text style={styles.todayCardDay}>{day.day}</Text>
                        </View>
                        <View style={styles.todayPill}>
                          <Text style={styles.todayPillText}>Today</Text>
                        </View>
                      </View>
                      {day.items.map((item, i) => (
                        <View key={i} style={styles.todayRow}>
                          <View style={styles.todayDot} />
                          <View style={styles.scheduleInfo}>
                            <Text style={styles.todayTime}>{item.time}</Text>
                            <Text style={styles.todayTitle}>{item.title}</Text>
                          </View>
                        </View>
                      ))}
                    </LinearGradient>
                  );
                }

                return (
                  <View key={day.day} style={[styles.dayCard, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
                    <View style={styles.dayHeader}>
                      <View style={[styles.dayBadge, { backgroundColor: color + '18' }]}>
                        <Text style={[styles.dayName, { color }]}>{day.day}</Text>
                      </View>
                    </View>
                    {day.items.map((item, i) => (
                      <View key={i} style={styles.scheduleRow}>
                        <View style={[styles.timeDot, { backgroundColor: color }]} />
                        <View style={styles.scheduleInfo}>
                          <Text style={[styles.scheduleTime, { color: colors.textSecondary }]}>{item.time}</Text>
                          <Text style={[styles.scheduleTitle, { color: colors.text }]}>{item.title}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── 2026 Annual Calendar ── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.gold }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>2026 Annual Programme</Text>
                <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>The Year of Answered Prayers</Text>
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {CALENDAR_2026.map((monthData) => {
                const isCurrentMonth = monthData.month === currentMonth;
                return (
                  <View
                    key={monthData.month}
                    style={[
                      styles.monthCard,
                      {
                        backgroundColor: isDark ? Colors.dark.card : '#fff',
                        borderColor: isCurrentMonth ? Colors.primary + '40' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(91,44,142,0.1)'),
                        borderWidth: isCurrentMonth ? 1.5 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.monthHeader, { borderBottomColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(91,44,142,0.08)' }]}>
                      <Text style={[styles.monthName, { color: isCurrentMonth ? Colors.primary : colors.text }]}>
                        {monthData.month}
                      </Text>
                      {isCurrentMonth && (
                        <View style={styles.currentMonthBadge}>
                          <Text style={styles.currentMonthBadgeText}>This Month</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.eventsContainer}>
                      {monthData.events.map((event, idx) => {
                        const color = EVENT_TYPE_COLORS[event.type];
                        return (
                          <View
                            key={idx}
                            style={[
                              styles.eventRow,
                              idx < monthData.events.length - 1 && {
                                borderBottomWidth: 0.5,
                                borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              },
                            ]}
                          >
                            <View style={[styles.eventDot, { backgroundColor: color }]} />
                            <View style={[styles.eventDateBubble, { backgroundColor: color + '18' }]}>
                              <Text style={[styles.eventDate, { color }]}>{event.dates}</Text>
                            </View>
                            <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 12 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },

  sectionBlock: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  sectionAccent: { width: 4, borderRadius: 2, marginTop: 4, height: 44 },
  sectionTitle: { fontSize: 20, fontFamily: fontFamily.extraBold },
  sectionSub: { fontSize: 12, fontFamily: fontFamily.regular, marginTop: 2 },

  monthCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  monthName: { fontSize: 15, fontFamily: fontFamily.bold },
  currentMonthBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentMonthBadgeText: { color: '#fff', fontSize: 10, fontFamily: fontFamily.bold, letterSpacing: 0.5 },
  eventsContainer: { paddingHorizontal: 10, paddingVertical: 6 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  eventDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  eventDateBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    minWidth: 44,
    alignItems: 'center',
    flexShrink: 0,
  },
  eventDate: { fontSize: 10, fontFamily: fontFamily.bold, letterSpacing: 0.2 },
  eventName: { fontSize: 13, fontFamily: fontFamily.medium, flex: 1 },
  todayCard: {
    borderRadius: 20, padding: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16,
    elevation: 10, gap: 12,
  },
  todayCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  todayLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  todayCardDay: { fontSize: 16, fontFamily: fontFamily.bold, color: '#fff' },
  todayPill: { backgroundColor: 'rgba(255,255,255,0.28)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  todayPillText: { fontSize: 11, fontFamily: fontFamily.bold, color: '#fff' },
  todayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  todayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.8)', marginTop: 5 },
  todayTime: { fontSize: 12, fontFamily: fontFamily.semiBold, color: 'rgba(255,255,255,0.75)' },
  todayTitle: { fontSize: 14, fontFamily: fontFamily.bold, color: '#fff' },
  dayCard: {
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 12,
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  dayBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  dayName: { fontSize: 15, fontFamily: fontFamily.bold },
  scheduleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  timeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  scheduleInfo: { flex: 1, gap: 1 },
  scheduleTime: { fontSize: 12, fontFamily: fontFamily.semiBold },
  scheduleTitle: { fontSize: 14, fontFamily: fontFamily.medium },
});
