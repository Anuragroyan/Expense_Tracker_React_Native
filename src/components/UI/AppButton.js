import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import colors from '../../constants/colors';

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  secondary = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        secondary && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={secondary ? colors.accent : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            secondary && styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },

  disabledButton: {
    opacity: 0.5,
  },

  text: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  secondaryText: {
    color: colors.accent,
  },
});

export default AppButton;