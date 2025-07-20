<script>
import HomePage from './pages/HomePage.vue'
import { LoadingScreen, ErrorScreen } from './components'
import './assets/css/main.css'
import { ref, onMounted, provide } from 'vue';
import { telegramAuth, refreshToken, verifyToken, getCurrentUser } from './api/auth';

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

    // --- Token refresh logic ---
    async function tryRefreshToken() {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return false;
      try {
        const data = await refreshToken(refresh);
        localStorage.setItem('access', data.access);
        return true;
      } catch (e) {
        return false;
      }
    }

    async function checkAndRefreshToken() {
      const access = localStorage.getItem('access');
      if (!access) return false;
      try {
        await verifyToken(access);
        // verify.user_id есть, токен валиден
        const userData = await getCurrentUser(access);
        if (userData && userData.id) {
          user.value = userData;
          isAuth.value = true;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        // access token is invalid/expired, try refresh
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          try {
            const newAccess = localStorage.getItem('access');
            await verifyToken(newAccess);
            const userData = await getCurrentUser(newAccess);
            if (userData && userData.id) {
              user.value = userData;
              isAuth.value = true;
              return true;
            } else {
              return false;
            }
          } catch (refreshError) {
            return false;
          }
        }
        return false;
      }
    }

    async function logout() {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
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
            const data = await telegramAuth(initData);
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            user.value = data.user;
            isAuth.value = true;
            console.log('USER SET:', user.value);
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
        // Проверяем, запущено ли приложение в Telegram Web App
        const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
        if (!isTelegramWebApp) {
          authError.value = 'Приложение должно быть запущено через Telegram бота';
          authLoading.value = false;
          return;
        }

        let authed = false;
        if (localStorage.getItem('access') && localStorage.getItem('refresh')) {
          authed = await checkAndRefreshToken();
        }
        
        if (!authed) {
          const initData = getTelegramInitData();
          debugInfo.value = `initData: ${initData}`;
          
          // Валидация initData
          if (initData && initData.length > 0) {
            // Проверяем, что initData содержит необходимые поля
            const hasRequiredFields = initData.includes('user=') && 
                                    initData.includes('auth_date=') && 
                                    (initData.includes('signature=') || initData.includes('hash='));
            
            if (hasRequiredFields) {
              const data = await telegramAuth(initData);
              localStorage.setItem('access', data.access);
              localStorage.setItem('refresh', data.refresh);
              user.value = data.user;
              isAuth.value = true;
            } else {
              isAuth.value = false;
              authError.value = 'Некорректный формат initData. Отсутствуют обязательные поля.';
            }
          } else {
            isAuth.value = false;
            authError.value = 'Нет данных Telegram WebApp (initData пустой).';
          }
        } else {
          isAuth.value = true;
        }
      } catch (e) {
        isAuth.value = false;
        authError.value = e?.response?.data?.error || e.message || 'Ошибка авторизации';
        await logout();
      } finally {
        authLoading.value = false;
      }
    });

    // Periodically refresh token every 10 minutes
    setInterval(async () => {
      if (isAuth.value) {
        const ok = await tryRefreshToken();
        if (!ok) {
          await logout();
          authError.value = 'Сессия истекла. Перезайдите через Telegram.';
        }
      }
    }, 10 * 60 * 1000);

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
