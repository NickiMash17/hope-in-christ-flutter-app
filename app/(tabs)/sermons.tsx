import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { SERMONS } from "@/lib/ministry-data";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";

const CATEGORIES = ["All", "Word", "Teaching", "Prayer"] as const;

const sermonImages: Record<string, any> = {
  "1": require("@/assets/new/pastor.jpeg"),
  "2": require("@/assets/new/pastor teaching congregants.jpeg"),
  "3": require("@/assets/new/new purple.png"),
  "4": require("@/assets/new/pastor.jpeg"),
  "5": require("@/assets/new/pastor teaching congregants.jpeg"),
  "6": require("@/assets/new/new purple.png"),
  "7": require("@/assets/new/church youth.jpeg"),
  "8": require("@/assets/new/pastor.jpeg"),
  "9": require("@/assets/new/pastor teaching congregants.jpeg"),
  "10": require("@/assets/new/new purple.png"),
  "11": require("@/assets/new/pastor.jpeg"),
};

const categoryColors: Record<string, string> = {
  Word: Colors.primary,
  Teaching: Colors.accentBlue,
  Prayer: Colors.accent,
};

// ─── Featured "Latest Sermon" hero card ─────────────────────────────────────
function FeaturedSermonCard({ colors }: { colors: any }) {
  const sermon = SERMONS[0];
  if (!sermon) return null;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/sermon/[id]", params: { id: sermon.id } });
      }}
      style={({ pressed }) => [
        styles.featuredCard,
        { transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      <Image
        source={sermonImages[sermon.id]}
        style={styles.featuredImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={["rgba(74,35,90,0.25)", "rgba(0,0,0,0.94)"]}
        style={styles.featuredOverlay}
      >
        {/* Top row */}
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredBadge}>
            <View style={styles.featuredBadgeDot} />
            <Text style={styles.featuredBadgeText}>LATEST SERMON</Text>
          </View>
          <View
            style={[
              styles.featuredCategoryChip,
              {
                backgroundColor:
                  (categoryColors[sermon.category] || Colors.primary) + "CC",
              },
            ]}
          >
            <Text style={styles.featuredCategoryText}>{sermon.category}</Text>
          </View>
        </View>

        {/* Bottom info */}
        <View style={styles.featuredBottom}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {sermon.title}
          </Text>

          <View style={styles.featuredMetaRow}>
            <Ionicons
              name="person-outline"
              size={12}
              color="rgba(255,255,255,0.72)"
            />
            <Text style={styles.featuredSpeaker}>{sermon.speaker}</Text>
            <Text style={styles.featuredDot}>·</Text>
            <Ionicons
              name="calendar-outline"
              size={12}
              color="rgba(255,255,255,0.72)"
            />
            <Text style={styles.featuredDate}>
              {new Date(sermon.date).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Listen Now pill */}
          <View style={styles.featuredActions}>
            <View style={styles.featuredPlayPill}>
              <View style={styles.featuredPlayIconWrap}>
                <Ionicons name="headset" size={15} color={Colors.primary} />
              </View>
              <Text style={styles.featuredPlayText}>Listen Now</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Individual sermon list card ─────────────────────────────────────────────
function SermonCard({
  sermon,
  isDark,
  colors,
  isFirst,
}: {
  sermon: any;
  isDark: boolean;
  colors: any;
  isFirst?: boolean;
}) {
  const catColor = categoryColors[sermon.category] || Colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/sermon/[id]", params: { id: sermon.id } });
      }}
      style={({ pressed }) => [
        styles.sermonCard,
        {
          backgroundColor: isDark ? Colors.dark.card : "#fff",
          transform: [{ scale: pressed ? 0.98 : 1 }],
          marginTop: isFirst ? 0 : 0,
        },
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.sermonThumbWrap}>
        <Image
          source={sermonImages[sermon.id]}
          style={styles.sermonThumb}
          contentFit="cover"
        />
        {/* Category colour strip */}
        <View
          style={[styles.sermonThumbStrip, { backgroundColor: catColor }]}
        />
      </View>

      {/* Info */}
      <View style={styles.sermonInfo}>
        <Text
          style={[styles.sermonTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {sermon.title}
        </Text>
        <Text
          style={[styles.sermonSpeaker, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {sermon.speaker}
        </Text>
        <View style={styles.sermonMeta}>
          <View
            style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}
          >
            <Text style={[styles.categoryText, { color: catColor }]}>
              {sermon.category}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(sermon.date).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      {/* Arrow */}
      <View
        style={[
          styles.sermonArrow,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : catColor + "12",
          },
        ]}
      >
        <Ionicons name="chevron-forward" size={15} color={catColor} />
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SermonsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const filteredSermons = useMemo(() => {
    return SERMONS.filter((s) => {
      const matchesCategory =
        selectedCategory === "All" || s.category === selectedCategory;
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.speaker.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const ListHeader = (
    <View style={{ paddingHorizontal: layout.horizontalPadding }}>
      {/* ── Page header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 8,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Sermons
        </Text>

        {/* Search bar */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? Colors.dark.card : Colors.gray100 },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search sermons…"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {/* Category chips */}
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setSelectedCategory(cat);
              }}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat
                      ? Colors.primary
                      : isDark
                        ? Colors.dark.card
                        : Colors.gray100,
                  borderWidth: selectedCategory === cat ? 0 : 1,
                  borderColor: "rgba(91,44,142,0.14)",
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === cat ? "#fff" : colors.textSecondary,
                  },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Meta badge */}
        <View style={styles.headerMetaRow}>
          <View
            style={[
              styles.headerMetaBadge,
              { backgroundColor: isDark ? Colors.dark.card : "#ffffff" },
            ]}
          >
            <Ionicons name="mic" size={13} color={Colors.primary} />
            <Text style={[styles.headerMetaText, { color: colors.text }]}>
              Weekly Revelations
            </Text>
          </View>
        </View>
      </View>

      {/* ── Featured card (only when not filtering) ── */}
      {selectedCategory === "All" && !search && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeaderRow}>
            <View
              style={[
                styles.sectionAccent,
                { backgroundColor: Colors.primary },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Latest Sermon
            </Text>
          </View>
          <FeaturedSermonCard colors={colors} />
        </View>
      )}

      {/* ── "All Sermons" label ── */}
      <View style={styles.allSermonsHeader}>
        <View style={styles.sectionHeaderRow}>
          <View
            style={[styles.sectionAccent, { backgroundColor: Colors.primary }]}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory === "All" && !search
              ? "All Sermons"
              : `${filteredSermons.length} result${filteredSermons.length !== 1 ? "s" : ""}`}
          </Text>
        </View>
      </View>
    </View>
  );

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

      <View style={[layout.maxWidthStyle, { flex: 1, width: "100%" }]}>
        <FlatList
          data={filteredSermons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SermonCard sermon={item} isDark={isDark} colors={colors} />
          )}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: 100, paddingHorizontal: layout.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIconWrap,
                  {
                    backgroundColor: isDark
                      ? Colors.dark.card
                      : Colors.primary + "10",
                  },
                ]}
              >
                <Ionicons
                  name="search-outline"
                  size={32}
                  color={Colors.primary}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No sermons found
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: colors.textSecondary }]}
              >
                Try a different search or category
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  atmosphere: { ...StyleSheet.absoluteFillObject },

  orbPrimary: {
    position: "absolute",
    top: -120,
    right: -84,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(106,71,205,0.14)",
  },
  orbSecondary: {
    position: "absolute",
    bottom: 140,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(31,83,168,0.1)",
  },

  // ── Page header ──
  header: {
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    gap: 9,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.1)",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    padding: 0,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  headerMetaRow: {
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
    borderColor: "rgba(91,44,142,0.24)",
  },
  headerMetaText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.2,
  },

  // ── Section headers ──
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

  // ── Featured card ──
  featuredSection: {
    marginBottom: 4,
    gap: 12,
  },
  featuredCard: {
    height: 215,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 12,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 16,
  },
  featuredTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(91,44,142,0.88)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  featuredBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A8F0B0",
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  featuredCategoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featuredCategoryText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fontFamily.bold,
  },
  featuredBottom: {
    gap: 7,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 19,
    fontFamily: fontFamily.extraBold,
    lineHeight: 25,
  },
  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featuredSpeaker: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  featuredDot: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },
  featuredDate: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  featuredActions: {
    flexDirection: "row",
    marginTop: 2,
  },
  featuredPlayPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 7,
  },
  featuredPlayIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + "22",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredPlayText: {
    color: Colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.bold,
  },

  // ── All sermons label ──
  allSermonsHeader: {
    marginTop: 18,
    marginBottom: 10,
  },

  // ── List ──
  list: {
    paddingTop: 0,
    gap: 10,
  },

  // ── Sermon card ──
  sermonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.12)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: 13,
  },
  sermonThumbWrap: {
    position: "relative",
    borderRadius: 13,
    overflow: "hidden",
  },
  sermonThumb: {
    width: 68,
    height: 68,
    borderRadius: 13,
  },
  sermonThumbStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  sermonInfo: {
    flex: 1,
    gap: 3,
  },
  sermonTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    lineHeight: 19,
  },
  sermonSpeaker: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  sermonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
  },
  dateText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
  },
  sermonArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIconWrap: {
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
  },
});
