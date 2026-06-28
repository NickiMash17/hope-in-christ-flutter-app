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
import { SCHEDULE } from '@/lib/ministry-data';
import { useResponsiveLayout } from '@/lib/layout';

const DAY_COLORS = [Colors.primary, Colors.accentBlue, Colors.accent, Colors.gold];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  // Today first, rest in original order
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
        <Text style={[styles.navTitle, { color: colors.text }]}>Weekly Schedule</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding, gap: 14 }]}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 12 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
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
