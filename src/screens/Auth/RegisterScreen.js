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

import {
  register,
  clearAuthError,
} from '../../store/slices/authSlice';

import colors from '../../constants/colors';

function RegisterScreen({navigation}) {
  const dispatch = useDispatch();

  const {loading, error} = useSelector(
    state => state.auth,
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        'Error',
        'Please fill in all fields.',
      );
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert(
        'Error',
        'Name must be at least 2 characters.',
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Error',
        'Password must be at least 6 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Error',
        'Passwords do not match.',
      );
      return;
    }

    dispatch(clearAuthError());

    const result = await dispatch(
      register({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    );

    if (register.fulfilled.match(result)) {
      // Do not navigate manually.
      //
      // Redux changes isAuthenticated to true.
      // RootNavigator will automatically
      // display AppNavigator.
      return;
    }

    if (register.rejected.match(result)) {
      Alert.alert(
        'Registration Failed',
        result.payload ||
          'Unable to create account. Please try again.',
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
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Start tracking your expenses
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Register
          </Text>

          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />

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
            placeholder="Enter password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={colors.primary}
              />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.accountText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Login')
              }
            >
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

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
    marginBottom: 25,
  },

  logo: {
    fontSize: 50,
    marginBottom: 8,
  },

  title: {
    color: colors.white,
    fontSize: 27,
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
    marginBottom: 20,
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
    height: 50,
    color: colors.textDark,
    fontSize: 16,
    marginBottom: 15,
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

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  accountText: {
    color: colors.textDark,
    fontSize: 14,
  },

  loginText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});