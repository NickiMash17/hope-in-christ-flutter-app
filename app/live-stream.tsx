import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";

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
    id: "1",
    title: "Sunday Morning Service",
    day: "Sunday",
    time: "09:00 AM",
    platform: "Facebook",
    description: "Join us for powerful worship, prayer, and the Word of God",
    isLive: false,
  },
  {
    id: "2",
    title: "Wednesday Bible Study",
    day: "Wednesday",
    time: "18:00 PM",
    platform: "Facebook",
    description: "Deep dive into biblical teachings and practical applications",
    isLive: false,
  },
  {
    id: "3",
    title: "Friday Youth Service",
    day: "Friday",
    time: "18:30 PM",
    platform: "Facebook",
    description: "Dynamic youth service with relevant teaching and worship",
    isLive: false,
  },
];

export default function LiveStreamScreen() {
  const { colors, isDark } = useTheme();
  const layout = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const [isCurrentlyLive, setIsCurrentlyLive] = useState(false);

  useEffect(() => {
    checkLiveStatus();
  }, []);

  const checkLiveStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const isLive =
      (day === 0 && hour >= 9 && hour < 12) ||
      (day === 3 && hour >= 18 && hour < 20) ||
      (day === 5 && hour >= 18 && hour < 21);

    setIsCurrentlyLive(isLive);
  };

  const openFacebookLive = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("https://www.facebook.com/hopeinchristforallnations/live");
  };

  const openYouTubeLive = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "YouTube Channel Coming Soon",
      "Our YouTube channel will launch soon with live streaming capabilities!",
      [
        { text: "Watch on Facebook", onPress: openFacebookLive },
        { text: "OK", style: "cancel" },
      ],
    );
  };

  const enableNotifications = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Enable Notifications",
      "Get notified when we go live! This feature will be available in the next update.",
      [{ text: "OK" }],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Atmosphere */}
      <LinearGradient
        colors={["rgba(74,35,90,0.14)", "rgba(36,113,163,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      {/* Custom Nav Bar */}
      <View
        style={[
          styles.navBar,
          { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 4 },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>
          Live Stream
        </Text>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.horizontalPadding },
        ]}
      >
        <View style={layout.maxWidthStyle}>
          {/* Live Status Banner */}
          {isCurrentlyLive ? (
            <Pressable onPress={openFacebookLive}>
              <LinearGradient
                colors={["#C0392B", "#8B0000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.liveBanner}
              >
                <View style={styles.liveIndicator}>
                  <View style={styles.livePulse} />
                  <Text style={styles.liveText}>LIVE NOW</Text>
                </View>
                <Text style={styles.liveBannerTitle}>Service is Live!</Text>
                <Text style={styles.liveBannerSubtitle}>
                  Tap to join the stream
                </Text>
                <Ionicons
                  name="play-circle"
                  size={48}
                  color="#fff"
                  style={{ marginTop: 12 }}
                />
              </LinearGradient>
            </Pressable>
          ) : (
            <LinearGradient
              colors={isDark ? ["#4A235A", "#1a1a2e"] : ["#6B3AA0", "#4A235A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.offlineBanner}
            >
              <Ionicons
                name="videocam-outline"
                size={48}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={styles.offlineTitle}>No Live Stream Right Now</Text>
              <Text style={styles.offlineSubtitle}>
                Check the schedule below for upcoming services
              </Text>
            </LinearGradient>
          )}

          {/* Quick Access Buttons */}
          <View style={styles.quickActions}>
            <Pressable
              onPress={openFacebookLive}
              style={({ pressed }) => [
                styles.quickActionButton,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  opacity: pressed ? 0.85 : 1,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(91,44,142,0.1)",
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "#1877F218" },
                ]}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </View>
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Watch on
              </Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                Facebook
              </Text>
            </Pressable>

            <Pressable
              onPress={openYouTubeLive}
              style={({ pressed }) => [
                styles.quickActionButton,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  opacity: pressed ? 0.85 : 1,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(91,44,142,0.1)",
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "#FF000018" },
                ]}
              >
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              </View>
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                YouTube
              </Text>
              <Text
                style={[
                  styles.quickActionLabel,
                  { color: colors.textSecondary, fontSize: 11 },
                ]}
              >
                Coming Soon
              </Text>
            </Pressable>

            <Pressable
              onPress={enableNotifications}
              style={({ pressed }) => [
                styles.quickActionButton,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  opacity: pressed ? 0.85 : 1,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(91,44,142,0.1)",
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: Colors.gold + "18" },
                ]}
              >
                <Ionicons name="notifications" size={24} color={Colors.gold} />
              </View>
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Get
              </Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                Notified
              </Text>
            </Pressable>
          </View>

          {/* Stream Schedule */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Live Stream Schedule
              </Text>
            </View>

            {STREAM_SCHEDULE.map((schedule) => (
              <View
                key={schedule.id}
                style={[
                  styles.scheduleCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : "#fff",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(91,44,142,0.1)",
                  },
                ]}
              >
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleDay}>
                    <Text
                      style={[
                        styles.scheduleDayText,
                        { color: Colors.primary },
                      ]}
                    >
                      {schedule.day}
                    </Text>
                    <Text style={[styles.scheduleTime, { color: colors.text }]}>
                      {schedule.time}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.platformBadge,
                      { backgroundColor: "#1877F218" },
                    ]}
                  >
                    <Ionicons name="logo-facebook" size={14} color="#1877F2" />
                    <Text style={[styles.platformText, { color: "#1877F2" }]}>
                      {schedule.platform}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.scheduleTitle, { color: colors.text }]}>
                  {schedule.title}
                </Text>
                <Text
                  style={[
                    styles.scheduleDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {schedule.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Streaming Features */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Streaming Features
              </Text>
            </View>

            {[
              {
                icon: <MaterialIcons name="hd" size={24} color="#6B3AA0" />,
                iconBg: "#6B3AA018",
                title: "HD Quality",
                description:
                  "High-definition video streaming for the best viewing experience",
              },
              {
                icon: (
                  <Ionicons name="chatbubbles" size={24} color={Colors.gold} />
                ),
                iconBg: Colors.gold + "18",
                title: "Live Chat",
                description: "Interact with other viewers during the service",
              },
              {
                icon: <MaterialIcons name="replay" size={24} color="#25D366" />,
                iconBg: "#25D36618",
                title: "Watch Replay",
                description:
                  "Missed it live? Watch the replay anytime after the service",
              },
            ].map((feature, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : "#fff",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(91,44,142,0.1)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: feature.iconBg },
                  ]}
                >
                  {feature.icon}
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* How to Watch */}
          <View
            style={[
              styles.howToCard,
              {
                backgroundColor: isDark ? Colors.dark.card : "#fff",
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(91,44,142,0.1)",
              },
            ]}
          >
            <Text style={[styles.howToTitle, { color: colors.text }]}>
              How to Watch Live
            </Text>

            {[
              "Follow us on Facebook or subscribe on YouTube (when available)",
              "Check the schedule above for service times",
              'Tap "Watch on Facebook" when the service is live',
              "Enable notifications to never miss a service",
            ].map((step, idx) => (
              <View key={idx} style={styles.step}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: Colors.primary },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.text }]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <Pressable
            onPress={openFacebookLive}
            style={({ pressed }) => [
              styles.ctaButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <LinearGradient
              colors={["#6B3AA0", "#4A235A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Ionicons name="videocam" size={22} color="#fff" />
              <Text style={styles.ctaText}>Go to Live Stream Page</Text>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  orbPrimary: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(106,71,205,0.14)",
  },
  orbSecondary: {
    position: "absolute",
    bottom: 200,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(36,113,163,0.1)",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 17,
    fontFamily: fontFamily.semiBold,
    flex: 1,
    textAlign: "center",
  },
  navPlaceholder: {
    width: 36,
  },
  content: {
    paddingVertical: 12,
  },
  liveBanner: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  livePulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  liveText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    color: "#fff",
    letterSpacing: 1.5,
  },
  liveBannerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    marginBottom: 4,
  },
  liveBannerSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.9)",
  },
  offlineBanner: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
  },
  offlineSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  quickActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    marginBottom: 2,
  },
  quickActionLabel: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fontFamily.extraBold,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  scheduleDay: {
    flex: 1,
  },
  scheduleDayText: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  scheduleTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    marginBottom: 6,
  },
  scheduleDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 19,
  },
  featureCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 19,
  },
  howToCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  howToTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    marginBottom: 20,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 21,
    paddingTop: 3,
  },
  ctaButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#4A235A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 10,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
});
