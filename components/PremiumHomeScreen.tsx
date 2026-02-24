import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';
import { MINISTRY_INFO, SCHEDULE, SERMONS } from '@/lib/ministry-data';
import { GlassCard } from '@/components/GlassCard';
import { PremiumButton } from '@/components/PremiumButton';
import { PremiumStats } from '@/components/PremiumStats';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CONTENT_MAX_WIDTH, useResponsiveLayout } from '@/lib/layout';

function getTodaySchedule() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  return SCHEDULE.find((s) => s.day === today);
}

export function PremiumHomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const layout = useResponsiveLayout();
  const reveal = useRef(new Animated.Value(0)).current;

  const todaySchedule = getTodaySchedule();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const heroHeight = Math.min(Math.max(layout.width * 0.72, 360), layout.isTablet ? 600 : 520);
  const contentWidth = Math.min(
    layout.width - layout.horizontalPadding * 2,
    CONTENT_MAX_WIDTH - layout.horizontalPadding * 2
  );

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      duration: 620,
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  const quickActions = useMemo(
    () => [
      {
        id: 'live',
        icon: 'videocam',
        label: 'Watch Live',
        color: '#8B0000', // Deep Ruby Red
        gradient: ['#8B0000', '#DC143C', '#FF6347'], // Ruby gradient
        action: 'live',
      },
      {
        id: 'sermon',
        icon: 'play-circle',
        label: 'Latest Sermon',
        color: '#4A235A', // Deep Royal Purple
        gradient: ['#4A235A', '#6B3AA0', '#9B59B6'], // Royal gradient
        action: 'sermon',
      },
      {
        id: 'give',
        icon: 'heart',
        label: 'Give',
        color: '#D4AF37', // Premium Gold
        gradient: ['#D4AF37', '#F7E7CE', '#CD7F32'], // Gold gradient
        action: 'give',
      },
      {
        id: 'register',
        icon: 'calendar',
        label: 'Register',
        color: '#1E3A8A', // Royal Blue
        gradient: ['#1E3A8A', '#4682B4', '#5F9EA0'], // Blue gradient
        action: 'register',
      },
    ],
    []
  );

  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
      case 'live':
        router.push('/live-stream');
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
      case 'youtube':
        router.push('/youtube-sermons');
        break;
      case 'schedule':
        router.push('/schedule');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'maps': {
        const address = encodeURIComponent(MINISTRY_INFO.address);
        const mapsUrl = Platform.select({
          ios: `maps:0,0?q=${address}`,
          android: `geo:0,0?q=${address}`,
          default: `https://www.google.com/maps/search/?api=1&query=${address}`,
        });
        if (mapsUrl) Linking.openURL(mapsUrl);
        break;
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(78,60,198,0.16)', 'rgba(127,167,221,0.1)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          style={[
            layout.maxWidthStyle,
            {
              paddingHorizontal: layout.horizontalPadding,
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.heroContainer, { height: heroHeight }]}>
            <Image source={require('@/assets/new/pastor.jpeg')} style={styles.heroImage} contentFit="cover" />
            <LinearGradient
              colors={[
                'rgba(74,35,90,0.4)',    // Deep Royal Purple
                'rgba(107,58,160,0.6)',   // Majestic Royal Purple
                'rgba(155,89,182,0.8)',   // Amethyst Purple
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroOverlay, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 20 }]}
            >
              <View style={styles.heroHeader}>
                <Image source={require('@/assets/new/new purple.png')} style={styles.logoImage} contentFit="contain" />
                <View style={styles.heroActions}>
                  <ThemeToggle size="small" />
                  <Pressable onPress={() => handlePress('about')}>
                    <Ionicons name="information-circle-outline" size={26} color="#fff" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.heroCenter}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={[styles.ministryNameMain, layout.isTablet && styles.ministryNameMainLarge]}>
                  Hope In Christ
                </Text>
                <Text style={styles.ministryNameSub}>For All Nations Ministries</Text>
                <Text style={styles.sloganText}>{MINISTRY_INFO.slogan1}</Text>
                <Text style={styles.sloganText2}>{MINISTRY_INFO.slogan2}</Text>
              </View>

              <View style={styles.serviceBadge}>
                <Ionicons name="home-outline" size={16} color="#fff" />
                <Text style={styles.serviceText} numberOfLines={1}>
                  {MINISTRY_INFO.serviceStyle}
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Ministry Impact</Text>
              <View style={styles.sectionDivider} />
            </View>
            <PremiumStats
              containerWidth={contentWidth}
              stats={[
                {
                  label: 'Weekly Services',
                  value: '7',
                  icon: 'calendar-outline',
                  gradient: ['#4A235A', '#6B3AA0'], // Royal Purple
                  trend: 'up',
                },
                {
                  label: 'Active Members',
                  value: '2.5K',
                  icon: 'people-outline',
                  gradient: ['#1E3A8A', '#4682B4'], // Royal Blue
                  trend: 'up',
                },
                {
                  label: 'Sermons This Month',
                  value: '12',
                  icon: 'mic-outline',
                  gradient: ['#D4AF37', '#F7E7CE'], // Premium Gold
                  trend: 'neutral',
                },
                {
                  label: 'Community Events',
                  value: '24',
                  icon: 'star-outline',
                  gradient: ['#8B0000', '#DC143C'], // Deep Ruby
                  trend: 'up',
                },
              ]}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
              <View style={styles.sectionDivider} />
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <View
                  key={action.id}
                  style={[
                    styles.quickActionItem,
                    layout.isTablet && styles.quickActionItemTablet,
                    layout.isDesktop && styles.quickActionItemDesktop,
                  ]}
                >
                  <PremiumButton
                    title={action.label}
                    onPress={() => handlePress(action.action)}
                    variant={action.id === 'give' ? 'gold' : 'primary'}
                    size="medium"
                    icon={action.icon}
                    gradient={action.gradient}
                    fullWidth
                    shadowIntensity="large"
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Sermon</Text>
              <View style={styles.sectionDivider} />
            </View>
            <Pressable onPress={() => handlePress('sermon')} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }] })}>
              <GlassCard style={styles.sermonCard}>
                <Image source={require('@/assets/new/pastor teaching congregants.jpeg')} style={styles.sermonImage} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.sermonOverlay}>
                  <View style={styles.sermonBadge}>
                    <Ionicons name="play-circle" size={14} color="#fff" />
                    <Text style={styles.sermonBadgeText}>Latest Sermon</Text>
                  </View>
                  <Text style={styles.sermonTitle}>{SERMONS[0]?.title || 'Powerful Teaching from the Word'}</Text>
                  <Text style={styles.sermonSpeaker}>{SERMONS[0]?.speaker || 'Senior Pastor'}</Text>
                </LinearGradient>
              </GlassCard>
            </Pressable>
          </View>

          {todaySchedule && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Schedule</Text>
                <View style={styles.sectionDivider} />
              </View>
              <GlassCard style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleTitle, { color: colors.text }]}>{todaySchedule.day}</Text>
                  <Pressable onPress={() => handlePress('schedule')}>
                    <Text style={styles.moreText}>View all</Text>
                  </Pressable>
                </View>
                <View style={styles.scheduleItems}>
                  {todaySchedule.items.slice(0, 3).map((item, idx) => (
                    <View key={idx} style={styles.scheduleItem}>
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                      <Text style={[styles.scheduleItemTitle, { color: colors.text }]}>{item.title}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Visit Us</Text>
              <View style={styles.sectionDivider} />
            </View>
            <Pressable onPress={() => handlePress('maps')}>
              <GlassCard style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Ionicons name="location-outline" size={22} color="#2471A3" />
                  <View style={styles.locationTextContainer}>
                    <Text style={[styles.locationTitle, { color: colors.text }]}>Our Location</Text>
                    <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>{MINISTRY_INFO.address}</Text>
                  </View>
                  <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
                </View>
              </GlassCard>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              © 2026 Hope In Christ For All Nations Ministries
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>Premium Ministry Experience</Text>
          </View>
        </Animated.View>
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
    top: -140,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(106,71,205,0.15)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(127,167,221,0.13)',
  },
  heroContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 28,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroCenter: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: fontFamily.medium,
  },
  ministryNameMain: {
    fontSize: 34,
    fontFamily: fontFamily.extraBold,
    color: '#fff',
    textAlign: 'center',
  },
  ministryNameMainLarge: {
    fontSize: 44,
  },
  ministryNameSub: {
    fontSize: 17,
    fontFamily: fontFamily.semiBold,
    color: '#F0D060',
    textAlign: 'center',
  },
  sloganText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.86)',
    fontFamily: fontFamily.medium,
    textAlign: 'center',
  },
  sloganText2: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: fontFamily.medium,
    textAlign: 'center',
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: 'center',
    gap: 8,
  },
  serviceText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 60,
    backgroundColor: '#5B2C8E',
    borderRadius: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: '100%',
  },
  quickActionItemTablet: {
    width: '48.5%',
  },
  quickActionItemDesktop: {
    width: '32.4%',
  },
  sermonCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sermonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sermonOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    gap: 6,
  },
  sermonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(91,44,142,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 5,
  },
  sermonBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  sermonTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fontFamily.bold,
  },
  sermonSpeaker: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  scheduleCard: {
    padding: 18,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  scheduleItems: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleTimeText: {
    color: '#5B2C8E',
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    minWidth: 88,
  },
  scheduleItemTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  moreText: {
    color: '#5B2C8E',
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  locationCard: {
    padding: 18,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
    gap: 3,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  locationAddress: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
  },
});


