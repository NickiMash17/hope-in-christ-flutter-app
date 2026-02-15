import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';

export default function DonationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: Colors.accentBlue + '15' }]}>
          <Ionicons name="heart-circle" size={64} color={Colors.accentBlue} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Thank You!</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your generosity makes a difference. May God bless you abundantly for your cheerful giving.
        </Text>

        <Text style={[styles.verse, { color: Colors.primary }]}>
          "Give, and it will be given to you. A good measure, pressed down, shaken together and running over."
        </Text>
        <Text style={[styles.verseRef, { color: colors.textSecondary }]}>- Luke 6:38</Text>

        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: Colors.primary }]}
        >
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  verse: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: 8,
  },
  verseRef: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
});
