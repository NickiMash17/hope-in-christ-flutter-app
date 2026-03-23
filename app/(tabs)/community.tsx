import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";
import { CHAT_CHANNELS } from "@/lib/ministry-data";

const communityHero = require("@/assets/new/worship team 2.jpeg");

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const CHANNEL_ICON_MAP: Record<string, IoniconsName> = {
  chatbubbles: "chatbubbles",
  heart: "heart",
  star: "star",
  people: "people",
  book: "book",
};

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["rgba(74,35,90,0.14)", "rgba(36,113,163,0.08)", "transparent"]}
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
        <View
          style={[
            layout.maxWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          {/* ── Header ── */}
          <View
            style={[
              styles.header,
              {
                paddingTop:
                  (Platform.OS === "web" ? webTopInset : insets.top) + 8,
              },
            ]}
          >
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Community
            </Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
              Connect, share, and grow together
            </Text>
            <View style={styles.headerMetaRow}>
              <View
                style={[
                  styles.headerMetaBadge,
                  { backgroundColor: isDark ? Colors.dark.card : "#ffffff" },
                ]}
              >
                <Ionicons name="people" size={13} color={Colors.primary} />
                <Text style={[styles.headerMetaText, { color: colors.text }]}>
                  Private Fellowship
                </Text>
              </View>
            </View>
          </View>

          {/* ── Hero Image ── */}
          <View style={styles.heroCard}>
            <Image
              source={communityHero}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.78)"]}
              style={styles.heroOverlay}
            >
              <Text style={styles.heroText}>
                Join our growing community of believers
              </Text>
            </LinearGradient>
          </View>

          {/* ── Channels ── */}
          <View style={styles.content}>
            {/* Section header */}
            <View style={styles.channelsSectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Channels
              </Text>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isDark
                      ? Colors.dark.card
                      : Colors.primary + "12",
                  },
                ]}
              >
                <Text style={[styles.countText, { color: Colors.primary }]}>
                  {CHAT_CHANNELS.length} active
                </Text>
              </View>
            </View>

            {CHAT_CHANNELS.map((channel) => (
              <Pressable
                key={channel.id}
                onPress={() => {
                  if (Platform.OS !== "web")
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({
                    pathname: "/chat/[channel]",
                    params: { channel: channel.id },
                  });
                }}
                style={({ pressed }) => [
                  styles.channelCard,
                  {
                    backgroundColor: isDark ? Colors.dark.card : "#fff",
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {/* Colored left accent bar */}
                <View
                  style={[
                    styles.channelAccent,
                    { backgroundColor: channel.color },
                  ]}
                />

                {/* Icon */}
                <View
                  style={[
                    styles.channelIconWrap,
                    { backgroundColor: channel.color + "18" },
                  ]}
                >
                  <Ionicons
                    name={
                      CHANNEL_ICON_MAP[channel.icon] ?? "chatbubble-outline"
                    }
                    size={24}
                    color={channel.color}
                  />
                </View>

                {/* Text */}
                <View style={styles.channelInfo}>
                  <Text style={[styles.channelName, { color: colors.text }]}>
                    {channel.name}
                  </Text>
                  <Text
                    style={[
                      styles.channelDesc,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {channel.description}
                  </Text>
                </View>

                {/* Arrow */}
                <View
                  style={[
                    styles.channelArrow,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.06)"
                        : Colors.primary + "0E",
                    },
                  ]}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={channel.color}
                  />
                </View>
              </Pressable>
            ))}

            {/* ── Guidelines Card ── */}
            <View
              style={[
                styles.guidelinesCard,
                {
                  backgroundColor: isDark
                    ? Colors.dark.card
                    : Colors.primary + "08",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(91,44,142,0.12)",
                },
              ]}
            >
              <View
                style={[
                  styles.guidelinesIconWrap,
                  { backgroundColor: Colors.primary + "18" },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.guidelinesContent}>
                <Text style={[styles.guidelinesTitle, { color: colors.text }]}>
                  Community Guidelines
                </Text>
                <Text
                  style={[
                    styles.guidelinesText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Be respectful, encourage one another, and keep conversations
                  uplifting. Inappropriate content will be removed.
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
    position: "absolute",
    top: -120,
    right: -90,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(106,71,205,0.13)",
  },

  orbSecondary: {
    position: "absolute",
    bottom: 140,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(36,113,163,0.1)",
  },

  // ── Header ──
  header: {
    paddingBottom: 14,
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
    flexDirection: "row",
  },
  headerMetaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.28)",
  },
  headerMetaText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.2,
  },

  // ── Hero ──
  heroCard: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 44,
  },
  heroText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fontFamily.bold,
    lineHeight: 22,
  },

  // ── Channels ──
  content: {
    gap: 10,
  },

  channelsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },

  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.12)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
    paddingRight: 14,
    paddingVertical: 14,
    gap: 13,
  },

  channelAccent: {
    width: 4,
    alignSelf: "stretch",
  },

  channelIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  channelInfo: {
    flex: 1,
    gap: 3,
  },
  channelName: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  channelDesc: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 17,
  },

  channelArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Guidelines ──
  guidelinesCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginTop: 4,
    alignItems: "flex-start",
  },
  guidelinesIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  guidelinesContent: {
    flex: 1,
    gap: 5,
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
