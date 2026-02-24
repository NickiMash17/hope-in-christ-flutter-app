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
import { EVENTS } from '@/lib/ministry-data';
import { useResponsiveLayout } from '@/lib/layout';

const eventImages: Record<string, any> = {
  '1': require('@/assets/new/sunday-service-poster.jpeg'),
  '2': require('@/assets/new/church youth.jpeg'),
  '3': require('@/assets/new/ordination of ministers.jpeg'),
  '4': require('@/assets/new/worship team.jpeg'),
};

const categoryColors: Record<string, string> = {
  Conference: Colors.primary,
  Youth: Colors.accentBlue,
  Fellowship: Colors.accent,
  Service: Colors.gold,
};

function EventCard({ event, isDark, colors }: { event: any; isDark: boolean; colors: any }) {
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
        source={eventImages[event.id] || eventImages['1']}
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
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const sortedEvents = [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(74,35,90,0.14)', 'rgba(36,113,163,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />
      <View style={[layout.maxWidthStyle, { flex: 1, width: '100%' }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 8,
              paddingHorizontal: layout.horizontalPadding,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Upcoming conferences and gatherings</Text>
          <View style={styles.headerMetaRow}>
            <View style={[styles.headerMetaBadge, { backgroundColor: isDark ? Colors.dark.card : '#ffffff' }]}>
              <Ionicons name="sparkles" size={13} color={Colors.gold} />
              <Text style={[styles.headerMetaText, { color: colors.text }]}>Curated Experiences</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={sortedEvents}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <EventCard event={item} isDark={isDark} colors={colors} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: 100, paddingHorizontal: layout.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No upcoming events</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  orbPrimary: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(106,71,205,0.14)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 140,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(70,130,180,0.12)',
  },
  header: {
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
  headerMetaRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  headerMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.34)',
  },
  headerMetaText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.2,
  },
  list: {
    paddingTop: 4,
    gap: 14,
  },
  eventCard: {
    height: 200,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#241063',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 8,
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
    padding: 16,
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
