import axios from 'axios';

const api = axios.create({
  baseURL: 'https://polya-top-bot-backend.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('DEBUG: API REQUEST', config);
  return config;
});

// Response interceptor для обработки ошибок авторизации
api.interceptors.response.use(
  response => {
    console.log('DEBUG: API RESPONSE', response);
    return response;
  },
  error => {
    console.log('DEBUG: API ERROR', error);
    if (error.response?.status === 401) {
      // Удаляем токены при ошибке авторизации
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      
      // Если не на странице логина, перенаправляем туда
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;