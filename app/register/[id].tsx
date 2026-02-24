import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { EVENTS } from '@/lib/data';
import { useResponsiveLayout } from '@/lib/layout';

export default function RegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const event = EVENTS.find(e => e.id === id);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ticketType, setTicketType] = useState('General');
  const [attendanceType, setAttendanceType] = useState('In-Person');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Event not found</Text>
        </View>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim() || !surname.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const registration = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        eventId: event.id,
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        ticketType,
        attendanceType,
        timestamp: Date.now(),
      };
      const existing = await AsyncStorage.getItem('registrations');
      const registrations = existing ? JSON.parse(existing) : [];
      registrations.push(registration);
      await AsyncStorage.setItem('registrations', JSON.stringify(registrations));
      setIsSuccess(true);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.successContainer,
            layout.narrowWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          <View style={[styles.successIcon, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Registration Complete!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            You have been registered for {event.title}. We look forward to seeing you there!
          </Text>
          <Text style={[styles.successDetail, { color: colors.textSecondary }]}>
            {new Date(event.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} at {event.time}
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.doneButton, { backgroundColor: Colors.primary }]}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(74,35,90,0.14)', 'rgba(36,113,163,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={styles.orbPrimary} />
      <View style={styles.orbSecondary} />
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Register</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[layout.narrowWidthStyle, { paddingHorizontal: layout.horizontalPadding }]}>
          <View style={[styles.eventSummary, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
            <Text style={[styles.eventName, { color: colors.text }]}>{event.title}</Text>
            <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
              {new Date(event.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} | {event.time}
            </Text>
          </View>

          <View style={[styles.form, { backgroundColor: isDark ? Colors.dark.card : '#fff' }]}>
            <View style={[styles.formRow, !layout.isTablet && styles.formRowStack]}>
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>First Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Surname *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder="Enter surname"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {event.ticketTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Ticket Type</Text>
                <View style={styles.optionRow}>
                  {event.ticketTypes.map(t => (
                    <Pressable
                      key={t}
                      onPress={() => {
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                        setTicketType(t);
                      }}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor: ticketType === t ? Colors.primary : isDark ? Colors.dark.card : Colors.gray100,
                        },
                      ]}
                    >
                      <Text style={[styles.optionText, { color: ticketType === t ? '#fff' : colors.text }]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {event.attendanceTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Attendance</Text>
                <View style={styles.optionRow}>
                  {event.attendanceTypes.map(a => (
                    <Pressable
                      key={a}
                      onPress={() => {
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                        setAttendanceType(a);
                      }}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor: attendanceType === a ? Colors.accentBlue : isDark ? Colors.dark.card : Colors.gray100,
                        },
                      ]}
                    >
                      <Text style={[styles.optionText, { color: attendanceType === a ? '#fff' : colors.text }]}>{a}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitButton, { backgroundColor: Colors.primary, opacity: isSubmitting ? 0.7 : 1 }]}
            >
              {isSubmitting ? (
                <Text style={styles.submitText}>Registering...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.submitText}>Complete Registration</Text>
                </>
              )}
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  orbPrimary: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(106,71,205,0.13)',
  },
  orbSecondary: {
    position: 'absolute',
    bottom: 140,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(70,130,180,0.1)',
  },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
  eventSummary: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 12,
  },
  eventName: { fontSize: 20, fontFamily: fontFamily.bold },
  eventDate: { fontSize: 13, fontFamily: fontFamily.regular },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  formRow: { flexDirection: 'row', gap: 12 },
  formRowStack: { flexDirection: 'column', gap: 16 },
  formField: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontFamily: fontFamily.semiBold, marginLeft: 4 },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, fontSize: 14, fontFamily: fontFamily.regular },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionChip: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  optionText: { fontSize: 14, fontFamily: fontFamily.semiBold },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 14 },
  successIcon: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 24, fontFamily: fontFamily.extraBold },
  successSubtitle: { fontSize: 14, fontFamily: fontFamily.regular, textAlign: 'center', lineHeight: 20 },
  successDetail: { fontSize: 13, fontFamily: fontFamily.medium },
  doneButton: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 16 },
  doneButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
});
