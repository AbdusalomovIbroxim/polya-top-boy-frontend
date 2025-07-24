import { ref } from 'vue';
import { telegramAuth, getCurrentUser } from '../api/auth';

// Вспомогательная функция для получения initData
function getTelegramInitData() {
  let initData = '';
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    if (tg.initData) {
      initData = tg.initData;
    }
  }
  if (!initData) {
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/tgWebAppData=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        initData = decoded;
      }
    }
  }
  if (!initData) {
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
      initData = decodeURIComponent(tgWebAppData);
    }
  }
  if (!initData) {
    const path = window.location.pathname;
    const pathMatch = path.match(/\/tgWebAppData\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
      const decoded = decodeURIComponent(pathMatch[1]);
      initData = decoded;
    }
  }
  return initData;
}

// Создаем состояние как синглтон, чтобы оно было общим для всего приложения
const user = ref(null);
const isAuth = ref(false);
const authError = ref('');
const debugInfo = ref('');
const isLoading = ref(true);

export function useAuth() {

  async function authenticate() {
    isLoading.value = true;
    authError.value = '';
    try {
      const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
      if (!isTelegramWebApp) {
        authError.value = 'Приложение должно быть запущено через Telegram бота';
        return;
      }

      const initData = getTelegramInitData();
      debugInfo.value = `initData: ${initData}`;

      if (initData && initData.length > 0) {
        // Только один запрос!
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

  if (isLoading.value) {
      authenticate();
  }

  return {
    user,
    isAuth,
    authError,
    debugInfo,
    isLoading,
    retryAuth: authenticate, // Переименовываем authenticate в retryAuth для совместимости
    logout,
  };
}