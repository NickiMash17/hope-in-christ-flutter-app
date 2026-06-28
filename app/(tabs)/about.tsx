import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { MINISTRY_INFO } from '@/lib/ministry-data';
import { useResponsiveLayout } from '@/lib/layout';

// ── 3D Sphere Icon ────────────────────────────────────────────────────────────

type IconNode = React.ReactNode;

function Sphere3D({
  gradientColors,
  shadowColor,
  size = 64,
  children,
}: {
  gradientColors: [string, string];
  shadowColor: string;
  size?: number;
  children: IconNode;
}) {
  const r = size / 2;
  return (
    <View style={[styles.sphereWrap, { width: size, height: size, borderRadius: r, shadowColor }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.18, y: 0 }}
        end={{ x: 0.82, y: 1 }}
        style={[styles.sphereGradient, { borderRadius: r }]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.sphereShine,
            { borderTopLeftRadius: r, borderTopRightRadius: r },
          ]}
        />
        {children}
      </LinearGradient>
    </View>
  );
}

// ── Social button config ──────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: 'Facebook',
    action: 'facebook',
    g: ['#4FACFE', '#1565C0'] as [string, string],
    shadow: '#1877F2',
    icon: <Ionicons name="logo-facebook" size={26} color="#fff" />,
  },
  {
    label: 'X / Twitter',
    action: 'twitter',
    g: ['#555', '#0d0d0d'] as [string, string],
    shadow: '#222',
    icon: <FontAwesome6 name="x-twitter" size={22} color="#fff" />,
  },
  {
    label: 'WhatsApp',
    action: 'whatsapp',
    g: ['#57EE8C', '#128C7E'] as [string, string],
    shadow: '#25D366',
    icon: <Ionicons name="logo-whatsapp" size={26} color="#fff" />,
  },
  {
    label: 'TikTok',
    action: 'tiktok',
    g: ['#FF6B9D', '#1a1a2e'] as [string, string],
    shadow: '#FE2C55',
    icon: <FontAwesome6 name="tiktok" size={22} color="#fff" />,
  },
  {
    label: 'YouTube',
    action: 'youtube',
    g: ['#FF6B6B', '#C62828'] as [string, string],
    shadow: '#FF0000',
    icon: <Ionicons name="logo-youtube" size={26} color="#fff" />,
  },
  {
    label: 'Website',
    action: 'website',
    g: ['#A29BFE', '#5C4FD6'] as [string, string],
    shadow: '#6C5CE7',
    icon: <Ionicons name="globe" size={24} color="#fff" />,
  },
  {
    label: 'Email',
    action: 'email',
    g: ['#FD79A8', '#9B1A6B'] as [string, string],
    shadow: '#E84393',
    icon: <Ionicons name="mail" size={24} color="#fff" />,
  },
  {
    label: 'Directions',
    action: 'maps',
    g: ['#55EFC4', '#00897B'] as [string, string],
    shadow: '#00B894',
    icon: <Ionicons name="navigate" size={24} color="#fff" />,
  },
];

// ── Department icon + color map ───────────────────────────────────────────────

const DEPT_MAP: Record<string, { icon: keyof typeof Ionicons.glyphMap; g: [string, string] }> = {
  'Worship Team':       { icon: 'musical-notes', g: ['#C39BD3', '#7D3C98'] },
  'Ushering Ministry':  { icon: 'hand-right',    g: ['#85C1E9', '#1F618D'] },
  'Youth Ministry':     { icon: 'flash',         g: ['#F1948A', '#C0392B'] },
  "Women's Fellowship": { icon: 'flower-outline',g: ['#F48FB1', '#AD1457'] },
  "Men's Fellowship":   { icon: 'shield',        g: ['#90CAF9', '#1565C0'] },
  "Children's Ministry":{ icon: 'star',          g: ['#FFD54F', '#F57F17'] },
  'Catering Team':      { icon: 'restaurant',    g: ['#A5D6A7', '#2E7D32'] },
  'Media Team':         { icon: 'videocam',      g: ['#CE93D8', '#6A1B9A'] },
  'Evangelism':         { icon: 'globe',         g: ['#80DEEA', '#00838F'] },
  "Pastors' Fellowship":{ icon: 'book',          g: ['#BCAAA4', '#4E342E'] },
  'Community Affairs':  { icon: 'people',        g: ['#B0BEC5', '#37474F'] },
  'Social Services':    { icon: 'heart',         g: ['#EF9A9A', '#B71C1C'] },
};

