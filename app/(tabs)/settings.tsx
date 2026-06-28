import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Linking,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { fontFamily } from "@/lib/fonts";
import {
  requestNotificationPermission,
  isNotificationsEnabled,
  scheduleServiceReminders,
  cancelServiceReminders,
} from "@/lib/notifications";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlassCard } from "@/components/GlassCard";
import { useResponsiveLayout } from "@/lib/layout";
import Colors from "@/constants/colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const layout = useResponsiveLayout();
  const router = useRouter();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    isNotificationsEnabled().then(setNotificationsEnabled);
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Push notifications are not supported on web.");
      return;
    }
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings.",
          [{ text: "OK" }],
        );
        return;
      }
      await scheduleServiceReminders();
      setNotificationsEnabled(true);
      Alert.alert(
        "Notifications Enabled!",
        "You'll be reminded before Sunday, Wednesday, and Friday services.",
        [{ text: "Great!" }],
      );
    } else {
      await cancelServiceReminders();
      setNotificationsEnabled(false);
    }
  };

  const handlePress = (action: string) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
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
        Linking.openURL("https://doc-hosting.flycricket.io/hope-in-christ-privacy-policy/671705c1-7314-4cc2-9d2f-c71d18c2607f/privacy");
        break;
      case "terms":
        Linking.openURL("https://doc-hosting.flycricket.io/hope-in-christ-terms-of-use/565db735-e082-4222-81c6-bf4c8ec89bce/terms");
        break;
      case "help":
        Linking.openURL("https://wa.me/27825302000");
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
      subtitle: "Pastor Thabo on YouTube",
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
      title: "Privacy Policy",
      subtitle: "How we handle your data",
      icon: "lock-closed-outline",
      action: "privacy",
      color: Colors.primary,
    },
    {
      title: "Terms of Use",
      subtitle: "Terms & conditions of this app",
      icon: "document-text-outline",
      action: "terms",
      color: Colors.accentBlue,
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
      <LinearGradient
        colors={["rgba(74,35,90,0.12)", "rgba(36,113,163,0.07)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

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
            <View style={styles.headerAccentRow}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.headerAccentBar}
              />
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Settings
              </Text>
            </View>
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
              <View style={styles.settingContent}>
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
                      {notificationsEnabled
                        ? "Reminders set for Sun, Wed & Fri"
                        : "Tap to enable service reminders"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{
                    false: colors.border,
                    true: Colors.primary + "99",
                  }}
                  thumbColor={notificationsEnabled ? Colors.primary : colors.textSecondary}
                />
              </View>
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
          <LinearGradient
            colors={cardColors}
            style={styles.infoCard}
          >
            <View style={styles.appInfo}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 0.85, y: 1 }}
                style={styles.appIconCircle}
              >
                <Ionicons name="globe-outline" size={28} color="#fff" />
              </LinearGradient>
              <Text style={[styles.appName, cardText]}>
                Hope In Christ Ministries
              </Text>
              <Text style={styles.appVersion}>
                Version 2.0.0
              </Text>
              <Text style={[styles.appDescription, cardSubText]}>
                Empowering lives through faith and bringing hope to communities
                across the nations.
              </Text>
            </View>
            <LinearGradient
              colors={[Colors.primary, Colors.accentBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.infoFooterBar}
            />
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  orbPrimary: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(106,71,205,0.11)",
  },
  orbSecondary: {
    position: "absolute",
    bottom: 200,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(36,113,163,0.09)",
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerAccentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  headerAccentBar: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    marginLeft: 14,
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
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  appInfo: {
    alignItems: "center",
    padding: 24,
    paddingBottom: 20,
    gap: 6,
  },
  appIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  appName: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: "#fff",
    textAlign: "center",
  },
  appVersion: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: Colors.gold,
  },
  appDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 20,
    color: "rgba(255,255,255,0.55)",
    marginTop: 4,
  },
  infoFooterBar: {
    height: 4,
  },
});
