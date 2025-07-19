import api from './api';

export default {
  // Инициализация Telegram Web App
  initTelegramApp() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      return window.Telegram.WebApp;
    }
    return null;
  },

  // Получение данных пользователя от Telegram
  getTelegramUser() {
    if (window.Telegram && window.Telegram.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user || null;
    }
    return null;
  },

  // Получение init_data от Telegram
  getInitData() {
    if (window.Telegram && window.Telegram.WebApp) {
      return window.Telegram.WebApp.initData || '';
    }
    return '';
  },

  // Проверка, что приложение открыто в Telegram
  isTelegramApp() {
    return !!(window.Telegram && window.Telegram.WebApp);
  },

  // Авторизация через Telegram
  async telegramAuth() {
    const initData = this.getInitData();
    
    if (!initData) {
      throw new Error('Telegram init_data not found');
    }

    if (!this.isTelegramApp()) {
      throw new Error('Application must be opened in Telegram');
    }

    try {
      const response = await api.post('telegram-auth/telegram_auth/', {
        init_data: initData
      });

      const { access, refresh, user } = response.data;
      
      // Сохраняем токены и данные пользователя
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error('Telegram auth error:', error);
      throw error;
    }
  },

  // Обновление токена
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    try {
      const response = await api.post('token/refresh/', {
        refresh: refreshToken
      });

      const { access } = response.data;
      localStorage.setItem('token', access);

      return access;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Если refresh токен истек, очищаем все данные
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Проверка токена
  async verifyToken() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    try {
      await api.post('token/verify/', {
        token: token
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Выход из системы
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Получение текущего пользователя
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Проверка авторизации
  isAuthenticated() {
    return !!(localStorage.getItem('token') && this.getCurrentUser());
  }
}; 