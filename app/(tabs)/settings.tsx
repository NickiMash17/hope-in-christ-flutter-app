import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { fontFamily } from "@/lib/fonts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlassCard } from "@/components/GlassCard";
import { useResponsiveLayout } from "@/lib/layout";
import Colors from "@/constants/colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const layout = useResponsiveLayout();
  const router = useRouter();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const handlePress = (action: string) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
      case "notifications":
        Alert.alert(
          "Notifications",
          "Stay updated with service times, events, and ministry announcements.",
          [
            { text: "Enable Notifications", onPress: () => {} },
            { text: "Not Now", style: "cancel" },
          ],
        );
        break;
      case "live-stream":
        router.push("/live-stream");
        break;
      case "youtube":
        router.push("/youtube-sermons");
        break;
      case "about":
        router.push("/about");
        break;
      case "privacy":
        Alert.alert(
          "Privacy",
          "Your data is kept private and never shared with third parties.",
        );
        break;
      case "help":
        Alert.alert(
          "Help & Support",
          "For assistance, contact us at info@hopeinchrist.co.za or reach us on WhatsApp.",
        );
        break;
      default:
        break;
    }
  };

  const notificationsOption = {
    title: "Notifications",
    subtitle: "Stay updated with services & events",
    icon: "notifications-outline",
    action: "notifications",
    color: Colors.primary,
  };

  const mediaOptions = [
    {
      title: "Live Stream",
      subtitle: "Watch services live on Facebook",
      icon: "videocam-outline",
      action: "live-stream",
      color: "#C0392B",
    },
    {
      title: "YouTube Channel",
      subtitle: "Video sermons — coming soon",
      icon: "logo-youtube",
      action: "youtube",
      color: "#FF0000",
    },
  ];

  const generalOptions = [
    {
      title: "About",
      subtitle: "Learn more about Hope In Christ",
      icon: "information-circle-outline",
      action: "about",
      color: Colors.accentBlue,
    },
    {
      title: "Privacy",
      subtitle: "Your data is private & secure",
      icon: "lock-closed-outline",
      action: "privacy",
      color: Colors.primary,
    },
    {
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: "help-circle-outline",
      action: "help",
      color: Colors.gold,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 20,
          },
        ]}
      >
        <View
          style={[
            layout.maxWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Settings
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Customize your app experience
            </Text>
          </View>

          {/* Theme Section */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={colors.text}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>
            <View style={styles.themeRow}>
              <View style={styles.themeInfo}>
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  Theme
                </Text>
                <Text
                  style={[
                    styles.themeDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Choose between light and dark mode
                </Text>
              </View>
              <View
                style={[
                  styles.themeToggleWrap,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ThemeToggle size="medium" showLabel={false} />
              </View>
            </View>
          </GlassCard>

          {/* Notifications */}
          <View style={styles.sectionGroup}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
              UPDATES
            </Text>
            <GlassCard style={styles.settingCard}>
              <Pressable
                style={styles.settingContent}
                onPress={() => handlePress(notificationsOption.action)}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.settingIcon,
                      { backgroundColor: notificationsOption.color + "18" },
                    ]}
                  >
                    <Ionicons
                      name={notificationsOption.icon as any}
                      size={20}
                      color={notificationsOption.color}
                    />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {notificationsOption.title}
                    </Text>
                    <Text
                      style={[
                        styles.settingSubtitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {notificationsOption.subtitle}
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
          </View>

          {/* Media */}
          <View style={styles.sectionGroup}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
              MEDIA
            </Text>
            <View style={styles.settingsContainer}>
              {mediaOptions.map((option, index) => (
                <GlassCard key={index} style={styles.settingCard}>
                  <Pressable
                    style={styles.settingContent}
                    onPress={() => handlePress(option.action)}
                  >
                    <View style={styles.settingLeft}>
                      <View
                        style={[
                          styles.settingIcon,
                          { backgroundColor: option.color + "18" },
                        ]}
                      >
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={option.color}
                        />
                      </View>
                      <View style={styles.settingText}>
                        <Text
                          style={[styles.settingTitle, { color: colors.text }]}
                        >
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            styles.settingSubtitle,
                            { color: colors.textSecondary },
                          ]}
                        >
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
          </View>

          {/* General */}
          <View style={styles.sectionGroup}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
              GENERAL
            </Text>
            <View style={styles.settingsContainer}>
              {generalOptions.map((option, index) => (
                <GlassCard key={index} style={styles.settingCard}>
                  <Pressable
                    style={styles.settingContent}
                    onPress={() => handlePress(option.action)}
                  >
                    <View style={styles.settingLeft}>
                      <View
                        style={[
                          styles.settingIcon,
                          { backgroundColor: option.color + "18" },
                        ]}
                      >
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={option.color}
                        />
                      </View>
                      <View style={styles.settingText}>
                        <Text
                          style={[styles.settingTitle, { color: colors.text }]}
                        >
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            styles.settingSubtitle,
                            { color: colors.textSecondary },
                          ]}
                        >
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
          </View>

          {/* App Info */}
          <GlassCard style={styles.infoCard}>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: colors.text }]}>
                Hope In Christ Ministries
              </Text>
              <Text
                style={[styles.appVersion, { color: colors.textSecondary }]}
              >
                Version 1.0.0
              </Text>
              <Text
                style={[styles.appDescription, { color: colors.textSecondary }]}
              >
                Empowering lives through faith and bringing hope to communities
                across the nations.
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    marginLeft: 12,
  },
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  sectionGroup: {
    marginBottom: 24,
  },
  groupLabel: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsContainer: {
    gap: 10,
  },
  settingCard: {
    marginHorizontal: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 16,
  },
  infoCard: {
    marginBottom: 4,
  },
  appInfo: {
    alignItems: "center",
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
    textAlign: "center",
    lineHeight: 20,
  },
});
