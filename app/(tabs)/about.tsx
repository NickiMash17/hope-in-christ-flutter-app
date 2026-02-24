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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { MINISTRY_INFO } from '@/lib/ministry-data';
import { PremiumCard } from '@/components/PremiumCard';
import { useResponsiveLayout } from '@/lib/layout';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch (action) {
      case 'facebook':
        Linking.openURL(MINISTRY_INFO.socialMedia.facebook);
        break;
      case 'youtube':
        if (MINISTRY_INFO.socialMedia.youtube) {
          Linking.openURL(MINISTRY_INFO.socialMedia.youtube);
        }
        break;
      case 'whatsapp':
        Linking.openURL(MINISTRY_INFO.socialMedia.whatsapp);
        break;
      case 'maps':
        const address = encodeURIComponent(MINISTRY_INFO.address);
        const mapsUrl = Platform.select({
          ios: `maps:0,0?q=${address}`,
          android: `geo:0,0?q=${address}`,
          default: `https://www.google.com/maps/search/?api=1&query=${address}`,
        });
        if (mapsUrl) Linking.openURL(mapsUrl);
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 20 }]}
      >
        <View style={[layout.maxWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>
        {/* Hero Section with Pastors */}
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/new/pastor and wife 2.jpeg')}
            style={styles.pastorsImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(91,44,142,0.9)']}
            style={styles.pastorsOverlay}
          >
            <Text style={styles.pastorsTitle}>Our Leadership</Text>
            <Text style={styles.pastorsNames}>{MINISTRY_INFO.leadership.seniorPastors}</Text>
          </LinearGradient>
        </View>

        {/* Ministry Vision */}
        <PremiumCard style={styles.card}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Ionicons name="eye-outline" size={24} color={Colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Vision</Text>
            </View>
            <Text style={[styles.visionText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.slogan1}
            </Text>
            <Text style={[styles.visionText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.slogan2}
            </Text>
          </View>
        </PremiumCard>

        {/* Pastor Thabo's Bio */}
        <PremiumCard style={styles.card}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Image
                source={require('@/assets/new/pastor.jpeg')}
                style={styles.pastorThumbnail}
                contentFit="cover"
              />
              <View style={styles.pastorInfo}>
                <Text style={[styles.pastorName, { color: colors.text }]}>Pastor Thabo Boshomane</Text>
                <Text style={[styles.pastorTitle, { color: colors.textSecondary }]}>Senior Pastor</Text>
              </View>
            </View>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.leadership.pastorThabo.ordination}
            </Text>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.leadership.pastorThabo.founded}
            </Text>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.leadership.pastorThabo.belief}
            </Text>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>
              {MINISTRY_INFO.leadership.pastorThabo.additional}
            </Text>
          </View>
        </PremiumCard>

        {/* Departments */}
        <PremiumCard style={styles.card}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={24} color={Colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Departments</Text>
            </View>
            <View style={styles.departmentsGrid}>
              {MINISTRY_INFO.departments.map((department, index) => (
                <View key={index} style={[styles.departmentBadge, { backgroundColor: Colors.primary + '15' }]}>
                  <Text style={[styles.departmentText, { color: Colors.primary }]}>{department}</Text>
                </View>
              ))}
            </View>
          </View>
        </PremiumCard>

        {/* Service Style */}
        <PremiumCard style={styles.card}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart-outline" size={24} color={Colors.accentBlue} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Services</Text>
            </View>
            <Text style={[styles.serviceStyleText, { color: colors.text }]}>
              {MINISTRY_INFO.serviceStyle}
            </Text>
            <View style={styles.valuesRow}>
              <View style={styles.valueItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  {MINISTRY_INFO.values.dressing}
                </Text>
              </View>
              <View style={styles.valueItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                <Text style={[styles.valueText, { color: colors.textSecondary }]}>
                  {MINISTRY_INFO.values.services}
                </Text>
              </View>
            </View>
          </View>
        </PremiumCard>

        {/* Contact & Social */}
        <PremiumCard style={styles.card}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Ionicons name="share-social-outline" size={24} color={Colors.gold} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect With Us</Text>
            </View>
            
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={18} color={Colors.accent} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>{MINISTRY_INFO.address}</Text>
            </View>
            
            <View style={styles.contactRow}>
              <Ionicons name="time-outline" size={18} color={Colors.accent} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                Office Hours: {MINISTRY_INFO.officeHours}
              </Text>
            </View>

            <View style={styles.socialRow}>
              <Pressable
                onPress={() => handlePress('facebook')}
                style={[styles.socialButton, { backgroundColor: Colors.accent + '20' }]}
              >
                <Ionicons name="logo-facebook" size={20} color={Colors.accent} />
              </Pressable>
              <Pressable
                onPress={() => handlePress('youtube')}
                style={[styles.socialButton, { backgroundColor: Colors.accentBlue + '20' }]}
              >
                <Ionicons name="logo-youtube" size={20} color={Colors.accentBlue} />
              </Pressable>
              <Pressable
                onPress={() => handlePress('whatsapp')}
                style={[styles.socialButton, { backgroundColor: '#25D36620' }]}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              </Pressable>
              <Pressable
                onPress={() => handlePress('maps')}
                style={[styles.socialButton, { backgroundColor: Colors.primary + '20' }]}
              >
                <Ionicons name="map-outline" size={20} color={Colors.primary} />
              </Pressable>
            </View>
          </View>
        </PremiumCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heroSection: {
    height: 280,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  pastorsImage: {
    width: '100%',
    height: '100%',
  },
  pastorsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  pastorsTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pastorsNames: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
  card: {
    marginBottom: 16,
  },
  sectionContent: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    marginLeft: 12,
  },
  visionText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  pastorThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pastorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pastorName: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
  },
  pastorTitle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    marginTop: 2,
  },
  bioText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
    marginBottom: 8,
  },
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  departmentText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  serviceStyleText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  valuesRow: {
    gap: 12,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    flex: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
