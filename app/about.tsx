import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { MINISTRY_INFO, DEPARTMENTS, SOCIAL_LINKS } from '@/lib/data';
import { useResponsiveLayout } from '@/lib/layout';

const DEPT_ICONS: Record<string, { icon: string; set: string }> = {
  'Worship': { icon: 'musical-notes', set: 'ion' },
  'Ushering': { icon: 'hand-right', set: 'ion' },
  'Youth Ministry': { icon: 'flash', set: 'ion' },
  'Women Fellowship': { icon: 'people', set: 'ion' },
  "Men's Fellowship": { icon: 'people', set: 'ion' },
  'Children Ministry': { icon: 'happy', set: 'ion' },
  'Catering Team': { icon: 'restaurant', set: 'ion' },
  'Media Team': { icon: 'videocam', set: 'ion' },
  'Evangelism': { icon: 'megaphone', set: 'ion' },
  'Pastors Fellowship': { icon: 'book', set: 'ion' },
  'Community Affairs': { icon: 'globe', set: 'ion' },
  'Social Service': { icon: 'heart', set: 'ion' },
};

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const openLink = (url: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>About</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>
        <LinearGradient
          colors={isDark ? ['#2A1548', '#1A0A30'] : ['#5B2C8E', '#7B4BAE']}
          style={styles.heroSection}
        >
          <View style={styles.heroIconWrap}>
            <Ionicons name="sparkles" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{MINISTRY_INFO.name}</Text>
          <Text style={styles.heroSlogan}>{MINISTRY_INFO.slogan1}</Text>
          <Text style={styles.heroSlogan2}>{MINISTRY_INFO.slogan2}</Text>
          <View style={styles.heroBadge}>
            <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroBadgeText}>Est. {MINISTRY_INFO.established}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="people" size={18} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Leadership</Text>
            </View>
            <View style={styles.leaderRow}>
              <View style={[styles.leaderAvatar, { backgroundColor: Colors.primary + '18' }]}>
                <Ionicons name="person" size={24} color={Colors.primary} />
              </View>
              <View style={styles.leaderInfo}>
                <Text style={[styles.leaderName, { color: colors.text }]}>Pastor Thabo Boshomane</Text>
                <Text style={[styles.leaderRole, { color: Colors.primary }]}>Senior Pastor & Founder</Text>
              </View>
            </View>
            <View style={styles.leaderRow}>
              <View style={[styles.leaderAvatar, { backgroundColor: Colors.accent + '18' }]}>
                <Ionicons name="person" size={24} color={Colors.accent} />
              </View>
              <View style={styles.leaderInfo}>
                <Text style={[styles.leaderName, { color: colors.text }]}>Mrs Ntombi Boshomane</Text>
                <Text style={[styles.leaderRole, { color: Colors.accent }]}>Co-Founder</Text>
              </View>
            </View>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>{MINISTRY_INFO.pastorBio}</Text>

            <View style={[styles.divider, { backgroundColor: isDark ? Colors.dark.border : Colors.gray200 }]} />

            <View style={styles.adminRow}>
              <View style={[styles.adminIcon, { backgroundColor: Colors.accentBlue + '15' }]}>
                <Ionicons name="briefcase-outline" size={14} color={Colors.accentBlue} />
              </View>
              <View>
                <Text style={[styles.adminLabel, { color: colors.textSecondary }]}>Admin/HR</Text>
                <Text style={[styles.adminName, { color: colors.text }]}>{MINISTRY_INFO.adminHR}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="grid" size={18} color={Colors.accentBlue} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Departments</Text>
            </View>
            <View style={styles.deptGrid}>
              {DEPARTMENTS.map(dept => {
                const deptInfo = DEPT_ICONS[dept] || { icon: 'star', set: 'ion' };
                return (
                  <View key={dept} style={[styles.deptChip, { backgroundColor: isDark ? Colors.dark.surface : Colors.gray50 }]}>
                    <Ionicons name={deptInfo.icon as any} size={14} color={Colors.primaryLight} />
                    <Text style={[styles.deptText, { color: colors.text }]} numberOfLines={1}>{dept}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="share-social" size={18} color={Colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Connect With Us</Text>
            </View>
            <Text style={[styles.streamingNote, { color: colors.textSecondary }]}>
              Live Services: Facebook Live | Audio Sermons: Twitter/X
            </Text>
            <View style={styles.socialRow}>
              <Pressable
                onPress={() => openLink(SOCIAL_LINKS.facebook)}
                style={[styles.socialButton, { backgroundColor: '#1877F2' + '18' }]}
              >
                <FontAwesome5 name="facebook" size={20} color="#1877F2" />
              </Pressable>
              {SOCIAL_LINKS.youtube && (
                <Pressable
                  onPress={() => openLink(SOCIAL_LINKS.youtube)}
                  style={[styles.socialButton, { backgroundColor: '#FF0000' + '18', opacity: 0.5 }]}
                >
                  <FontAwesome5 name="youtube" size={20} color="#FF0000" />
                </Pressable>
              )}
              <Pressable
                onPress={() => openLink(SOCIAL_LINKS.twitter)}
                style={[styles.socialButton, { backgroundColor: '#1DA1F2' + '18' }]}
              >
                <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
              </Pressable>
              <Pressable
                onPress={() => openLink(SOCIAL_LINKS.tiktok)}
                style={[styles.socialButton, { backgroundColor: '#000' + '18' }]}
              >
                <MaterialCommunityIcons name="music-note" size={20} color={isDark ? '#fff' : '#000'} />
              </Pressable>
              <Pressable
                onPress={() => openLink(SOCIAL_LINKS.whatsapp)}
                style={[styles.socialButton, { backgroundColor: '#25D366' + '18' }]}
              >
                <FontAwesome5 name="whatsapp" size={20} color="#25D366" />
              </Pressable>
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
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginHorizontal: 0,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroTitle: { fontSize: 18, fontFamily: fontFamily.extraBold, color: '#fff', textAlign: 'center', lineHeight: 24 },
  heroSlogan: { fontSize: 13, fontFamily: fontFamily.medium, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },
  heroSlogan2: { fontSize: 11, fontFamily: fontFamily.semiBold, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  heroBadgeText: { fontSize: 11, fontFamily: fontFamily.medium, color: 'rgba(255,255,255,0.8)' },
  content: { paddingHorizontal: 0, gap: 14 },
  card: { borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontFamily: fontFamily.bold },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  leaderAvatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  leaderInfo: { flex: 1, gap: 2 },
  leaderName: { fontSize: 15, fontFamily: fontFamily.bold },
  leaderRole: { fontSize: 12, fontFamily: fontFamily.semiBold },
  bioText: { fontSize: 13, fontFamily: fontFamily.regular, lineHeight: 20, marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  adminRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adminIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  adminLabel: { fontSize: 11, fontFamily: fontFamily.medium },
  adminName: { fontSize: 14, fontFamily: fontFamily.semiBold },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  deptText: { fontSize: 12, fontFamily: fontFamily.medium },
  streamingNote: { fontSize: 12, fontFamily: fontFamily.medium, marginBottom: 10, fontStyle: 'italic' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
