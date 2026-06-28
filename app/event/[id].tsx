import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { useEvent } from '@/lib/db';
import { useResponsiveLayout } from '@/lib/layout';
import { EventCountdown } from '@/components/EventCountdown';

const fallbackImages: Record<string, any> = {
  Conference: require('@/assets/new/sunday-service-poster.jpeg'),
  Youth: require('@/assets/new/church youth.jpeg'),
  Fellowship: require('@/assets/new/worship team.jpeg'),
  Service: require('@/assets/new/ordination of ministers.jpeg'),
};

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
  const layout = useResponsiveLayout();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const cardDivider = { backgroundColor: colors.border };
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const { data: event, isLoading } = useEvent(id ?? '');

  const navBar = (
    <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {navBar}
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {navBar}
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Event not found</Text>
        </View>
      </View>
    );
  }

  const catColor = categoryColors[event.category] || Colors.primary;
  const dateObj = new Date(event.date);
  const ticketTypes = ['General'];
  const attendanceTypes = event.is_online ? ['In-Person', 'Online'] : ['In-Person'];

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[layout.maxWidthStyle, { width: '100%' }]}>
        <View style={styles.heroContainer}>
          <Image
            source={event.image_url ? { uri: event.image_url } : fallbackImages[event.category] ?? fallbackImages.Conference}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)']}
            style={styles.heroOverlay}
          >
            <Pressable
              onPress={() => router.back()}
              style={[styles.floatingBack, { top: (Platform.OS === 'web' ? webTopInset : insets.top) + 8 }]}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>

            <View style={styles.heroBottom}>
              <View style={[styles.datePill, { backgroundColor: catColor }]}>
                <Text style={styles.dateDay}>{dateObj.getDate()}</Text>
                <Text style={styles.dateMonth}>
                  {dateObj.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
              <View style={styles.heroTitleArea}>
                <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
                <Text style={styles.heroTitle} numberOfLines={2}>{event.title}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}>
          <LinearGradient colors={['#1a0f2e', '#0d1a3a']} style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '28' }]}>
                <Ionicons name="calendar-outline" size={16} color={catColor} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {dateObj.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '28' }]}>
                <Ionicons name="time-outline" size={16} color={catColor} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{event.time ?? 'TBA'}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: catColor + '28' }]}>
                <Ionicons name="location-outline" size={16} color={catColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{event.location}</Text>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient colors={['#1a0f2e', '#0d1a3a']} style={styles.countdownCard}>
            <View style={styles.countdownCardHeader}>
              <View style={[styles.countdownDot, { backgroundColor: catColor }]} />
              <Text style={styles.countdownCardLabel}>Event starts in</Text>
            </View>
            <EventCountdown date={event.date} time={event.time} color={catColor} size="lg" />
          </LinearGradient>

          <Text style={[styles.description, { color: colors.text }]}>{event.description}</Text>

          <View style={styles.ticketInfo}>
            <Text style={[styles.ticketLabel, { color: colors.textSecondary }]}>Available Options</Text>
            <View style={styles.ticketRow}>
              {ticketTypes.map((t: string) => (
                <View key={t} style={styles.ticketBadge}>
                  <Ionicons name="ticket-outline" size={13} color={catColor} />
                  <Text style={[styles.ticketText, { color: colors.text }]}>{t}</Text>
                </View>
              ))}
              {attendanceTypes.map((a: string) => (
                <View key={a} style={styles.ticketBadge}>
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
            style={styles.registerButton}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.accentBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.registerGradient}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Register Now</Text>
            </LinearGradient>
          </Pressable>
        </View>
        </View>
      </ScrollView>
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
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(106,71,205,0.13)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 140,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(70,130,180,0.1)',
  },
  heroContainer: {
    height: 260,
    position: 'relative',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 16,
  },
  floatingBack: {
    position: 'absolute',
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateDay: { fontSize: 22, fontFamily: fontFamily.extraBold, color: '#fff' },
  dateMonth: { fontSize: 10, fontFamily: fontFamily.bold, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  heroTitleArea: { flex: 1, gap: 4 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  categoryText: { fontSize: 11, fontFamily: fontFamily.bold, color: '#fff' },
  heroTitle: { fontSize: 20, fontFamily: fontFamily.bold, color: '#fff', lineHeight: 26 },
  content: { paddingHorizontal: 0, paddingTop: 16, gap: 14 },
  detailsCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#241063',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  detailDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  detailIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 11, fontFamily: fontFamily.medium, color: 'rgba(255,255,255,0.5)' },
  detailValue: { fontSize: 14, fontFamily: fontFamily.semiBold, color: '#fff' },
  countdownCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  countdownCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  countdownDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  countdownCardLabel: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },
  description: { fontSize: 14, fontFamily: fontFamily.regular, lineHeight: 22 },
  ticketInfo: { gap: 8 },
  ticketLabel: { fontSize: 12, fontFamily: fontFamily.bold, letterSpacing: 0.5 },
  ticketRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(91,44,142,0.2)',
    backgroundColor: 'rgba(91,44,142,0.08)',
  },
  ticketText: { fontSize: 12, fontFamily: fontFamily.medium },
  registerButton: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  registerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
});
