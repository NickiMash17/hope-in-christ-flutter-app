import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/useTheme';
import { fontFamily } from '@/lib/fonts';

interface MissionStatementProps {
  type?: 'primary' | 'secondary';
  style?: any;
}

export function MissionStatement({ type = 'primary', style }: MissionStatementProps) {
  const { gradients, colors } = useTheme();

  const primaryMission = "Inspiring Hope... Encouraging Life";
  const secondaryMission = "Winning, Discipling, Imparting and Sending";

  const gradientColors = type === 'primary' ? gradients.primary : gradients.accent;

  return (
    <LinearGradient
      colors={gradientColors as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Our Mission</Text>
        <Text style={[styles.missionText, { color: colors.text }]}>
          {type === 'primary' ? primaryMission : secondaryMission}
        </Text>
      </View>
    </LinearGradient>
  );
}

interface VisionCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  style?: any;
}

export function VisionCard({ title, description, icon, gradient, style }: VisionCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.visionCard, { backgroundColor: colors.card }, style]}>
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.visionIconContainer}
      >
        <Text style={styles.visionIcon}>{icon}</Text>
      </LinearGradient>
      <Text style={[styles.visionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.visionDescription, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );
}

export function VisionValues() {
  const { gradients } = useTheme();

  const values = [
    {
      title: "Spirit-Filled Worship",
      description: "Vibrant and exciting services powered by the Holy Spirit",
      icon: "🔥",
      gradient: gradients.accent
    },
    {
      title: "Biblical Teaching",
      description: "Sound doctrine and practical application of God's Word",
      icon: "📖",
      gradient: gradients.primary
    },
    {
      title: "Community Fellowship",
      description: "Building meaningful relationships and supporting one another",
      icon: "🤝",
      gradient: gradients.blue
    },
    {
      title: "Global Outreach",
      description: "Taking the gospel to all nations and making disciples",
      icon: "🌍",
      gradient: gradients.gold
    }
  ];

  return (
    <View style={styles.valuesContainer}>
      {values.map((value, index) => (
        <VisionCard
          key={index}
          title={value.title}
          description={value.description}
          icon={value.icon}
          gradient={value.gradient}
          style={styles.valueCard}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 2,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  missionText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    textAlign: 'center',
    lineHeight: 24,
  },
  visionCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  visionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  visionIcon: {
    fontSize: 24,
  },
  visionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  visionDescription: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
  valuesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  valueCard: {
    marginHorizontal: 0,
  },
});
