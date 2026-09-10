import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../../constants/colors';

const ChatMessage = ({ message, isUser }) => {
  return (
    <View
      style={[
        styles.container,
        isUser
          ? styles.userContainer
          : styles.botContainer,
      ]}
    >
      <View
        style={[
          styles.message,
          isUser
            ? styles.userMessage
            : styles.botMessage,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser
              ? styles.userText
              : styles.botText,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  botContainer: {
    alignItems: 'flex-start',
  },

  message: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  userMessage: {
    backgroundColor: colors.accent,
  },

  botMessage: {
    backgroundColor: colors.card,
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
  },

  userText: {
    color: colors.primary,
  },

  botText: {
    color: colors.textDark,
  },
});

export default ChatMessage;