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
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { EVENTS } from '@/lib/data';

const categoryColors: Record<string, string> = {
  Conference: Colors.primary,
  Youth: Colors.accentBlue,
  Fellowship: Colors.accent,
  Service: Colors.gold,
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const event = EVENTS.find(e => e.id === id);

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Event not found</Text>
        </View>
      </View>
    );
  }

  const catColor = categoryColors[event.category] || Colors.primary;
  const dateObj = new Date(event.date);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>Event Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.heroSection, { backgroundColor: catColor + '12' }]}>
          <View style={[styles.heroDate]}>
            <Text style={[styles.heroDay, { color: catColor }]}>{dateObj.getDate()}</Text>
            <Text style={[styles.heroMonth, { color: catColor }]}>
              {dateObj.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase()}
            </Text>
            <Text style={[styles.heroYear, { color: catColor }]}>{dateObj.getFullYear()}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '18' }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{event.category}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '15' }]}>
                <Ionicons name="calendar-outline" size={16} color={catColor} />
              </View>
              <View>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {dateObj.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '15' }]}>
                <Ionicons name="time-outline" size={16} color={catColor} />
              </View>
              <View>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '15' }]}>
                <Ionicons name="location-outline" size={16} color={catColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Location</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{event.location}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text }]}>{event.description}</Text>

          <View style={styles.ticketInfo}>
            <Text style={[styles.ticketLabel, { color: colors.textSecondary }]}>Available Options</Text>
            <View style={styles.ticketRow}>
              {event.ticketTypes.map(t => (
                <View key={t} style={[styles.ticketBadge, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100 }]}>
                  <Ionicons name="ticket-outline" size={13} color={catColor} />
                  <Text style={[styles.ticketText, { color: colors.text }]}>{t}</Text>
                </View>
              ))}
              {event.attendanceTypes.map(a => (
                <View key={a} style={[styles.ticketBadge, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100 }]}>
                  <Ionicons name={a === 'Online' ? 'laptop-outline' : 'walk-outline'} size={13} color={catColor} />
                  <Text style={[styles.ticketText, { color: colors.text }]}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: '/register/[id]', params: { id: event.id } });
            }}
            style={[styles.registerButton, { backgroundColor: catColor }]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.registerButtonText}>Register Now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroDate: { alignItems: 'center' },
  heroDay: { fontSize: 42, fontFamily: fontFamily.extraBold },
  heroMonth: { fontSize: 14, fontFamily: fontFamily.bold, letterSpacing: 2 },
  heroYear: { fontSize: 14, fontFamily: fontFamily.medium },
  content: { paddingHorizontal: 20, gap: 12 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  categoryText: { fontSize: 12, fontFamily: fontFamily.bold },
  title: { fontSize: 24, fontFamily: fontFamily.extraBold, lineHeight: 30 },
  detailsCard: { gap: 14, marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 11, fontFamily: fontFamily.medium },
  detailValue: { fontSize: 14, fontFamily: fontFamily.semiBold },
  description: { fontSize: 14, fontFamily: fontFamily.regular, lineHeight: 22, marginTop: 4 },
  ticketInfo: { gap: 8, marginTop: 4 },
  ticketLabel: { fontSize: 12, fontFamily: fontFamily.bold, letterSpacing: 0.5 },
  ticketRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ticketBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  ticketText: { fontSize: 12, fontFamily: fontFamily.medium },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
});
