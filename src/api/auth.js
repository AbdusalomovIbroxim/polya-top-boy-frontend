import api from './api';

async function telegramAuth(initData) {
  console.log('=== DEBUG: Sending to API ===');
  console.log('initData being sent:', initData);
  console.log('initData length:', initData.length);
  console.log('Request payload:', { init_data: initData });
  
  try {
    const response = await api.post('telegram_auth/', { init_data: initData });
    console.log('API response success:', response.data);
    return response.data;
  } catch (error) {
    console.error('API response error:', error);
    console.error('Error response data:', error.response?.data);
    throw error;
  }
}

async function refreshToken(refresh) {
  const response = await api.post('token/refresh/', { refresh });
  return response.data;
}

async function verifyToken(token) {
  const response = await api.post('token/verify/', { token });
  return response.data;
}


async function getCurrentUser(access) {
  const response = await api.post('users/me/', {
    headers: {
      'Authorization': 'Bearer ' + access
    }
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

export { telegramAuth, refreshToken, verifyToken, getCurrentUser }; 