import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';

interface MinistryImage {
  id: string;
  source: any;
  title: string;
  description: string;
}

const ministryImages: MinistryImage[] = [
  {
    id: '1',
    source: require('@/assets/new/pastor and wife 1.jpeg'),
    title: 'Our Leadership',
    description: 'Pastor Thabo & Mrs Ntombi Boshomane'
  },
  {
    id: '2', 
    source: require('@/assets/new/worship team.jpeg'),
    title: 'Worship Team',
    description: 'Spirit-filled worship ministry'
  },
  {
    id: '3',
    source: require('@/assets/new/church youth.jpeg'),
    title: 'Youth Ministry',
    description: 'Empowering the next generation'
  },
  {
    id: '4',
    source: require('@/assets/new/ordination of ministers.jpeg'),
    title: 'Ministry Ordination',
    description: 'Commissioning leaders for the harvest'
  },
  {
    id: '5',
    source: require('@/assets/new/sunday-service-poster.jpeg'),
    title: 'Sunday Services',
    description: 'Join us for powerful services'
  },
  {
    id: '6',
    source: require('@/assets/new/worship team 2.jpeg'),
    title: 'Praise & Worship',
    description: 'Experiencing God\'s presence'
  }
];

export function MinistryGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ministry Gallery</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Experience life at Hope In Christ
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ministryImages.map((image) => (
          <Pressable
            key={image.id}
            onPress={() => setSelectedImage(image.id)}
            style={({ pressed }) => [
              styles.imageCard,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Image
              source={image.source}
              style={styles.galleryImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.imageOverlay}
            >
              <Text style={styles.imageTitle}>{image.title}</Text>
              <Text style={styles.imageDescription}>{image.description}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>

      {selectedImage && (
        <View style={styles.selectedInfo}>
          <Ionicons 
            name="checkmark-circle" 
            size={20} 
            color="#5B2C8E" 
            style={styles.checkIcon}
          />
          <Text style={[styles.selectedText, { color: colors.text }]}>
            {ministryImages.find(img => img.id === selectedImage)?.title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  imageCard: {
    width: 200,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  imageTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  imageDescription: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  selectedText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
});
