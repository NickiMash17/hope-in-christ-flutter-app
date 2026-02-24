import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';
import { SCHEDULE, MINISTRY_INFO, SERMONS } from '@/lib/ministry-data';
import { GlassCard } from '@/components/GlassCard';
import { ThemeToggle } from '@/components/ThemeToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getTodaySchedule() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  return SCHEDULE.find(s => s.day === today);
}

export function EnhancedHomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors, gradients } = useTheme();
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  
  const todaySchedule = getTodaySchedule();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const quickActions = useMemo(() => [
    { 
      id: 'live', 
      icon: 'videocam', 
      label: 'Watch Live', 
      color: '#C0392B',
      gradient: gradients.accent,
      action: 'live' 
    },
    { 
      id: 'sermon', 
      icon: 'play-circle', 
      label: 'Latest Sermon', 
      color: '#5B2C8E',
      gradient: gradients.primary,
      action: 'sermon' 
    },
    { 
      id: 'give', 
      icon: 'heart', 
      label: 'Give', 
      color: '#2471A3',
      gradient: gradients.blue,
      action: 'give' 
    },
    { 
      id: 'register', 
      icon: 'calendar', 
      label: 'Register', 
      color: '#D4A017',
      gradient: gradients.gold,
      action: 'register' 
    },
  ], [gradients]);

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
        {/* Enhanced Hero Section with Pastor Background */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/new/pastor.jpeg')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={[
              'rgba(91,44,142,0.7)',  // Royal Purple
              'rgba(36,113,163,0.8)',  // Ministry Blue
              'rgba(91,44,142,0.9)',  // Royal Purple stronger
            ]}
            style={[styles.heroOverlay, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 20 }]}
          >
            {/* Church Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/new/church-logo.jpeg')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <View style={styles.ministryNameContainer}>
                  <Text style={styles.ministryNameFirstLine}>Hope In Christ</Text>
                  <Text style={styles.ministryNameSecondLine}>For All Nations Ministries</Text>
                </View>
                <Text style={styles.sloganText}>{MINISTRY_INFO.slogan1}</Text>
                <Text style={styles.sloganText2}>{MINISTRY_INFO.slogan2}</Text>
              </View>
              <View style={styles.headerActions}>
                <ThemeToggle size="small" />
                <Pressable
                  onPress={() => handlePress('about')}
                  style={({ pressed }) => [styles.aboutButton, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Ionicons name="information-circle-outline" size={26} color="#fff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.heroContent}>
            </View>

            <View style={styles.serviceBadge}>
              <Ionicons name="home-outline" size={16} color="#fff" />
              <Text style={styles.serviceText}>{MINISTRY_INFO.serviceStyle}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => {
                  setSelectedQuickAction(action.id);
                  handlePress(action.action);
                  setTimeout(() => setSelectedQuickAction(null), 200);
                }}
                style={({ pressed }) => [
                  styles.quickActionCard,
                  {
                    backgroundColor: isDark ? colors.card : colors.surface,
                    transform: [{ scale: pressed || selectedQuickAction === action.id ? 0.95 : 1 }],
                    opacity: selectedQuickAction === action.id ? 0.8 : 1,
                  },
                ]}
              >
                <LinearGradient
                  colors={action.gradient as any}
                  style={styles.quickActionGradient}
                />
                <View style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: colors.text }]}>{action.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Sermon */}
        <View style={styles.featuredSermonContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Sermon</Text>
          <Pressable
            onPress={() => handlePress('sermon')}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard style={styles.sermonCard}>
              <Image
                source={require('@/assets/new/pastor teaching congregants.jpeg')}
                style={styles.sermonImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.sermonOverlay}
              >
                <View style={styles.sermonContent}>
                  <View style={styles.sermonBadge}>
                    <Ionicons name="play-circle" size={14} color="#fff" />
                    <Text style={styles.sermonBadgeText}>Latest Sermon</Text>
                  </View>
                  <Text style={styles.sermonTitle}>{SERMONS[0]?.title || 'Powerful Teaching from the Word'}</Text>
                  <Text style={styles.sermonSpeaker}>{SERMONS[0]?.speaker || 'Senior Pastor'}</Text>
                </View>
              </LinearGradient>
            </GlassCard>
          </Pressable>
        </View>

        {/* Worship Experience */}
        <View style={styles.featuredSermonContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Worship Experience</Text>
          <GlassCard style={styles.sermonCard}>
            <Image
              source={require('@/assets/new/worship team 2.jpeg')}
              style={styles.sermonImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(91,44,142,0.9)']}
              style={styles.sermonOverlay}
            >
              <View style={styles.sermonContent}>
                <Text style={styles.sermonTitle}>Spirit-Filled Worship</Text>
                <Text style={styles.sermonDescription}>
                  Experience the presence of God through vibrant worship led by our talented team
                </Text>
                <Pressable
                  onPress={() => handlePress('live')}
                  style={({ pressed }) => [styles.sermonButton, { opacity: pressed ? 0.8 : 1 }]}
                >
                  <Ionicons name="videocam" size={16} color="#fff" />
                  <Text style={styles.sermonButtonText}>Watch Live</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </GlassCard>
        </View>

        {/* Today's Schedule */}
        {todaySchedule && (
          <GlassCard style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleHeaderLeft}>
                <Ionicons name="time-outline" size={20} color="#5B2C8E" />
                <Text style={[styles.scheduleTitle, { color: colors.text }]}>Today&apos;s Schedule</Text>
              </View>
              <View style={[styles.todayBadge, { backgroundColor: '#5B2C8E20' }]}>
                <Text style={[styles.todayBadgeText, { color: '#5B2C8E' }]}>{todaySchedule.day}</Text>
              </View>
            </View>
            <View style={styles.scheduleItems}>
              {todaySchedule.items.slice(0, 3).map((item, idx) => (
                <View key={idx} style={styles.scheduleItem}>
                  <View style={[styles.timeBadge, { backgroundColor: '#5B2C8E15' }]}>
                    <Text style={[styles.timeText, { color: '#5B2C8E' }]}>{item.time}</Text>
                  </View>
                  <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                </View>
              ))}
              {todaySchedule.items.length > 3 && (
                <Text style={[styles.moreText, { color: '#5B2C8E' }]}>
                  +{todaySchedule.items.length - 3} more services
                </Text>
              )}
            </View>
          </GlassCard>
        )}

        {/* Location Card */}
        <GlassCard style={styles.locationCard}>
          <Pressable onPress={() => handlePress('maps')}>
            <View style={styles.locationHeader}>
              <View style={styles.locationHeaderLeft}>
                <Ionicons name="location-outline" size={20} color="#C0392B" />
                <Text style={[styles.locationTitle, { color: colors.text }]}>Visit Us</Text>
              </View>
              <Ionicons name="open-outline" size={18} color="#C0392B" />
            </View>
            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.address}
            </Text>
            <View style={styles.officeInfo}>
              <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.officeText, { color: colors.textSecondary }]}>
                Office Hours: {MINISTRY_INFO.officeHours}
              </Text>
            </View>
          </Pressable>
        </GlassCard>

        {/* Ministry Values */}
        <View style={styles.valuesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {[
              { icon: 'heart', title: 'Love', color: '#C0392B' },
              { icon: 'people', title: 'Community', color: '#2471A3' },
              { icon: 'star', title: 'Excellence', color: '#D4A017' },
              { icon: 'prayer', title: 'Faith', color: '#5B2C8E' },
            ].map((value, idx) => (
              <View key={idx} style={[styles.valueCard, { backgroundColor: isDark ? colors.card : colors.surface }]}>
                <View style={[styles.valueIcon, { backgroundColor: value.color + '20' }]}>
                  <Ionicons name={value.icon as any} size={20} color={value.color} />
                </View>
                <Text style={[styles.valueTitle, { color: colors.text }]}>{value.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},
  heroContainer: {
    height: 320,
    position: 'relative',
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
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
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
    color: '#FFFFFF',
  },
  ministryNameContainer: {
    marginBottom: 8,
  },
  ministryNameFirstLine: {
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ministryNameSecondLine: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#F0D060', // Gold color for the second line
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutButton: {
    padding: 4,
  },
  heroContent: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: fontFamily.medium,
    marginBottom: 4,
  },
  ministryName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: fontFamily.extraBold,
    lineHeight: 34,
    marginBottom: 8,
  },
  sloganText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fontFamily.medium,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sloganText2: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.5,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  serviceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: fontFamily.semiBold,
    marginLeft: 6,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  quickActionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  quickActionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
  },
  featuredSermonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sermonCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  sermonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sermonOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  sermonContent: {
    gap: 8,
  },
  sermonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(91,44,142,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  sermonBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    marginLeft: 4,
  },
  sermonTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sermonSpeaker: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  sermonDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
    marginBottom: 12,
  },
  sermonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B2C8E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  sermonButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  sermonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sermonDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  todayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
  },
  scheduleItems: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 80,
  },
  timeText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
    marginTop: 4,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  addressText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
    marginBottom: 8,
  },
  officeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  officeText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  valuesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  valueCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
});
