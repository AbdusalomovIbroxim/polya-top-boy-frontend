import { ref } from 'vue';
import { getCurrentUser, isAuthenticated } from '../api/api.js';

const isAuth = ref(isAuthenticated());
const isLoading = ref(true);
const user = ref(null);

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

async function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  isAuth.value = false;
  user.value = null;
  window.location.hash = '#/login';
}

export function useAuth() {
  return {
    isAuth,
    isLoading,
    user,
    checkAuth,
    logout
  };
}

// Инициализация при старте
checkAuth();