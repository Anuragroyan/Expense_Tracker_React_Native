import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JWT_KEY = 'token';
const USER_KEY = 'user';

// REGISTER
export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });

  const { token, user } = response.data;

  await AsyncStorage.setItem(JWT_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return response.data;
};

// LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const { token, user } = response.data;

  await AsyncStorage.setItem(JWT_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return response.data;
};

// GET CURRENT USER
export const getMe = async () => {
  const response = await api.get('/auth/me');

  const user = response.data.user;

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

// UPDATE PROFILE
export const updateProfile = async (name, email) => {
  const response = await api.put('/auth/profile', {
    name,
    email,
  });

  const user = response.data.user;

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return response.data;
};

// LOGOUT
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    await AsyncStorage.removeItem(JWT_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  }
};

// GET TOKEN
export const getToken = async () => {
  return await AsyncStorage.getItem(JWT_KEY);
};

// GET STORED USER
export const getStoredUser = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};