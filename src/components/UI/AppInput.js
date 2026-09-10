import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import colors from '../../constants/colors';

const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.errorInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize="none"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: colors.textDark,
    fontSize: 15,
  },

  multilineInput: {
    height: 100,
    paddingTop: 14,
  },

  errorInput: {
    borderWidth: 1,
    borderColor: colors.error,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppInput;