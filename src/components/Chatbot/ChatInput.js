import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../../constants/colors';

const ChatInput = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask something..."
        placeholderTextColor={colors.placeholder}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onSend}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textDark,
    marginRight: 8,
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default ChatInput;