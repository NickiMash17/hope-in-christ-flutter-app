import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';

interface PremiumCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  gradient?: string[];
  style?: any;
  disabled?: boolean;
}

export function PremiumCard({ children, onPress, gradient, style, disabled = false }: PremiumCardProps) {
  const { gradients, colors } = useTheme();
  const scaleValue = useMemo(() => new Animated.Value(1), []);

  const defaultGradient = gradient || gradients.primary;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    return () => {
      scaleValue.setValue(1);
    };
  }, [scaleValue]);

  const CardContent = (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleValue }],
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={defaultGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={[styles.cardContent, { backgroundColor: colors.card }]}>
          {children}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableContainer}
      >
        {CardContent}
      </Pressable>
    );
  }

  return CardContent;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  gradient?: string[];
  style?: any;
}

export function HeroSection({ title, subtitle, description, badge, gradient, style }: HeroSectionProps) {
  const { gradients, colors } = useTheme();

  return (
    <PremiumCard gradient={gradient || gradients.primary} style={[styles.heroCard, style]}>
      <View style={styles.heroContent}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: 'rgba(91, 44, 142, 0.1)' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={[styles.heroTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.heroSubtitle, { color: '#5B2C8E' }]}>{subtitle}</Text>}
        {description && <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 15,
  },
  gradientBackground: {
    padding: 2,
    borderRadius: 24,
  },
  cardContent: {
    borderRadius: 22,
    padding: 20,
    minHeight: 100,
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: 'rgba(91, 44, 142, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#5B2C8E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  heroDescription: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
