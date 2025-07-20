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
        await verifyToken(access);
        return true;
      } catch (e) {
        // access token is invalid/expired, try refresh
        return await tryRefreshToken();
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
      <div style="padding:0.5rem 1rem 0 1rem;font-size:0.98rem;color:#6d8566;">
        <span style="font-weight:600;color:#131712;">@{{ user.username }}</span>
        <span v-if="user.first_name || user.last_name"> — {{ user.first_name }} {{ user.last_name }}</span>
        <button @click="logout" style="float:right;font-size:0.95em;color:#d33;background:none;border:none;cursor:pointer;">Выйти</button>
      </div>
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
