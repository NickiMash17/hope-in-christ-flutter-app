import React from "react";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/lib/useTheme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: "light" | "dark" | "default";
}

export function GlassCard({
  children,
  style,
  intensity = 100,
  tint = "default",
}: GlassCardProps) {
  const { isDark, glass } = useTheme();

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint={isDark ? "dark" : tint}
        style={[styles.glassCard, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: glass,
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(91,44,142,0.12)",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
});
