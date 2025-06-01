<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <div class="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Профиль</h2>
        <div class="flex w-12 items-center justify-end relative">
          <button
            v-if="isAuthenticated"
            class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#131711] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
            @click="toggleMenu"
          >
            <div class="text-[#131711]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>
              </svg>
            </div>
          </button>
          <div v-if="showMenu" class="absolute right-0 top-16 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-100">
            <button class="block w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500" @click="logout">Выйти</button>
            <button class="block w-full text-left px-4 py-3 hover:bg-gray-100" @click="goToFriends">Мои друзья</button>
            <button class="block w-full text-left px-4 py-3 hover:bg-gray-100" @click="goToBookings">Мои бронирования</button>
            <button class="block w-full text-left px-4 py-3 hover:bg-gray-100" @click="goToSettings">Настройки профиля</button>
          </div>
        </div>
      </div>
      <div v-if="loading" class="flex p-4 @container">
        <ProfileSkeleton />
      </div>
      <div v-else class="flex p-4 @container">
        <div class="flex w-full flex-col gap-4 items-start">
          <div class="flex gap-4 flex-col items-start">
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
              :style='{ backgroundImage: `url(${userData.photo_url || "https://cdn.usegalileo.ai/sdxl10/40f70546-ecd7-4361-be87-04d23971368e.png"})` }'
            ></div>
            <div class="flex flex-col justify-center">
              <p class="text-[#131711] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                {{ userData.username }}
              </p>
              <p class="text-[#6c8764] text-base font-normal leading-normal">
                {{ userData.first_name }} {{ userData.last_name }}
              </p>
              <p class="text-[#6c8764] text-base font-normal leading-normal">
                {{ userData.phone || 'Телефон не указан' }}
              </p>
              <p v-if="isAuthenticated" class="text-[#6c8764] text-base font-normal leading-normal">
                В системе с {{ formatDate(userData.date_joined) }}
              </p>
            </div>
          </div>
          <button
            v-if="isAuthenticated"
            class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f4f0] text-[#131711] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto"
          >
            <span class="truncate">Пригласить поиграть</span>
          </button>
          <button
            v-else
            @click="goToAuth"
            class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#4a90e2] text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto"
          >
            <span class="truncate">Войти</span>
          </button>
        </div>
      </div>
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'
import ProfileSkeleton from './ProfileSkeleton.vue'
import { authService } from '../services/api'

export default {
  name: 'ProfilePage',
  components: {
    NavigationBar,
    ProfileSkeleton
  },
  data() {
    return {
      loading: true,
      isAuthenticated: false,
      showMenu: false,
      userData: {
        id: null,
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: '',
        phone: '',
        address: '',
        date_joined: null,
        photo_url: null
      }
    }
  },
  async created() {
    await this.checkAuth()
  },
  methods: {
    async checkAuth() {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const response = await authService.getCurrentUser()
          this.userData = response.data
          this.isAuthenticated = true
        } catch (error) {
          console.error('Error fetching user data:', error)
          this.isAuthenticated = false
          this.userData = {
            id: null,
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            role: '',
            phone: '',
            address: '',
            date_joined: null,
            photo_url: null
          }
        }
      }
      this.loading = false
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    },
    goToAuth() {
      this.$router.push('/auth')
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    logout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.$router.push('/auth')
      this.showMenu = false
    },
    goToFriends() {
      this.$router.push('/friends')
      this.showMenu = false
    },
    goToBookings() {
      this.$router.push('/bookings')
      this.showMenu = false
    },
    goToSettings() {
      this.$router.push('/profile/settings')
      this.showMenu = false
    }
  }
}
</script> 