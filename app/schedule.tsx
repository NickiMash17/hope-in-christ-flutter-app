import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
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
          {SCHEDULE.map((day, idx) => {
          const color = DAY_COLORS[idx % DAY_COLORS.length];
          const isToday = day.day === today;
          return (
            <View key={day.day} style={[styles.dayCard, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
              <View style={styles.dayHeader}>
                <View style={[styles.dayBadge, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.dayName, { color }]}>{day.day}</Text>
                </View>
                {isToday && (
                  <View style={[styles.todayBadge, { backgroundColor: color }]}>
                    <Text style={styles.todayText}>Today</Text>
                  </View>
                )}
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
  dayCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dayName: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  todayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  todayText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  scheduleInfo: {
    flex: 1,
    gap: 1,
  },
  scheduleTime: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
});
