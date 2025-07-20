<script>
import HomePage from './pages/HomePage.vue'
import './assets/css/main.css'
import { ref, onMounted } from 'vue';
import { telegramAuth, refreshToken, verifyToken } from './api/auth';

function getTelegramInitData() {
  console.log('=== DEBUG: Getting Telegram InitData ===');
  console.log('window.Telegram:', window.Telegram);
  console.log('window.Telegram.WebApp:', window.Telegram?.WebApp);
  
  let initData = '';
  
  // Метод 1: Из window.Telegram.WebApp.initData (основной способ)
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Инициализируем Telegram Web App
    tg.ready(); // Сообщаем Telegram что приложение готово
    tg.expand(); // Разворачиваем на весь экран
    
    console.log('tg.initData:', tg.initData);
    console.log('tg.initDataUnsafe:', tg.initDataUnsafe);
    console.log('tg.initDataUnsafe.user:', tg.initDataUnsafe?.user);
    
    if (tg.initData) {
      initData = tg.initData;
      console.log('Method 1 - Using tg.initData:', initData);
    }
  }
  
  // Метод 2: Из URL hash (для web.telegram.org)
  if (!initData) {
    const hash = window.location.hash;
    console.log('window.location.hash:', hash);
    
    if (hash) {
      const match = hash.match(/tgWebAppData=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        initData = decoded;
        console.log('Method 2 - Using hash tgWebAppData:', initData);
      }
    }
  }
  
  // Метод 3: Из URL search params
  if (!initData) {
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
      initData = decodeURIComponent(tgWebAppData);
      console.log('Method 3 - Using URL params tgWebAppData:', initData);
    }
  }
  
  // Метод 4: Из URL path (если данные передаются в пути)
  if (!initData) {
    const path = window.location.pathname;
    console.log('window.location.pathname:', path);
    
    // Проверяем, есть ли данные в пути
    const pathMatch = path.match(/\/tgWebAppData\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
      const decoded = decodeURIComponent(pathMatch[1]);
      initData = decoded;
      console.log('Method 4 - Using path tgWebAppData:', initData);
    }
  }
  
  if (!initData) {
    console.log('No initData found in any method');
  } else {
    console.log('Final initData:', initData);
  }
  
  return initData;
}

export default {
  name: 'App',
  components: { HomePage },
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
        const userData = await verifyToken(access);
        // verifyToken должен возвращать данные пользователя
        if (userData && userData.user) {
          user.value = userData.user;
        } else if (userData && userData.username) {
          // Если API возвращает пользователя напрямую
          user.value = userData;
        } else {
          console.error('Unexpected user data format:', userData);
          return false;
        }
        return true;
      } catch (e) {
        console.error('Token verification failed:', e);
        // access token is invalid/expired, try refresh
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          // После успешного обновления токена нужно получить данные пользователя
          try {
            const newAccess = localStorage.getItem('access');
            const userData = await verifyToken(newAccess);
            if (userData && userData.user) {
              user.value = userData.user;
            } else if (userData && userData.username) {
              user.value = userData;
            } else {
              console.error('Unexpected user data format after refresh:', userData);
              return false;
            }
            return true;
          } catch (refreshError) {
            console.error('Error getting user data after token refresh:', refreshError);
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
          console.log('initData:', initData);
          debugInfo.value = `initData: ${initData}`;
          
          // Валидация initData
          if (initData && initData.length > 0) {
            // Проверяем, что initData содержит необходимые поля
            const hasRequiredFields = initData.includes('user=') && 
                                    initData.includes('auth_date=') && 
                                    (initData.includes('signature=') || initData.includes('hash='));
            
            if (hasRequiredFields) {
              console.log('initData validation passed');
              const data = await telegramAuth(initData);
              localStorage.setItem('access', data.access);
              localStorage.setItem('refresh', data.refresh);
              user.value = data.user;
              isAuth.value = true;
            } else {
              isAuth.value = false;
              authError.value = 'Некорректный формат initData. Отсутствуют обязательные поля.';
              console.error('initData validation failed - missing required fields');
              console.error('initData content:', initData);
            }
          } else {
            isAuth.value = false;
            authError.value = 'Нет данных Telegram WebApp (initData пустой).';
            console.error('initData is empty');
          }
        } else {
          isAuth.value = true;
          console.log('User already authenticated, checking user data...');
          console.log('Current user value:', user.value);
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

    return { user, isAuth, authLoading, authError, logout, debugInfo };
  }
}
</script>

<template>
  <div>
    <div v-if="authLoading" style="padding:2rem;text-align:center;">Авторизация через Telegram...</div>
    <div v-else-if="!isAuth" style="padding:2rem;text-align:center;color:red;">
      Ошибка авторизации: {{ authError }}
      <div style="color:#888;font-size:0.95em;margin-top:1em;">{{ debugInfo }}</div>
    </div>
    <div v-else>
      <HomePage />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
