import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://polya-top-bot-backend.onrender.com/api/',
  timeout: 10000,
});

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
  // Быстрая проверка по localStorage (для SSR/SPA)
  return localStorage.getItem('isAuth') === '1';
}

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
  error => {
    if (error.response && error.response.status === 401) {
      clearAuthState();
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

export { api, getCurrentUser, isAuthenticated, setAuthState, clearAuthState };