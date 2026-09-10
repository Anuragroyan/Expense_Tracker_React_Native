import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {checkAuth} from '../store/slices/authSlice';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

import colors from '../constants/colors';

const RootNavigator = () => {
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    initialized,
  } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Check stored token/user first
  if (!initialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </View>
    );
  }

  // User is logged in
  if (isAuthenticated) {
    return <AppNavigator />;
  }

  // User is not logged in
  return <AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;