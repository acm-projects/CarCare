import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles, GradientText } from "@/styles/global";
import { chatBaseUrl } from "@/lib/chatApi";

const { width, height } = Dimensions.get("window");

type Message = {
  id: string;
  sender: "assistant" | "user";
  text: string;
};

type ChatbotProps = {
  navigation?: {
    goBack?: () => void;
  };
};

function formatChatError(
  status: number,
  raw: string,
  fetchErr: string | null,
): string {
  if (fetchErr) {
    return (
      `Could not reach the chat server at ${chatBaseUrl()}.\n\n` +
      `Start VinChatBotServer on port 8080. On a physical phone, set EXPO_PUBLIC_CHAT_API_URL to your computer’s IP (same Wi‑Fi).\n\n` +
      `Details: ${fetchErr}`
    );
  }
  try {
    const parsed = JSON.parse(raw) as { error?: string };
    const err = (parsed.error ?? raw).trim();
    if (err.includes("OpenAI") || err.toLowerCase().includes("openai")) {
      return (
        `The chat server could not complete the OpenAI request.\n\n` +
        `On the machine running Java: set a valid OPENAI_API_KEY, ensure the account has billing/quota, and that outbound HTTPS to api.openai.com is allowed (no blocking firewall/VPN).\n\n` +
        `Server said: ${err}`
      );
    }
    return `Chat server error (${status}): ${err || raw}`;
  } catch {
    return `Chat server error (${status}): ${raw || "(empty body)"}`;
  }
}

export default function Chatbot({ navigation }: ChatbotProps) {
  const flatListRef = useRef<FlatList<Message>>(null);

  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hi! I'm your personal assistant. What can I help you with today?",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;
    if (isSending) return;

    const userText = input.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setIsSending(true);
    const base = chatBaseUrl();
    try {
      const res = await fetch(`${base}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId }),
      });

      const raw = await res.text();
      if (!res.ok) {
        const text = formatChatError(res.status, raw, null);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), sender: "assistant", text },
        ]);
        return;
      }

      const data = JSON.parse(raw) as { reply?: string; sessionId?: string };
      const replyText =
        (data.reply ?? "").trim() || "Sorry — I could not generate a response.";
      if (data.sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: replyText,
        },
      ]);
    } catch (e) {
      const fetchErr = e instanceof Error ? e.message : String(e);
      const text = formatChatError(0, "", fetchErr);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    if (isUser) {
      return (
        <View style={[styles.messageRow, styles.userRow]}>
          <View style={styles.userShadowWrapper}>
            <LinearGradient
              colors={["#84D2F6", "#386FA4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.userBubble, styles.messageBubble]}
            >
              <Text style={styles.userMessageText}>{item.text}</Text>
            </LinearGradient>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, styles.assistantRow]}>
        <View style={[styles.messageBubble, styles.assistantBubble]}>
          <Text style={styles.assistantMessageText}>{item.text}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <GradientText style={globalStyles.gradientHeader}>
            CarCare Assistant
          </GradientText>
        </View>

        <View style={styles.chatArea}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.feedbackRow}>
          <Text style={styles.feedbackText}>Did this response help?</Text>

          <View style={styles.HStack}>
            <TouchableOpacity style={styles.feedbackButton}>
              <Feather name="thumbs-up" size={24} color="#7F7F7F" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.feedbackButton}>
              <Feather name="thumbs-down" size={24} color="#7F7F7F" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything"
              placeholderTextColor="#8D8D8D"
              value={input}
              onChangeText={setInput}
              editable={!isSending}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={isSending}
            >
              <Ionicons
                name={isSending ? "hourglass-outline" : "paper-plane-outline"}
                size={28}
                color={isSending ? "#8D8D8D" : "#386FA4"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingTop: 10,
    paddingHorizontal: 16,
  },

  header: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#84D2F6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    marginRight: 12,
  },

  headerTitle: {
    fontFamily: "Onest",
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "400",
  },

  chatArea: {
    flex: 1,
    position: "relative",
  },

  messagesContent: {
    paddingTop: 4,
    paddingBottom: 16,
  },

  messageRow: {
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 5,
  },

  assistantRow: {
    alignItems: "flex-start",
  },

  userRow: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "72%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
    elevation: 4,
  },

  userShadowWrapper: {
    maxWidth: "100%",
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
    elevation: 4,
  },

  assistantBubble: {
    backgroundColor: "#ffffff",
  },

  userBubble: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },

  assistantMessageText: {
    fontFamily: "Onest",
    fontSize: 16,
    lineHeight: 22,
    color: "#757575",
  },

  userMessageText: {
    fontFamily: "Onest",
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
    textAlign: "right",
  },

  feedbackRow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    gap: 15,
    marginBottom: 12,
  },

  HStack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  feedbackText: {
    fontFamily: "Onest",
    fontSize: 15,
    color: "#8D8D8D",
    marginRight: 10,
  },

  feedbackButton: {
    marginHorizontal: 6,
    padding: 2,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#8d8d8d",
    borderRadius: 32,
    paddingLeft: 16,
    paddingRight: 10,
  },

  input: {
    flex: 1,
    fontFamily: "Onest",
    fontSize: 16,
    color: "#444444",
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },

  paddingView: {
    paddingBottom: 10,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
});
