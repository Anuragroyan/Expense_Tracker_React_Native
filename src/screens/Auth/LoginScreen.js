import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {login, clearAuthError} from '../../store/slices/authSlice';

import colors from '../../constants/colors';

function LoginScreen({navigation}) {
  const dispatch = useDispatch();

  const {loading, error} = useSelector(
    state => state.auth,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Error',
        'Email and password are required.',
      );
      return;
    }

    dispatch(clearAuthError());

    const result = await dispatch(
      login({
        email: email.trim(),
        password,
      }),
    );

    if (login.fulfilled.match(result)) {
      // No navigation.replace() here.
      //
      // RootNavigator detects:
      // isAuthenticated = true
      //
      // and automatically shows AppNavigator.
      return;
    }

    if (login.rejected.match(result)) {
      Alert.alert(
        'Login Failed',
        result.payload ||
          'Unable to login. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>💰</Text>

          <Text style={styles.title}>
            Expense Tracker
          </Text>

          <Text style={styles.subtitle}>
            Manage your expenses easily
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Welcome Back
          </Text>

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={colors.primary}
              />
            ) : (
              <Text style={styles.buttonText}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.accountText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Register')
              }
            >
              <Text style={styles.registerText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 54,
    marginBottom: 10,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D1C4E9',
    fontSize: 15,
    marginTop: 6,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },

  heading: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  label: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 52,
    color: colors.textDark,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
  },

  button: {
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  accountText: {
    color: colors.textDark,
    fontSize: 14,
  },

  registerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});