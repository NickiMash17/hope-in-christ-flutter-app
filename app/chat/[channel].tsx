import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
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
import { ChatMessage } from '@/lib/data';
import { useResponsiveLayout } from '@/lib/layout';

const CHANNEL_INFO: Record<string, { name: string; color: string }> = {
  prayer: { name: 'Prayer Requests', color: Colors.primary },
  general: { name: 'General Chat', color: Colors.accentBlue },
};

const PROFANITY_LIST = ['damn', 'hell', 'crap'];

function filterProfanity(text: string): string {
  let filtered = text;
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}

function MessageBubble({ message, isOwn, colors, isDark }: { message: ChatMessage; isOwn: boolean; colors: any; isDark: boolean }) {
  const channelColor = CHANNEL_INFO[message.channel]?.color || Colors.primary;

  return (
    <View style={[styles.bubbleContainer, isOwn ? styles.bubbleRight : styles.bubbleLeft]}>
      {!isOwn && (
        <View style={[styles.avatar, { backgroundColor: channelColor + '20' }]}>
          <Text style={[styles.avatarText, { color: channelColor }]}>{message.nickname[0]?.toUpperCase()}</Text>
        </View>
      )}
      <View style={[
        styles.bubble,
        isOwn
          ? { backgroundColor: channelColor }
          : { backgroundColor: isDark ? Colors.dark.card : Colors.gray100 },
      ]}>
        {!isOwn && <Text style={[styles.bubbleNickname, { color: channelColor }]}>{message.nickname}</Text>}
        <Text style={[styles.bubbleText, { color: isOwn ? '#fff' : colors.text }]}>{message.text}</Text>
        <Text style={[styles.bubbleTime, { color: isOwn ? 'rgba(255,255,255,0.6)' : colors.textSecondary }]}>
          {new Date(message.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { channel } = useLocalSearchParams<{ channel: string }>();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const layout = useResponsiveLayout();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [showNicknameInput, setShowNicknameInput] = useState(true);
  const [nicknameText, setNicknameText] = useState('');

  const info = CHANNEL_INFO[channel || ''] || { name: 'Chat', color: Colors.primary };

  useEffect(() => {
    loadNickname();
    loadMessages();
  }, [channel]);

  const loadNickname = async () => {
    try {
      const saved = await AsyncStorage.getItem('chat_nickname');
      if (saved) {
        setNickname(saved);
        setShowNicknameInput(false);
      }
    } catch {}
  };

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem(`chat_${channel}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {}
  };

  const saveNickname = async () => {
    if (!nicknameText.trim()) return;
    const name = nicknameText.trim();
    await AsyncStorage.setItem('chat_nickname', name);
    setNickname(name);
    setShowNicknameInput(false);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || !nickname) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      channel: channel || 'general',
      nickname,
      text: filterProfanity(inputText.trim()),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');

    try {
      await AsyncStorage.setItem(`chat_${channel}`, JSON.stringify(updatedMessages));
    } catch {}
  }, [inputText, nickname, messages, channel]);

  const handleReport = (messageId: string) => {
    Alert.alert('Report Message', 'This message has been flagged for review. Thank you for helping keep our community safe.');
  };

  if (showNicknameInput) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={['rgba(74,35,90,0.16)', 'rgba(36,113,163,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.atmosphere}
        />
        <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.navTitle, { color: colors.text }]}>{info.name}</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.nicknameContainer}>
          <View style={[layout.narrowWidthStyle, { width: '100%', alignItems: 'center' }]}>
          <View style={[styles.nicknameIcon, { backgroundColor: info.color + '15' }]}>
            <Ionicons name="person-circle-outline" size={48} color={info.color} />
          </View>
          <Text style={[styles.nicknameTitle, { color: colors.text }]}>Enter Your Name</Text>
          <Text style={[styles.nicknameSubtitle, { color: colors.textSecondary }]}>
            Choose a display name for the community chat
          </Text>
          <TextInput
            style={[styles.nicknameInput, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
            placeholder="Your display name"
            placeholderTextColor={colors.textSecondary}
            value={nicknameText}
            onChangeText={setNicknameText}
            autoFocus
            maxLength={20}
          />
          <Pressable
            onPress={saveNickname}
            style={[styles.nicknameButton, { backgroundColor: info.color, opacity: nicknameText.trim() ? 1 : 0.5 }]}
            disabled={!nicknameText.trim()}
          >
            <Text style={styles.nicknameButtonText}>Join Chat</Text>
          </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(74,35,90,0.16)', 'rgba(36,113,163,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmosphere}
      />
      <View style={[styles.navBar, { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>{info.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[layout.maxWidthStyle, { flex: 1, width: '100%' }]}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable onLongPress={() => handleReport(item.id)}>
                <MessageBubble message={item} isOwn={item.nickname === nickname} colors={colors} isDark={isDark} />
              </Pressable>
            )}
            contentContainerStyle={[styles.messagesList, { paddingBottom: 8, paddingHorizontal: layout.horizontalPadding }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.textSecondary} />
                <Text style={[styles.emptyChatText, { color: colors.textSecondary }]}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />

          <View
            style={[
              styles.inputBar,
              {
                backgroundColor: isDark ? Colors.dark.surface : '#fff',
                paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom || 8,
                paddingHorizontal: layout.horizontalPadding,
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(91,44,142,0.12)',
              },
            ]}
          >
            <TextInput
              style={[styles.chatInput, { backgroundColor: isDark ? Colors.dark.card : Colors.gray100, color: colors.text }]}
              placeholder={channel === 'prayer' ? 'Share a prayer request...' : 'Type a message...'}
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={sendMessage}
              style={[styles.sendButton, { backgroundColor: info.color, opacity: inputText.trim() ? 1 : 0.4 }]}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, flex: 1, textAlign: 'center' },
  messagesList: { paddingTop: 8, flexGrow: 1 },
  bubbleContainer: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end', gap: 8 },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontFamily: fontFamily.bold },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  bubbleNickname: { fontSize: 11, fontFamily: fontFamily.bold, marginBottom: 2 },
  bubbleText: { fontSize: 14, fontFamily: fontFamily.regular, lineHeight: 20 },
  bubbleTime: { fontSize: 10, fontFamily: fontFamily.regular, marginTop: 4, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  chatInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    maxHeight: 100,
  },
  sendButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyChatText: { fontSize: 14, fontFamily: fontFamily.medium, textAlign: 'center', paddingHorizontal: 40 },
  nicknameContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  nicknameIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  nicknameTitle: { fontSize: 22, fontFamily: fontFamily.bold },
  nicknameSubtitle: { fontSize: 14, fontFamily: fontFamily.regular, textAlign: 'center', lineHeight: 20 },
  nicknameInput: { width: '100%', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, fontSize: 16, fontFamily: fontFamily.medium, textAlign: 'center', marginTop: 8 },
  nicknameButton: { width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  nicknameButtonText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
});
