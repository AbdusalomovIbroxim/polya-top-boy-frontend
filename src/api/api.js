import axios from 'axios';
import { setAuthState, clearAuthState, refreshToken } from './auth.js';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://polya-top-bot-backend.onrender.com/api/',
  timeout: 10000,
});

// --- AXIOS INTERCEPTORS ---
api.interceptors.request.use(
  config => {
    const access = localStorage.getItem('access');
    if (access) {
      config.headers['Authorization'] = `Bearer ${access}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пробуем обновить токен
        const newAccess = await refreshToken();
        if (newAccess) {
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен - очищаем состояние и редиректим
        clearAuthState();
        window.location.hash = '#/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };