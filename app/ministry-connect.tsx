import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";
import { useTheme } from "@/lib/useTheme";
import { MINISTRY_INFO } from "@/lib/ministry-data";

const pastorAvatar = require("@/assets/new/pastor.jpeg") as number;

// ── Conversation data ─────────────────────────────────────────────────────────

type StepKey = "menu" | "midwives" | "counseling" | "info" | "contact" | "schedule";

interface BotMessage {
  text: string;
  delay: number;
}

interface QuickReply {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  step: StepKey;
}

interface ActionButton {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: "whatsapp" | "email" | "website" | "navigate";
  target?: string;
}

interface Step {
  messages: BotMessage[];
  quickReplies?: QuickReply[];
  actions?: ActionButton[];
  backTo?: StepKey;
}

const WHATSAPP = MINISTRY_INFO.socialMedia.whatsapp;
const EMAIL = `mailto:${MINISTRY_INFO.email}`;
const WEBSITE = MINISTRY_INFO.website;

const STEPS: Record<StepKey, Step> = {
  menu: {
    messages: [
      { text: "Sawubona! I'm your Hope In Christ ministry guide 🙏", delay: 0 },
      {
        text: "I can help you connect with the ministry, join our WhatsApp groups, seek counsel, or learn more about who we are.",
        delay: 900,
      },
      { text: "What would you like to do today?", delay: 1700 },
    ],
    quickReplies: [
      { label: "Join 4AM Midwives Group", icon: "time-outline", step: "midwives" },
      { label: "Seek Counseling or Prayer", icon: "heart-outline", step: "counseling" },
      { label: "About the Ministry", icon: "information-circle-outline", step: "info" },
      { label: "Contact Pastor Thabo", icon: "person-outline", step: "contact" },
      { label: "Service Times & Schedule", icon: "calendar-outline", step: "schedule" },
    ],
  },

  midwives: {
    messages: [
      {
        text: "The 4AM Midwives in the Labour Ward is our early morning prayer group — one of the most powerful in the ministry.",
        delay: 0,
      },
      {
        text: "Members commit to praying at 4:00 AM daily, standing in the gap like midwives in spiritual labour — interceding for souls, families, nations, and breakthrough.",
        delay: 1000,
      },
      {
        text: "This is not a casual group. It requires dedication. But if God is calling you to intercede, this is your place.",
        delay: 2100,
      },
      {
        text: "To join, send a WhatsApp message to Pastor Thabo and mention you'd like to join the 4AM Midwives group:",
        delay: 3000,
      },
    ],
    actions: [
      { label: "Join via WhatsApp", icon: "logo-whatsapp", action: "whatsapp", target: WHATSAPP + "?text=Hello%20Pastor%20Thabo%2C%20I%20would%20like%20to%20join%20the%204AM%20Midwives%20group." },
    ],
    backTo: "menu",
  },

  counseling: {
    messages: [
      {
        text: "Pastor Thabo Boshomane and our ministry team offer confidential spiritual counseling and prayer support.",
        delay: 0,
      },
      {
        text: "Whether you're walking through a personal challenge, need healing, want to grow deeper in your faith, or simply need someone to pray with you — we are here.",
        delay: 1100,
      },
      {
        text: "Reach out to us in whichever way is most comfortable for you:",
        delay: 2100,
      },
    ],
    actions: [
      { label: "WhatsApp Pastor Thabo", icon: "logo-whatsapp", action: "whatsapp", target: WHATSAPP + "?text=Hello%20Pastor%20Thabo%2C%20I%20would%20like%20to%20seek%20counsel%20or%20prayer%20support." },
      { label: "Send an Email", icon: "mail-outline", action: "email", target: EMAIL },
    ],
    backTo: "menu",
  },

  info: {
    messages: [
      {
        text: "Hope In Christ for All Nations Ministries was established on 18 October 2015 by Pastor Thabo Boshomane.",
        delay: 0,
      },
      {
        text: "Our mission: Winning, Discipling, Imparting and Sending — all to the glory of God. We are located at 824 Simunye Street, KwaMhlanga, Mpumalanga.",
        delay: 1000,
      },
      {
        text: "Pastor Thabo is also a Life Coach and NLP Practitioner who believes every person can become the best of who God intended for them.",
        delay: 2100,
      },
      {
        text: "You can visit our website or connect on social media:",
        delay: 3000,
      },
    ],
    actions: [
      { label: "Visit Our Website", icon: "globe-outline", action: "website", target: WEBSITE },
      { label: "WhatsApp Us", icon: "logo-whatsapp", action: "whatsapp", target: WHATSAPP },
    ],
    backTo: "menu",
  },

  contact: {
    messages: [
      {
        text: "Pastor Thabo Boshomane is available to connect with you. Here are the best ways to reach him:",
        delay: 0,
      },
      {
        text: "📍 824 Simunye Street, Mountainview Zone 02, KwaMhlanga\n🕐 Office Hours: 07:30–17:00\n📧 Pastorthabo@hicfanm.org",
        delay: 900,
      },
    ],
    actions: [
      { label: "WhatsApp", icon: "logo-whatsapp", action: "whatsapp", target: WHATSAPP },
      { label: "Email", icon: "mail-outline", action: "email", target: EMAIL },
      { label: "Our Website", icon: "globe-outline", action: "website", target: WEBSITE },
    ],
    backTo: "menu",
  },

  schedule: {
    messages: [
      { text: "Here's when we gather:", delay: 0 },
      {
        text: "🕓 Daily (4AM) — Online Devotion\n☀️ Sunday (10:00–12:30) — Main Service + Power Hour\n📖 Wednesday (18:30) — Bible Study & Fasting\n🔥 Friday (18:30) — Youth Service\n🙏 Saturday (18:00) — Intercession",
        delay: 800,
      },
      {
        text: "We'd love to have you join us! You can view the full 2026 ministry calendar in the app.",
        delay: 1700,
      },
    ],
    actions: [
      { label: "View Full Calendar", icon: "calendar-outline", action: "navigate", target: "schedule" },
      { label: "WhatsApp Us", icon: "logo-whatsapp", action: "whatsapp", target: WHATSAPP },
    ],
    backTo: "menu",
  },
};

