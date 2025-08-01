<template>
  <div class="login-page page-container no-tabbar">
    <div class="login-container">
      <div class="login-header">
        <h1>{{ isLogin ? 'Вход' : 'Регистрация' }}</h1>
        <p>{{ isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт' }}</p>
      </div>

      <!-- Форма входа -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login">Логин или телефон</label>
          <input
            id="login"
            v-model="loginForm.login"
            type="text"
            placeholder="Введите логин или номер телефона"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </div>
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <!-- Форма регистрации -->
      <form v-else @submit.prevent="handleRegister" class="login-form">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input
            id="username"
            v-model="registerForm.username"
            type="text"
            placeholder="Введите имя пользователя"
            required
          />
        </div>
        <div class="form-group">
          <label for="phone">Номер телефона</label>
          <input
            id="phone"
            v-model="registerForm.phone"
            type="tel"
            placeholder="+998901234567"
            required
          />
        </div>
        <div class="form-group">
          <label for="first_name">Имя</label>
          <input
            id="first_name"
            v-model="registerForm.first_name"
            type="text"
            placeholder="Введите имя"
            required
          />
        </div>
        <div class="form-group">
          <label for="last_name">Фамилия</label>
          <input
            id="last_name"
            v-model="registerForm.last_name"
            type="text"
            placeholder="Введите фамилию"
            required
          />
        </div>
        <div class="form-group">
          <label for="reg_password">Пароль</label>
          <input
            id="reg_password"
            v-model="registerForm.password"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </div>
        <div class="form-group">
          <label for="password_confirm">Подтвердите пароль</label>
          <input
            id="password_confirm"
            v-model="registerForm.password_confirm"
            type="password"
            placeholder="Повторите пароль"
            required
          />
        </div>
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <!-- Ошибки -->
      <div v-if="authError" class="error-message">
        {{ authError }}
      </div>

      <!-- Переключение между формами -->
      <div class="form-switch">
        <button @click="toggleForm" class="switch-btn">
          {{ isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login, register, isLoading, authError } = useAuth();

const isLogin = ref(true);

// Форма входа
const loginForm = reactive({
  login: '',
  password: ''
});

// Форма регистрации
const registerForm = reactive({
  username: '',
  phone: '',
  first_name: '',
  last_name: '',
  password: '',
  password_confirm: ''
});

// Обработка входа
async function handleLogin() {
  try {
    await login(loginForm);
    // Проверяем, есть ли сохраненный путь для возврата
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath && redirectPath !== '/login') {
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
}

// Обработка регистрации
async function handleRegister() {
  try {
    await register(registerForm);
    // Проверяем, есть ли сохраненный путь для возврата
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath && redirectPath !== '/login') {
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
}

// Переключение между формами
function toggleForm() {
  isLogin.value = !isLogin.value;
  // Очистка ошибок при переключении
  authError.value = '';
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  box-sizing: border-box;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  margin: auto;
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.login-header p {
  color: #666;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.form-switch {
  margin-top: 1rem;
  text-align: center;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.switch-btn:hover {
  color: #5a6fd8;
}

/* Мобильные стили */
@media (max-width: 480px) {
  .login-page {
    padding: 0.5rem;
  }
  
  .login-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 0.5rem;
  }
  
  .submit-btn {
    padding: 0.5rem;
  }
}
</style> 