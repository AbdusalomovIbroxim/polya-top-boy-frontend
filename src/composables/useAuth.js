import { ref } from 'vue';
// import { telegramAuth } from '../api/auth';
import api from '../api/api';

// ЗАКОММЕНТИРОВАННАЯ СТАРАЯ АВТОРИЗАЦИЯ
/*
const user = ref(null);
const isAuth = ref(false);
const authError = ref('');
const debugInfo = ref('');
const isLoading = ref(true);

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || '';
}

export function useAuth() {
  async function authenticate() {
    isLoading.value = true;
    authError.value = '';
    try {
      if (!window.Telegram?.WebApp) {
        authError.value = 'Приложение должно быть запущено через Telegram бота';
        return;
      }
      const initData = getTelegramInitData();
      debugInfo.value = `initData: ${initData}`;
      if (initData) {
        const userProfile = await telegramAuth(initData);
        user.value = userProfile.user;
        isAuth.value = true;
      } else {
        authError.value = 'Нет данных Telegram WebApp (initData пустой).';
      }
    } catch (e) {
      authError.value = e?.response?.data?.error || e.message || 'Ошибка авторизации';
      await logout();
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    isAuth.value = false;
  }

  if (isLoading.value) authenticate();

  return {
    user,
    isAuth,
    authError,
    debugInfo,
    isLoading,
    retryAuth: authenticate,
    logout,
  };
}
*/

// НОВАЯ СИСТЕМА АВТОРИЗАЦИИ
const user = ref(null);
const isAuth = ref(false);
const authError = ref('');
const isLoading = ref(false);

export function useAuth() {
  // Авторизация пользователя
  async function login(loginData) {
    isLoading.value = true;
    authError.value = '';
    try {
      const response = await api.post('auth/login/', loginData);
      user.value = response.data.user;
      isAuth.value = true;
      return response.data;
    } catch (error) {
      authError.value = error.response?.data?.message || 'Ошибка авторизации';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Регистрация пользователя
  async function register(userData) {
    isLoading.value = true;
    authError.value = '';
    try {
      const response = await api.post('auth/register/', userData);
      user.value = response.data.user;
      isAuth.value = true;
      return response.data;
    } catch (error) {
      authError.value = error.response?.data?.message || 'Ошибка регистрации';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Выход пользователя
  async function logout() {
    isLoading.value = true;
    try {
      await api.post('auth/logout/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      user.value = null;
      isAuth.value = false;
      isLoading.value = false;
    }
  }

  // Получение текущего пользователя
  async function getCurrentUser() {
    isLoading.value = true;
    try {
      const response = await api.get('users/me/');
      user.value = response.data;
      isAuth.value = true;
      return response.data;
    } catch (error) {
      user.value = null;
      isAuth.value = false;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Проверка авторизации при загрузке
  async function checkAuth() {
    if (localStorage.getItem('token')) {
      try {
        await getCurrentUser();
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }

  // Инициализация при загрузке
  checkAuth();

  return {
    user,
    isAuth,
    authError,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
    checkAuth,
  };
}