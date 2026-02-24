import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SERMONS } from '@/lib/ministry-data';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { useResponsiveLayout } from '@/lib/layout';

const CATEGORIES = ['All', 'Word', 'Teaching', 'Prayer'] as const;

const sermonImages: Record<string, any> = {
  '1': require('@/assets/new/pastor.jpeg'),
  '2': require('@/assets/new/pastor teaching congregants.jpeg'),
  '3': require('@/assets/new/new purple.png'),
  '4': require('@/assets/new/pastor.jpeg'),
  '5': require('@/assets/new/pastor teaching congregants.jpeg'),
  '6': require('@/assets/new/new purple.png'),
  '7': require('@/assets/new/church youth.jpeg'),
  '8': require('@/assets/new/pastor.jpeg'),
  '9': require('@/assets/new/pastor teaching congregants.jpeg'),
  '10': require('@/assets/new/new purple.png'),
  '11': require('@/assets/new/pastor.jpeg'),
};

function SermonCard({ sermon, isDark, colors }: { sermon: any; isDark: boolean; colors: any }) {
  const categoryColors: Record<string, string> = {
    '1': Colors.primary,
    '2': Colors.accentBlue,
    '3': Colors.accent,
  };

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/sermon/[id]', params: { id: sermon.id } });
      }}
      style={({ pressed }) => [
        styles.sermonCard,
        {
          backgroundColor: isDark ? Colors.dark.card : '#fff',
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Image
        source={sermonImages[sermon.id]}
        style={styles.sermonImage}
        contentFit="cover"
      />
      <View style={styles.sermonInfo}>
        <Text style={[styles.sermonTitle, { color: colors.text }]} numberOfLines={2}>{sermon.title}</Text>
        <Text style={[styles.sermonSpeaker, { color: colors.textSecondary }]} numberOfLines={1}>{sermon.speaker}</Text>
        <View style={styles.sermonMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: (categoryColors[sermon.id] || Colors.primary) + '18' }]}>
            <Text style={[styles.categoryText, { color: categoryColors[sermon.id] || Colors.primary }]}>Sermon</Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(sermon.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function SermonsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const filteredSermons = useMemo(() => {
    return SERMONS.filter(s => {
      const matchesCategory = selectedCategory === 'All';
      const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

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
      <View style={[layout.maxWidthStyle, { flex: 1, width: '100%' }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 8,
              paddingHorizontal: layout.horizontalPadding,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>Sermons</Text>
          <View style={[styles.searchBar, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100 }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search sermons..."
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {!!search && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === cat
                      ? Colors.primary
                      : isDark ? Colors.dark.card : Colors.gray100,
                  },
                ]}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory === cat ? '#fff' : colors.textSecondary },
                ]}>{cat}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.headerMetaRow}>
            <View style={[styles.headerMetaBadge, { backgroundColor: isDark ? Colors.dark.card : '#ffffff' }]}>
              <Ionicons name="mic" size={13} color={Colors.primary} />
              <Text style={[styles.headerMetaText, { color: colors.text }]}>Weekly Revelations</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={filteredSermons}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <SermonCard sermon={item} isDark={isDark} colors={colors} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: 100, paddingHorizontal: layout.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No sermons found</Text>
            </View>
          }
        />
      </View>
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
  header: {
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    padding: 0,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  headerMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91,44,142,0.28)',
  },
  headerMetaText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  list: {
    paddingTop: 4,
    gap: 10,
  },
  sermonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    gap: 12,
  },
  sermonImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  sermonInfo: {
    flex: 1,
    gap: 3,
  },
  sermonTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    lineHeight: 20,
  },
  sermonSpeaker: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  sermonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
  },
  dateText: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
});
