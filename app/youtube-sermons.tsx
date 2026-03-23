import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";

interface VideoSermon {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: any;
  youtubeUrl?: string;
  comingSoon?: boolean;
}

const YOUTUBE_SERMONS: VideoSermon[] = [
  {
    id: "coming-1",
    title: "YouTube Channel Coming Soon!",
    description:
      "Our YouTube channel is launching soon with full sermon videos, worship sessions, and biblical teachings. Stay tuned!",
    date: "Coming Soon",
    thumbnail: require("@/assets/new/pastor.jpeg"),
    comingSoon: true,
  },
  {
    id: "coming-2",
    title: "Subscribe to Get Notified",
    description:
      "Be among the first to watch our video sermons when we launch. Full HD quality with subtitles.",
    date: "Coming Soon",
    thumbnail: require("@/assets/new/pastor teaching congregants.jpeg"),
    comingSoon: true,
  },
  {
    id: "coming-3",
    title: "Video Archive Coming",
    description:
      "We will be uploading past sermons and creating new video content regularly.",
    date: "Coming Soon",
    thumbnail: require("@/assets/new/new purple.png"),
    comingSoon: true,
  },
];

export default function YouTubeSermonsScreen() {
  const { colors, isDark } = useTheme();
  const layout = useResponsiveLayout();
  const insets = useSafeAreaInsets();

  const openYouTube = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("https://www.youtube.com/@hopeinchrist");
  };

  const openTwitter = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("https://x.com/HicfanMin");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Atmosphere ── */}
      <LinearGradient
        colors={["rgba(74,35,90,0.14)", "rgba(255,0,0,0.05)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      {/* ── Custom Nav Bar ── */}
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
          YouTube Sermons
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
          {/* ── Hero Card ── */}
          <LinearGradient
            colors={isDark ? ["#4A235A", "#1a1a2e"] : ["#6B3AA0", "#4A235A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-youtube" size={44} color="#FF0000" />
              </View>
              <Text style={styles.heroTitle}>YouTube Channel</Text>
              <Text style={styles.heroSubtitle}>Video Sermons Coming Soon</Text>
              <Text style={styles.heroDescription}>
                We&apos;re launching our official YouTube channel with full
                sermon videos, worship sessions, and biblical teachings in HD
                quality.
              </Text>

              {/* Subscribe button */}
              <Pressable
                onPress={openYouTube}
                style={({ pressed }) => [
                  styles.subscribeButton,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
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
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Ionicons name="logo-twitter" size={18} color="#1DA1F2" />
                <Text style={styles.twitterButtonText}>
                  Listen on Twitter/X
                </Text>
              </Pressable>
            </View>
          </LinearGradient>

          {/* ── What to Expect ── */}
          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What to Expect
              </Text>
            </View>

            {[
              {
                icon: (
                  <MaterialIcons
                    name="video-library"
                    size={22}
                    color="#FF0000"
                  />
                ),
                bg: "#FF000018",
                title: "Full Video Sermons",
                description:
                  "Complete Sunday services and special events in high definition",
              },
              {
                icon: (
                  <Ionicons name="musical-notes" size={22} color="#6B3AA0" />
                ),
                bg: "#6B3AA018",
                title: "Worship Sessions",
                description:
                  "Experience powerful worship moments from our services",
              },
              {
                icon: <Ionicons name="book" size={22} color={Colors.gold} />,
                bg: Colors.gold + "18",
                title: "Bible Teachings",
                description:
                  "In-depth biblical studies and practical life applications",
              },
              {
                icon: (
                  <MaterialIcons name="subtitles" size={22} color="#25D366" />
                ),
                bg: "#25D36618",
                title: "Subtitles & Quality",
                description:
                  "Multiple subtitle options and HD streaming quality",
              },
            ].map((feature, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : "#fff",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(91,44,142,0.1)",
                  },
                ]}
              >
                <View
                  style={[styles.featureIcon, { backgroundColor: feature.bg }]}
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

          {/* ── Coming to YouTube (previews) ── */}
          <View style={styles.previewSection}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionAccent, { backgroundColor: "#FF0000" }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Coming to YouTube
              </Text>
            </View>

            {YOUTUBE_SERMONS.map((sermon) => (
              <View
                key={sermon.id}
                style={[
                  styles.videoCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : "#fff",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(91,44,142,0.1)",
                  },
                ]}
              >
                <View style={styles.thumbnailWrap}>
                  <Image
                    source={sermon.thumbnail}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.thumbnailOverlay}
                  >
                    <View style={styles.comingSoonBadge}>
                      <Ionicons name="time-outline" size={13} color="#fff" />
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.videoInfo}>
                  <Text style={[styles.videoTitle, { color: colors.text }]}>
                    {sermon.title}
                  </Text>
                  <Text
                    style={[
                      styles.videoDescription,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {sermon.description}
                  </Text>
                  <View style={styles.videoMeta}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.videoDate,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {sermon.date}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* ── Stay Connected ── */}
          <View style={styles.ctaSection}>
            <Text style={[styles.ctaTitle, { color: colors.text }]}>
              Stay Connected
            </Text>
            <Text
              style={[styles.ctaDescription, { color: colors.textSecondary }]}
            >
              Follow us on social media to get notified when our YouTube channel
              launches!
            </Text>

            <View style={styles.socialButtons}>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web")
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(
                    "https://www.facebook.com/hopeinchristforallnations",
                  );
                }}
                style={[styles.socialButton, { backgroundColor: "#1877F218" }]}
              >
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={[styles.socialButtonText, { color: "#1877F2" }]}>
                  Facebook
                </Text>
              </Pressable>

              <Pressable
                onPress={openTwitter}
                style={[styles.socialButton, { backgroundColor: "#1DA1F218" }]}
              >
                <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                <Text style={[styles.socialButtonText, { color: "#1DA1F2" }]}>
                  Twitter/X
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web")
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL("https://www.tiktok.com/@hopeinchrist");
                }}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              >
                <MaterialIcons
                  name="music-note"
                  size={20}
                  color={isDark ? "#fff" : "#000"}
                />
                <Text
                  style={[
                    styles.socialButtonText,
                    { color: isDark ? "#fff" : "#000" },
                  ]}
                >
                  TikTok
                </Text>
              </Pressable>
            </View>
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
});
