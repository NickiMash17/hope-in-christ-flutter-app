import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { DONATION_INFO, MINISTRY_INFO } from "@/lib/ministry-data";
import { useResponsiveLayout } from "@/lib/layout";

const giveHero = require("@/assets/new/pastor and wife 3.jpeg");

const PURPOSE_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "trending-up-outline",
  "gift-outline",
  "business-outline",
  "globe-outline",
];

const PURPOSE_COLORS = [
  Colors.primary,
  Colors.gold,
  Colors.accentBlue,
  Colors.accent,
];

export default function GiveScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const handleAction = (action: string) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (action) {
      case "online":
        Linking.openURL(DONATION_INFO.onlineGiving.url);
        break;
      case "eft":
        router.push("/eft-details");
        break;
      case "contact":
        Linking.openURL(MINISTRY_INFO.socialMedia.whatsapp);
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[
          "rgba(36,113,163,0.14)",
          "rgba(212,175,55,0.08)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View
          style={[
            layout.maxWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          {/* ── Hero ── */}
          <View style={styles.heroContainer}>
            <Image
              source={giveHero}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={[
                "rgba(74,35,90,0.45)",
                "rgba(36,113,163,0.82)",
                isDark ? Colors.dark.background : Colors.light.background,
              ]}
              style={[
                styles.heroOverlay,
                {
                  paddingTop:
                    (Platform.OS === "web" ? webTopInset : insets.top) + 16,
                },
              ]}
            >
              <View style={styles.headerIcon}>
                <Ionicons name="heart" size={30} color="#fff" />
              </View>
              <Text style={styles.headerTitle}>Give Generously</Text>
              <Text style={styles.headerSubtitle}>
                Your giving supports the work of the ministry and helps bring
                hope to communities across the nations.
              </Text>
            </LinearGradient>
          </View>

          {/* ── Building Fund Campaign ── */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/eft-details");
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.93 : 1 }]}
          >
            <LinearGradient
              colors={cardColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.campaignCard}
            >
              <View style={styles.campaignTop}>
                <View style={styles.campaignBadge}>
                  <Text style={styles.campaignBadgeText}>ACTIVE CAMPAIGN</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={isDark ? "rgba(255,255,255,0.4)" : colors.textSecondary} />
              </View>
              <View style={styles.campaignBody}>
                <View style={styles.campaignIcon}>
                  <MaterialCommunityIcons name="church" size={26} color={Colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.campaignTitle, cardText]}>HICFANM Building Fund</Text>
                  <Text style={[styles.campaignSub, cardSubText]}>Help us buy the church land!</Text>
                </View>
                <View style={styles.goalPill}>
                  <Text style={styles.goalText}>R75,000</Text>
                </View>
              </View>
              <Text style={[styles.campaignCta, cardSubText]}>Donate via EFT · Tap to view banking details →</Text>
            </LinearGradient>
          </Pressable>

          {/* ── How to Give ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: Colors.accentBlue },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Choose How to Give
              </Text>
            </View>

            {/* Give via Facebook */}
            <Pressable
              onPress={() => handleAction("online")}
              style={({ pressed }) => [
                styles.giveCard,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={[styles.giveIconWrap, { backgroundColor: "#1877F218" }]}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </View>
              <View style={styles.giveCardContent}>
                <Text style={[styles.giveCardTitle, { color: colors.text }]}>Give via Facebook</Text>
                <Text style={[styles.giveCardDesc, { color: colors.textSecondary }]}>
                  Support the ministry on our Facebook page
                </Text>
              </View>
              <View style={[styles.cardArrow, { backgroundColor: "#1877F218" }]}>
                <Ionicons name="open-outline" size={16} color="#1877F2" />
              </View>
            </Pressable>

            {/* EFT */}
            <Pressable
              onPress={() => handleAction("eft")}
              style={({ pressed }) => [
                styles.giveCard,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View
                style={[
                  styles.giveIconWrap,
                  { backgroundColor: Colors.accentBlue + "18" },
                ]}
              >
                <MaterialCommunityIcons
                  name="bank-transfer"
                  size={24}
                  color={Colors.accentBlue}
                />
              </View>
              <View style={styles.giveCardContent}>
                <Text style={[styles.giveCardTitle, { color: colors.text }]}>
                  EFT / Bank Transfer
                </Text>
                <Text
                  style={[styles.giveCardDesc, { color: colors.textSecondary }]}
                >
                  View our banking details for direct transfer
                </Text>
              </View>
              <View
                style={[
                  styles.cardArrow,
                  { backgroundColor: Colors.accentBlue + "18" },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.accentBlue}
                />
              </View>
            </Pressable>

            {/* Contact */}
            <Pressable
              onPress={() => handleAction("contact")}
              style={({ pressed }) => [
                styles.giveCard,
                {
                  backgroundColor: isDark ? Colors.dark.card : "#fff",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View
                style={[
                  styles.giveIconWrap,
                  { backgroundColor: Colors.accent + "18" },
                ]}
              >
                <Ionicons name="call-outline" size={24} color={Colors.accent} />
              </View>
              <View style={styles.giveCardContent}>
                <Text style={[styles.giveCardTitle, { color: colors.text }]}>
                  Contact for Giving
                </Text>
                <Text
                  style={[styles.giveCardDesc, { color: colors.textSecondary }]}
                >
                  Speak with someone about your giving
                </Text>
              </View>
              <View
                style={[
                  styles.cardArrow,
                  { backgroundColor: Colors.accent + "18" },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.accent}
                />
              </View>
            </Pressable>
          </View>

          {/* ── Ways to Give (Purpose Grid) ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionAccent, { backgroundColor: Colors.gold }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ways to Give
              </Text>
            </View>

            <View style={styles.purposesGrid}>
              {DONATION_INFO.givingOptions.map((option, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.purposeCard,
                    {
                      backgroundColor: isDark ? Colors.dark.card : "#fff",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.purposeIconWrap,
                      { backgroundColor: PURPOSE_COLORS[idx] + "18" },
                    ]}
                  >
                    <Ionicons
                      name={PURPOSE_ICONS[idx]}
                      size={22}
                      color={PURPOSE_COLORS[idx]}
                    />
                  </View>
                  <Text style={[styles.purposeTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.purposeDesc,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={3}
                  >
                    {option.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Scripture ── */}
          <LinearGradient colors={cardColors} style={[styles.scriptureCard, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
            <View style={styles.scriptureIconWrap}>
              <Ionicons name="book" size={18} color={Colors.gold} />
            </View>
            <Text style={[styles.scriptureText, cardSubText]}>
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </Text>
            <Text style={styles.scriptureRef}>— 2 Corinthians 9:7</Text>
          </LinearGradient>
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
    top: -100,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(70,130,180,0.14)",
  },

  orbSecondary: {
    position: "absolute",
    bottom: 160,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(212,175,55,0.11)",
  },

  // ── Hero ──
  heroContainer: {
    height: 270,
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    lineHeight: 19,
  },

  // ── Sections ──
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
  },

  // ── Give Cards ──
  giveCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
    gap: 14,
    marginBottom: 10,
  },
  giveIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  giveCardContent: {
    flex: 1,
    gap: 3,
  },
  giveCardTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  giveCardDesc: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 17,
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Campaign Card ──
  campaignCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    gap: 10,
  },
  campaignTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  campaignBadge: {
    backgroundColor: "rgba(212,175,55,0.2)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  campaignBadgeText: {
    color: Colors.gold,
    fontSize: 9,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  campaignBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  campaignIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(212,175,55,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  campaignTitle: {
    fontSize: 16,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    marginBottom: 2,
  },
  campaignSub: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.7)",
  },
  goalPill: {
    backgroundColor: "rgba(212,175,55,0.18)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  goalText: {
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
    color: Colors.gold,
  },
  campaignCta: {
    fontSize: 11,
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.45)",
  },

  // ── Purpose Grid ──
  purposesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  purposeCard: {
    width: "48%",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.1)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    gap: 8,
  },
  purposeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  purposeTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  purposeDesc: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    lineHeight: 16,
  },

  // ── Scripture ──
  scriptureCard: {
    padding: 20,
    borderRadius: 18,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  scriptureIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(212,175,55,0.15)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(212,175,55,0.25)",
  },
  scriptureText: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    lineHeight: 21,
    fontStyle: "italic",
  },
  scriptureRef: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: Colors.gold,
    letterSpacing: 0.3,
  },
});
