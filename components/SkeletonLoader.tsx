import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@/lib/useTheme";
import Colors from "@/constants/colors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const { isDark } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });
  const base = isDark ? Colors.dark.card : Colors.gray200;

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: base, opacity },
        style,
      ]}
    />
  );
}

export function SermonCardSkeleton() {
  const { isDark } = useTheme();
  const bg = isDark ? Colors.dark.card : "#fff";
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <SkeletonLoader height={160} borderRadius={12} style={{ marginBottom: 12 }} />
      <SkeletonLoader height={14} width="70%" style={{ marginBottom: 8 }} />
      <SkeletonLoader height={12} width="45%" />
    </View>
  );
}

export function SermonRowSkeleton() {
  const { isDark } = useTheme();
  const bg = isDark ? Colors.dark.card : "#fff";
  return (
    <View style={[styles.row, { backgroundColor: bg }]}>
      <SkeletonLoader width={60} height={60} borderRadius={10} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonLoader height={14} width="80%" />
        <SkeletonLoader height={11} width="50%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 12, marginBottom: 12 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, padding: 12, marginBottom: 10,
  },
});
