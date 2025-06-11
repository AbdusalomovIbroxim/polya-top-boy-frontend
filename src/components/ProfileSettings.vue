<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div class="flex items-center bg-white p-4 pb-2">
      <button @click="$router.back()" class="text-[#131711]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
        </svg>
      </button>
      <h2 class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Настройки профиля</h2>
    </div>

    <div class="flex-1 p-4">
      <form @submit.prevent="updateProfile" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="username" class="text-[#131711] text-sm font-medium">Логин</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4a90e2] focus:outline-none"
            placeholder="Введите логин"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="firstName" class="text-[#131711] text-sm font-medium">Имя</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.first_name"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4a90e2] focus:outline-none"
            placeholder="Введите имя"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="lastName" class="text-[#131711] text-sm font-medium">Фамилия</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.last_name"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4a90e2] focus:outline-none"
            placeholder="Введите фамилию"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-[#4a90e2] text-white py-4 rounded-xl font-bold text-base mt-4"
          :disabled="loading"
        >
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'ProfileSettings',
  data() {
    return {
      loading: false,
      error: null,
      formData: {
        username: '',
        first_name: '',
        last_name: ''
      }
    }
  },
  async created() {
    await this.loadUserData()
  },
  methods: {
    async loadUserData() {
      try {
        const response = await authService.getCurrentUser()
        this.formData = {
          username: response.data.username,
          first_name: response.data.first_name,
          last_name: response.data.last_name
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        this.error = 'Не удалось загрузить данные пользователя'
      }
    },
    async updateProfile() {
      this.loading = true
      this.error = null

      try {
        await authService.updateProfile(this.formData)
        this.$router.push('/profile')
      } catch (error) {
        console.error('Error updating profile:', error)
        this.error = error.response?.data?.detail || 'Не удалось обновить профиль'
      } finally {
        this.loading = false
      }
    }
  }
}
</script> 