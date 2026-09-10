import React, {useState, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import ChatMessage from '../../components/Chatbot/ChatMessage';
import ChatInput from '../../components/Chatbot/ChatInput';

import {sendMessage} from '../../services/chatbotService';

import colors from '../../constants/colors';

const initialMessages = [
  {
    id: '1',
    text: 'Hi! How can I help you with your expenses?',
    isUser: false,
  },
];

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState(
    initialMessages,
  );

  // Reset chat every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setMessages(initialMessages);
      setMessage('');
    }, []),
  );

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: trimmedMessage,
      isUser: true,
    };

    setMessages(previousMessages => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage('');

    try {
      const data = await sendMessage(
        trimmedMessage,
      );

      const botMessage = {
        id: `${Date.now()}-bot`,
        text: data.reply,
        isUser: false,
      };

      setMessages(previousMessages => [
        ...previousMessages,
        botMessage,
      ]);
    } catch (error) {
      console.log(
        'CHATBOT SEND ERROR:',
        error,
      );

      console.log(
        'CHATBOT SEND ERROR RESPONSE:',
        error?.response?.data,
      );

      const errorMessage = {
        id: `${Date.now()}-error`,
        text: "Sorry, I couldn't reach the server. Please try again.",
        isUser: false,
      };

      setMessages(previousMessages => [
        ...previousMessages,
        errorMessage,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Help
        </Text>

        <Text style={styles.subtitle}>
          Expense Tracker Assistant
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatMessage
            message={item.text}
            isUser={item.isUser}
          />
        )}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput
        value={message}
        onChangeText={setMessage}
        onSend={handleSend}
      />
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D1C4E9',
    fontSize: 13,
    marginTop: 4,
  },

  messages: {
    flexGrow: 1,
    paddingVertical: 10,
  },
});