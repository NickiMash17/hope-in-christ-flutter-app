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
import { useEvent } from '@/lib/db';
import { useResponsiveLayout } from '@/lib/layout';

export default function RegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
  const cardDivider = { backgroundColor: colors.border };
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const { data: event, isLoading } = useEvent(id ?? '');

  const ticketTypes = ['General'];
  const attendanceTypes = event?.is_online ? ['In-Person', 'Online'] : ['In-Person'];

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ticketType, setTicketType] = useState('General');
  const [attendanceType, setAttendanceType] = useState('In-Person');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navBar = (
    <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.navTitle, { color: colors.text }]}>Register</Text>
      <View style={{ width: 36 }} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {navBar}
        <View style={styles.emptyState}>
          <Ionicons name="refresh" size={32} color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {navBar}
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
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
        <LinearGradient
          colors={['rgba(74,35,90,0.14)', 'rgba(36,113,163,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.atmosphere}
        />
        <View style={styles.orbPrimary} />
        <View
          style={[
            styles.successContainer,
            layout.narrowWidthStyle,
            { paddingHorizontal: layout.horizontalPadding },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accentBlue]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.successIcon}
          >
            <Ionicons name="checkmark" size={52} color="#fff" />
          </LinearGradient>
          <Text style={[styles.successTitle, { color: colors.text }]}>Registration Complete!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            You have been registered for {event.title}. We look forward to seeing you there!
          </Text>
          <LinearGradient colors={['#1a0f2e', '#0d1a3a']} style={styles.successDetailCard}>
            <Ionicons name="calendar-outline" size={15} color={Colors.gold} />
            <Text style={styles.successDetail}>
              {new Date(event.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} at {event.time ?? 'TBA'}
            </Text>
          </LinearGradient>
          <Pressable onPress={() => router.back()} style={styles.doneButton}>
            <LinearGradient
              colors={[Colors.primary, Colors.accentBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneGradient}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </LinearGradient>
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
      {navBar}

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
          <LinearGradient colors={['#1a0f2e', '#0d1a3a']} style={styles.eventSummary}>
            <View style={styles.eventSummaryInner}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.eventSummaryBar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventName}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.time}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient colors={['#1a0f2e', '#0d1a3a']} style={styles.form}>
            <View style={[styles.formRow, !layout.isTablet && styles.formRowStack]}>
              <View style={styles.formField}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter first name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  selectionColor={Colors.primary}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Surname *</Text>
                <TextInput
                  style={styles.input}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder="Enter surname"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  selectionColor={Colors.primary}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="phone-pad"
                selectionColor={Colors.primary}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={Colors.primary}
              />
            </View>

            {ticketTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={styles.label}>Ticket Type</Text>
                <View style={styles.optionRow}>
                  {ticketTypes.map((t: string) => (
                    <Pressable
                      key={t}
                      onPress={() => {
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                        setTicketType(t);
                      }}
                      style={[
                        styles.optionChip,
                        ticketType === t && styles.optionChipActive,
                      ]}
                    >
                      <Text style={[styles.optionText, { color: ticketType === t ? '#fff' : 'rgba(255,255,255,0.55)' }]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {attendanceTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={styles.label}>Attendance</Text>
                <View style={styles.optionRow}>
                  {attendanceTypes.map((a: string) => (
                    <Pressable
                      key={a}
                      onPress={() => {
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                        setAttendanceType(a);
                      }}
                      style={[
                        styles.optionChip,
                        attendanceType === a && styles.optionChipActiveBlue,
                      ]}
                    >
                      <Text style={[styles.optionText, { color: attendanceType === a ? '#fff' : 'rgba(255,255,255,0.55)' }]}>{a}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <Pressable onPress={handleSubmit} disabled={isSubmitting} style={[styles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <Text style={styles.submitText}>Registering...</Text>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.submitText}>Complete Registration</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </LinearGradient>
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  eventSummaryInner: { flexDirection: 'row', alignItems: 'stretch', gap: 14, padding: 16 },
  eventSummaryBar: { width: 4, borderRadius: 2 },
  eventName: { fontSize: 18, fontFamily: fontFamily.bold, color: '#fff', marginBottom: 4 },
  eventDate: { fontSize: 13, fontFamily: fontFamily.regular, color: 'rgba(255,255,255,0.55)' },
  form: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    padding: 16,
    gap: 16,
  },
  formRow: { flexDirection: 'row', gap: 12 },
  formRowStack: { flexDirection: 'column', gap: 16 },
  formField: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontFamily: fontFamily.semiBold, color: 'rgba(255,255,255,0.6)', marginLeft: 4 },
  input: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, fontSize: 14, fontFamily: fontFamily.regular,
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionChip: {
    flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  optionChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionChipActiveBlue: { backgroundColor: Colors.accentBlue, borderColor: Colors.accentBlue },
  optionText: { fontSize: 14, fontFamily: fontFamily.semiBold },
  submitButton: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  successIcon: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 24, fontFamily: fontFamily.extraBold },
  successSubtitle: { fontSize: 14, fontFamily: fontFamily.regular, textAlign: 'center', lineHeight: 20 },
  successDetailCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  successDetail: { fontSize: 13, fontFamily: fontFamily.medium, color: 'rgba(255,255,255,0.75)' },
  doneButton: { borderRadius: 14, overflow: 'hidden', marginTop: 8, alignSelf: 'stretch' },
  doneGradient: { paddingHorizontal: 40, paddingVertical: 14, alignItems: 'center' },
  doneButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
});
