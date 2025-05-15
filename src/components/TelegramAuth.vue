<template>
  <div class="telegram-auth">
    <div v-if="!isAuthorized" class="auth-container">
      <h2>Добро пожаловать!</h2>
      <p>Для входа в приложение используйте Telegram</p>
      <button @click="initTelegramAuth" class="telegram-button">
        <img src="@/assets/telegram-icon.svg" alt="Telegram" />
        Войти через Telegram
      </button>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
    <div v-else class="user-info">
      <img :src="userPhoto" alt="User photo" class="user-photo" />
      <h3>{{ userName }}</h3>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/api'

export default {
  name: 'TelegramAuth',
  data() {
    return {
      isAuthorized: false,
      userName: '',
      userPhoto: '',
      telegram: null,
      error: null
    }
  },
  mounted() {
    console.log('TelegramAuth mounted')
    // Проверяем, загружен ли Telegram WebApp
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp found')
      this.telegram = window.Telegram.WebApp
      this.telegram.ready()
      console.log('Telegram WebApp ready')
      
      // Проверяем наличие initData
      if (this.telegram.initData) {
        console.log('initData found:', this.telegram.initData)
        this.handleTelegramAuth(this.telegram.initData)
      } else {
        console.log('No initData found')
        this.error = 'Не удалось получить данные авторизации. Пожалуйста, откройте приложение через Telegram бота.'
      }
    } else {
      console.log('Telegram WebApp not found')
      this.error = 'Приложение должно быть открыто через Telegram бота'
    }
  },
  methods: {
    async initTelegramAuth() {
      if (!this.telegram) {
        this.error = 'Telegram WebApp не инициализирован'
        console.error('Telegram WebApp не инициализирован')
        return
      }

      try {
        const initData = this.telegram.initData
        console.log('Sending initData to backend:', initData)
        await this.handleTelegramAuth(initData)
      } catch (error) {
        console.error('Ошибка авторизации:', error)
        this.error = 'Ошибка авторизации. Пожалуйста, попробуйте снова.'
      }
    },
    async handleTelegramAuth(initData) {
      try {
        console.log('Handling Telegram auth with initData:', initData)
        const response = await authService.loginWithTelegram(initData)
        console.log('Auth response:', response)
        
        this.isAuthorized = true
        this.error = null
        
        // Получаем данные пользователя из ответа бэкенда
        const userData = response.user
        this.userName = userData.first_name || 'Пользователь'
        this.userPhoto = userData.photo_url || ''
        
        // Уведомляем родительский компонент об успешной авторизации
        this.$emit('auth-success', response)
      } catch (error) {
        console.error('Ошибка при обработке данных Telegram:', error)
        this.error = 'Ошибка при обработке данных. Пожалуйста, попробуйте снова.'
      }
    }
  }
}
</script>

<style scoped>
.telegram-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.auth-container {
  text-align: center;
  max-width: 400px;
}

.telegram-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 1rem 0;
}

.telegram-button:hover {
  background-color: #006699;
}

.telegram-button img {
  width: 24px;
  height: 24px;
}

.user-info {
  text-align: center;
}

.user-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.error-message {
  color: #dc2626;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #fee2e2;
}
</style> 