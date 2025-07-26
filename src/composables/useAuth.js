import { ref } from 'vue';
import api from '../api/api';

const user = ref(null);
const isAuth = ref(false);
const authError = ref('');
const isLoading = ref(false);

// --- AUTH API ---
async function login(loginData) {
  isLoading.value = true;
  authError.value = '';
  try {
    const response = await api.post('/auth/login/', loginData);
    if (response.data.access) localStorage.setItem('access', response.data.access);
    if (response.data.refresh) localStorage.setItem('refresh', response.data.refresh);
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
    if (response.data.access) localStorage.setItem('access', response.data.access);
    if (response.data.refresh) localStorage.setItem('refresh', response.data.refresh);
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
  isLoading.value = true;
  try {
    await api.post('/auth/logout/');
  } catch (e) {}
  user.value = null;
  isAuth.value = false;
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  isLoading.value = false;
}

async function getCurrentUser() {
  isLoading.value = true;
  try {
    const response = await api.get('/users/me/');
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

async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;
  try {
    const response = await api.post('/token/refresh/', { refresh });
    if (response.data.access) localStorage.setItem('access', response.data.access);
    return response.data.access;
  } catch (e) {
    await logout();
    return null;
  }
}

async function verifyToken(token) {
  try {
    await api.post('/token/verify/', { token });
    return true;
  } catch (e) {
    return false;
  }
}

// --- SESSION RESTORE ---
async function checkAuth() {
  const access = localStorage.getItem('access');
  if (!access) {
    user.value = null;
    isAuth.value = false;
    return;
  }
  const valid = await verifyToken(access);
  if (valid) {
    try {
      await getCurrentUser();
    } catch {
      user.value = null;
      isAuth.value = false;
    }
  } else {
    // Попробуем обновить токен
    const newAccess = await refreshToken();
    if (newAccess) {
      try {
        await getCurrentUser();
      } catch {
        user.value = null;
        isAuth.value = false;
      }
    } else {
      user.value = null;
      isAuth.value = false;
    }
  }
}

function requireAuth() {
  if (!isAuth.value) {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.hash = '#/login';
    return false;
  }
  return true;
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

// --- INIT ---
checkAuth();

export function useAuth() {
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
    refreshToken,
    verifyToken,
  };
}