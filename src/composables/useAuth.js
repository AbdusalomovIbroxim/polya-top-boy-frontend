import { ref } from 'vue';
import { telegramAuth } from '../api/auth';

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