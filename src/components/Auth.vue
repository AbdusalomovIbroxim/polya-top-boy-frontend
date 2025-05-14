<template>
  <div class="auth-container">
    <div class="auth-header">
      <button @click="goBack" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1>Вход</h1>
    </div>
    
    <div class="auth-content">
      <div class="auth-form-container">
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">Логин</label>
            <input
              type="text"
              id="username"
              v-model="username"
              required
              placeholder="Введите ваш логин"
              class="auth-input"
              :class="{ 'error': errors.username }"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <div class="password-input-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                placeholder="Введите ваш пароль"
                class="auth-input"
                :class="{ 'error': errors.password }"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePassword"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Нет аккаунта? <a href="#" class="auth-link">Зарегистрироваться</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'AuthPage',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      isLoading: false,
      errors: {
        username: '',
        password: '',
        general: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true
      this.errors = {
        username: '',
        password: '',
        general: ''
      }

      try {
        await authService.login(this.username, this.password)
        // После успешной авторизации перенаправляем на главную страницу
        this.$router.push('/')
      } catch (error) {
        if (error.response) {
          const { data } = error.response
          if (data.detail) {
            this.errors.general = data.detail
          } else if (data.username) {
            this.errors.username = data.username[0]
          } else if (data.password) {
            this.errors.password = data.password[0]
          }
        } else {
          this.errors.general = 'Произошла ошибка при входе. Попробуйте позже.'
        }
      } finally {
        this.isLoading = false
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.auth-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.back-button {
  background: none;
  border: none;
  padding: 8px;
  color: #131711;
  cursor: pointer;
}

.auth-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #131711;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.auth-content {
  flex: 1;
  padding: 72px 16px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px);
}

.auth-form-container {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #131711;
}

.auth-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f8f8f8;
  transition: border-color 0.2s;
}

.auth-input:focus {
  outline: none;
  border-color: #4a90e2;
  background-color: #ffffff;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  color: #666;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.submit-btn:hover {
  background-color: #357abd;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.auth-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Медиа-запросы для мобильных устройств */
@media (max-width: 480px) {
  .auth-content {
    padding: 16px 16px 16px;
  }
  
  .auth-form-container {
    padding: 20px;
    box-shadow: none;
  }
  
  .auth-input {
    font-size: 16px;
  }
  
  .submit-btn {
    padding: 16px;
  }
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.auth-input.error {
  border-color: #dc3545;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 