import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { storage } from '@/utils/Storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { Message, Role } from '@/utils/Interfaces';
import MessageIdeas from '@/components/MessageIdeas';
import { addChat, addMessage, getMessages } from '@/utils/Database';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Ionicons } from '@expo/vector-icons';
import { DOMAINS } from '@/constants/config';
import { askAuto, askDomain } from '@/services/api';

const DOMAIN_ITEMS = [
  { key: 'auto', title: 'Auto-route', icon: 'sparkles' },
  ...DOMAINS.map((d) => ({ key: d.name, title: d.label, icon: 'server' })),
];

const ChatPage = () => {
  const [selectedDomain, setSelectedDomain] = useMMKVString('cooperDomain', storage);
  const [height, setHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const db = useSQLiteContext();
  let { id, domain: paramDomain } = useLocalSearchParams<{ id: string; domain?: string }>();

  // If navigated from domain explorer, pre-select that domain
  useEffect(() => {
    if (paramDomain) {
      setSelectedDomain(paramDomain);
    }
  }, [paramDomain]);

  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);
  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  useEffect(() => {
    if (id) {
      getMessages(db, parseInt(id)).then((res) => {
        setMessages(res);
      });
    }
  }, [id]);

  const onDomainChange = (domain: string) => {
    setSelectedDomain(domain);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height / 2);
  };

  const getCompletion = async (text: string) => {
    if (loading) return;

    // Create chat in DB on first message
    if (messages.length === 0) {
      const res = await addChat(db, text);
      const chatID = res.lastInsertRowId;
      setChatId(chatID.toString());
      addMessage(db, chatID, { content: text, role: Role.User });
    } else if (chatIdRef.current) {
      addMessage(db, parseInt(chatIdRef.current), { content: text, role: Role.User });
    }

    setMessages((prev) => [
      ...prev,
      { role: Role.User, content: text },
      { role: Role.Bot, content: '…', loading: true },
    ]);
    setLoading(true);

    try {
      const domain = selectedDomain || 'auto';
      let responseText: string;
      let responseDomain: string;

      if (domain === 'auto') {
        const result = await askAuto(text);
        responseText = result.response;
        responseDomain = Array.isArray(result.domains) ? result.domains.join(', ') : '';
      } else {
        const result = await askDomain(domain, text);
        responseText = result.response;
        responseDomain = result.domain;
      }

      const botContent = responseDomain
        ? `**[${responseDomain}]**\n\n${responseText}`
        : responseText;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: Role.Bot, content: botContent };
        return updated;
      });

      // Save bot response to DB
      if (chatIdRef.current) {
        addMessage(db, parseInt(chatIdRef.current), {
          content: botContent,
          role: Role.Bot,
        });
      }
    } catch (err: any) {
      const errorMsg = `Error: ${err.message || 'Failed to get response'}`;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: Role.Bot, content: errorMsg };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const currentDomain = selectedDomain || 'auto';
  const domainLabel = currentDomain === 'auto'
    ? 'Auto'
    : DOMAINS.find((d) => d.name === currentDomain)?.label || currentDomain;

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="COOPER"
              items={DOMAIN_ITEMS}
              onSelect={onDomainChange}
              selected={domainLabel}
            />
          ),
        }}
      />
      <View style={styles.page} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Ionicons name="chatbubbles" size={30} color="#fff" />
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}>
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  page: {
    flex: 1,
  },
});
export default ChatPage;
