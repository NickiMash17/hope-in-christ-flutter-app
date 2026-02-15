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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { SERMONS } from '@/lib/data';

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
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
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>Sermon</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[styles.heroSection, { backgroundColor: catColor + '12' }]}>
          <View style={[styles.heroIcon, { backgroundColor: catColor + '20' }]}>
            <Ionicons name={sermon.videoUrl ? 'play-circle' : 'musical-notes'} size={40} color={catColor} />
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{sermon.category}</Text>
          </View>
        </View>

        <View style={styles.content}>
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
            {sermon.videoUrl && (
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(sermon.videoUrl!);
                }}
                style={[styles.actionButton, { backgroundColor: Colors.accent }]}
              >
                <Ionicons name="play" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Watch Video</Text>
              </Pressable>
            )}
            {sermon.audioUrl && (
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(sermon.audioUrl!);
                }}
                style={[styles.actionButton, { backgroundColor: Colors.accentBlue }]}
              >
                <Ionicons name="headset" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Listen</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  navTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    flex: 1,
    textAlign: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    gap: 12,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
  },
  content: {
    paddingHorizontal: 20,
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
    borderRadius: 12,
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
    borderRadius: 14,
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
