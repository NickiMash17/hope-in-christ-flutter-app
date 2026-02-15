import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { SCHEDULE, MINISTRY_INFO, SERMONS } from '@/lib/data';

function getTodaySchedule() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  return SCHEDULE.find(s => s.day === today);
}

function getNextService() {
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIdx = new Date().getDay();
  for (let i = 0; i < 7; i++) {
    const checkIdx = (todayIdx + i) % 7;
    const dayName = dayOrder[checkIdx];
    const found = SCHEDULE.find(s => s.day === dayName);
    if (found && (i > 0 || found)) return found;
  }
  return SCHEDULE[0];
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const todaySchedule = getTodaySchedule();
  const nextService = getNextService();

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (action) {
      case 'live':
        Linking.openURL('https://www.facebook.com/hopeinchristforallnations');
        break;
      case 'sermon':
        router.push({ pathname: '/sermon/[id]', params: { id: SERMONS[0].id } });
        break;
      case 'give':
        router.push('/(tabs)/give');
        break;
      case 'register':
        router.push('/(tabs)/events');
        break;
      case 'schedule':
        router.push('/schedule');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'maps':
        const address = encodeURIComponent(MINISTRY_INFO.address);
        const mapsUrl = Platform.select({
          ios: `maps:0,0?q=${address}`,
          android: `geo:0,0?q=${address}`,
          default: `https://www.google.com/maps/search/?api=1&query=${address}`,
        });
        if (mapsUrl) Linking.openURL(mapsUrl);
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        <LinearGradient
          colors={isDark ? ['#2A1548', '#1A0A30', Colors.dark.background] : ['#5B2C8E', '#7B4BAE', Colors.light.background]}
          style={[styles.header, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 16 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.ministryName}>{MINISTRY_INFO.shortName}</Text>
              <Text style={styles.sloganText}>{MINISTRY_INFO.slogan1}</Text>
            </View>
            <Pressable
              onPress={() => handlePress('about')}
              style={({ pressed }) => [styles.aboutButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="information-circle-outline" size={26} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.serviceStyle}>{MINISTRY_INFO.serviceStyle}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.quickActionsRow}>
            {[
              { icon: 'videocam', label: 'Watch\nLive', action: 'live', color: Colors.accent },
              { icon: 'play-circle', label: 'Latest\nSermon', action: 'sermon', color: Colors.primary },
              { icon: 'heart', label: 'Give', action: 'give', color: Colors.accentBlue },
              { icon: 'calendar', label: 'Register', action: 'register', color: Colors.gold },
            ].map((item) => (
              <Pressable
                key={item.action}
                onPress={() => handlePress(item.action)}
                style={({ pressed }) => [
                  styles.quickAction,
                  {
                    backgroundColor: isDark ? Colors.dark.card : '#fff',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          {todaySchedule && (
            <Pressable onPress={() => handlePress('schedule')}>
              <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Ionicons name="time-outline" size={18} color={Colors.primary} />
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Today's Schedule</Text>
                  </View>
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>{todaySchedule.day}</Text>
                  </View>
                </View>
                {todaySchedule.items.slice(0, 3).map((item, idx) => (
                  <View key={idx} style={styles.scheduleRow}>
                    <View style={styles.scheduleTimeBadge}>
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                    </View>
                    <Text style={[styles.scheduleTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  </View>
                ))}
                {todaySchedule.items.length > 3 && (
                  <Text style={[styles.moreText, { color: Colors.primary }]}>
                    +{todaySchedule.items.length - 3} more
                  </Text>
                )}
              </View>
            </Pressable>
          )}

          {!todaySchedule && nextService && (
            <Pressable onPress={() => handlePress('schedule')}>
              <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Ionicons name="time-outline" size={18} color={Colors.primary} />
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Next Service</Text>
                  </View>
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>{nextService.day}</Text>
                  </View>
                </View>
                {nextService.items.slice(0, 2).map((item, idx) => (
                  <View key={idx} style={styles.scheduleRow}>
                    <View style={styles.scheduleTimeBadge}>
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                    </View>
                    <Text style={[styles.scheduleTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          )}

          <Pressable onPress={() => handlePress('maps')}>
            <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Ionicons name="location-outline" size={18} color={Colors.accent} />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Our Location</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={Colors.accentBlue} />
              </View>
              <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                {MINISTRY_INFO.address}
              </Text>
              <View style={styles.officeRow}>
                <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.officeText, { color: colors.textSecondary }]}>
                  Office Hours: {MINISTRY_INFO.officeHours}
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable onPress={() => handlePress('schedule')}>
            <View style={[styles.viewScheduleButton, { borderColor: isDark ? Colors.dark.border : Colors.light.border }]}>
              <MaterialCommunityIcons name="calendar-clock" size={18} color={Colors.primary} />
              <Text style={[styles.viewScheduleText, { color: Colors.primary }]}>View Full Weekly Schedule</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: { flex: 1 },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: fontFamily.medium,
    marginBottom: 2,
  },
  ministryName: {
    fontSize: 26,
    color: '#fff',
    fontFamily: fontFamily.extraBold,
    lineHeight: 32,
  },
  sloganText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fontFamily.medium,
    fontStyle: 'italic',
    marginTop: 6,
  },
  serviceStyle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fontFamily.semiBold,
    marginTop: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aboutButton: { padding: 4 },
  content: { padding: 16, gap: 14 },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
    lineHeight: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  todayBadge: {
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: Colors.primary,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  scheduleTimeBadge: {
    backgroundColor: Colors.primaryLight + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 90,
  },
  scheduleTimeText: {
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
    color: Colors.primaryLight,
    textAlign: 'center',
  },
  scheduleTitle: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
    marginBottom: 8,
  },
  officeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  officeText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  viewScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  viewScheduleText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
});
