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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { useResponsiveLayout } from "@/lib/layout";

const ACCOUNTS = [
  {
    bank: "FNB",
    tagline: "First National Bank",
    accentColor: "#007A3D",
    accountHolder: "Hope in Christ for All Nations Ministries",
    accountNumber: "62564540007",
    branchCode: "250655",
    accountType: "Cheque / Current",
  },
  {
    bank: "Capitec",
    tagline: "Capitec Bank",
    accentColor: "#0048A0",
    accountHolder: "Hope in Christ for All Nations Ministries",
    accountNumber: "1757619486",
    branchCode: "470010",
    accountType: "Savings",
  },
];

export default function EFTDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const cardDivider = { backgroundColor: colors.border };

  const haptic = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.navBar,
          { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 4 },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>
          Banking Details
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View
          style={[
            layout.maxWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          {/* ── Building Fund Banner ── */}
          <LinearGradient
            colors={["#1a1a2e", "#16213e", "#0f3460"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.campaignBanner}
          >
            <View style={styles.campaignBadge}>
              <Text style={styles.campaignBadgeText}>ACTIVE CAMPAIGN</Text>
            </View>
            <View style={styles.campaignIconRow}>
              <View style={styles.campaignIconWrap}>
                <MaterialCommunityIcons name="church" size={28} color={Colors.gold} />
              </View>
              <View style={styles.campaignText}>
                <Text style={styles.campaignTitle}>HICFANM Building Fund</Text>
                <Text style={styles.campaignSub}>
                  Help us buy the church land!
                </Text>
              </View>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Fundraising Goal</Text>
              <Text style={styles.goalAmount}>R75,000</Text>
            </View>
            <Pressable
              onPress={() => {
                haptic();
                Linking.openURL("tel:+27606860952");
              }}
              style={styles.campaignContact}
            >
              <Ionicons name="call-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.campaignContactText}>
                Contact Pastor Thoko · +27 60 686-0952
              </Text>
            </Pressable>
          </LinearGradient>

          {/* ── Accounts ── */}
          {ACCOUNTS.map((account) => (
            <View
              key={account.bank}
              style={[
                styles.accountCard,
                { backgroundColor: isDark ? Colors.dark.card : "#fff" },
              ]}
            >
              <View
                style={[
                  styles.accountHeader,
                  { borderBottomColor: isDark ? Colors.dark.border : Colors.gray200 },
                ]}
              >
                <View style={[styles.bankBadge, { backgroundColor: account.accentColor + "18" }]}>
                  <Text style={[styles.bankName, { color: account.accentColor }]}>
                    {account.bank}
                  </Text>
                </View>
                <Text style={[styles.bankTagline, { color: colors.textSecondary }]}>
                  {account.tagline}
                </Text>
              </View>

              {[
                { label: "Account Holder", value: account.accountHolder, icon: "person-outline" },
                { label: "Account Number", value: account.accountNumber, icon: "card-outline" },
                { label: "Branch Code", value: account.branchCode, icon: "git-branch-outline" },
                { label: "Account Type", value: account.accountType, icon: "document-outline" },
              ].map((row, i, arr) => (
                <View key={row.label}>
                  <View style={styles.detailRow}>
                    <View
                      style={[
                        styles.detailIcon,
                        { backgroundColor: account.accentColor + "12" },
                      ]}
                    >
                      <Ionicons name={row.icon as any} size={16} color={account.accentColor} />
                    </View>
                    <View style={styles.detailInfo}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                        {row.label}
                      </Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {row.value}
                      </Text>
                    </View>
                  </View>
                  {i < arr.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: isDark ? Colors.dark.border : Colors.gray200 },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* ── Reference Note ── */}
          <View
            style={[
              styles.noteCard,
              {
                backgroundColor: isDark ? Colors.dark.card : Colors.primary + "08",
                borderColor: isDark ? "rgba(255,255,255,0.07)" : Colors.primary + "20",
              },
            ]}
          >
            <Ionicons name="information-circle" size={18} color={Colors.primary} />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Please use your name as the payment reference so the church can
              acknowledge your contribution. For enquiries contact{" "}
              <Text
                style={{ color: Colors.primary }}
                onPress={() => Linking.openURL("mailto:Pastorthabo@hicfanm.org")}
              >
                Pastorthabo@hicfanm.org
              </Text>
            </Text>
          </View>

          <Pressable
            onPress={() => {
              haptic();
              router.push("/donation-success");
            }}
            style={({ pressed }) => [
              styles.doneButton,
              { backgroundColor: Colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.doneButtonText}>I've Made a Transfer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    flex: 1,
    textAlign: "center",
  },
  campaignBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  campaignBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gold + "30",
    borderWidth: 1,
    borderColor: Colors.gold + "60",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  campaignBadgeText: {
    color: Colors.gold,
    fontSize: 10,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
  },
  campaignIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  campaignIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.gold + "18",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.gold + "30",
  },
  campaignText: { flex: 1 },
  campaignTitle: {
    fontSize: 18,
    fontFamily: fontFamily.extraBold,
    color: "#fff",
    marginBottom: 2,
  },
  campaignSub: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.75)",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  goalLabel: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.6)",
  },
  goalAmount: {
    fontSize: 22,
    fontFamily: fontFamily.extraBold,
    color: Colors.gold,
  },
  campaignContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  campaignContactText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: "rgba(255,255,255,0.65)",
  },
  accountCard: {
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  bankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  bankName: {
    fontSize: 14,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.5,
  },
  bankTagline: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailInfo: { flex: 1, gap: 1 },
  detailLabel: { fontSize: 11, fontFamily: fontFamily.medium },
  detailValue: { fontSize: 15, fontFamily: fontFamily.semiBold },
  divider: { height: 1, marginLeft: 64 },
  noteCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  doneButtonText: { color: "#fff", fontSize: 16, fontFamily: fontFamily.bold },
});
