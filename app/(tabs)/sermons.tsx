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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { SERMONS, Sermon } from '@/lib/data';

const CATEGORIES = ['All', 'Word', 'Teaching', 'Prayer'] as const;

const sermonImages: Record<string, any> = {
  Word: require('@/assets/images/sermon-word.png'),
  Teaching: require('@/assets/images/sermon-teaching.png'),
  Prayer: require('@/assets/images/sermon-prayer.png'),
};

function SermonCard({ sermon, isDark, colors }: { sermon: Sermon; isDark: boolean; colors: any }) {
  const categoryColors: Record<string, string> = {
    Word: Colors.primary,
    Teaching: Colors.accentBlue,
    Prayer: Colors.accent,
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
        source={sermonImages[sermon.category]}
        style={styles.sermonImage}
        contentFit="cover"
      />
      <View style={styles.sermonInfo}>
        <Text style={[styles.sermonTitle, { color: colors.text }]} numberOfLines={2}>{sermon.title}</Text>
        <Text style={[styles.sermonSpeaker, { color: colors.textSecondary }]} numberOfLines={1}>{sermon.speaker}</Text>
        <View style={styles.sermonMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: (categoryColors[sermon.category] || Colors.primary) + '18' }]}>
            <Text style={[styles.categoryText, { color: categoryColors[sermon.category] || Colors.primary }]}>{sermon.category}</Text>
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
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const filteredSermons = useMemo(() => {
    return SERMONS.filter(s => {
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 8 }]}>
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
      </View>

      <FlatList
        data={filteredSermons}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SermonCard sermon={item} isDark={isDark} colors={colors} />}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No sermons found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
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
    gap: 8,
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
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  sermonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