// ── Main screen ───────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePress = (action: string) => {
    tap();
    switch (action) {
      case 'facebook':  Linking.openURL(MINISTRY_INFO.socialMedia.facebook);  break;
      case 'twitter':   Linking.openURL(MINISTRY_INFO.socialMedia.twitter);   break;
      case 'whatsapp':  Linking.openURL(MINISTRY_INFO.socialMedia.whatsapp);  break;
      case 'tiktok':    Linking.openURL(MINISTRY_INFO.socialMedia.tiktok);    break;
      case 'youtube':   Linking.openURL(MINISTRY_INFO.socialMedia.youtube);   break;
      case 'website':   Linking.openURL(MINISTRY_INFO.website);               break;
      case 'email':     Linking.openURL(`mailto:${MINISTRY_INFO.email}`);     break;
      case 'maps': {
        const q = encodeURIComponent(MINISTRY_INFO.address);
        const url = Platform.select({
          ios: `maps:0,0?q=${q}`,
          android: `geo:0,0?q=${q}`,
          default: `https://www.google.com/maps/search/?api=1&query=${q}`,
        });
        if (url) Linking.openURL(url);
        break;
      }
    }
  };

  const cardBg = isDark ? Colors.dark.card : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Atmosphere orbs */}
      <LinearGradient
        colors={['rgba(74,35,90,0.14)', 'rgba(30,58,138,0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbA} />
      <View style={styles.orbB} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 12 },
        ]}
      >
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>

          {/* ── Hero ─────────────────────────────────────────────── */}
          <View style={styles.hero}>
            <Image
              source={require('@/assets/new/pastor and wife 2.jpeg')}
              style={styles.heroImg}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(30,0,60,0.82)']}
              style={styles.heroOverlay}
            >
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroBadgeText}>Est. {MINISTRY_INFO.established}</Text>
                </View>
                <View style={[styles.heroBadge, { backgroundColor: 'rgba(91,44,142,0.85)' }]}>
                  <Text style={styles.heroBadgeText}>KwaMhlanga · Mpumalanga</Text>
                </View>
              </View>
              <Text style={styles.heroLabel}>Our Leadership</Text>
              <Text style={styles.heroNames}>{MINISTRY_INFO.leadership.seniorPastors}</Text>
            </LinearGradient>
          </View>

          {/* ── Vision ───────────────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardHeader}>
              <Sphere3D gradientColors={['#C39BD3', '#7D3C98']} shadowColor="#7D3C98" size={44}>
                <Ionicons name="eye" size={20} color="#fff" />
              </Sphere3D>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Our Vision</Text>
            </View>
            <LinearGradient
              colors={isDark ? ['#2a1548', '#1a0a30'] : ['#f3e5f5', '#ede7f6']}
              style={styles.quoteBox}
            >
              <View style={styles.quoteAccent} />
              <Text style={[styles.quoteText, { color: isDark ? '#E1BEE7' : '#4A235A' }]}>
                "{MINISTRY_INFO.slogan1}"
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={isDark ? ['#1a2a48', '#0d1a30'] : ['#e3f2fd', '#e8eaf6']}
              style={[styles.quoteBox, { marginTop: 10 }]}
            >
              <View style={[styles.quoteAccent, { backgroundColor: Colors.accentBlue }]} />
              <Text style={[styles.quoteText, { color: isDark ? '#BBDEFB' : '#1565C0' }]}>
                "{MINISTRY_INFO.slogan2}"
              </Text>
            </LinearGradient>
          </View>

          {/* ── Pastor Bio ───────────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.pastorRow}>
              <View style={styles.pastorPhotoWrap}>
                <Image
                  source={require('@/assets/new/pastor.jpeg')}
                  style={styles.pastorPhoto}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(91,44,142,0.7)']}
                  style={styles.pastorPhotoOverlay}
                />
              </View>
              <View style={styles.pastorMeta}>
                <Text style={[styles.pastorName, { color: colors.text }]}>
                  Pastor Thabo Boshomane
                </Text>
                <Text style={[styles.pastorRole, { color: Colors.primary }]}>Senior Pastor</Text>
                <View style={styles.credBadgeRow}>
                  <View style={[styles.credBadge, { backgroundColor: Colors.primary + '18' }]}>
                    <Text style={[styles.credBadgeText, { color: Colors.primary }]}>Life Coach</Text>
                  </View>
                  <View style={[styles.credBadge, { backgroundColor: Colors.accentBlue + '18' }]}>
                    <Text style={[styles.credBadgeText, { color: Colors.accentBlue }]}>NLP</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]} />
            {[
              MINISTRY_INFO.leadership.pastorThabo.ordination,
              MINISTRY_INFO.leadership.pastorThabo.founded,
              MINISTRY_INFO.leadership.pastorThabo.belief,
            ].map((line, i) => (
              <View key={i} style={styles.bioLine}>
                <View style={[styles.bioDot, { backgroundColor: Colors.primary }]} />
                <Text style={[styles.bioText, { color: colors.textSecondary }]}>{line}</Text>
              </View>
            ))}
          </View>

          {/* ── Connect With Us ──────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardHeader}>
              <Sphere3D gradientColors={['#FD79A8', '#9B1A6B']} shadowColor="#E84393" size={44}>
                <Ionicons name="share-social" size={20} color="#fff" />
              </Sphere3D>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Connect With Us</Text>
            </View>
            <View style={styles.socialsGrid}>
              {SOCIALS.map((s) => (
                <Pressable
                  key={s.action}
                  onPress={() => handlePress(s.action)}
                  style={({ pressed }) => [
                    styles.socialCell,
                    { transform: [{ scale: pressed ? 0.91 : 1 }] },
                  ]}
                >
                  <Sphere3D gradientColors={s.g} shadowColor={s.shadow} size={60}>
                    {s.icon}
                  </Sphere3D>
                  <Text style={[styles.socialLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Contact Info ─────────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardHeader}>
              <Sphere3D gradientColors={['#74B9FF', '#0984E3']} shadowColor="#0984E3" size={44}>
                <Ionicons name="call" size={20} color="#fff" />
              </Sphere3D>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Contact Info</Text>
            </View>
            {[
              { icon: 'location', g: ['#FF6B6B', '#C62828'] as [string,string], shadow: '#C62828', label: MINISTRY_INFO.address, action: 'maps' },
              { icon: 'globe',    g: ['#A29BFE', '#5C4FD6'] as [string,string], shadow: '#6C5CE7', label: MINISTRY_INFO.website,  action: 'website' },
              { icon: 'mail',     g: ['#FD79A8', '#9B1A6B'] as [string,string], shadow: '#E84393', label: MINISTRY_INFO.email,    action: 'email' },
              { icon: 'time',     g: ['#55EFC4', '#00897B'] as [string,string], shadow: '#00B894', label: `Office Hours: ${MINISTRY_INFO.officeHours}`, action: '' },
            ].map((row, i) => (
              <Pressable
                key={i}
                onPress={() => row.action && handlePress(row.action)}
                style={({ pressed }) => [
                  styles.infoRow,
                  pressed && row.action ? { opacity: 0.75 } : undefined,
                ]}
                disabled={!row.action}
              >
                <Sphere3D gradientColors={row.g} shadowColor={row.shadow} size={40}>
                  <Ionicons name={row.icon as any} size={18} color="#fff" />
                </Sphere3D>
                <Text style={[styles.infoText, { color: colors.text }]} numberOfLines={2}>
                  {row.label}
                </Text>
                {!!row.action && (
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                )}
              </Pressable>
            ))}
          </View>

          {/* ── Departments ──────────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardHeader}>
              <Sphere3D gradientColors={['#85C1E9', '#1F618D']} shadowColor="#1F618D" size={44}>
                <Ionicons name="people" size={20} color="#fff" />
              </Sphere3D>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Our Departments</Text>
            </View>
            <View style={styles.deptsGrid}>
              {MINISTRY_INFO.departments.map((dept, i) => {
                const cfg = DEPT_MAP[dept] ?? { icon: 'star-outline' as keyof typeof Ionicons.glyphMap, g: ['#B0BEC5', '#546E7A'] as [string, string] };
                return (
                  <LinearGradient
                    key={i}
                    colors={cfg.g}
                    start={{ x: 0.15, y: 0 }}
                    end={{ x: 0.85, y: 1 }}
                    style={styles.deptChip}
                  >
                    <View pointerEvents="none" style={styles.deptShine} />
                    <Ionicons name={cfg.icon} size={13} color="#fff" />
                    <Text style={styles.deptText}>{dept}</Text>
                  </LinearGradient>
                );
              })}
            </View>
          </View>

          {/* ── Footer ───────────────────────────────────────────── */}
          <View style={styles.footer}>
            <LinearGradient
              colors={['#5B2C8E', '#2471A3']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.footerBar}
            />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              © {new Date().getFullYear()} Hope In Christ For All Nations Ministries
            </Text>
            <Text style={[styles.footerSub, { color: colors.textSecondary }]}>
              Inspiring Hope · Encouraging Life
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 110 },

  orbA: {
    position: 'absolute', top: -100, right: -80,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(106,71,205,0.12)',
  },
  orbB: {
    position: 'absolute', bottom: 200, left: -70,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(31,83,168,0.09)',
  },

  // ── Sphere 3D ──
  sphereWrap: {
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  sphereGradient: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  sphereShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '52%',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  // ── Hero ──
  hero: {
    height: 300, borderRadius: 24, overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end', padding: 20,
  },
  heroBadgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  heroBadgeText: { fontSize: 11, fontFamily: fontFamily.semiBold, color: '#fff' },
  heroLabel: { fontSize: 13, fontFamily: fontFamily.semiBold, color: 'rgba(255,255,255,0.72)', marginBottom: 4 },
  heroNames: { fontSize: 22, fontFamily: fontFamily.extraBold, color: '#fff', lineHeight: 28 },

  // ── Card ──
  card: {
    borderRadius: 22, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09, shadowRadius: 16, elevation: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  cardTitle: { fontSize: 19, fontFamily: fontFamily.bold },

  // ── Vision ──
  quoteBox: {
    borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  quoteAccent: {
    width: 4, borderRadius: 2, alignSelf: 'stretch',
    backgroundColor: Colors.primary,
  },
  quoteText: { fontSize: 15, fontFamily: fontFamily.semiBold, flex: 1, lineHeight: 22, fontStyle: 'italic' },

  // ── Pastor Bio ──
  pastorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  pastorPhotoWrap: {
    width: 76, height: 76, borderRadius: 38, overflow: 'hidden',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  pastorPhoto: { width: '100%', height: '100%' },
  pastorPhotoOverlay: { ...StyleSheet.absoluteFillObject },
  pastorMeta: { flex: 1, paddingTop: 4, gap: 4 },
  pastorName: { fontSize: 16, fontFamily: fontFamily.bold, lineHeight: 20 },
  pastorRole: { fontSize: 13, fontFamily: fontFamily.semiBold },
  credBadgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  credBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  credBadgeText: { fontSize: 11, fontFamily: fontFamily.bold },
  divider: { height: 1, marginBottom: 14 },
  bioLine: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  bioDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  bioText: { fontSize: 13, fontFamily: fontFamily.regular, lineHeight: 19, flex: 1 },

  // ── Socials grid ──
  socialsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8,
  },
  socialCell: {
    width: '22%', alignItems: 'center', gap: 6, paddingVertical: 4,
  },
  socialLabel: { fontSize: 10, fontFamily: fontFamily.semiBold, textAlign: 'center' },

  // ── Contact rows ──
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  infoText: { flex: 1, fontSize: 13, fontFamily: fontFamily.medium, lineHeight: 18 },

  // ── Departments ──
  deptsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  deptShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  deptText: { fontSize: 11, fontFamily: fontFamily.bold, color: '#fff' },

  // ── Footer ──
  footer: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  footerBar: { width: 60, height: 3, borderRadius: 2, marginBottom: 4 },
  footerText: { fontSize: 12, fontFamily: fontFamily.medium, textAlign: 'center' },
  footerSub: { fontSize: 11, fontFamily: fontFamily.regular },
});
