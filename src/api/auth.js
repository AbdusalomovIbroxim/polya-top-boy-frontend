import api from './api';

async function telegramAuth(initData) {
  console.log('=== DEBUG: Sending to API ===');
  console.log('initData being sent:', initData);
  console.log('Request payload:', { init_data: initData });
  
  const response = await api.post('telegram_auth/', { init_data: initData });
  return response.data;
}

async function refreshToken(refresh) {
  const response = await api.post('token/refresh/', { refresh });
  return response.data;
}

async function verifyToken(token) {
  const response = await api.post('token/verify/', { token });
  return response.data;
}

export { telegramAuth, refreshToken, verifyToken }; 