import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlassCard } from '@/components/GlassCard';
import { useResponsiveLayout } from '@/lib/layout';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const layout = useResponsiveLayout();
  const router = useRouter();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (action) {
      case 'live-stream':
        router.push('/live-stream');
        break;
      case 'youtube':
        router.push('/youtube-sermons');
        break;
      case 'about':
        router.push('/about');
        break;
      default:
        break;
    }
  };

  const settingsOptions = [
    {
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      icon: 'notifications-outline',
      action: 'notifications',
    },
    {
      title: 'Live Stream',
      subtitle: 'Watch services live on Facebook',
      icon: 'videocam-outline',
      action: 'live-stream',
    },
    {
      title: 'YouTube Channel',
      subtitle: 'Video sermons (coming soon)',
      icon: 'logo-youtube',
      action: 'youtube',
    },
    {
      title: 'Privacy',
      subtitle: 'Control your privacy settings',
      icon: 'lock-closed-outline',
      action: 'privacy',
    },
    {
      title: 'About',
      subtitle: 'Learn more about Hope In Christ',
      icon: 'information-circle-outline',
      action: 'about',
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      action: 'help',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 20 }]}
      >
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Customize your app experience
          </Text>
        </View>

        {/* Theme Section */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={24} color={colors.text} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          </View>
          <View style={styles.themeRow}>
            <View style={styles.themeInfo}>
              <Text style={[styles.themeLabel, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                Choose between light and dark mode
              </Text>
            </View>
            <View style={[styles.themeToggleWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemeToggle size="medium" showLabel={false} />
            </View>
          </View>
        </GlassCard>

        {/* Other Settings */}
        <View style={styles.settingsContainer}>
          {settingsOptions.slice(1).map((option, index) => (
            <GlassCard key={index} style={styles.settingCard}>
              <Pressable 
                style={styles.settingContent}
                onPress={() => handlePress(option.action)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.card }]}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={colors.text} 
                    />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {option.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </Pressable>
            </GlassCard>
          ))}
        </View>

        {/* App Info */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: colors.text }]}>
              Hope In Christ Ministries
            </Text>
            <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
              Empowering lives through faith and bringing hope to communities across the nations.
            </Text>
          </View>
        </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    marginLeft: 12,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  themeInfo: {
    flex: 1,
    paddingTop: 2,
  },
  themeLabel: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },
  themeToggleWrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  settingsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  settingCard: {
    marginHorizontal: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  infoCard: {
    marginBottom: 4,
  },
  appInfo: {
    alignItems: 'center',
    padding: 8,
  },
  appName: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
