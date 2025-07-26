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
    console.log('DEBUG: login called', loginData);
    isLoading.value = true;
    authError.value = '';
    try {
      const response = await api.post('auth/login/', loginData);
      console.log('DEBUG: login response', response);
      user.value = response.data.user;
      isAuth.value = true;
      
      // Сохраняем токены в localStorage
      if (response.data.access) {
        localStorage.setItem('access', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('DEBUG: login error', error);
      authError.value = error.response?.data?.message || 'Ошибка авторизации';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Регистрация пользователя
  async function register(userData) {
    console.log('DEBUG: register called', userData);
    isLoading.value = true;
    authError.value = '';
    try {
      const response = await api.post('auth/register/', userData);
      console.log('DEBUG: register response', response);
      user.value = response.data.user;
      isAuth.value = true;
      
      // Сохраняем токены в localStorage
      if (response.data.access) {
        localStorage.setItem('access', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('DEBUG: register error', error);
      authError.value = error.response?.data?.message || 'Ошибка регистрации';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Выход пользователя
  async function logout() {
    console.log('DEBUG: logout called');
    isLoading.value = true;
    try {
      await api.post('auth/logout/');
      console.log('DEBUG: logout success');
    } catch (error) {
      console.error('DEBUG: logout error', error);
    } finally {
      user.value = null;
      isAuth.value = false;
      // Удаляем токены из localStorage
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      isLoading.value = false;
    }
  }

  // Получение текущего пользователя
  async function getCurrentUser() {
    console.log('DEBUG: getCurrentUser called');
    isLoading.value = true;
    try {
      const response = await api.get('users/me/');
      console.log('DEBUG: getCurrentUser response', response);
      user.value = response.data;
      isAuth.value = true;
      return response.data;
    } catch (error) {
      console.error('DEBUG: getCurrentUser error', error);
      user.value = null;
      isAuth.value = false;
      // Если токен недействителен, удаляем его
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Проверка авторизации при загрузке
  async function checkAuth() {
    console.log('DEBUG: checkAuth called');
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error('DEBUG: checkAuth error', error);
        // Если токен недействителен, очищаем состояние
        user.value = null;
        isAuth.value = false;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }
  }

  // Функция для проверки авторизации в компонентах
  function requireAuth() {
    console.log('DEBUG: requireAuth called, isAuth:', isAuth.value);
    if (!isAuth.value) {
      // Сохраняем текущий путь для возврата после авторизации
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return false;
    }
    return true;
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
    requireAuth,
  };
}