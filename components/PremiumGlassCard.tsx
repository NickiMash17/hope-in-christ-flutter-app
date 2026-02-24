import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/useTheme';
import { EnhancedColors, ColorUtils } from '@/constants/enhanced-colors';

interface PremiumGlassCardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  gradient?: string[];
  shadowIntensity?: 'small' | 'medium' | 'large' | 'premium' | 'epic';
  borderGlow?: boolean;
  shimmer?: boolean;
  scaleOnPress?: boolean;
  delay?: number;
}

export function PremiumGlassCard({
  children,
  style,
  onPress,
  gradient,
  shadowIntensity = 'medium',
  borderGlow = false,
  shimmer = false,
  scaleOnPress = true,
  delay = 0,
}: PremiumGlassCardProps) {
  const { isDark, colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const glowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer animation
    if (shimmer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }

    // Glow animation
    if (borderGlow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }

    // Entrance animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [shimmer, borderGlow, delay]);

  const handlePressIn = () => {
    if (scaleOnPress) {
      setIsPressed(true);
      Animated.spring(scaleValue, {
        toValue: 0.95,
        tension: 300,
        friction: 30,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (scaleOnPress) {
      setIsPressed(false);
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 300,
        friction: 30,
        useNativeDriver: true,
      }).start();
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: isDark 
        ? EnhancedColors.glass.dark.background 
        : EnhancedColors.glass.light.background,
      borderColor: isDark 
        ? EnhancedColors.glass.dark.border 
        : EnhancedColors.glass.light.border,
      shadowColor: EnhancedColors.shadows.light[shadowIntensity].shadowColor,
      shadowOffset: EnhancedColors.shadows.light[shadowIntensity].shadowOffset,
      shadowOpacity: EnhancedColors.shadows.light[shadowIntensity].shadowOpacity,
      shadowRadius: EnhancedColors.shadows.light[shadowIntensity].shadowRadius,
      elevation: EnhancedColors.shadows.light[shadowIntensity].elevation,
      opacity: animatedValue,
      transform: [{ scale: scaleValue }],
    },
    style,
  ];

  const shimmerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: shimmerValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 0],
    }),
  };

  const glowStyle = {
    position: 'absolute' as const,
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    opacity: glowValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.8, 0.3],
    }),
  };

  const CardComponent = (
    <View style={styles.container}>
      {borderGlow && (
        <Animated.View style={glowStyle}>
          <LinearGradient
            colors={gradient || EnhancedColors.gradients.premium}
            style={styles.glowGradient}
          />
        </Animated.View>
      )}
      
      <Animated.View style={cardStyle}>
        {shimmer && (
          <Animated.View style={shimmerStyle}>
            <LinearGradient
              colors={EnhancedColors.animation.shimmer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        )}
        
        {gradient && (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          />
        )}
        
        {children}
      </Animated.View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {CardComponent}
      </Pressable>
    );
  }

  return CardComponent;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 0.1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 22,
  },
  shimmerGradient: {
    flex: 1,
    borderRadius: 20,
  },
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});
