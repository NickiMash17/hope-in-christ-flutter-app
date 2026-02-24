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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { SERMONS } from '@/lib/data';
import { useResponsiveLayout } from '@/lib/layout';

const sermonImages: Record<string, any> = {
  Word: require('@/assets/images/sermon-word.png'),
  Teaching: require('@/assets/images/sermon-teaching.png'),
  Prayer: require('@/assets/images/sermon-prayer.png'),
};

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const sermon = SERMONS.find(s => s.id === id);

  if (!sermon) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Sermon not found</Text>
        </View>
      </View>
    );
  }

  const categoryColors: Record<string, string> = {
    Word: Colors.primary,
    Teaching: Colors.accentBlue,
    Prayer: Colors.accent,
  };
  const catColor = categoryColors[sermon.category] || Colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(74,35,90,0.16)', 'rgba(30,58,138,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[layout.maxWidthStyle, { width: '100%' }]}>
        <View style={styles.heroContainer}>
          <Image
            source={sermonImages[sermon.category]}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          >
            <Pressable
              onPress={() => router.back()}
              style={[styles.floatingBack, { top: (Platform.OS === 'web' ? webTopInset : insets.top) + 8 }]}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>

            <View style={styles.heroBottom}>
              <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
                <Text style={styles.categoryText}>{sermon.category}</Text>
              </View>
              {sermon.videoUrl && (
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Linking.openURL(sermon.videoUrl!);
                  }}
                  style={styles.playButton}
                >
                  <Ionicons name="play" size={28} color="#fff" />
                </Pressable>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.content, { paddingHorizontal: layout.horizontalPadding }]}>
          <Text style={[styles.title, { color: colors.text }]}>{sermon.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{sermon.speaker}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {new Date(sermon.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.text }]}>{sermon.description}</Text>

          <View style={styles.actionsRow}>
            {sermon.audioUrl && (
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(sermon.audioUrl!);
                }}
                style={[styles.actionButton, { backgroundColor: Colors.primary }]}
              >
                <Ionicons name="headset" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Listen to Audio</Text>
              </Pressable>
            )}
          </View>

          {sermon.notes && (
            <View style={[styles.notesCard, { backgroundColor: isDark ? Colors.dark.card : Colors.gray50 }]}>
              <View style={styles.notesHeader}>
                <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
                <Text style={[styles.notesTitle, { color: colors.text }]}>Sermon Notes</Text>
              </View>
              <Text style={[styles.notesText, { color: colors.text }]}>{sermon.notes}</Text>
            </View>
          )}
        </View>
        </View>
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
    position: 'absolute',
    top: -120,
    right: -84,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(106,71,205,0.14)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 140,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(31,83,168,0.1)',
  },
  heroContainer: {
    height: 240,
    position: 'relative',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 16,
  },
  floatingBack: {
    position: 'absolute',
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(91,44,142,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 16,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  description: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 22,
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  notesCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(91,44,142,0.14)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
    gap: 10,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notesTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
  notesText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
});
