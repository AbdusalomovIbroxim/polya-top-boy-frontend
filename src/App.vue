<script>
import HomePage from './pages/HomePage.vue'
import { LoadingScreen, ErrorScreen } from './components'
import './assets/css/main.css'
import { ref, onMounted, provide } from 'vue';
import { telegramAuth } from './api/auth';

function getTelegramInitData() {
  let initData = '';
  
  // Метод 1: Из window.Telegram.WebApp.initData (основной способ)
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Инициализируем Telegram Web App
    tg.ready(); // Сообщаем Telegram что приложение готово
    tg.expand(); // Разворачиваем на весь экран
    
    if (tg.initData) {
      initData = tg.initData;
    }
  }
  
  // Метод 2: Из URL hash (для web.telegram.org)
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
  
  // Метод 3: Из URL search params
  if (!initData) {
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
      initData = decodeURIComponent(tgWebAppData);
    }
  }
  
  // Метод 4: Из URL path (если данные передаются в пути)
  if (!initData) {
    const path = window.location.pathname;
    
    // Проверяем, есть ли данные в пути
    const pathMatch = path.match(/\/tgWebAppData\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
      const decoded = decodeURIComponent(pathMatch[1]);
      initData = decoded;
    }
  }
  
  return initData;
}

export default {
  name: 'App',
  components: { 
    HomePage,
    LoadingScreen,
    ErrorScreen
  },
  setup() {
    const user = ref(null);
    const isAuth = ref(false);
    const authLoading = ref(true);
    const authError = ref('');
    const debugInfo = ref('');

    async function logout() {
      user.value = null;
      isAuth.value = false;
    }

    async function retryAuth() {
      authLoading.value = true;
      authError.value = '';
      try {
        const initData = getTelegramInitData();
        if (initData && initData.length > 0) {
          const hasRequiredFields = initData.includes('user=') && 
                                  initData.includes('auth_date=') && 
                                  (initData.includes('signature=') || initData.includes('hash='));
          if (hasRequiredFields) {
            const userProfile = await telegramAuth(initData);
            user.value = userProfile.user;
            isAuth.value = true;
          } else {
            isAuth.value = false;
            authError.value = 'Некорректный формат initData. Отсутствуют обязательные поля.';
          }
        } else {
          isAuth.value = false;
          authError.value = 'Нет данных Telegram WebApp (initData пустой).';
        }
      } catch (e) {
        isAuth.value = false;
        authError.value = e?.response?.data?.error || e.message || 'Ошибка авторизации';
        await logout();
      } finally {
        authLoading.value = false;
      }
    }

    onMounted(async () => {
      authLoading.value = true;
      authError.value = '';
      try {
        const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
        if (!isTelegramWebApp) {
          authError.value = 'Приложение должно быть запущено через Telegram бота';
          authLoading.value = false;
          return;
        }
        const initData = getTelegramInitData();
        debugInfo.value = `initData: ${initData}`;
        if (initData && initData.length > 0) {
          const hasRequiredFields = initData.includes('user=') && 
                                  initData.includes('auth_date=') && 
                                  (initData.includes('signature=') || initData.includes('hash='));
          if (hasRequiredFields) {
            const userProfile = await telegramAuth(initData);
            user.value = userProfile.user;
            isAuth.value = true;
          } else {
            isAuth.value = false;
            authError.value = 'Некорректный формат initData. Отсутствуют обязательные поля.';
          }
        } else {
          isAuth.value = false;
          authError.value = 'Нет данных Telegram WebApp (initData пустой).';
        }
      } catch (e) {
        isAuth.value = false;
        authError.value = e?.response?.data?.error || e.message || 'Ошибка авторизации';
        await logout();
      } finally {
        authLoading.value = false;
      }
    });

    provide('user', user);
    provide('logout', logout);

    return { user, isAuth, authLoading, authError, logout, debugInfo, retryAuth };
  }
}
</script>

<template>
  <div>
    <LoadingScreen v-if="authLoading" />
    <ErrorScreen 
      v-else-if="!isAuth" 
      :error="authError"
      :debugInfo="debugInfo"
      @retry="retryAuth"
    />
    <router-view />
  </div>
</template>

<style src="./assets/css/app.css"></style>
