import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/lib/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE_MARGIN = 14;
const BAR_WIDTH = SCREEN_WIDTH - SIDE_MARGIN * 2;
const BAR_HEIGHT = 70;

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  icon: IoniconsName;
  iconActive: IoniconsName;
  label: string;
}

const TAB_CONFIG: TabConfig[] = [
  { name: 'index',     icon: 'home-outline',        iconActive: 'home',                          label: 'Home'     },
  { name: 'sermons',   icon: 'book-outline',         iconActive: 'book',                          label: 'Sermons'  },
  { name: 'give',      icon: 'heart-outline',        iconActive: 'heart',                         label: 'Give'     },
  { name: 'events',    icon: 'calendar-outline',     iconActive: 'calendar',                      label: 'Events'   },
  { name: 'community', icon: 'chatbubbles-outline',  iconActive: 'chatbubbles',                   label: 'Chat'     },
  { name: 'settings',  icon: 'settings-outline',     iconActive: 'settings',                      label: 'More'     },
];

function TabButton({
  config,
  focused,
  onPress,
  accentColor,
  defaultColor,
  tabWidth,
}: {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
  accentColor: string;
  defaultColor: string;
  tabWidth: number;
}) {
  const iconScale    = useSharedValue(1);
  const iconY        = useSharedValue(0);
  const labelOpacity = useSharedValue(focused ? 1 : 0.5);
  const labelScale   = useSharedValue(focused ? 1 : 0.82);

  useEffect(() => {
    const spring = { damping: 10, stiffness: 240, mass: 0.75 };
    iconScale.value = withSpring(focused ? 1.2 : 1, spring);
    iconY.value     = withSpring(focused ? -2 : 0, spring);
    labelOpacity.value = withTiming(focused ? 1 : 0.5,  { duration: 160 });
    labelScale.value   = withTiming(focused ? 1 : 0.82, { duration: 160 });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: iconY.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity:   labelOpacity.value,
    transform: [{ scale: labelScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, { width: tabWidth }]}
      hitSlop={{ top: 8, bottom: 8 }}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? config.iconActive : config.icon}
          size={22}
          color={focused ? accentColor : defaultColor}
        />
      </Animated.View>
      <Animated.Text
        style={[styles.label, { color: focused ? accentColor : defaultColor }, labelStyle]}
        numberOfLines={1}
      >
        {config.label}
      </Animated.Text>
    </Pressable>
  );
}

export function AnimatedTabBar({ state, navigation }: BottomTabBarProps) {
  const { isDark, colors } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  const tabCount = state.routes.length;
  const tabWidth = BAR_WIDTH / tabCount;
  const pillWidth = tabWidth - 16;

  // Sliding pill: translateX moves it to the active tab slot
  const pillX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    pillX.value = withSpring(state.index * tabWidth, {
      damping: 18,
      stiffness: 200,
      mass: 0.9,
    });
  }, [state.index, tabWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          left:   isWeb ? 20 : SIDE_MARGIN,
          right:  isWeb ? 20 : SIDE_MARGIN,
          bottom: isWeb ? 16 : 12,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            borderColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(91,44,142,0.12)',
            backgroundColor: isIOS
              ? 'transparent'
              : isDark
              ? 'rgba(34,34,46,0.95)'
              : 'rgba(255,255,255,0.96)',
            shadowColor: isDark ? '#000' : '#241063',
          },
        ]}
      >
        {isIOS && (
          <BlurView
            intensity={95}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
          />
        )}

        {/* Sliding highlight pill — sits behind the icons */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            pillStyle,
            {
              width: pillWidth,
              backgroundColor: isDark
                ? 'rgba(155,109,215,0.16)'
                : 'rgba(91,44,142,0.09)',
              borderColor: isDark
                ? 'rgba(155,109,215,0.28)'
                : 'rgba(91,44,142,0.16)',
            },
          ]}
        />

        {/* Tab items */}
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG.find((t) => t.name === route.name);
            if (!config) return null;

            const focused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                navigation.navigate(route.name);
              }
            };

            return (
              <TabButton
                key={route.key}
                config={config}
                focused={focused}
                onPress={onPress}
                accentColor={colors.tint}
                defaultColor={colors.tabIconDefault}
                tabWidth={tabWidth}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius:  22,
    elevation:     14,
  },
  pill: {
    position: 'absolute',
    top:    8,
    left:   8,
    height: BAR_HEIGHT - 16,
    borderRadius: 18,
    borderWidth:  1,
    zIndex: 0,
  },
  row: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
  },
  tabButton: {
    height:          '100%',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             2,
    zIndex:          1,
  },
  label: {
    fontSize:    10,
    fontFamily:  'Nunito_600SemiBold',
    letterSpacing: 0.2,
    marginTop:   1,
  },
});
