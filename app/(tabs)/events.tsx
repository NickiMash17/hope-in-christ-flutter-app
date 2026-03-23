import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
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
import { EVENTS } from "@/lib/ministry-data";
import { useResponsiveLayout } from "@/lib/layout";

const eventImages: Record<string, any> = {
  "1": require("@/assets/new/sunday-service-poster.jpeg"),
  "2": require("@/assets/new/church youth.jpeg"),
  "3": require("@/assets/new/ordination of ministers.jpeg"),
  "4": require("@/assets/new/worship team.jpeg"),
};

const categoryColors: Record<string, string> = {
  Conference: Colors.primary,
  Youth: Colors.accentBlue,
  Fellowship: Colors.accent,
  Service: Colors.gold,
};

// ─── Featured "Next Event" card (first / closest event) ──────────────────────
function FeaturedEventCard({
  event,
  isDark,
  colors,
}: {
  event: any;
  isDark: boolean;
  colors: any;
}) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString("en-ZA", { month: "short" })
    .toUpperCase();
  const weekday = dateObj.toLocaleDateString("en-ZA", { weekday: "long" });
  const color = categoryColors[event.category] || Colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/event/[id]", params: { id: event.id } });
      }}
      style={({ pressed }) => [
        styles.featuredCard,
        { transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      <Image
        source={eventImages[event.id] || eventImages["1"]}
        style={styles.featuredImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.88)"]}
        style={styles.featuredOverlay}
      >
        {/* Top row */}
        <View style={styles.featuredTopRow}>
          {/* Next Event badge */}
          <View style={styles.nextEventBadge}>
            <View style={styles.nextEventDot} />
            <Text style={styles.nextEventText}>NEXT EVENT</Text>
          </View>

          {/* Category badge */}
          <View style={[styles.categoryBadge, { backgroundColor: color }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        {/* Bottom content */}
        <View style={styles.featuredBottom}>
          {/* Date pill */}
          <View
            style={[styles.featuredDatePill, { backgroundColor: color + "DD" }]}
          >
            <Text style={styles.featuredDateDay}>{day}</Text>
            <Text style={styles.featuredDateMonth}>{month}</Text>
          </View>

          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.featuredWeekday}>{weekday}</Text>

            <View style={styles.featuredMetaRow}>
              <View style={styles.featuredMetaItem}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color="rgba(255,255,255,0.75)"
                />
                <Text style={styles.featuredMetaText}>{event.time}</Text>
              </View>
              <View style={styles.featuredMetaDot} />
              <View style={styles.featuredMetaItem}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color="rgba(255,255,255,0.75)"
                />
                <Text style={styles.featuredMetaText} numberOfLines={1}>
                  {event.location.split(",")[0]}
                </Text>
              </View>
            </View>

            {/* Register pill */}
            <View style={styles.featuredRegisterPill}>
              <Text style={styles.featuredRegisterText}>Tap to Register</Text>
              <Ionicons name="arrow-forward" size={13} color={color} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Regular event card ───────────────────────────────────────────────────────
function EventCard({
  event,
  isDark,
  colors,
}: {
  event: any;
  isDark: boolean;
  colors: any;
}) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString("en-ZA", { month: "short" })
    .toUpperCase();
  const color = categoryColors[event.category] || Colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/event/[id]", params: { id: event.id } });
      }}
      style={({ pressed }) => [
        styles.eventCard,
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <Image
        source={eventImages[event.id] || eventImages["1"]}
        style={styles.eventImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.86)"]}
        style={styles.eventOverlay}
      >
        {/* Date pill — top right */}
        <View style={[styles.datePill, { backgroundColor: color + "DD" }]}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>

        {/* Bottom */}
        <View style={styles.eventBottom}>
          <View style={[styles.categoryBadge, { backgroundColor: color }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color="rgba(255,255,255,0.7)"
            />
            <Text style={styles.metaText}>{event.time}</Text>
            <Ionicons
              name="location-outline"
              size={12}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location.split(",")[0]}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const sortedEvents = [...EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Split: first = featured, rest = regular list
  const [featuredEvent, ...remainingEvents] = sortedEvents;

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
          Upcoming conferences and gatherings
        </Text>
        <View style={styles.headerMetaRow}>
          <View
            style={[
              styles.headerMetaBadge,
              { backgroundColor: isDark ? Colors.dark.card : "#ffffff" },
            ]}
          >
            <Ionicons name="sparkles" size={13} color={Colors.gold} />
            <Text style={[styles.headerMetaText, { color: colors.text }]}>
              Curated Experiences
            </Text>
          </View>
        </View>
      </View>

      {/* ── Featured next event ── */}
      {featuredEvent && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeaderRow}>
            <View
              style={[
                styles.sectionAccent,
                { backgroundColor: Colors.primary },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Next Event
            </Text>
          </View>
          <FeaturedEventCard
            event={featuredEvent}
            isDark={isDark}
            colors={colors}
          />
        </View>
      )}

      {/* ── Upcoming events label ── */}
      {remainingEvents.length > 0 && (
        <View style={styles.upcomingHeader}>
          <View style={styles.sectionHeaderRow}>
            <View
              style={[
                styles.sectionAccent,
                { backgroundColor: Colors.accentBlue },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              More Events
            </Text>
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: isDark
                    ? Colors.dark.card
                    : Colors.accentBlue + "14",
                },
              ]}
            >
              <Text style={[styles.countText, { color: Colors.accentBlue }]}>
                {remainingEvents.length}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

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

      <View style={[layout.maxWidthStyle, { flex: 1, width: "100%" }]}>
        <FlatList
          data={remainingEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} isDark={isDark} colors={colors} />
          )}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: 100, paddingHorizontal: layout.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !featuredEvent ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  No upcoming events
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  atmosphere: { ...StyleSheet.absoluteFillObject },

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
    bottom: 140,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(70,130,180,0.12)",
  },

  // ── Page header ──
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
    flexDirection: "row",
    marginTop: 12,
  },
  headerMetaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.34)",
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
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
  },

  // ── Featured card ──
  featuredSection: {
    gap: 12,
    marginBottom: 8,
  },
  featuredCard: {
    height: 280,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 14,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 18,
  },
  featuredTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nextEventBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  nextEventDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#A8F0B0",
  },
  nextEventText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  featuredBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
  },
  featuredDatePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    minWidth: 54,
  },
  featuredDateDay: {
    fontSize: 26,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    lineHeight: 30,
  },
  featuredDateMonth: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
  },
  featuredInfo: {
    flex: 1,
    gap: 5,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    lineHeight: 26,
  },
  featuredWeekday: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.7)",
  },
  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  featuredMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featuredMetaText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  featuredMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  featuredRegisterPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    marginTop: 2,
  },
  featuredRegisterText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: "#1A1A2E",
  },

  // ── Upcoming label ──
  upcomingHeader: {
    marginTop: 22,
    marginBottom: 12,
  },

  // ── Regular event card ──
  list: {
    paddingTop: 0,
    gap: 12,
  },
  eventCard: {
    height: 195,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    justifyContent: "space-between",
  },
  datePill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  dateDay: {
    fontSize: 18,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 9,
    fontFamily: fontFamily.bold,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
  },
  eventBottom: {
    gap: 5,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  eventTitle: {
    fontSize: 17,
    fontFamily: fontFamily.bold,
    color: "#fff",
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.72)",
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
});
