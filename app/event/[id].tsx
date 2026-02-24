import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
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
import { EVENTS } from '@/lib/data';
import { useResponsiveLayout } from '@/lib/layout';

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

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
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
            source={eventImages[event.category]}
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
          <View style={[styles.detailsCard, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
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
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 11, fontFamily: fontFamily.medium },
  detailValue: { fontSize: 14, fontFamily: fontFamily.semiBold },
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
    borderColor: 'rgba(91,44,142,0.14)',
  },
  ticketText: { fontSize: 12, fontFamily: fontFamily.medium },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
});
