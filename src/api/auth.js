import api from './api';

async function telegramAuth(initData) {
  const response = await api.post('/telegram-auth/telegram_auth/', { init_data: initData });
  return response.data;
}

async function refreshToken(refresh) {
  const response = await api.post('/token/refresh/', { refresh });
  return response.data;
}

async function verifyToken(token) {
  const response = await api.post('/token/verify/', { token });
  return response.data;
}

export { telegramAuth, refreshToken, verifyToken }; 