import React from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";

export default function DonationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();

  const handleDone = () => {
    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.dismissAll();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["rgba(74,35,90,0.14)", "rgba(36,113,163,0.08)", "transparent"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orb} />

      <View
        style={[
          styles.inner,
          {
            paddingTop: (Platform.OS === "web" ? 80 : insets.top) + 32,
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        {/* Badge */}
        <View style={styles.badgeRing}>
          <LinearGradient
            colors={[Colors.primary, Colors.accentBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Ionicons name="heart" size={44} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={[styles.headline, { color: colors.text }]}>Thank You!</Text>
        <Text style={[styles.subheadline, { color: Colors.gold }]}>
          Your generosity is a blessing
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Your transfer has been noted. The church leadership will confirm
          receipt and keep you in prayer. May God multiply what you have sown.
        </Text>

        {/* Scripture */}
        <View
          style={[
            styles.scriptureCard,
            {
              backgroundColor: isDark ? Colors.dark.card : Colors.primary + "08",
              borderColor: isDark ? "rgba(255,255,255,0.08)" : Colors.primary + "20",
            },
          ]}
        >
          <Ionicons name="book-outline" size={16} color={Colors.primary} />
          <Text style={[styles.scriptureText, { color: colors.textSecondary }]}>
            &ldquo;Each of you should give what you have decided in your heart
            to give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </Text>
          <Text style={[styles.scriptureRef, { color: Colors.primary }]}>
            — 2 Corinthians 9:7
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleDone}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, width: "100%" })}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.accentBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Back to Home</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: isDark ? "rgba(255,255,255,0.15)" : Colors.primary + "40",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>
              View Banking Details Again
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orb: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(106,71,205,0.12)",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 16,
  },
  badgeRing: {
    width: 120,
    height: 120,
    borderRadius: 34,
    backgroundColor: Colors.gold + "22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: { fontSize: 32, fontFamily: fontFamily.extraBold, textAlign: "center" },
  subheadline: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    textAlign: "center",
    marginTop: -8,
  },
  body: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    lineHeight: 22,
  },
  scriptureCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    alignItems: "flex-start",
    width: "100%",
  },
  scriptureText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    fontStyle: "italic",
    lineHeight: 20,
  },
  scriptureRef: { fontSize: 12, fontFamily: fontFamily.semiBold, alignSelf: "flex-end" },
  actions: { width: "100%", gap: 12, marginTop: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontFamily: fontFamily.bold },
  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 14, fontFamily: fontFamily.medium },
});
