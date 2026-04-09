import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientText } from '@/styles/global';

const { width, height } = Dimensions.get('window');

type Message = {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
};

type ChatbotProps = {
  navigation?: {
    goBack?: () => void;
  };
};

export default function Chatbot({ navigation }: ChatbotProps) {
  const flatListRef = useRef<FlatList<Message>>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'How can I help you with today?',
    },
    {
      id: '2',
      sender: 'user',
      text: 'I could really use some help',
    },
    {
      id: '3',
      sender: 'assistant',
      text: 'OK. Please describe your problem.',
    },
    {
      id: '4',
      sender: 'user',
      text: 'How do I change the oil on my vehicle?',
    },
    {
      id: '5',
      sender: 'assistant',
      text: 'Warm engine. Lift and secure car. Remove drain plug; drain oil. Replace plug, remove and replace the oil filter, add the correct oil type, then check the level and inspect for leaks.',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = (): void => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    if (isUser) {
      return (
        <View style={[styles.messageRow, styles.userRow]}>
          <LinearGradient
            colors={['#84D2F6', '#386FA4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.messageBubble, styles.userBubble]}
          >
            <Text style={styles.userMessageText}>{item.text}</Text>
          </LinearGradient>
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
          >
            <Ionicons name="chevron-back" size={24} color="#84D2F6" />
          </TouchableOpacity>

          <GradientText style={styles.headerTitle}>
            CarCare Assistant
          </GradientText>
        </View>

        <View style={styles.chatArea}>
          <View pointerEvents="none" style={styles.watermarkContainer}>
            <Text style={styles.watermarkGear}>⚙</Text>
            <Text style={styles.watermarkText}>CarCare</Text>
          </View>

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
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="paper-plane-outline" size={28} color="#386FA4" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#84D2F6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },

  headerTitle: {
    fontFamily: 'Onest',
    fontSize: 28,
    fontWeight: '400',
  },

  chatArea: {
    flex: 1,
    position: 'relative',
  },

  watermarkContainer: {
    position: 'absolute',
    top: height * 0.12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.12,
  },

  watermarkGear: {
    fontSize: width * 0.45,
    color: '#84D2F6',
    lineHeight: width * 0.45,
  },

  watermarkText: {
    marginTop: -10,
    fontSize: 56,
    fontFamily: 'Onest',
    color: '#386FA4',
    fontWeight: '600',
  },

  messagesContent: {
    paddingTop: 4,
    paddingBottom: 16,
  },

  messageRow: {
    width: '100%',
    marginVertical: 8,
  },

  assistantRow: {
    alignItems: 'flex-start',
  },

  userRow: {
    alignItems: 'flex-end',
  },

  messageBubble: {
    maxWidth: '72%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  assistantBubble: {
    backgroundColor: '#DADADA',
  },

  userBubble: {
    backgroundColor: 'transparent',
  },

  assistantMessageText: {
    fontFamily: 'Onest',
    fontSize: 16,
    lineHeight: 22,
    color: '#747474',
  },

  userMessageText: {
    fontFamily: 'Onest',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
  },

  feedbackText: {
    fontFamily: 'Onest',
    fontSize: 15,
    color: '#8D8D8D',
    marginRight: 10,
  },

  feedbackButton: {
    marginHorizontal: 6,
    padding: 2,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    borderWidth: 3,
    borderColor: '#84D2F6',
    borderRadius: 32,
    backgroundColor: '#F8F8F8',
    paddingLeft: 16,
    paddingRight: 10,
  },

  input: {
    flex: 1,
    fontFamily: 'Onest',
    fontSize: 16,
    color: '#444444',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});