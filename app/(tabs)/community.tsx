import React, { useState, useCallback } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  Alert,
  RefreshControl,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";
import {
  usePrayerRequests,
  submitPrayerRequest,
  incrementPrayerCount,
} from "@/lib/db";
import type { PrayerRequest } from "@/lib/supabase";
import { SkeletonLoader } from "@/components/SkeletonLoader";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const communityHero = require("@/assets/new/worship team 2.jpeg") as number;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function PrayerCard({
  prayer,
  hasPrayed,
  onPray,
  isDark,
  colors,
}: {
  prayer: PrayerRequest;
  hasPrayed: boolean;
  onPray: () => void;
  isDark: boolean;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.prayerCard,
        { backgroundColor: isDark ? Colors.dark.card : "#fff" },
      ]}
    >
      <View style={styles.prayerCardTop}>
        <View style={[styles.prayerAvatar, { backgroundColor: Colors.primary + "22" }]}>
          <Ionicons
            name={prayer.is_anonymous ? "person-outline" : "person"}
            size={16}
            color={Colors.primary}
          />
        </View>
        <View style={styles.prayerMeta}>
          <Text style={[styles.prayerName, { color: colors.text }]}>
            {prayer.name}
          </Text>
          <Text style={[styles.prayerTime, { color: colors.textSecondary }]}>
            {timeAgo(prayer.created_at)}
          </Text>
        </View>
      </View>

      <Text style={[styles.prayerText, { color: colors.text }]}>
        {prayer.request}
      </Text>

      <View style={styles.prayerFooter}>
        <Pressable
          onPress={onPray}
          disabled={hasPrayed}
          style={[
            styles.prayButton,
            {
              backgroundColor: hasPrayed
                ? Colors.accent + "18"
                : isDark
                ? "rgba(255,255,255,0.06)"
                : Colors.gray100,
            },
          ]}
        >
          <Ionicons
            name={hasPrayed ? "heart" : "heart-outline"}
            size={15}
            color={hasPrayed ? Colors.accent : colors.textSecondary}
          />
          <Text
            style={[
              styles.prayButtonText,
              { color: hasPrayed ? Colors.accent : colors.textSecondary },
            ]}
          >
            {hasPrayed ? "Prayed" : "I Prayed"}
          </Text>
          {prayer.prayer_count > 0 && (
            <View
              style={[
                styles.prayCount,
                {
                  backgroundColor: hasPrayed
                    ? Colors.accent + "28"
                    : isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Text
                style={[
                  styles.prayCountText,
                  { color: hasPrayed ? Colors.accent : colors.textSecondary },
                ]}
              >
                {prayer.prayer_count + (hasPrayed ? 1 : 0)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const { data: prayers = [], isLoading, refetch } = usePrayerRequests();
  const [refreshing, setRefreshing] = useState(false);
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

  const [showForm, setShowForm] = useState(false);
  const [submitterName, setSubmitterName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);
  const [submitError, setSubmitError] = useState("");

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePray = useCallback(
    async (prayer: PrayerRequest) => {
      if (prayedIds.has(prayer.id)) return;
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPrayedIds((prev) => new Set([...prev, prayer.id]));
      try {
        await incrementPrayerCount(prayer.id, prayer.prayer_count);
      } catch {
        setPrayedIds((prev) => {
          const next = new Set(prev);
          next.delete(prayer.id);
          return next;
        });
      }
    },
    [prayedIds],
  );

  const handleSubmit = async () => {
    if (!requestText.trim()) {
      Alert.alert("Empty Request", "Please write your prayer request.");
      return;
    }
    if (!isAnonymous && !submitterName.trim()) {
      Alert.alert(
        "Name Required",
        "Please enter your name or enable anonymous submission.",
      );
      return;
    }
    setIsSubmitting(true);
    setSubmitResult(null);
    setSubmitError("");
    try {
      await submitPrayerRequest(
        isAnonymous ? "Anonymous" : submitterName.trim(),
        requestText.trim(),
        isAnonymous,
      );
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRequestText("");
      setSubmitterName("");
      setSubmitResult("success");
      refetch();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setSubmitError(msg);
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ListHeader = (
    <View style={{ paddingHorizontal: layout.horizontalPadding }}>
      {/* Page header */}
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
          Prayer Wall
        </Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
          Lift one another up in prayer
        </Text>
        <View style={styles.headerMetaRow}>
          <View
            style={[
              styles.headerMetaBadge,
              { backgroundColor: isDark ? Colors.dark.card : "#fff" },
            ]}
          >
            <Ionicons name="people" size={13} color={Colors.primary} />
            <Text style={[styles.headerMetaText, { color: colors.text }]}>
              {prayers.length > 0 ? `${prayers.length} requests` : "Community Prayer"}
            </Text>
          </View>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroCard}>
        <Image
          source={communityHero}
          style={styles.heroImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(13,13,30,0.88)"]}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroText}>
            &ldquo;The prayer of a righteous person is powerful and effective.&rdquo;
          </Text>
          <Text style={styles.heroRef}>— James 5:16</Text>
        </LinearGradient>
      </View>

      {/* Ministry Connect banner */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/ministry-connect");
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1, marginBottom: 10 })}
      >
        <View
          style={[
            styles.connectBanner,
            {
              backgroundColor: isDark ? Colors.dark.card : "#fff",
              borderColor: isDark ? "rgba(37,211,102,0.25)" : "rgba(37,211,102,0.3)",
            },
          ]}
        >
          <View style={styles.connectBannerLeft}>
            <View style={[styles.connectIconWrap, { backgroundColor: "#25D36618" }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#25D366" />
            </View>
            <View style={styles.connectBannerText}>
              <Text style={[styles.connectBannerTitle, { color: colors.text }]}>
                Connect with the Ministry
              </Text>
              <Text style={[styles.connectBannerSub, { color: colors.textSecondary }]}>
                Join WhatsApp groups · Seek counsel · Get info
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </Pressable>

      {/* Submit button / form toggle */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowForm((v) => !v);
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.accentBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitToggle}
        >
          <Ionicons
            name={showForm ? "chevron-up" : "add-circle-outline"}
            size={20}
            color="#fff"
          />
          <Text style={styles.submitToggleText}>
            {showForm ? "Cancel" : "Share a Prayer Request"}
          </Text>
        </LinearGradient>
      </Pressable>

      {/* Inline form */}
      {showForm && (
        <View
          style={[
            styles.form,
            {
              backgroundColor: isDark ? Colors.dark.card : "#fff",
              borderColor: isDark ? "rgba(255,255,255,0.08)" : colors.border,
            },
          ]}
        >
          {submitResult === "success" ? (
            /* ── Success state ── */
            <View style={styles.resultBox}>
              <View style={[styles.resultIconWrap, { backgroundColor: "#25D36618" }]}>
                <Ionicons name="checkmark-circle" size={40} color="#25D366" />
              </View>
              <Text style={[styles.resultTitle, { color: colors.text }]}>
                Prayer Submitted
              </Text>
              <Text style={[styles.resultMsg, { color: colors.textSecondary }]}>
                Your request has been shared with the community. We are standing
                with you in prayer.
              </Text>
              <Pressable
                onPress={() => {
                  setSubmitResult(null);
                  setShowForm(false);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.accentBlue]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resultBtn}
                >
                  <Text style={styles.resultBtnText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : submitResult === "error" ? (
            /* ── Error state ── */
            <View style={styles.resultBox}>
              <View style={[styles.resultIconWrap, { backgroundColor: "#e74c3c18" }]}>
                <Ionicons name="alert-circle" size={40} color="#e74c3c" />
              </View>
              <Text style={[styles.resultTitle, { color: colors.text }]}>
                Something went wrong
              </Text>
              <Text style={[styles.resultMsg, { color: colors.textSecondary }]}>
                {submitError || "Could not submit your request. Please try again."}
              </Text>
              <Pressable
                onPress={() => setSubmitResult(null)}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <LinearGradient
                  colors={["#e74c3c", "#c0392b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resultBtn}
                >
                  <Text style={styles.resultBtnText}>Try Again</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            /* ── Form fields ── */
            <>
              {/* Anonymous toggle */}
              <View style={styles.anonymousRow}>
                <View style={styles.anonymousLeft}>
                  <Ionicons
                    name="eye-off-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.anonymousLabel, { color: colors.text }]}>
                    Submit Anonymously
                  </Text>
                </View>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  trackColor={{ false: colors.border, true: Colors.primary + "99" }}
                  thumbColor={isAnonymous ? Colors.primary : colors.textSecondary}
                />
              </View>

              {!isAnonymous && (
                <View style={styles.formField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                    Your Name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : colors.background,
                        color: colors.text,
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : colors.border,
                      },
                    ]}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    value={submitterName}
                    onChangeText={setSubmitterName}
                    maxLength={40}
                  />
                </View>
              )}

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Prayer Request
                </Text>
                <TextInput
                  style={[
                    styles.textarea,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.06)"
                        : colors.background,
                      color: colors.text,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : colors.border,
                    },
                  ]}
                  placeholder="Share what you need prayer for..."
                  placeholderTextColor={colors.textSecondary}
                  value={requestText}
                  onChangeText={setRequestText}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {requestText.length}/500
                </Text>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={[styles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.accentBlue]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Ionicons name="send" size={16} color="#fff" />
                  <Text style={styles.submitText}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* Section header */}
      {prayers.length > 0 && (
        <View style={styles.sectionHeader}>
          <View
            style={[styles.sectionAccent, { backgroundColor: Colors.primary }]}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Community Prayers
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[
          "rgba(74,35,90,0.14)",
          "rgba(36,113,163,0.08)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />

      <View style={[layout.maxWidthStyle, { flex: 1, width: "100%" }]}>
        {isLoading ? (
          <View
            style={[
              styles.skeletonPad,
              { paddingHorizontal: layout.horizontalPadding },
            ]}
          >
            <SkeletonLoader
              height={28}
              width="40%"
              style={{ marginBottom: 6, marginTop: 16 }}
            />
            <SkeletonLoader
              height={13}
              width="60%"
              style={{ marginBottom: 20 }}
            />
            <SkeletonLoader
              height={160}
              borderRadius={20}
              style={{ marginBottom: 16 }}
            />
            {[1, 2, 3].map((i) => (
              <SkeletonLoader
                key={i}
                height={110}
                borderRadius={16}
                style={{ marginBottom: 10 }}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: layout.horizontalPadding }}>
                <PrayerCard
                  prayer={item}
                  hasPrayed={prayedIds.has(item.id)}
                  onPray={() => handlePray(item)}
                  isDark={isDark}
                  colors={colors}
                />
              </View>
            )}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyState}>
                  <View
                    style={[
                      styles.emptyIcon,
                      { backgroundColor: Colors.primary + "12" },
                    ]}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={34}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No requests yet
                  </Text>
                  <Text
                    style={[
                      styles.emptySub,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Be the first to share a prayer request with the community.
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  atmosphere: { ...StyleSheet.absoluteFillObject },
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
  skeletonPad: { paddingTop: 8, gap: 0 },

  header: { paddingBottom: 14 },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, fontFamily: fontFamily.regular },
  headerMetaRow: { marginTop: 12, flexDirection: "row" },
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
  headerMetaText: { fontSize: 11, fontFamily: fontFamily.semiBold },

  heroCard: {
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
  },
  heroText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontFamily: fontFamily.medium,
    fontStyle: "italic",
    lineHeight: 19,
    marginBottom: 4,
  },
  heroRef: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
  },

  submitToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  submitToggleText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },

  form: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    marginBottom: 16,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  anonymousRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  anonymousLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  anonymousLabel: { fontSize: 14, fontFamily: fontFamily.medium },
  formField: { gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: fontFamily.semiBold, marginLeft: 2 },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    borderWidth: 1,
  },
  textarea: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    borderWidth: 1,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    textAlign: "right",
    marginTop: 2,
  },
  submitButton: { borderRadius: 12, overflow: "hidden" },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  submitText: { color: "#fff", fontSize: 15, fontFamily: fontFamily.bold },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  sectionAccent: { width: 4, height: 22, borderRadius: 2 },
  sectionTitle: { fontSize: 20, fontFamily: fontFamily.extraBold },

  prayerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91,44,142,0.1)",
    padding: 14,
    marginBottom: 10,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    gap: 10,
  },
  prayerCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prayerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  prayerMeta: { flex: 1, gap: 1 },
  prayerName: { fontSize: 14, fontFamily: fontFamily.bold },
  prayerTime: { fontSize: 11, fontFamily: fontFamily.regular },
  prayerText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 21,
  },
  prayerFooter: { flexDirection: "row" },
  prayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  prayButtonText: { fontSize: 13, fontFamily: fontFamily.semiBold },
  prayCount: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  prayCountText: { fontSize: 12, fontFamily: fontFamily.bold },

  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontFamily: fontFamily.bold },
  emptySub: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 20,
  },

  connectBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  connectBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  connectIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  connectBannerText: { flex: 1, gap: 2 },
  connectBannerTitle: { fontSize: 14, fontFamily: fontFamily.bold },
  connectBannerSub: { fontSize: 12, fontFamily: fontFamily.regular },

  resultBox: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 12,
  },
  resultIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
    textAlign: "center",
  },
  resultMsg: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 21,
  },
  resultBtn: {
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
  },
  resultBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
});
