import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';
import { EnhancedColors } from '@/constants/enhanced-colors';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'success' | 'danger' | 'gradient';
  size?: 'small' | 'medium' | 'large' | 'xl';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  shadowIntensity?: 'small' | 'medium' | 'large' | 'premium';
  animated?: boolean;
  gradient?: string[];
}

export function PremiumButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  shadowIntensity = 'medium',
  animated = true,
  gradient,
}: PremiumButtonProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated && !disabled) {
      // Subtle pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Loading shimmer
    if (loading) {
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [animated, disabled, loading]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
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
    if (!disabled && !loading) {
      setIsPressed(false);
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 300,
        friction: 30,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return gradient || EnhancedColors.gradients.premium;
      case 'secondary':
        return gradient || EnhancedColors.gradients.info;
      case 'gold':
        return gradient || EnhancedColors.gradients.gold;
      case 'success':
        return gradient || EnhancedColors.gradients.success;
      case 'danger':
        return gradient || EnhancedColors.gradients.danger;
      case 'gradient':
        return gradient || EnhancedColors.gradients.aurora;
      default:
        return EnhancedColors.gradients.premium;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 40,
          paddingHorizontal: 20,
          borderRadius: 12,
          fontSize: 14,
          iconSize: 16,
        };
      case 'medium':
        return {
          height: 48,
          paddingHorizontal: 24,
          borderRadius: 16,
          fontSize: 16,
          iconSize: 18,
        };
      case 'large':
        return {
          height: 56,
          paddingHorizontal: 32,
          borderRadius: 20,
          fontSize: 18,
          iconSize: 20,
        };
      case 'xl':
        return {
          height: 64,
          paddingHorizontal: 40,
          borderRadius: 24,
          fontSize: 20,
          iconSize: 22,
        };
      default:
        return {
          height: 48,
          paddingHorizontal: 24,
          borderRadius: 16,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const buttonStyle = [
    styles.button,
    {
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderRadius: sizeStyles.borderRadius,
      width: fullWidth ? Math.max(220, Math.min(width - 32, 560)) : undefined,
      shadowColor: EnhancedColors.shadows.light[shadowIntensity].shadowColor,
      shadowOffset: EnhancedColors.shadows.light[shadowIntensity].shadowOffset,
      shadowOpacity: disabled ? 0.1 : EnhancedColors.shadows.light[shadowIntensity].shadowOpacity,
      shadowRadius: EnhancedColors.shadows.light[shadowIntensity].shadowRadius,
      elevation: disabled ? 2 : EnhancedColors.shadows.light[shadowIntensity].elevation,
      opacity: disabled ? 0.6 : 1,
      transform: [
        { scale: scaleValue },
        { 
          scale: pulseValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.02],
          })
        },
      ],
    },
  ];

  const loadingStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: sizeStyles.borderRadius,
    opacity: shimmerValue,
  };

  const renderContent = () => {
    const iconElement = icon ? (
      <Ionicons 
        name={icon as any} 
        size={sizeStyles.iconSize} 
        color="#fff" 
      />
    ) : null;

    const textElement = (
      <Text style={[
        styles.text,
        { fontSize: sizeStyles.fontSize },
      ]}>
        {title}
      </Text>
    );

    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{iconElement}</View>
        )}
        {textElement}
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{iconElement}</View>
        )}
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[styles.container, fullWidth && styles.fullWidthContainer]}
    >
      <Animated.View style={buttonStyle}>
        <LinearGradient
          colors={getVariantColors() as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        {renderContent()}
        
        {loading && (
          <Animated.View style={loadingStyle}>
            <LinearGradient
              colors={EnhancedColors.animation.shimmer}
              start={{ x: -1, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loadingGradient}
            />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    color: '#fff',
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingGradient: {
    flex: 1,
  },
});
