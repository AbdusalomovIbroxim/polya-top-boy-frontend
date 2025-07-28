import { api } from './api';

// --- AUTH STATE ---
let authState = {
  isAuth: false,
  isLoading: true,
  user: null,
};

function setAuthState(newState) {
  authState = { ...authState, ...newState };
  localStorage.setItem('isAuth', authState.isAuth ? '1' : '0');
  if (authState.user) {
    localStorage.setItem('user', JSON.stringify(authState.user));
  } else {
    localStorage.removeItem('user');
  }
}

function clearAuthState() {
  authState = { isAuth: false, isLoading: false, user: null };
  localStorage.removeItem('isAuth');
  localStorage.removeItem('user');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

function isAuthenticated() {
  return localStorage.getItem('isAuth') === '1';
}

// Получение текущего пользователя
async function getCurrentUser() {
  try {
    const access = localStorage.getItem('access');
    if (!access) throw new Error('No access token');
    
    const res = await api.get('/users/me/');
    setAuthState({ isAuth: true, isLoading: false, user: res.data });
    return res.data;
  } catch (e) {
    clearAuthState();
    throw e;
  }
}

// Проверка и обновление токена
async function refreshToken() {
  try {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token');
    
    const response = await api.post('/token/refresh/', {
      refresh: refresh
    });
    
    if (response.data.access) {
      localStorage.setItem('access', response.data.access);
      return response.data.access;
    }
  } catch (error) {
    clearAuthState();
    throw error;
  }
}

async function telegramAuth(initData) {
  try {
    const response = await api.post('telegram_auth/', { init_data: initData });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getCurrentUserWithInitData(initData) {
  try {
    const response = await api.get('users/me/', {
      params: { init_data: initData }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { 
  telegramAuth, 
  getCurrentUserWithInitData, 
  getCurrentUser, 
  isAuthenticated, 
  setAuthState, 
  clearAuthState,
  refreshToken
};
