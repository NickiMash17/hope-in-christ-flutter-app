import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Image as RNImage,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { layout } from '@/lib/layout';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface VideoSermon {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: any;
  youtubeUrl?: string;
  comingSoon?: boolean;
}

// Placeholder data - will be replaced with real YouTube videos when channel launches
const YOUTUBE_SERMONS: VideoSermon[] = [
  {
    id: 'coming-1',
    title: 'YouTube Channel Coming Soon!',
    description: 'Our YouTube channel is launching soon with full sermon videos, worship sessions, and biblical teachings. Stay tuned!',
    date: 'Coming Soon',
    thumbnail: require('@/assets/new/pastor.jpeg'),
    comingSoon: true,
  },
  {
    id: 'coming-2',
    title: 'Subscribe to Get Notified',
    description: 'Be among the first to watch our video sermons when we launch. Full HD quality with subtitles.',
    date: 'Coming Soon',
    thumbnail: require('@/assets/new/pastor teaching congregants.jpeg'),
    comingSoon: true,
  },
  {
    id: 'coming-3',
    title: 'Video Archive Coming',
    description: 'We will be uploading past sermons and creating new video content regularly.',
    date: 'Coming Soon',
    thumbnail: require('@/assets/new/new purple.png'),
    comingSoon: true,
  },
];

export default function YouTubeSermonsScreen() {
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coming'>('all');

  const openYouTube = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // This will be updated with the actual YouTube channel URL when available
    Linking.openURL('https://www.youtube.com/@hopeinchrist');
  };

  const openTwitter = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://x.com/HicfanMin');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'YouTube Sermons',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={isDark ? ['#5B2C8E', '#1a1a2e'] : ['#7B3FA8', '#5B2C8E']}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="logo-youtube" size={48} color="#FF0000" />
            </View>
            <Text style={styles.heroTitle}>YouTube Channel</Text>
            <Text style={styles.heroSubtitle}>Video Sermons Coming Soon</Text>
            <Text style={styles.heroDescription}>
              We're launching our official YouTube channel with full sermon videos, worship sessions, and biblical teachings in HD quality.
            </Text>

            <Pressable
              onPress={openYouTube}
              style={({ pressed }) => [
                styles.subscribeButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <LinearGradient
                colors={['#FF0000', '#CC0000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.subscribeGradient}
              >
                <Ionicons name="logo-youtube" size={20} color="#fff" />
                <Text style={styles.subscribeText}>Subscribe on YouTube</Text>
              </LinearGradient>
            </Pressable>

            <Text style={styles.availableNowText}>
              Listen to audio sermons on Twitter/X now
            </Text>
            <Pressable
              onPress={openTwitter}
              style={({ pressed }) => [
                styles.twitterButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Ionicons name="logo-twitter" size={18} color="#1DA1F2" />
              <Text style={styles.twitterButtonText}>Listen on Twitter/X</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What to Expect</Text>
          
          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#FF000018' }]}>
              <MaterialIcons name="video-library" size={24} color="#FF0000" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Full Video Sermons</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Complete Sunday services and special events in high definition
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#7B3FA818' }]}>
              <Ionicons name="musical-notes" size={24} color="#7B3FA8" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Worship Sessions</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Experience powerful worship moments from our services
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#DAA52018' }]}>
              <Ionicons name="book" size={24} color="#DAA520" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Bible Teachings</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                In-depth biblical studies and practical life applications
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#25D36618' }]}>
              <MaterialIcons name="subtitles" size={24} color="#25D366" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Subtitles & Quality</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Multiple subtitle options and HD streaming quality
              </Text>
            </View>
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.previewSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Coming to YouTube</Text>
          
          {YOUTUBE_SERMONS.map((sermon) => (
            <View key={sermon.id} style={[styles.videoCard, { backgroundColor: colors.card }]}>
              <Image
                source={sermon.thumbnail}
                style={styles.thumbnail}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.thumbnailOverlay}
              >
                <View style={styles.comingSoonBadge}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </LinearGradient>
              
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]}>{sermon.title}</Text>
                <Text style={[styles.videoDescription, { color: colors.textSecondary }]}>
                  {sermon.description}
                </Text>
                <View style={styles.videoMeta}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.videoDate, { color: colors.textSecondary }]}>
                    {sermon.date}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { color: colors.text }]}>Stay Connected</Text>
          <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
            Follow us on social media to get notified when our YouTube channel launches!
          </Text>
          
          <View style={styles.socialButtons}>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL('https://www.facebook.com/hopeinchristforallnations');
              }}
              style={[styles.socialButton, { backgroundColor: '#1877F2' + '18' }]}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={[styles.socialButtonText, { color: '#1877F2' }]}>Facebook</Text>
            </Pressable>

            <Pressable
              onPress={openTwitter}
              style={[styles.socialButton, { backgroundColor: '#1DA1F2' + '18' }]}
            >
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
              <Text style={[styles.socialButtonText, { color: '#1DA1F2' }]}>Twitter/X</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL('https://www.tiktok.com/@hopeinchrist');
              }}
              style={[styles.socialButton, { backgroundColor: isDark ? '#fff18' : '#00018' }]}
            >
              <MaterialIcons name="music-note" size={20} color={isDark ? '#fff' : '#000'} />
              <Text style={[styles.socialButtonText, { color: isDark ? '#fff' : '#000' }]}>TikTok</Text>
            </Pressable>
          </View>
        </View>
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
  heroCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  availableNowText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  twitterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  twitterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
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
  previewSection: {
    marginBottom: 24,
  },
  videoCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 12,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoDate: {
    fontSize: 13,
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
