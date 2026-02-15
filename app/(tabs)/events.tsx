import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { EVENTS, Event } from '@/lib/data';

const eventImages: Record<string, any> = {
  Conference: require('@/assets/images/event-conference.png'),
  Youth: require('@/assets/images/event-youth.png'),
  Fellowship: require('@/assets/images/event-fellowship.png'),
  Service: require('@/assets/images/event-easter.png'),
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
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Image
        source={eventImages[event.category]}
        style={styles.eventImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.eventOverlay}
      >
        <View style={[styles.datePill]}>
          <Text style={[styles.dateDay, { color: '#fff' }]}>{day}</Text>
          <Text style={[styles.dateMonth, { color: 'rgba(255,255,255,0.8)' }]}>{month}</Text>
        </View>
        <View style={styles.eventBottom}>
          <View style={[styles.categoryBadge, { backgroundColor: color }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{event.time}</Text>
            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
            <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
      </LinearGradient>
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
    gap: 14,
  },
  eventCard: {
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    justifyContent: 'space-between',
  },
  datePill: {
    backgroundColor: 'rgba(91,44,142,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
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
  eventBottom: {
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#fff',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.7)',
    flex: 0,
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
