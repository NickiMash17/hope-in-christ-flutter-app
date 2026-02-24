import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fontFamily } from '@/lib/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PremiumLoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  showProgress?: boolean;
}

export function PremiumLoading({ 
  size = 'medium', 
  color = '#4A235A', 
  text = 'Loading...', 
  showProgress = false 
}: PremiumLoadingProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    const rotationLoop = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotationLoop.start();

    // Scale pulse animation
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    scaleLoop.start();

    // Opacity pulse animation
    const opacityLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    opacityLoop.start();

    // Progress animation
    if (showProgress) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      rotationLoop.stop();
      scaleLoop.stop();
      opacityLoop.stop();
    };
  }, [showProgress]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          containerSize: 60,
          iconSize: 24,
          fontSize: 12,
          strokeWidth: 2,
        };
      case 'medium':
        return {
          containerSize: 80,
          iconSize: 32,
          fontSize: 14,
          strokeWidth: 3,
        };
      case 'large':
        return {
          containerSize: 120,
          iconSize: 48,
          fontSize: 16,
          strokeWidth: 4,
        };
      default:
        return {
          containerSize: 80,
          iconSize: 32,
          fontSize: 14,
          strokeWidth: 3,
        };
    }
  };

  const { containerSize, iconSize, fontSize, strokeWidth } = getSizeStyles();

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH * 0.6],
  });

  return (
    <View style={styles.container}>
      {/* Royal Orb Loading */}
      <View style={[styles.loadingContainer, { width: containerSize, height: containerSize }]}>
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              width: containerSize,
              height: containerSize,
              borderRadius: containerSize / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />

        {/* Middle rotating ring */}
        <Animated.View
          style={[
            styles.middleRing,
            {
              width: containerSize * 0.8,
              height: containerSize * 0.8,
              borderRadius: (containerSize * 0.8) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: rotation }],
            },
          ]}
        />

        {/* Inner gradient circle */}
        <LinearGradient
          colors={[color, `${color}88`, `${color}44`]}
          style={[
            styles.innerCircle,
            {
              width: containerSize * 0.6,
              height: containerSize * 0.6,
              borderRadius: (containerSize * 0.6) / 2,
            },
          ]}
        >
          {/* Center icon */}
          <Ionicons
            name="refresh-outline"
            size={iconSize}
            color="#fff"
            style={{
              transform: [{ rotate: rotation }],
            }}
          />
        </LinearGradient>
      </View>

      {/* Loading text */}
      <Text style={[styles.loadingText, { fontSize, color }]}>{text}</Text>

      {/* Progress bar */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  middleRing: {
    position: 'absolute',
    borderStyle: 'dashed',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontFamily: fontFamily.semiBold,
    marginTop: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    marginTop: 16,
    width: SCREEN_WIDTH * 0.6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
