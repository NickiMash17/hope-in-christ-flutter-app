import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { DONATION_CONFIG } from '@/lib/data';

export default function EFTDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const eft = DONATION_CONFIG.eftDetails;

  const details = [
    { label: 'Bank', value: eft.bankName, icon: 'business-outline' },
    { label: 'Account Holder', value: eft.accountHolder, icon: 'person-outline' },
    { label: 'Account Number', value: eft.accountNumber, icon: 'card-outline' },
    { label: 'Branch Code', value: eft.branchCode, icon: 'git-branch-outline' },
    { label: 'Account Type', value: eft.accountType, icon: 'document-outline' },
    { label: 'Reference', value: eft.reference, icon: 'pricetag-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Banking Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerSection}>
          <View style={[styles.headerIcon, { backgroundColor: Colors.accentBlue + '15' }]}>
            <MaterialCommunityIcons name="bank-transfer" size={36} color={Colors.accentBlue} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>EFT / Bank Transfer</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Use the details below for direct bank transfers
          </Text>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
          {details.map((item, idx) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.accentBlue + '12' }]}>
                  <Ionicons name={item.icon as any} size={16} color={Colors.accentBlue} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.value}</Text>
                </View>
              </View>
              {idx < details.length - 1 && (
                <View style={[styles.divider, { backgroundColor: isDark ? Colors.dark.border : Colors.gray200 }]} />
              )}
            </View>
          ))}
        </View>

        <View style={[styles.noteCard, { backgroundColor: isDark ? Colors.dark.card : Colors.primary + '08' }]}>
          <Ionicons name="information-circle" size={18} color={Colors.primary} />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Please use your name as the payment reference so we can acknowledge your contribution. Contact us at {DONATION_CONFIG.contactEmail} if you need assistance.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/donation-success')}
          style={[styles.doneButton, { backgroundColor: Colors.accentBlue }]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.doneButtonText}>I've Made a Transfer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
  headerSection: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 32, gap: 8 },
  headerIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 22, fontFamily: fontFamily.bold },
  headerSubtitle: { fontSize: 14, fontFamily: fontFamily.regular, textAlign: 'center' },
  detailsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  detailIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailInfo: { flex: 1, gap: 1 },
  detailLabel: { fontSize: 11, fontFamily: fontFamily.medium },
  detailValue: { fontSize: 15, fontFamily: fontFamily.semiBold },
  divider: { height: 1, marginLeft: 48 },
  noteCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  noteText: { flex: 1, fontSize: 12, fontFamily: fontFamily.regular, lineHeight: 18 },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 14,
  },
  doneButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
});
