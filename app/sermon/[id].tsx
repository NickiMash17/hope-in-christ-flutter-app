import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { useSermon } from "@/lib/db";
import { useResponsiveLayout } from "@/lib/layout";
import { useAudioPlayer } from "@/contexts/AudioContext";

const FALLBACK_IMAGES: Record<string, any> = {
  Word: require("@/assets/new/pastor.jpeg"),
  Teaching: require("@/assets/new/pastor teaching congregants.jpeg"),
  Prayer: require("@/assets/new/new purple.png"),
};


export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const cardDivider = { backgroundColor: colors.border };
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const { data: sermon, isLoading } = useSermon(id ?? "");
  const audioPlayer = useAudioPlayer();

  const handleListenOnX = () => {
    if (!sermon?.audio_url) return;
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    audioPlayer.play({
      id: sermon.id,
      title: sermon.title,
      speaker: sermon.speaker,
      url: sermon.audio_url,
    });
    Linking.openURL(sermon.audio_url);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.navBar, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 4 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!sermon) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.navBar, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 4 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Sermon not found
          </Text>
        </View>
      </View>
    );
  }

  const categoryColors: Record<string, string> = {
    Word: Colors.primary,
    Teaching: Colors.accentBlue,
    Prayer: Colors.accent,
  };
  const catColor = categoryColors[sermon.category] || Colors.primary;
  const heroSource = sermon.thumbnail_url
    ? { uri: sermon.thumbnail_url }
    : FALLBACK_IMAGES[sermon.category] ?? FALLBACK_IMAGES.Word;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["rgba(74,35,90,0.16)", "rgba(30,58,138,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[layout.maxWidthStyle, { width: "100%" }]}>
          {/* ── Hero ── */}
          <View style={styles.heroContainer}>
            <Image source={heroSource} style={styles.heroImage} contentFit="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
              style={styles.heroOverlay}
            >
              <Pressable
                onPress={() => router.back()}
                style={[
                  styles.floatingBack,
                  { top: (Platform.OS === "web" ? webTopInset : insets.top) + 8 },
                ]}
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </Pressable>

              <View style={styles.heroBottom}>
                <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
                  <Text style={styles.categoryText}>{sermon.category}</Text>
                </View>
                <Pressable onPress={handleListenOnX} style={[styles.playButton, !sermon.audio_url && { opacity: 0.4 }]}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.accentBlue]}
                    start={{ x: 0.15, y: 0 }}
                    end={{ x: 0.85, y: 1 }}
                    style={styles.playButtonGradient}
                  >
                    <Ionicons name="play" size={22} color="#fff" />
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}>
            {/* Title row with accent bar */}
            <View style={styles.titleRow}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.titleAccentBar}
              />
              <Text style={[styles.title, { color: colors.text }]}>{sermon.title}</Text>
            </View>

            {/* Meta card */}
            <LinearGradient colors={cardColors} style={[styles.metaCard, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
              <View style={styles.metaRow}>
                <View style={[styles.metaIconWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
                  <Ionicons name="person-outline" size={14} color={Colors.primary} />
                </View>
                <Text style={[styles.metaText, cardSubText]}>{sermon.speaker}</Text>
              </View>
              <View style={[styles.metaDivider, cardDivider]} />
              <View style={styles.metaRow}>
                <View style={[styles.metaIconWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.accentBlue} />
                </View>
                <Text style={[styles.metaText, cardSubText]}>
                  {new Date(sermon.date).toLocaleDateString("en-ZA", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
              {sermon.duration && (
                <>
                  <View style={[styles.metaDivider, cardDivider]} />
                  <View style={styles.metaRow}>
                    <View style={[styles.metaIconWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
                      <Ionicons name="time-outline" size={14} color={Colors.gold} />
                    </View>
                    <Text style={[styles.metaText, cardSubText]}>{sermon.duration}</Text>
                  </View>
                </>
              )}
            </LinearGradient>

            {sermon.description && (
              <Text style={[styles.description, { color: colors.text }]}>
                {sermon.description}
              </Text>
            )}

            {/* ── Recording CTA ── */}
            {sermon.audio_url ? (
              <Pressable onPress={handleListenOnX} style={styles.ctaButton}>
                <LinearGradient
                  colors={[Colors.primary, Colors.accentBlue]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <FontAwesome6 name="x-twitter" size={18} color="#fff" />
                  <Text style={styles.ctaText}>Listen to Sermon on X</Text>
                  <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              </Pressable>
            ) : (
              <View
                style={[
                  styles.noAudioCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : Colors.gray100,
                    borderColor: isDark ? "rgba(255,255,255,0.07)" : colors.border,
                  },
                ]}
              >
                <Ionicons name="mic-off-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.noAudioText, { color: colors.textSecondary }]}>
                  Recording not yet available for this sermon
                </Text>
              </View>
            )}

            {sermon.notes && (
              <LinearGradient colors={cardColors} style={[styles.notesCard, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
                <View style={styles.notesHeader}>
                  <Ionicons name="document-text-outline" size={16} color={Colors.gold} />
                  <Text style={[styles.notesTitle, cardText]}>Sermon Notes</Text>
                </View>
                <Text style={[styles.notesText, cardSubText]}>{sermon.notes}</Text>
              </LinearGradient>
            )}
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
    position: "absolute", top: -120, right: -84,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: "rgba(106,71,205,0.14)",
  },
  orbSecondary: {
    position: "absolute", bottom: 140, left: -80,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(31,83,168,0.1)",
  },
  navBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingBottom: 8,
  },
  backButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 16, fontFamily: fontFamily.medium },
  heroContainer: {
    height: 300, position: "relative",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end", padding: 16,
  },
  floatingBack: {
    position: "absolute", left: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center", justifyContent: "center",
  },
  heroBottom: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10,
  },
  categoryText: { color: "#fff", fontSize: 12, fontFamily: fontFamily.bold },
  playButton: { borderRadius: 30, overflow: "hidden" },
  playButtonGradient: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  content: { paddingTop: 20, gap: 12 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  titleAccentBar: { width: 4, height: 30, borderRadius: 2, marginTop: 4, flexShrink: 0 },
  title: { fontSize: 22, fontFamily: fontFamily.extraBold, lineHeight: 30, flex: 1 },
  metaCard: {
    borderRadius: 16, padding: 14, gap: 0,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  metaIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  metaDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginVertical: 2 },
  metaText: { fontSize: 13, fontFamily: fontFamily.medium, color: "rgba(255,255,255,0.75)" },
  description: {
    fontSize: 15, fontFamily: fontFamily.regular, lineHeight: 23,
    marginTop: 4, marginBottom: 4,
  },
  noAudioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  noAudioText: { fontSize: 13, fontFamily: fontFamily.regular, flex: 1 },
  ctaButton: { marginTop: 4, borderRadius: 16, overflow: "hidden" },
  ctaGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, paddingHorizontal: 20,
  },
  ctaText: { color: "#fff", fontSize: 16, fontFamily: fontFamily.bold, flex: 1 },
  notesCard: {
    borderRadius: 16, padding: 16, gap: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  notesHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  notesTitle: { fontSize: 15, fontFamily: fontFamily.bold, color: "#fff" },
  notesText: { fontSize: 14, fontFamily: fontFamily.regular, lineHeight: 22, color: "rgba(255,255,255,0.75)" },
});
