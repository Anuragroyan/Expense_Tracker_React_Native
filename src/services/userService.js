import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');

  return response.data.users || response.data;
};

export const getUserById = async id => {
  const response = await api.get(`/users/${id}`);

  return response.data.user || response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');

  return response.data.user || response.data;
};