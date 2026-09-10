import api from './api';

// ======================================================
// NOTE
// ======================================================
// Assumes your chatbotRoutes.js is mounted like:
//   app.use('/api/chatbot', chatbotRoutes);
// and that `api` (your common axios instance) already has
// the base URL + auth token header configured.
// If your route is mounted under a different path,
// change BASE_PATH below to match.
// ======================================================

const BASE_PATH = '/chatbot';

// ======================================================
// SEND MESSAGE
// ======================================================

export const sendMessage = async message => {
  const response = await api.post(
    BASE_PATH,
    {message},
  );

  return response.data;
};