<script>
import HomePage from './pages/HomePage.vue'
import './assets/css/main.css'
import { ref, onMounted } from 'vue';
import { telegramAuth, refreshToken, verifyToken } from './api/auth';

function getTelegramInitData() {
  // Всегда используем window.location.hash (tgWebAppData)
  const hash = window.location.hash;
  if (hash) {
    const match = hash.match(/tgWebAppData=([^&]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  return '';
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
        let authed = false;
        if (localStorage.getItem('access') && localStorage.getItem('refresh')) {
          authed = await checkAndRefreshToken();
        }
        if (!authed) {
          const initData = getTelegramInitData();
          console.log('initData:', initData);
          debugInfo.value = `initData: ${initData}`;
          if (initData) {
            const data = await telegramAuth(initData);
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            user.value = data.user;
            isAuth.value = true;
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
