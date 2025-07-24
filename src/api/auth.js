import api from './api';

async function telegramAuth(initData) {
  try {
    const response = await api.post('telegram_auth/', { init_data: initData });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getCurrentUser(initData) {
  try {
    const response = await api.get('users/me/', {
      params: { init_data: initData }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { telegramAuth, getCurrentUser };
