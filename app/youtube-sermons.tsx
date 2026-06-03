import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";
import { usePodcasts } from "@/lib/db";
import type { PodcastAppearance } from "@/lib/supabase";

const PLATFORM_ICON: Record<string, { name: any; color: string }> = {
  spotify: { name: "logo-spotify" as any,  color: "#1DB954" },
  apple:   { name: "logo-apple" as any,    color: "#FC3C44" },
  youtube: { name: "logo-youtube" as any,  color: "#FF0000" },
  google:  { name: "logo-google" as any,   color: "#4285F4" },
  other:   { name: "mic-outline" as any,   color: Colors.primary },
};

function PodcastCard({ item, isDark, colors }: { item: PodcastAppearance; isDark: boolean; colors: any }) {
  const platform = (item.platform ?? "other").toLowerCase();
  const iconCfg = PLATFORM_ICON[platform] ?? PLATFORM_ICON.other;

  const open = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(item.url);
  };

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [
        styles.podcastCard,
        {
          backgroundColor: isDark ? Colors.dark.card : "#fff",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(91,44,142,0.1)",
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.podcastThumb} contentFit="cover" />
      ) : (
        <View style={[styles.podcastThumbPlaceholder, { backgroundColor: iconCfg.color + "18" }]}>
          <Ionicons name={iconCfg.name} size={28} color={iconCfg.color} />
        </View>
      )}
      <View style={styles.podcastInfo}>
        <Text style={[styles.podcastShow, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.podcast_name}
        </Text>
        <Text style={[styles.podcastTitle, { color: colors.text }]} numberOfLines={2}>
          {item.episode_title}
        </Text>
        {item.date && (
          <Text style={[styles.podcastDate, { color: colors.textSecondary }]}>
            {new Date(item.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
          </Text>
        )}
        <View style={[styles.listenPill, { backgroundColor: iconCfg.color + "18" }]}>
          <Ionicons name={iconCfg.name} size={13} color={iconCfg.color} />
          <Text style={[styles.listenText, { color: iconCfg.color }]}>Listen</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function YouTubeSermonsScreen() {
  const { colors, isDark } = useTheme();
  const layout = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const { data: podcasts = [], isLoading } = usePodcasts();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["rgba(74,35,90,0.14)", "rgba(255,0,0,0.05)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      {/* Nav bar */}
      <View style={[styles.navBar, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Podcast Appearances</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}
      >
        <View style={layout.maxWidthStyle}>
          {/* Hero */}
          <LinearGradient
            colors={isDark ? ["#4A235A", "#1a1a2e"] : ["#6B3AA0", "#4A235A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="mic" size={44} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>Guest Appearances</Text>
              <Text style={styles.heroSubtitle}>Pastor Thabo on Podcasts & Media</Text>
              <Text style={styles.heroDescription}>
                Listen to Pastor Thabo Boshomane share the Word of God across various
                podcast platforms and media interviews.
              </Text>
            </View>
          </LinearGradient>

          {/* Podcast list */}
          <View style={styles.listSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.primary }]} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {podcasts.length > 0 ? `${podcasts.length} Episode${podcasts.length !== 1 ? "s" : ""}` : "Episodes"}
              </Text>
            </View>

            {isLoading && (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
            )}

            {!isLoading && podcasts.length === 0 && (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, { backgroundColor: Colors.primary + "14" }]}>
                  <Ionicons name="mic-outline" size={36} color={Colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No episodes yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  Podcast appearances will appear here once added.
                </Text>
              </View>
            )}

            {podcasts.map((item) => (
              <PodcastCard key={item.id} item={item} isDark={isDark} colors={colors} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  atmosphere: { ...StyleSheet.absoluteFillObject },

  orbPrimary: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(106,71,205,0.12)",
  },
  orbSecondary: {
    position: "absolute",
    bottom: 200,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,0,0,0.06)",
  },

  // ── Nav bar ──
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
  navPlaceholder: { width: 36 },

  // ── Scroll content ──
  content: {
    paddingVertical: 12,
    paddingBottom: 60,
  },

  // ── Hero ──
  heroCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 28,
  },
  heroContent: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: "rgba(255,255,255,0.88)",
    marginBottom: 12,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  subscribeButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 14,
    gap: 9,
  },
  subscribeText: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  availableNowText: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 10,
    textAlign: "center",
  },
  twitterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  twitterButtonText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: "#fff",
  },

  // ── Section headers ──
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

  // ── Features ──
  featuresSection: {
    marginBottom: 28,
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
  featureContent: { flex: 1 },
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

  // ── Preview ──
  previewSection: {
    marginBottom: 28,
  },
  videoCard: {
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  thumbnailWrap: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  thumbnailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    padding: 12,
  },
  comingSoonBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,165,0,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 5,
  },
  comingSoonText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  videoInfo: {
    padding: 16,
    gap: 6,
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  videoDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 19,
  },
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  videoDate: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },

  // ── CTA ──
  ctaSection: {
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 24,
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: fontFamily.extraBold,
    marginBottom: 8,
    textAlign: "center",
  },
  ctaDescription: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.1)",
  },
  socialButtonText: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },

  // ── Podcast cards ──
  listSection: {
    marginBottom: 28,
  },
  podcastCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  podcastThumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  podcastThumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  podcastInfo: {
    flex: 1,
    gap: 3,
  },
  podcastShow: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  podcastTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    lineHeight: 19,
  },
  podcastDate: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
  },
  listenPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    marginTop: 4,
  },
  listenText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    gap: 10,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 19,
  },
});
