<script>
import HomePage from './pages/HomePage.vue'
import { LoadingScreen, ErrorScreen, Tabbar } from './components'
import './assets/css/main.css'
import { ref, onMounted, provide } from 'vue';
import { telegramAuth } from './api/auth';

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

export default {
  name: 'App',
  components: { 
    HomePage,
    LoadingScreen,
    ErrorScreen,
    Tabbar
  },
  setup() {
    const user = ref(null);
    const isAuth = ref(false);
    const authError = ref('');
    const debugInfo = ref('');

    async function logout() {
      user.value = null;
      isAuth.value = false;
    }

    async function retryAuth() {
      authError.value = '';
      try {
        const initData = getTelegramInitData();
        if (initData && initData.length > 0) {
          const hasRequiredFields = initData.includes('user=') && 
                                  initData.includes('auth_date=') && 
                                  (initData.includes('signature=') || initData.includes('hash='));
          if (hasRequiredFields) {
            const userProfile = await telegramAuth(initData);
            console.log('userProfile from API:', userProfile);
            user.value = userProfile.user;
            isAuth.value = true;
            console.log('isAuth:', isAuth.value, 'user:', user.value);
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
      }
    }

    onMounted(async () => {
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
          const hasRequiredFields = initData.includes('user=') && 
                                  initData.includes('auth_date=') && 
                                  (initData.includes('signature=') || initData.includes('hash='));
          if (hasRequiredFields) {
            const userProfile = await telegramAuth(initData);
            console.log('userProfile from API:', userProfile);
            user.value = userProfile.user;
            isAuth.value = true;
            console.log('isAuth:', isAuth.value, 'user:', user.value);
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
      }
    });

    provide('user', user);
    provide('logout', logout);

    return { user, isAuth, authError, logout, debugInfo, retryAuth };
  }
}
</script>

<template>
  <div>
    <LoadingScreen v-if="!isAuth && !authError" />
    <ErrorScreen 
      v-else-if="!isAuth && authError" 
      :error="authError"
      :debugInfo="debugInfo"
      @retry="retryAuth"
    />
    <router-view v-else />
  </div>
</template>

<style src="./assets/css/app.css"></style>
