import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import * as Haptics from 'expo-haptics';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: any;
}

export function ThemeToggle({ size = 'medium', showLabel = false, style }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (__DEV__) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 44, height: 24, borderRadius: 12 },
          thumb: { width: 20, height: 20, borderRadius: 10 },
          icon: { size: 12 as const },
        };
      case 'large':
        return {
          container: { width: 64, height: 36, borderRadius: 18 },
          thumb: { width: 30, height: 30, borderRadius: 15 },
          icon: { size: 16 as const },
        };
      default: // medium
        return {
          container: { width: 56, height: 32, borderRadius: 16 },
          thumb: { width: 26, height: 26, borderRadius: 13 },
          icon: { size: 14 as const },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      onPress={handleToggle}
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
    >
      <View
        style={[
          styles.toggle,
          sizeStyles.container,
          {
            backgroundColor: isDark ? '#5B2C8E' : '#E8E4EE',
            justifyContent: isDark ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <View
          style={[
            styles.thumb,
            sizeStyles.thumb,
            {
              backgroundColor: isDark ? '#FFFFFF' : '#5B2C8E',
              transform: [{ scale: 1 }],
            },
          ]}
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={sizeStyles.icon.size}
            color={isDark ? '#5B2C8E' : '#FFFFFF'}
          />
        </View>
      </View>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={16}
            color={isDark ? '#FFFFFF' : '#1A1A2E'}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  thumb: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