// ── Message bubble ────────────────────────────────────────────────────────────

function BotBubble({
  text,
  visible,
  isDark,
  colors,
}: {
  text: string;
  visible: boolean;
  isDark: boolean;
  colors: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.botRow, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.botAvatar}>
        <Image source={pastorAvatar} style={styles.botAvatarImg} contentFit="cover" />
      </View>
      <View
        style={[
          styles.botBubble,
          { backgroundColor: isDark ? Colors.dark.card : "#fff" },
        ]}
      >
        <Text style={[styles.botText, { color: colors.text }]}>{text}</Text>
      </View>
    </Animated.View>
  );
}

function UserBubble({ text }: { text: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.userRow, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={[Colors.primary, Colors.accentBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.userBubble}
      >
        <Text style={styles.userText}>{text}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

interface ConversationEntry {
  id: string;
  type: "bot" | "user";
  text: string;
}

export default function MinistryConnectScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState<StepKey>("menu");
  const [messages, setMessages] = useState<ConversationEntry[]>([]);
  const [shownBotCount, setShownBotCount] = useState(0);
  const [showReplies, setShowReplies] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  // Load the first step on mount
  useEffect(() => {
    loadStep("menu", null);
  }, []);

  const loadStep = useCallback((step: StepKey, userLabel: string | null) => {
    const stepData = STEPS[step];
    setCurrentStep(step);
    setShowReplies(false);
    setIsTyping(true);
    setShownBotCount(0);

    const newEntries: ConversationEntry[] = [];
    if (userLabel) {
      newEntries.push({ id: `user-${Date.now()}`, type: "user", text: userLabel });
    }

    setMessages((prev) => [...prev, ...newEntries]);

    // Reveal bot messages one by one
    stepData.messages.forEach((msg, i) => {
      setTimeout(() => {
        setShownBotCount(i + 1);
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}-${i}`, type: "bot", text: msg.text },
        ]);
        if (i === stepData.messages.length - 1) {
          setIsTyping(false);
          setTimeout(() => setShowReplies(true), 300);
        }
      }, msg.delay + (userLabel ? 400 : 0));
    });
  }, []);

  const handleReply = useCallback(
    (reply: QuickReply) => {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      loadStep(reply.step, reply.label);
    },
    [loadStep],
  );

  const handleAction = useCallback((action: ActionButton) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action.action === "navigate" && action.target === "schedule") {
      router.push("/schedule");
      return;
    }
    if (action.target) Linking.openURL(action.target);
  }, []);

  const handleBack = useCallback(() => {
    const step = STEPS[currentStep];
    if (step.backTo) loadStep(step.backTo, "← Back to main menu");
  }, [currentStep, loadStep]);

  const stepData = STEPS[currentStep];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={["rgba(74,35,90,0.15)", "rgba(36,113,163,0.07)", "transparent"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === "web" ? 0 : insets.top) + 8,
            backgroundColor: isDark
              ? "rgba(13,13,30,0.92)"
              : "rgba(255,255,255,0.94)",
            borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarWrap}>
            <Image source={pastorAvatar} style={styles.headerAvatar} contentFit="cover" />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={[styles.headerName, { color: colors.text }]}>Hope In Christ</Text>
            <Text style={[styles.headerStatus, { color: Colors.primary }]}>
              Ministry Connect
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => Linking.openURL(WHATSAPP)}
          style={styles.whatsappBtn}
          hitSlop={8}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.messageArea,
          { paddingBottom: 24 },
        ]}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) =>
          msg.type === "bot" ? (
            <BotBubble
              key={msg.id}
              text={msg.text}
              visible
              isDark={isDark}
              colors={colors}
            />
          ) : (
            <UserBubble key={msg.id} text={msg.text} />
          ),
        )}

        {/* Typing indicator */}
        {isTyping && (
          <View style={styles.botRow}>
            <View style={styles.botAvatar}>
              <Image source={pastorAvatar} style={styles.botAvatarImg} contentFit="cover" />
            </View>
            <View
              style={[
                styles.typingBubble,
                { backgroundColor: isDark ? Colors.dark.card : "#fff" },
              ]}
            >
              <TypingDots />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick replies / actions */}
      {showReplies && !isTyping && (
        <View
          style={[
            styles.replyArea,
            {
              backgroundColor: isDark
                ? "rgba(13,13,30,0.95)"
                : "rgba(255,255,255,0.97)",
              borderTopColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* Quick replies (main menu) */}
          {stepData.quickReplies &&
            stepData.quickReplies.map((reply) => (
              <Pressable
                key={reply.label}
                onPress={() => handleReply(reply)}
                style={({ pressed }) => [
                  styles.quickReply,
                  {
                    backgroundColor: pressed
                      ? Colors.primary + "18"
                      : isDark
                      ? "rgba(255,255,255,0.05)"
                      : "#f7f4fc",
                    borderColor: isDark
                      ? "rgba(91,44,142,0.3)"
                      : "rgba(91,44,142,0.18)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.quickReplyIcon,
                    { backgroundColor: Colors.primary + "18" },
                  ]}
                >
                  <Ionicons name={reply.icon} size={16} color={Colors.primary} />
                </View>
                <Text style={[styles.quickReplyText, { color: colors.text }]}>
                  {reply.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.textSecondary}
                />
              </Pressable>
            ))}

          {/* Action buttons (sub-steps) */}
          {stepData.actions && (
            <View style={styles.actionGroup}>
              {stepData.actions.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() => handleAction(action)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, flex: 1 })}
                >
                  <LinearGradient
                    colors={
                      action.icon === "logo-whatsapp"
                        ? ["#128C7E", "#25D366"]
                        : [Colors.primary, Colors.accentBlue]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtn}
                  >
                    <Ionicons name={action.icon} size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>{action.label}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          )}

          {/* Back button for sub-steps */}
          {stepData.backTo && (
            <Pressable onPress={handleBack} style={styles.backToMenu}>
              <Ionicons name="arrow-back-outline" size={15} color={colors.textSecondary} />
              <Text style={[styles.backToMenuText, { color: colors.textSecondary }]}>
                Back to main menu
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  const anims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const sequence = anims.map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 160),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: -5, duration: 320, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 320, useNativeDriver: true }),
          ]),
        ),
      ]),
    );
    const all = Animated.parallel(sequence);
    all.start();
    return () => all.stop();
  }, []);

  return (
    <View style={styles.dots}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { transform: [{ translateY: anim }] }]}
        />
      ))}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  headerAvatarWrap: { position: "relative" },
  headerAvatar: { width: 38, height: 38, borderRadius: 19 },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#25D366",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  headerName: { fontSize: 15, fontFamily: fontFamily.bold, lineHeight: 19 },
  headerStatus: { fontSize: 11, fontFamily: fontFamily.semiBold },
  whatsappBtn: { padding: 6 },

  messageArea: { paddingHorizontal: 14, paddingTop: 18, gap: 10 },

  botRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "88%" },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    flexShrink: 0,
  },
  botAvatarImg: { width: 30, height: 30 },
  botBubble: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#241063",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  botText: { fontSize: 14, fontFamily: fontFamily.regular, lineHeight: 21 },

  typingBubble: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dots: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },

  userRow: { flexDirection: "row", justifyContent: "flex-end" },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "78%",
  },
  userText: { color: "#fff", fontSize: 14, fontFamily: fontFamily.medium },

  replyArea: {
    paddingHorizontal: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 8,
  },
  quickReply: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickReplyIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  quickReplyText: { flex: 1, fontSize: 14, fontFamily: fontFamily.medium },

  actionGroup: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionBtnText: { color: "#fff", fontSize: 14, fontFamily: fontFamily.bold },

  backToMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  backToMenuText: { fontSize: 13, fontFamily: fontFamily.medium },
});
