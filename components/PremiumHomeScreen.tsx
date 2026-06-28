
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";
import { MINISTRY_INFO, SCHEDULE } from "@/lib/ministry-data";
import { useEvents, useSermons } from "@/lib/db";
import { useIsLiveNow } from "@/lib/useIsLiveNow";
import { GlassCard } from "@/components/GlassCard";

import { PremiumStats } from "@/components/PremiumStats";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTENT_MAX_WIDTH, useResponsiveLayout } from "@/lib/layout";

function getTodaySchedule() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[new Date().getDay()];
  return SCHEDULE.find((s) => s.day === today);
}

export function PremiumHomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const layout = useResponsiveLayout();
  const reveal = useRef(new Animated.Value(0)).current;

  const todaySchedule = getTodaySchedule();
  const { data: liveSermons } = useSermons();
  const { data: events } = useEvents();
  const isLive = useIsLiveNow();
  const featuredSermon = liveSermons?.[0];
  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [events]);

  const sermonsThisMonth = useMemo(() => {
    if (!liveSermons) return null;
    const now = new Date();
    const count = liveSermons.filter((s) => {
      const d = new Date(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return count > 0 ? count.toString() : liveSermons.length > 0 ? liveSermons.length.toString() : null;
  }, [liveSermons]);

  const totalEvents = useMemo(() => {
    if (!events || events.length === 0) return null;
    return events.length.toString();
  }, [events]);
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const heroHeight = Math.min(
    Math.max(layout.width * 0.72, 360),
    layout.isTablet ? 600 : 520,
  );
  const contentWidth = Math.min(
    layout.width - layout.horizontalPadding * 2,
    CONTENT_MAX_WIDTH - layout.horizontalPadding * 2,
  );

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      duration: 620,
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  const quickActions = useMemo(
    () => [
      {
        id: "live",
        icon: "videocam",
        label: "Watch Live",
        color: Colors.accent,
        gradient: [Colors.accentDark, Colors.accent, Colors.accentLight],
        action: "live",
      },
      {
        id: "sermon",
        icon: "play-circle",
        label: "Latest Sermon",
        color: Colors.primary,
        gradient: [Colors.primaryDark, Colors.primary, Colors.primaryLight],
        action: "sermon",
      },
      {
        id: "give",
        icon: "heart",
        label: "Give",
        color: Colors.gold,
        gradient: [Colors.goldDark, Colors.gold],
        action: "give",
      },
      {
        id: "register",
        icon: "calendar",
        label: "Register",
        color: Colors.accentBlue,
        gradient: [Colors.accentBlueDark, Colors.accentBlue, Colors.accentBlueLight],
        action: "register",
      },
    ],
    [],
  );

  const handlePress = (action: string) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
      case "live":
        router.push("/live-stream");
        break;
      case "sermon":
        router.push({
          pathname: "/sermon/[id]",
          params: { id: featuredSermon?.id ?? "1" },
        });
        break;
      case "give":
        router.push("/(tabs)/give");
        break;
      case "register":
        router.push("/(tabs)/events");
        break;
      case "youtube":
        router.push("/youtube-sermons");
        break;
      case "schedule":
        router.push("/schedule");
        break;
      case "about":
        router.push("/about");
        break;
      case "maps": {
        const address = encodeURIComponent(MINISTRY_INFO.address);
        const mapsUrl = Platform.select({
          ios: `maps:0,0?q=${address}`,
          android: `geo:0,0?q=${address}`,
          default: `https://www.google.com/maps/search/?api=1&query=${address}`,
        });
        if (mapsUrl) Linking.openURL(mapsUrl);
        break;
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[
          "rgba(78,60,198,0.16)",
          "rgba(127,167,221,0.1)",
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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          style={[
            layout.maxWidthStyle,
            {
              paddingHorizontal: layout.horizontalPadding,
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.heroContainer, { height: heroHeight }]}>
            <Image
              source={require("@/assets/new/pastor.jpeg")}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={[
                'rgba(61,26,110,0.38)',
                'rgba(91,44,142,0.68)',
                'rgba(13,26,58,0.92)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.3, y: 1 }}
              style={[
                styles.heroOverlay,
                {
                  paddingTop:
                    (Platform.OS === "web" ? webTopInset : insets.top) + 20,
                },
              ]}
            >
              <View style={styles.heroHeader}>
                <Image
                  source={require("@/assets/new/new purple.png")}
                  style={styles.logoImage}
                  contentFit="contain"
                />
                <View style={styles.heroActions}>
                  <ThemeToggle size="small" />
                  <Pressable onPress={() => handlePress("about")}>
                    <Ionicons
                      name="information-circle-outline"
                      size={26}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.heroCenter}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text
                  style={[
                    styles.ministryNameMain,
                    layout.isTablet && styles.ministryNameMainLarge,
                  ]}
                >
                  Hope In Christ
                </Text>
                <Text style={styles.ministryNameSub}>
                  For All Nations Ministries
                </Text>
                <View style={styles.heroDivider} />
                <Text style={styles.sloganText}>{MINISTRY_INFO.slogan1}</Text>
                <Text style={styles.sloganText2}>{MINISTRY_INFO.slogan2}</Text>
                {isLive && (
                  <View style={styles.heroLiveBadge}>
                    <View style={styles.heroLiveDot} />
                    <Text style={styles.heroLiveText}>{"WE'RE LIVE NOW"}</Text>
                    <Ionicons name="radio" size={11} color="#fff" />
                  </View>
                )}
              </View>

              <View style={styles.serviceBadge}>
                <Ionicons name="home-outline" size={16} color="#fff" />
                <Text style={styles.serviceText} numberOfLines={1}>
                  {MINISTRY_INFO.serviceStyle}
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionAccent, { backgroundColor: colors.tint }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ministry Impact
              </Text>
            </View>
            <PremiumStats
              containerWidth={contentWidth}
              stats={[
                {
                  label: "Weekly Services",
                  value: "7",
                  icon: "calendar-outline",
                  gradient: [Colors.primaryDark, Colors.primary],
                  trend: "up",
                },
                {
                  label: "Active Members",
                  value: "2.5K",
                  icon: "people-outline",
                  gradient: [Colors.accentBlueDark, Colors.accentBlue],
                  trend: "up",
                },
                {
                  label: "Sermons This Month",
                  value: sermonsThisMonth ?? "–",
                  icon: "mic-outline",
                  gradient: [Colors.goldDark, Colors.gold],
                  trend: "neutral",
                },
                {
                  label: "Community Events",
                  value: totalEvents ?? "–",
                  icon: "star-outline",
                  gradient: [Colors.accentDark, Colors.accent],
                  trend: "up",
                },
              ]}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionAccent, { backgroundColor: colors.tint }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Quick Actions
              </Text>
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => handlePress(action.action)}
                  style={({ pressed }) => [
                    styles.quickActionTile,
                    {
                      opacity: pressed ? 0.88 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={action.gradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickActionTileGradient}
                  >
                    <View style={styles.quickActionShine} pointerEvents="none" />
                    {action.id === 'live' && isLive && (
                      <View style={styles.liveChip}>
                        <View style={styles.liveChipDot} />
                        <Text style={styles.liveChipText}>LIVE</Text>
                      </View>
                    )}
                    <View style={styles.quickActionTileIconWrap}>
                      <Ionicons name={action.icon as any} size={26} color="#fff" />
                    </View>
                    <Text style={styles.quickActionTileLabel}>{action.label}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </View>

          {upcomingEvents.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionAccent, { backgroundColor: colors.tint }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Events</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingRight: 4 }}
              >
                {upcomingEvents.map((ev) => {
                  const d = new Date(ev.date);
                  const catColor = ({
                    Conference: Colors.primary,
                    Youth: Colors.accentBlue,
                    Fellowship: Colors.accent,
                    Service: Colors.gold,
                  } as Record<string, string>)[ev.category] ?? Colors.primary;
                  return (
                    <Pressable
                      key={ev.id}
                      onPress={() => router.push({ pathname: '/event/[id]', params: { id: ev.id } })}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.88 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      })}
                    >
                      <LinearGradient colors={cardColors} style={styles.eventMiniCard}>
                        <View style={[styles.eventMiniAccent, { backgroundColor: catColor }]} />
                        <View style={[styles.eventMiniDateBubble, { backgroundColor: catColor + '22', borderColor: catColor + '55', borderWidth: 1 }]}>
                          <Text style={[styles.eventMiniDay, { color: catColor }]}>{d.getDate()}</Text>
                          <Text style={[styles.eventMiniMonth, { color: catColor + 'cc' }]}>
                            {d.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.eventMiniContent}>
                          <Text style={[styles.eventMiniName, cardText]} numberOfLines={2}>{ev.title}</Text>
                          <View style={styles.eventMiniMeta}>
                            <Ionicons name="location-outline" size={10} color={isDark ? "rgba(255,255,255,0.4)" : colors.textSecondary} />
                            <Text style={[styles.eventMiniLocation, cardSubText]} numberOfLines={1}>{ev.location}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionAccent, { backgroundColor: colors.tint }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured Sermon
              </Text>
            </View>
            <Pressable
              onPress={() => handlePress("sermon")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <GlassCard style={styles.sermonCard}>
                <Image
                  source={
                    featuredSermon?.thumbnail_url
                      ? { uri: featuredSermon.thumbnail_url }
                      : require("@/assets/new/pastor teaching congregants.jpeg")
                  }
                  style={styles.sermonImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.92)"]}
                  style={styles.sermonOverlay}
                >
                  {/* centre play button */}
                  <View style={styles.sermonPlayBtn} pointerEvents="none">
                    <LinearGradient colors={["rgba(91,44,142,0.9)", "rgba(36,113,163,0.9)"]} style={styles.sermonPlayGradient}>
                      <Ionicons name="play" size={22} color="#fff" />
                    </LinearGradient>
                  </View>
                  <View style={styles.sermonBadge}>
                    <Ionicons name="mic" size={13} color="#fff" />
                    <Text style={styles.sermonBadgeText}>Latest Sermon</Text>
                  </View>
                  <Text style={styles.sermonTitle}>
                    {featuredSermon?.title ?? "Powerful Teaching from the Word"}
                  </Text>
                  <View style={styles.sermonSpeakerRow}>
                    <Ionicons name="person-circle-outline" size={15} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.sermonSpeaker}>
                      {featuredSermon?.speaker ?? "Senior Pastor"}
                    </Text>
                  </View>
                </LinearGradient>
              </GlassCard>
            </Pressable>
          </View>

          {todaySchedule && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionAccent, { backgroundColor: colors.tint }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Schedule</Text>
              </View>
              <LinearGradient colors={cardColors} style={[styles.scheduleCard, { borderColor: isDark ? 'rgba(255,255,255,0.06)' : colors.border }]}>
                {/* card header */}
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleDayRow}>
                    <LinearGradient colors={["#5B2C8E", "#2471A3"]} style={styles.scheduleDayBadge}>
                      <Ionicons name="today" size={13} color="#fff" />
                      <Text style={styles.scheduleDayText}>{todaySchedule.day}</Text>
                    </LinearGradient>
                  </View>
                  <Pressable onPress={() => handlePress("schedule")} style={styles.scheduleViewAll}>
                    <Text style={styles.moreText}>View all</Text>
                    <Ionicons name="chevron-forward" size={12} color="#5B2C8E" />
                  </Pressable>
                </View>
                {/* time rows */}
                <View style={styles.scheduleItems}>
                  {todaySchedule.items.slice(0, 3).map((item, idx) => (
                    <View key={idx} style={[styles.scheduleItem, idx > 0 && { borderTopWidth: 0.5, borderTopColor: isDark ? "rgba(255,255,255,0.06)" : colors.border }]}>
                      <View style={styles.scheduleTimePill}>
                        <Text style={[styles.scheduleTimeText, cardSubText]}>{item.time}</Text>
                      </View>
                      <View style={styles.scheduleTimeDot} />
                      <Text style={[styles.scheduleItemTitle, cardText]}>{item.title}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: colors.tint }]} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Visit Us</Text>
            </View>
            <Pressable onPress={() => handlePress("maps")} style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
              <LinearGradient colors={cardColors} style={[styles.locationCard, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
                <LinearGradient colors={["#2471A3", "#5B2C8E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.locationTopBar} />
                <View style={styles.locationHeader}>
                  <LinearGradient colors={[Colors.accentBlue, Colors.primary]} style={styles.locationIconWrap}>
                    <Ionicons name="location" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={styles.locationTextContainer}>
                    <Text style={[styles.locationTitle, cardText]}>Our Location</Text>
                    <Text style={[styles.locationAddress, cardSubText]}>{MINISTRY_INFO.address}</Text>
                  </View>
                  <View style={[styles.locationArrow, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : colors.border }]}>
                    <Ionicons name="navigate" size={16} color={isDark ? "#fff" : colors.text} />
                  </View>
                </View>
                <View style={styles.locationFooter}>
                  <Ionicons name="map-outline" size={13} color={isDark ? "rgba(255,255,255,0.4)" : colors.textSecondary} />
                  <Text style={[styles.locationFooterText, cardSubText]}>Tap to open in Maps</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              © 2026 Hope In Christ For All Nations Ministries
            </Text>
            <Text
              style={[styles.footerSubtext, { color: colors.textSecondary }]}
            >
              Bringing Hope to All Nations
            </Text>
          </View>
        </Animated.View>
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
    top: -140,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(106,71,205,0.15)",
  },
  orbSecondary: {
    position: "absolute",
    bottom: 120,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(127,167,221,0.13)",
  },
  heroContainer: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 28,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 28,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heroCenter: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontFamily: fontFamily.medium,
  },
  ministryNameMain: {
    fontSize: 34,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    textAlign: "center",
  },
  ministryNameMainLarge: {
    fontSize: 44,
  },
  ministryNameSub: {
    fontSize: 17,
    fontFamily: fontFamily.semiBold,
    color: Colors.gold,
    textAlign: "center",
  },
  sloganText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
  sloganText2: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: "center",
    gap: 8,
  },
  serviceText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fontFamily.extraBold,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionTile: {
    width: "48%",
    height: 118,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  quickActionTileGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  quickActionShine: {
    position: "absolute", top: 0, left: 0, right: 0, height: "48%",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  quickActionTileIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionTileLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  sermonCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
  },
  sermonImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  sermonOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    gap: 6,
  },
  sermonBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(91,44,142,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: "flex-start",
    gap: 5,
  },
  sermonBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  sermonTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontFamily.bold,
  },
  sermonSpeaker: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  scheduleCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#5B2C8E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 12,
  },
  scheduleItems: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 0,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  scheduleTimeText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
  },
  scheduleItemTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: "#fff",
  },
  moreText: {
    color: "#5B2C8E",
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  locationCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  locationTextContainer: {
    flex: 1,
    gap: 3,
  },
  locationTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
  locationAddress: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 17,
    color: "rgba(255,255,255,0.6)",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
  footerSubtext: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
  },

  // ── sermon play overlay ──
  sermonPlayBtn: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sermonPlayGradient: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  sermonSpeakerRow: {
    flexDirection: "row", alignItems: "center", gap: 5,
  },

  // ── schedule card ──
  scheduleDayRow: { flexDirection: "row", alignItems: "center" },
  scheduleDayBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16,
  },
  scheduleDayText: { fontSize: 12, fontFamily: fontFamily.bold, color: "#fff" },
  scheduleViewAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  scheduleTimePill: {
    backgroundColor: "rgba(91,44,142,0.35)",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    minWidth: 96,
  },
  scheduleTimeDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#5B2C8E",
  },

  // ── location card ──
  locationTopBar: { height: 3 },
  locationIconWrap: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#00897B", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  locationArrow: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  locationFooter: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 18, paddingBottom: 14,
  },
  locationFooterText: {
    fontSize: 11, fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.38)",
  },

  // ── hero divider ──
  heroDivider: {
    width: 36,
    height: 1.5,
    backgroundColor: 'rgba(212,160,23,0.5)',
    borderRadius: 1,
    marginVertical: 4,
  },

  // ── live badge in hero ──
  heroLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(192,57,43,0.78)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 8,
  },
  heroLiveDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#FF8080',
  },
  heroLiveText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fontFamily.bold,
    letterSpacing: 1.2,
  },

  // ── live chip on quick action tile ──
  liveChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    zIndex: 1,
  },
  liveChipDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: '#FF8080',
  },
  liveChipText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.8,
  },

  // ── upcoming events mini cards ──
  eventMiniCard: {
    width: 172,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    gap: 8,
    shadowColor: '#241063',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  eventMiniAccent: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: 3,
  },
  eventMiniDateBubble: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 44,
  },
  eventMiniDay: {
    fontSize: 18,
    fontFamily: fontFamily.extraBold,
    lineHeight: 22,
  },
  eventMiniMonth: {
    fontSize: 9,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.8,
  },
  eventMiniContent: {
    flex: 1,
    gap: 4,
  },
  eventMiniName: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#fff',
    lineHeight: 16,
  },
  eventMiniMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  eventMiniLocation: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.4)',
    flex: 1,
  },
});
