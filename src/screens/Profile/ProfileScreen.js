import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {
  fetchMe,
  updateUserProfile,
  logout,
  clearAuthError,
} from '../../store/slices/authSlice';

import colors from '../../constants/colors';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const {
    user,
    loading,
    error,
  } = useSelector(state => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        'Error',
        'Name and email are required.',
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

    dispatch(clearAuthError());

    const result = await dispatch(
      updateUserProfile({
        name: name.trim(),
        email: email.trim(),
      }),
    );

    if (
      updateUserProfile.fulfilled.match(result)
    ) {
      setEditing(false);

      Alert.alert(
        'Success',
        'Profile updated successfully.',
      );
    } else {
      Alert.alert(
        'Update Failed',
        result.payload ||
          'Unable to update profile.',
      );
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');

    dispatch(clearAuthError());

    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
          },
        },
      ],
    );
  };

  if (!user && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : '?'}
          </Text>
        </View>

        <Text style={styles.title}>
          Profile
        </Text>

        <Text style={styles.subtitle}>
          Manage your account
        </Text>
      </View>

      {/* PROFILE CARD */}

      <View style={styles.card}>
        <Text style={styles.heading}>
          Personal Information
        </Text>

        {/* NAME */}

        <Text style={styles.label}>
          Name
        </Text>

        <TextInput
          style={[
            styles.input,
            !editing && styles.disabledInput,
          ]}
          value={name}
          onChangeText={setName}
          editable={editing}
          placeholder="Enter your name"
          placeholderTextColor={
            colors.placeholder
          }
        />

        {/* EMAIL */}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={[
            styles.input,
            !editing && styles.disabledInput,
          ]}
          value={email}
          onChangeText={setEmail}
          editable={editing}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your email"
          placeholderTextColor={
            colors.placeholder
          }
        />

        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        {/* EDIT */}

        {!editing ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(clearAuthError());
              setEditing(true);
            }}
          >
            <Text style={styles.buttonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
              ]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color={colors.primary}
                />
              ) : (
                <Text style={styles.buttonText}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ACCOUNT */}

      <View style={styles.card}>
        <Text style={styles.heading}>
          Account
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            User ID
          </Text>

          <Text
            style={styles.infoValue}
            numberOfLines={1}
          >
            {user?.id || user?._id || '-'}
          </Text>
        </View>
      </View>

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            color={colors.white}
          />
        ) : (
          <Text style={styles.logoutText}>
            Logout
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: 'bold',
  },

  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D1C4E9',
    fontSize: 14,
    marginTop: 5,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  heading: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 18,
  },

  label: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.textDark,
    fontSize: 15,
    marginBottom: 15,
  },

  disabledInput: {
    backgroundColor: '#E0DCE8',
  },

  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
  },

  button: {
    flex: 1,
    minHeight: 50,
    backgroundColor: colors.accent,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  cancelText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
  },

  infoValue: {
    color: '#666',
    fontSize: 12,
    maxWidth: '65%',
  },

  logoutButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});