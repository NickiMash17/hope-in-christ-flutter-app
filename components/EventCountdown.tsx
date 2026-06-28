import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fontFamily } from "@/lib/fonts";
import Colors from "@/constants/colors";

interface Props {
  date: string;
  time?: string | null;
  color?: string;
  size?: "sm" | "lg";
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdown(date: string, time?: string | null): Countdown | null {
  const target = new Date(`${date}T${time ?? "09:00"}:00`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function Tile({
  value,
  label,
  color,
  size,
}: {
  value: number;
  label: string;
  color: string;
  size: "sm" | "lg";
}) {
  const isLg = size === "lg";
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.13)", "rgba(255,255,255,0.04)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.tile, isLg ? styles.tileLg : styles.tileSm]}
    >
      {/* Colored accent bar across the top */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      {/* Number */}
      <Text style={[styles.tileValue, isLg ? styles.tileValueLg : styles.tileValueSm, { color }]}>
        {String(value).padStart(2, "0")}
      </Text>

      {/* Label */}
      <Text style={[styles.tileLabel, isLg ? styles.tileLabelLg : styles.tileLabelSm, { color: color + "90" }]}>
        {label}
      </Text>
    </LinearGradient>
  );
}

function Colon({ color, size }: { color: string; size: "sm" | "lg" }) {
  return (
    <View style={styles.colonWrap}>
      <View style={[styles.colonDot, { backgroundColor: color + "70" }]} />
      <View style={[styles.colonDot, { backgroundColor: color + "70" }]} />
    </View>
  );
}

export function EventCountdown({ date, time, color = Colors.primary, size = "sm" }: Props) {
  const [countdown, setCountdown] = useState<Countdown | null>(getCountdown(date, time));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(date, time));
    }, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (!countdown) return null;

  const units =
    size === "lg"
      ? [
          { label: "DAYS", value: countdown.days },
          { label: "HRS", value: countdown.hours },
          { label: "MIN", value: countdown.minutes },
          { label: "SEC", value: countdown.seconds },
        ]
      : [
          { label: "D", value: countdown.days },
          { label: "H", value: countdown.hours },
          { label: "M", value: countdown.minutes },
        ];

  return (
    <View style={[styles.container, size === "lg" && styles.containerLg]}>
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <Tile value={u.value} label={u.label} color={color} size={size} />
          {i < units.length - 1 && <Colon color={color} size={size} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  containerLg: {
    gap: 8,
    justifyContent: "center",
  },

  // Tile base
  tile: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  tileSm: {
    width: 38,
    paddingVertical: 5,
  },
  tileLg: {
    width: 72,
    paddingVertical: 12,
  },

  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  tileValue: {
    fontFamily: fontFamily.extraBold,
    lineHeight: undefined,
  },
  tileValueSm: {
    fontSize: 17,
    lineHeight: 22,
  },
  tileValueLg: {
    fontSize: 36,
    lineHeight: 44,
  },

  tileLabel: {
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
  },
  tileLabelSm: {
    fontSize: 8,
    marginTop: 1,
  },
  tileLabelLg: {
    fontSize: 10,
    marginTop: 2,
  },

  // Colon separator
  colonWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 10,
  },
  colonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
