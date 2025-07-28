import { ref } from 'vue';
import { getCurrentUser, isAuthenticated, setAuthState } from '../api/auth.js';
import { api } from '../api/api.js';

const isAuth = ref(isAuthenticated());
const isLoading = ref(true);
const user = ref(null);
const authError = ref('');

async function checkAuth() {
  isLoading.value = true;
  try {
    const u = await getCurrentUser();
    user.value = u;
    isAuth.value = true;
  } catch (e) {
    isAuth.value = false;
    user.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function login(loginData) {
  isLoading.value = true;
  authError.value = '';
  try {
    const response = await api.post('/auth/login/', loginData);
    if (response.data.access) {
      localStorage.setItem('access', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refresh', response.data.refresh);
    }
    setAuthState({ isAuth: true, user: response.data.user });
    user.value = response.data.user;
    isAuth.value = true;
    return response.data;
  } catch (error) {
    authError.value = parseAuthError(error);
    throw error;
  } finally {
    isLoading.value = false;
  }
}

async function register(userData) {
  isLoading.value = true;
  authError.value = '';
  try {
    const response = await api.post('/auth/register/', userData);
    if (response.data.access) {
      localStorage.setItem('access', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refresh', response.data.refresh);
    }
    setAuthState({ isAuth: true, user: response.data.user });
    user.value = response.data.user;
    isAuth.value = true;
    return response.data;
  } catch (error) {
    authError.value = parseAuthError(error);
    throw error;
  } finally {
    isLoading.value = false;
  }
}

async function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  isAuth.value = false;
  user.value = null;
  setAuthState({ isAuth: false, user: null });
  window.location.hash = '#/login';
}

function parseAuthError(error) {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      return Object.values(data).flat().join(' ');
    }
  }
  return 'Ошибка авторизации';
}

export function useAuth() {
  return {
    isAuth,
    isLoading,
    user,
    authError,
    checkAuth,
    login,
    register,
    logout
  };
}

// Инициализация при старте
checkAuth();