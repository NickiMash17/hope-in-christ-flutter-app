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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { fontFamily } from '@/lib/fonts';
import { useTheme } from '@/lib/useTheme';
import { useEvent, submitEventRegistration } from '@/lib/db';
import { useResponsiveLayout } from '@/lib/layout';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function RegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const cardColors: [string, string] = isDark ? ['#1a0f2e', '#0d1a3a'] : [colors.card, colors.surface];
  const cardText = { color: colors.text };
  const cardSubText = { color: colors.textSecondary };
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
        <View style={[styles.skeletonPad, { paddingHorizontal: layout.horizontalPadding }]}>
          <SkeletonLoader height={90} borderRadius={18} style={{ marginBottom: 12 }} />
          <SkeletonLoader height={320} borderRadius={18} />
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
      await submitEventRegistration({
        event_id: event.id,
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        ticket_type: ticketType,
        attendance_type: attendanceType,
      });
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
          colors={['rgba(74,35,90,0.18)', 'rgba(36,113,163,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.atmosphere}
        />
        <View style={styles.orbPrimary} />
        <View style={styles.orbSecondary} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 48, paddingTop: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[layout.narrowWidthStyle, { paddingHorizontal: layout.horizontalPadding, alignItems: 'center' }]}>

            {/* Checkmark badge */}
            <LinearGradient
              colors={[Colors.primary, Colors.accentBlue]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={styles.successBadge}
            >
              <View style={styles.successBadgeRing} />
              <Ionicons name="checkmark" size={52} color="#fff" />
            </LinearGradient>

            <Text style={[styles.successHeadline, { color: colors.text }]}>{"You're Registered!"}</Text>
            <Text style={[styles.successGreeting, { color: colors.textSecondary }]}>
              {"Well done, "}{name}{"! Your spot is confirmed.\nWe can't wait to see you there."}
            </Text>

            {/* Event summary card */}
            <LinearGradient
              colors={cardColors}
              style={[styles.successCard, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border, width: '100%' }]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.successCardTopBar}
              />
              <View style={styles.successCardBody}>
                <Text style={[styles.successCardTitle, cardText]}>{event.title}</Text>
                <View style={styles.successRow}>
                  <View style={[styles.successRowIcon, { backgroundColor: Colors.gold + '22' }]}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.gold} />
                  </View>
                  <Text style={[styles.successRowText, cardSubText]}>
                    {new Date(event.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <View style={[styles.successRowIcon, { backgroundColor: Colors.primary + '22' }]}>
                    <Ionicons name="time-outline" size={14} color={Colors.primary} />
                  </View>
                  <Text style={[styles.successRowText, cardSubText]}>{event.time ?? 'TBA'}</Text>
                </View>
                <View style={styles.successRow}>
                  <View style={[styles.successRowIcon, { backgroundColor: Colors.accentBlue + '22' }]}>
                    <Ionicons name="location-outline" size={14} color={Colors.accentBlue} />
                  </View>
                  <Text style={[styles.successRowText, cardSubText]}>{event.location}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Registration details card */}
            <LinearGradient
              colors={cardColors}
              style={[styles.successCard, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border, width: '100%' }]}
            >
              <View style={styles.successCardBody}>
                <Text style={[styles.successCardSectionLabel, { color: Colors.gold }]}>YOUR DETAILS</Text>
                {[
                  { label: 'Name', value: `${name} ${surname}` },
                  { label: 'Email', value: email },
                  { label: 'Ticket', value: ticketType },
                  { label: 'Attendance', value: attendanceType },
                ].map((row, i, arr) => (
                  <React.Fragment key={row.label}>
                    <View style={styles.successDetailRow}>
                      <Text style={[styles.successDetailLabel, cardSubText]}>{row.label}</Text>
                      <Text style={[styles.successDetailValue, cardText]} numberOfLines={1}>{row.value}</Text>
                    </View>
                    {i < arr.length - 1 && (
                      <View style={[styles.successDetailDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.border }]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </LinearGradient>

            {/* Action buttons */}
            <View style={{ width: '100%', gap: 10, marginTop: 4 }}>
              <Pressable
                onPress={() => router.replace({ pathname: '/event/[id]', params: { id: event.id } })}
                style={styles.primaryActionButton}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.accentBlue]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.primaryActionGradient}
                >
                  <Ionicons name="calendar" size={18} color="#fff" />
                  <Text style={styles.primaryActionText}>View Event Details</Text>
                </LinearGradient>
              </Pressable>
              <Pressable
                onPress={() => router.back()}
                style={[styles.secondaryActionButton, { borderColor: isDark ? 'rgba(255,255,255,0.15)' : colors.border }]}
              >
                <Text style={[styles.secondaryActionText, { color: colors.textSecondary }]}>Back to Events</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
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
          <LinearGradient colors={cardColors} style={[styles.eventSummary, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
            <View style={styles.eventSummaryInner}>
              <LinearGradient
                colors={[Colors.primary, Colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.eventSummaryBar}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.eventName, cardText]}>{event.title}</Text>
                <Text style={[styles.eventDate, cardSubText]}>
                  {new Date(event.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.time}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient colors={cardColors} style={[styles.form, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.border }]}>
            <View style={[styles.formRow, !layout.isTablet && styles.formRowStack]}>
              <View style={styles.formField}>
                <Text style={[styles.label, cardSubText]}>First Name *</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter first name"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                  selectionColor={Colors.primary}
                />
              </View>
              <View style={styles.formField}>
                <Text style={[styles.label, cardSubText]}>Surname *</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}
                  value={surname}
                  onChangeText={setSurname}
                  placeholder="Enter surname"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                  selectionColor={Colors.primary}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={[styles.label, cardSubText]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                keyboardType="phone-pad"
                selectionColor={Colors.primary}
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.label, cardSubText]}>Email Address *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={Colors.primary}
              />
            </View>

            {ticketTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={[styles.label, cardSubText]}>Ticket Type</Text>
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
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border },
                        ticketType === t && styles.optionChipActive,
                      ]}
                    >
                      <Text style={[styles.optionText, { color: ticketType === t ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : colors.textSecondary) }]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {attendanceTypes.length > 1 && (
              <View style={styles.formField}>
                <Text style={[styles.label, cardSubText]}>Attendance</Text>
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
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.background, borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border },
                        attendanceType === a && styles.optionChipActiveBlue,
                      ]}
                    >
                      <Text style={[styles.optionText, { color: attendanceType === a ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : colors.textSecondary) }]}>{a}</Text>
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
  successBadge: {
    width: 110, height: 110, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#5B2C8E', shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42, shadowRadius: 22, elevation: 14,
  },
  successBadgeRing: {
    position: 'absolute', width: 134, height: 134, borderRadius: 67,
    borderWidth: 1.5, borderColor: 'rgba(91,44,142,0.28)',
    top: -12, left: -12,
  },
  successHeadline: { fontSize: 28, fontFamily: fontFamily.extraBold, textAlign: 'center', marginBottom: 8 },
  successGreeting: { fontSize: 14, fontFamily: fontFamily.regular, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successCard: {
    borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 12,
    shadowColor: '#241063', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16, shadowRadius: 14, elevation: 6,
  },
  successCardTopBar: { height: 3 },
  successCardBody: { padding: 16, gap: 12 },
  successCardTitle: { fontSize: 17, fontFamily: fontFamily.bold, marginBottom: 2 },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  successRowIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  successRowText: { fontSize: 13, fontFamily: fontFamily.regular, flex: 1, lineHeight: 18 },
  successCardSectionLabel: { fontSize: 10, fontFamily: fontFamily.bold, letterSpacing: 1.2 },
  successDetailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  successDetailDivider: { height: 1 },
  successDetailLabel: { fontSize: 12, fontFamily: fontFamily.regular },
  successDetailValue: { fontSize: 13, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'right', marginLeft: 16 },
  primaryActionButton: { borderRadius: 14, overflow: 'hidden' },
  primaryActionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  primaryActionText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  secondaryActionButton: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  secondaryActionText: { fontSize: 15, fontFamily: fontFamily.semiBold },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, fontFamily: fontFamily.medium },
  skeletonPad: { paddingTop: 24, gap: 0 },
});
