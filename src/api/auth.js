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

export { telegramAuth };
