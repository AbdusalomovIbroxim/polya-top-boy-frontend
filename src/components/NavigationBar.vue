<template>
  <div class="fixed bottom-0 left-0 right-0 z-50">
    <div class="flex gap-2 border-t border-[#f1f4f0] bg-white px-4 pb-3 pt-2">
      <!-- Используем цикл для навигационных ссылок -->
      <router-link 
        v-for="(item, index) in navItems" 
        :key="index"
        :to="item.to" 
        class="just flex flex-1 flex-col items-center justify-end gap-1" 
        :class="[$route.path === item.to ? 'text-[#131711]' : 'text-[#6c8764]']"
      >
        <div class="flex h-8 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path :d="item.icon"></path>
          </svg>
        </div>
        <p class="text-xs font-medium leading-normal tracking-[0.015em]">{{ item.name }}</p>
      </router-link>
    </div>
    <div class="h-5 bg-white"></div>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      navItems: [
        {
          name: 'Главная',
          to: '/',
          icon: 'M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z'
        },
        {
          name: 'Избранное',
          to: '/favorites',
          icon: 'M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z'
        },
        {
          name: 'Брони',
          to: '/bookings',
          icon: 'M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V96H48ZM208,208H48V112H208v96Z'
        },
        {
          name: 'Профиль',
          to: '/profile',
          icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z'
        }
      ]
    }
  }
}
</script>
