import React from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";

interface Props {
  title: string;
  speaker: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

export function MiniPlayer({ title, speaker, isPlaying, onPlayPause, onClose }: Props) {
  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, Platform.OS === "ios" && styles.containerIos]}
    >
      <View style={styles.info}>
        <View style={styles.iconWrap}>
          <Ionicons name="musical-notes" size={16} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.speaker} numberOfLines={1}>{speaker}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <Pressable onPress={onPlayPause} style={styles.btn}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#fff" />
        </Pressable>
        <Pressable onPress={onClose} style={styles.btn}>
          <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 12,
    right: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  containerIos: { bottom: 100 },
  info: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primary + "20",
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 13, fontFamily: fontFamily.semiBold, color: "#fff" },
  speaker: { fontSize: 11, fontFamily: fontFamily.regular, color: "rgba(255,255,255,0.6)" },
  controls: { flexDirection: "row", alignItems: "center" },
  btn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
});
