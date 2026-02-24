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
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { useResponsiveLayout } from '@/lib/layout';

const communityHero = require('@/assets/new/worship team 2.jpeg');

const CHANNELS = [
  {
    id: 'prayer',
    name: 'Prayer Requests',
    description: 'Share your prayer needs and pray for others',
    icon: 'hand-left' as const,
    color: Colors.primary,
  },
  {
    id: 'general',
    name: 'General Chat',
    description: 'Fellowship and general conversation',
    icon: 'chatbubbles' as const,
    color: Colors.accentBlue,
  },
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>
        <View style={[styles.header, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 8 }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Connect, share, and grow together</Text>
          <View style={styles.headerMetaRow}>
            <View style={[styles.headerMetaBadge, { backgroundColor: isDark ? Colors.dark.card : '#ffffff' }]}>
              <Ionicons name="people" size={13} color={Colors.primary} />
              <Text style={[styles.headerMetaText, { color: colors.text }]}>Private Fellowship</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Image
            source={communityHero}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroText}>Join our growing community of believers</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CHANNELS</Text>

          {CHANNELS.map(channel => (
            <Pressable
              key={channel.id}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/chat/[channel]', params: { channel: channel.id } });
              }}
              style={({ pressed }) => [
                styles.channelCard,
                {
                  backgroundColor: isDark ? Colors.dark.card : '#fff',
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={[styles.channelIconWrap, { backgroundColor: channel.color + '15' }]}>
                <Ionicons name={channel.icon} size={28} color={channel.color} />
              </View>
              <View style={styles.channelInfo}>
                <Text style={[styles.channelName, { color: colors.text }]}>{channel.name}</Text>
                <Text style={[styles.channelDesc, { color: colors.textSecondary }]}>{channel.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}

          <View style={[styles.guidelinesCard, { backgroundColor: isDark ? Colors.dark.card : Colors.primary + '08' }]}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <View style={styles.guidelinesContent}>
              <Text style={[styles.guidelinesTitle, { color: colors.text }]}>Community Guidelines</Text>
              <Text style={[styles.guidelinesText, { color: colors.textSecondary }]}>
                Be respectful, encourage one another, and keep conversations uplifting. Inappropriate content will be removed.
              </Text>
            </View>
          </View>
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
    right: -90,
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
    backgroundColor: 'rgba(36,113,163,0.1)',
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
    marginTop: 12,
    flexDirection: 'row',
  },
  headerMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91,44,142,0.28)',
  },
  headerMetaText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.2,
  },
  heroCard: {
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    paddingTop: 40,
  },
  heroText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamily.bold,
    lineHeight: 22,
  },
  content: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 2,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    gap: 14,
  },
  channelIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfo: {
    flex: 1,
    gap: 3,
  },
  channelName: {
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  channelDesc: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },
  guidelinesCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    gap: 10,
    marginTop: 8,
  },
  guidelinesContent: {
    flex: 1,
    gap: 4,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  guidelinesText: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },
});
