<template>
  <div class="telegram-auth-container">
    <!-- Лоадер во время авторизации -->
    <div v-if="loading" class="auth-loader">
      <div class="loader-spinner"></div>
      <h2 class="loader-title">Авторизация...</h2>
      <p class="loader-subtitle">Подключение к Telegram</p>
    </div>

    <!-- Ошибка авторизации -->
    <div v-else-if="error" class="auth-error">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Ошибка авторизации</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="retryAuth" class="retry-button">
        Попробовать снова
      </button>
    </div>

    <!-- Успешная авторизация -->
    <div v-else-if="user" class="auth-success">
      <div class="success-icon">✅</div>
      <h2 class="success-title">Добро пожаловать!</h2>
      <div class="user-info">
        <img v-if="user.photo_url" :src="user.photo_url" :alt="user.first_name" class="user-avatar" />
        <div v-else class="user-avatar-placeholder">
          {{ userInitials }}
        </div>
        <h3 class="user-name">{{ user.first_name }} {{ user.last_name || '' }}</h3>
        <p v-if="user.username" class="user-username">@{{ user.username }}</p>
      </div>
      <button @click="goToApp" class="continue-button">
        Перейти в приложение
      </button>
    </div>

    <!-- Начальный экран -->
    <div v-else class="auth-welcome">
      <div class="welcome-icon">🤖</div>
      <h2 class="welcome-title">Polyatop</h2>
      <p class="welcome-subtitle">Найдите лучшие футбольные поля</p>
      <div class="telegram-info">
        <div class="telegram-icon">📱</div>
        <p>Приложение работает только в Telegram</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import telegramAuth from '../services/telegramAuth';
import '../assets/css/telegram-auth.css';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const user = ref(null);

const userInitials = computed(() => {
  if (!user.value?.first_name) return 'П';
  return user.value.first_name[0].toUpperCase();
});

// Авторизация через Telegram
async function authenticate() {
  loading.value = true;
  error.value = null;

  try {
    // Инициализируем Telegram Web App
    const webApp = telegramAuth.initTelegramApp();
    
    if (!webApp) {
      throw new Error('Приложение должно быть открыто в Telegram');
    }

    // Получаем данные пользователя от Telegram
    const telegramUser = telegramAuth.getTelegramUser();
    if (!telegramUser) {
      throw new Error('Не удалось получить данные пользователя');
    }

    // Авторизуемся через API
    const authData = await telegramAuth.telegramAuth();
    user.value = authData.user;

    // Автоматически переходим в приложение через 2 секунды
    setTimeout(() => {
      goToApp();
    }, 2000);

  } catch (err) {
    console.error('Auth error:', err);
    error.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
}

// Получение понятного сообщения об ошибке
function getErrorMessage(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Произошла неизвестная ошибка';
}

// Повторная попытка авторизации
function retryAuth() {
  authenticate();
}

// Переход в основное приложение
function goToApp() {
  router.push('/');
}

// Проверяем авторизацию при загрузке
onMounted(() => {
  const currentUser = telegramAuth.getCurrentUser();
  if (currentUser && telegramAuth.isAuthenticated()) {
    user.value = currentUser;
  } else {
    authenticate();
  }
});
</script> 