import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { width, height } = useWindowDimensions();

  const screenFade = useRef(new Animated.Value(0)).current;
  const logoIn = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(logoIn, {
        toValue: 1,
        speed: 10,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1700,
        delay: 140,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2150);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [glowPulse, logoIn, onFinish, progress, screenFade]);

  const logoSize = Math.min(Math.max(width * 0.54, 210), 320);
  const shellSize = logoSize + 14;
  const glowSize = logoSize + 72;
  const progressWidth = Math.min(width * 0.54, 260);

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <LinearGradient
        colors={['#241063', '#351783', '#4B26AB', '#6A47CD']}
        start={{ x: 0.05, y: 0.04 }}
        end={{ x: 0.95, y: 0.96 }}
        style={styles.background}
      />

      <View
        style={[
          styles.orb,
          {
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: (width * 0.9) / 2,
            top: -width * 0.28,
            right: -width * 0.2,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          styles.orbSecondary,
          {
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: (width * 0.7) / 2,
            bottom: -width * 0.24,
            left: -width * 0.22,
          },
        ]}
      />

      <View style={[styles.centerWrap, { paddingTop: Math.max(height * 0.04, 20) }]}>
        <Animated.View
          style={[
            styles.logoGlow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
              opacity: glowPulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.24],
              }),
              transform: [
                {
                  scale: glowPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1.05],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.logoShell,
            {
              width: shellSize,
              height: shellSize,
              borderRadius: 26,
              transform: [
                {
                  translateY: logoIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
                {
                  scale: logoIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require('@/assets/new/new purple.png')}
            style={{ width: logoSize, height: logoSize, borderRadius: 20 }}
            contentFit="cover"
          />
        </Animated.View>
      </View>

      <View style={styles.bottomWrap}>
        <View style={[styles.progressTrack, { width: progressWidth }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, progressWidth],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: 'absolute',
    backgroundColor: 'rgba(173,145,255,0.16)',
  },
  orbSecondary: {
    backgroundColor: 'rgba(124,169,255,0.16)',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  logoShell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    shadowColor: '#0F0B1E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 48,
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.26)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
});
