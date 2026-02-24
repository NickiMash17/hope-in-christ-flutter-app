import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fontFamily } from '@/lib/fonts';
import { EnhancedColors } from '@/constants/enhanced-colors';

interface PremiumStatsProps {
  stats: Array<{
    label: string;
    value: string;
    icon: string;
    color?: string;
    gradient?: string[];
    trend?: 'up' | 'down' | 'neutral';
  }>;
  animated?: boolean;
  containerWidth?: number;
}

export function PremiumStats({ stats, animated = true, containerWidth }: PremiumStatsProps) {
  const { width } = useWindowDimensions();
  const effectiveWidth = containerWidth ?? width;
  const animatedValues = useRef(
    stats.map(() => new Animated.Value(0))
  ).current;
  const columns = effectiveWidth >= 1200 ? 4 : effectiveWidth >= 768 ? 3 : 2;
  const cardGap = 12;
  const cardWidth = (effectiveWidth - cardGap * (columns - 1)) / columns;

  useEffect(() => {
    if (animated) {
      // Staggered animation for stats
      const animations = animatedValues.map((value, index) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 800,
          delay: index * 150,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, animations).start();
    }
  }, [animated]);

  const getStatColor = (stat: any) => {
    if (stat.gradient) return stat.gradient;
    if (stat.color) return [stat.color, ColorUtils.darken(stat.color, 20)];
    return EnhancedColors.gradients.premium;
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-up';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '#27AE60';
      case 'down':
        return '#E74C3C';
      default:
        return '#F39C12';
    }
  };

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => {
        const animatedStyle = {
          opacity: animatedValues[index],
          transform: [
            {
              translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            {
              scale: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };

        return (
          <Animated.View
            key={index}
            style={[
              styles.statCard,
              { width: cardWidth },
              animatedStyle,
            ]}
          >
            <LinearGradient
              colors={getStatColor(stat) as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            />
            
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <Ionicons
                    name={stat.icon as any}
                    size={24}
                    color="#fff"
                  />
                </View>
                {stat.trend && (
                  <View style={styles.trendContainer}>
                    <Ionicons
                      name={getTrendIcon(stat.trend) as any}
                      size={16}
                      color={getTrendColor(stat.trend)}
                    />
                  </View>
                )}
              </View>
              
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    ...EnhancedColors.shadows.light.medium,
  },
  statGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  statContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

// Color utility for the component
const ColorUtils = {
  darken: (color: string, percent: number) => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  },
};
