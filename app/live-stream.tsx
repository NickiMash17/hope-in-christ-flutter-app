import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { layout } from '@/lib/layout';
import { MINISTRY_INFO } from '@/lib/ministry-data';

const { width } = Dimensions.get('window');

interface StreamSchedule {
  id: string;
  title: string;
  day: string;
  time: string;
  platform: string;
  description: string;
  isLive?: boolean;
}

const STREAM_SCHEDULE: StreamSchedule[] = [
  {
    id: '1',
    title: 'Sunday Morning Service',
    day: 'Sunday',
    time: '09:00 AM',
    platform: 'Facebook',
    description: 'Join us for powerful worship, prayer, and the Word of God',
    isLive: false,
  },
  {
    id: '2',
    title: 'Wednesday Bible Study',
    day: 'Wednesday',
    time: '18:00 PM',
    platform: 'Facebook',
    description: 'Deep dive into biblical teachings and practical applications',
    isLive: false,
  },
  {
    id: '3',
    title: 'Friday Youth Service',
    day: 'Friday',
    time: '18:30 PM',
    platform: 'Facebook',
    description: 'Dynamic youth service with relevant teaching and worship',
    isLive: false,
  },
];

export default function LiveStreamScreen() {
  const { colors, isDark } = useTheme();
  const [isCurrentlyLive, setIsCurrentlyLive] = useState(false);

  // Check if any service is currently live (you can implement actual live check via API)
  useEffect(() => {
    // This is a placeholder - you would check your actual streaming status
    // For example, by calling Facebook Graph API or your backend
    checkLiveStatus();
  }, []);

  const checkLiveStatus = () => {
    // Placeholder for checking if stream is live
    // In production, you'd check Facebook Live API or your backend
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 3 = Wednesday, 5 = Friday
    const hour = now.getHours();
    
    // Simple check: Sunday at 9am, Wednesday at 6pm, Friday at 6:30pm
    const isLive = 
      (day === 0 && hour >= 9 && hour < 12) || // Sunday 9am-12pm
      (day === 3 && hour >= 18 && hour < 20) || // Wednesday 6pm-8pm
      (day === 5 && hour >= 18 && hour < 21);   // Friday 6:30pm-9pm
    
    setIsCurrentlyLive(isLive);
  };

  const openFacebookLive = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://www.facebook.com/hopeinchristforallnations/live');
  };

  const openYouTubeLive = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'YouTube Channel Coming Soon',
      'Our YouTube channel will launch soon with live streaming capabilities!',
      [
        { text: 'Watch on Facebook', onPress: openFacebookLive },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const enableNotifications = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Enable Notifications',
      'Get notified when we go live! This feature will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Live Stream',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}
      >
        {/* Live Status Banner */}
        {isCurrentlyLive ? (
          <Pressable onPress={openFacebookLive}>
            <LinearGradient
              colors={['#FF0000', '#CC0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.liveBanner}
            >
              <View style={styles.liveIndicator}>
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
              <Text style={styles.liveBannerTitle}>Service is Live!</Text>
              <Text style={styles.liveBannerSubtitle}>Tap to join the stream</Text>
              <Ionicons name="play-circle" size={48} color="#fff" style={{ marginTop: 12 }} />
            </LinearGradient>
          </Pressable>
        ) : (
          <LinearGradient
            colors={isDark ? ['#5B2C8E', '#1a1a2e'] : ['#7B3FA8', '#5B2C8E']}
            style={styles.offlineBanner}
          >
            <Ionicons name="videocam-outline" size={48} color="rgba(255,255,255,0.7)" />
            <Text style={styles.offlineTitle}>No Live Stream</Text>
            <Text style={styles.offlineSubtitle}>Check the schedule below for upcoming services</Text>
          </LinearGradient>
        )}

        {/* Quick Access Buttons */}
        <View style={styles.quickActions}>
          <Pressable
            onPress={openFacebookLive}
            style={({ pressed }) => [
              styles.quickActionButton,
              { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#1877F2' + '18' }]}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Watch on</Text>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Facebook</Text>
          </Pressable>

          <Pressable
            onPress={openYouTubeLive}
            style={({ pressed }) => [
              styles.quickActionButton,
              { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF0000' + '18' }]}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>YouTube</Text>
            <Text style={[styles.quickActionLabel, { color: colors.textSecondary, fontSize: 11 }]}>Coming Soon</Text>
          </Pressable>

          <Pressable
            onPress={enableNotifications}
            style={({ pressed }) => [
              styles.quickActionButton,
              { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DAA520' + '18' }]}>
              <Ionicons name="notifications" size={24} color="#DAA520" />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Get</Text>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Notified</Text>
          </Pressable>
        </View>

        {/* Stream Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Stream Schedule</Text>
          </View>

          {STREAM_SCHEDULE.map((schedule) => (
            <View key={schedule.id} style={[styles.scheduleCard, { backgroundColor: colors.card }]}>
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleDay}>
                  <Text style={[styles.scheduleDayText, { color: colors.primary }]}>{schedule.day}</Text>
                  <Text style={[styles.scheduleTime, { color: colors.text }]}>{schedule.time}</Text>
                </View>
                <View style={[styles.platformBadge, { backgroundColor: '#1877F2' + '18' }]}>
                  <Ionicons name="logo-facebook" size={14} color="#1877F2" />
                  <Text style={[styles.platformText, { color: '#1877F2' }]}>{schedule.platform}</Text>
                </View>
              </View>
              <Text style={[styles.scheduleTitle, { color: colors.text }]}>{schedule.title}</Text>
              <Text style={[styles.scheduleDescription, { color: colors.textSecondary }]}>
                {schedule.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Streaming Features</Text>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#7B3FA8' + '18' }]}>
              <MaterialIcons name="hd" size={24} color="#7B3FA8" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>HD Quality</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                High-definition video streaming for the best viewing experience
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#DAA520' + '18' }]}>
              <Ionicons name="chatbubbles" size={24} color="#DAA520" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Live Chat</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Interact with other viewers during the service
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#25D366' + '18' }]}>
              <MaterialIcons name="replay" size={24} color="#25D366" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Watch Replay</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Missed it live? Watch the replay anytime after the service
              </Text>
            </View>
          </View>
        </View>

        {/* How to Watch */}
        <View style={[styles.howToCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.howToTitle, { color: colors.text }]}>How to Watch Live</Text>
          
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Follow us on Facebook or subscribe on YouTube (when available)
            </Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Check the schedule above for service times
            </Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Tap "Watch on Facebook" when the service is live
            </Text>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Enable notifications to never miss a service
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={openFacebookLive}
          style={({ pressed }) => [
            styles.ctaButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <LinearGradient
            colors={['#7B3FA8', '#5B2C8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Ionicons name="videocam" size={24} color="#fff" />
            <Text style={styles.ctaText}>Go to Live Stream Page</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
  liveBanner: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  livePulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  liveBannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  liveBannerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
  },
  offlineBanner: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  offlineSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    marginBottom: 2,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scheduleDay: {
    flex: 1,
  },
  scheduleDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  scheduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  howToCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  howToTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 2,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
