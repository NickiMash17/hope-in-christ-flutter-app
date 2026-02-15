import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { EVENTS, Event } from '@/lib/data';

const categoryIcons: Record<string, string> = {
  Conference: 'people',
  Youth: 'flash',
  Fellowship: 'heart',
  Service: 'musical-notes',
};

const categoryColors: Record<string, string> = {
  Conference: Colors.primary,
  Youth: Colors.accentBlue,
  Fellowship: Colors.accent,
  Service: Colors.gold,
};

function EventCard({ event, isDark, colors }: { event: Event; isDark: boolean; colors: any }) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
  const color = categoryColors[event.category] || Colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/event/[id]', params: { id: event.id } });
      }}
      style={({ pressed }) => [
        styles.eventCard,
        {
          backgroundColor: isDark ? Colors.dark.card : '#fff',
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.dateBlock, { backgroundColor: color + '15' }]}>
        <Text style={[styles.dateDay, { color }]}>{day}</Text>
        <Text style={[styles.dateMonth, { color }]}>{month}</Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.time}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: color + '18' }]}>
          <Ionicons name={(categoryIcons[event.category] || 'star') as any} size={12} color={color} />
          <Text style={[styles.categoryText, { color }]}>{event.category}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const sortedEvents = [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Upcoming conferences and gatherings</Text>
      </View>

      <FlatList
        data={sortedEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <EventCard event={item} isDark={isDark} colors={colors} />}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No upcoming events</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  dateBlock: {
    width: 52,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
  },
  dateMonth: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    lineHeight: 20,
  },
  eventMeta: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
});
