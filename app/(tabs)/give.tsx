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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { DONATION_INFO } from '@/lib/ministry-data';
import { useResponsiveLayout } from '@/lib/layout';

const giveHero = require('@/assets/new/pastor and wife 3.jpeg');

export default function GiveScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handleAction = (action: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (action) {
      case 'online':
        Linking.openURL(DONATION_INFO.onlineGiving.url);
        router.push('/donation-success');
        break;
      case 'eft':
        router.push('/eft-details');
        break;
      case 'contact':
        Linking.openURL(`tel:+27123456789`);
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(36,113,163,0.14)', 'rgba(212,175,55,0.08)', 'transparent']}
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
        <View style={[styles.heroContainer, { marginHorizontal: 0 }]}>
          <Image
            source={giveHero}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(36,113,163,0.6)', 'rgba(36,113,163,0.9)', isDark ? Colors.dark.background : Colors.light.background]}
            style={[styles.heroOverlay, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 16 }]}
          >
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={32} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Give Generously</Text>
            <Text style={styles.headerSubtitle}>
              Your giving supports the work of the ministry and helps bring hope to communities across the nations.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CHOOSE HOW TO GIVE</Text>

          <Pressable
            onPress={() => handleAction('online')}
            style={({ pressed }) => [
              styles.giveCard,
              {
                backgroundColor: isDark ? Colors.dark.card : '#fff',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={[styles.giveIconWrap, { backgroundColor: Colors.primary + '18' }]}>
              <Ionicons name="globe-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.giveCardContent}>
              <Text style={[styles.giveCardTitle, { color: colors.text }]}>Donate Online</Text>
              <Text style={[styles.giveCardDesc, { color: colors.textSecondary }]}>
                Securely give via our online platform
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color={Colors.primary} />
          </Pressable>

          <Pressable
            onPress={() => handleAction('eft')}
            style={({ pressed }) => [
              styles.giveCard,
              {
                backgroundColor: isDark ? Colors.dark.card : '#fff',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={[styles.giveIconWrap, { backgroundColor: Colors.accentBlue + '18' }]}>
              <MaterialCommunityIcons name="bank-transfer" size={24} color={Colors.accentBlue} />
            </View>
            <View style={styles.giveCardContent}>
              <Text style={[styles.giveCardTitle, { color: colors.text }]}>EFT / Bank Transfer</Text>
              <Text style={[styles.giveCardDesc, { color: colors.textSecondary }]}>
                View our banking details for direct transfer
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.accentBlue} />
          </Pressable>

          <Pressable
            onPress={() => handleAction('contact')}
            style={({ pressed }) => [
              styles.giveCard,
              {
                backgroundColor: isDark ? Colors.dark.card : '#fff',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={[styles.giveIconWrap, { backgroundColor: Colors.accent + '18' }]}>
              <Ionicons name="call-outline" size={24} color={Colors.accent} />
            </View>
            <View style={styles.giveCardContent}>
              <Text style={[styles.giveCardTitle, { color: colors.text }]}>Contact for Giving</Text>
              <Text style={[styles.giveCardDesc, { color: colors.textSecondary }]}>
                Speak with someone about your giving
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
          </Pressable>

          <View style={[styles.infoCard, { backgroundColor: isDark ? Colors.dark.card : Colors.primary + '08' }]}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.
            </Text>
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
    top: -100,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(70,130,180,0.14)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 160,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212,175,55,0.11)',
  },
  heroContainer: {
    height: 260,
    position: 'relative',
    borderRadius: 24,
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fontFamily.extraBold,
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 4,
    marginLeft: 4,
  },
  giveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    gap: 12,
  },
  giveIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giveCardContent: {
    flex: 1,
    gap: 2,
  },
  giveCardTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  giveCardDesc: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
