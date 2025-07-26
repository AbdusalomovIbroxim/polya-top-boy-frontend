<template>
  <div class="tabbar">
    <router-link
      v-for="tab in tabs"
      :key="tab.id"
      :to="getTabLink(tab)"
      :class="['tabbar-item', { active: $route.name === tab.id }]"
      @click="handleTabClick(tab, $event)"
    >
      <span class="tabbar-icon" v-html="tab.icon"></span>
      <span class="tabbar-label">{{ tab.label }}</span>
    </router-link>
  </div>
</template>

<script>
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  name: 'Tabbar',
  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  },
  setup() {
    const { checkAuthOnDemand } = useAuth();
    const router = useRouter();

    function getTabLink(tab) {
      if (tab.id === 'profile') {
        return '#'; // Временно ставим #, обработка будет в handleTabClick
      }
      return tab.id === 'home' ? '/' : (tab.id === 'profile' ? '/profile' : '#');
    }

    async function handleTabClick(tab, event) {
      if (tab.id === 'profile') {
        event.preventDefault();
        const isAuth = await checkAuthOnDemand();
        if (isAuth) {
          router.push('/profile');
        }
      }
    }

    return {
      getTabLink,
      handleTabClick
    };
  },
  data() {
    return {
      tabs: [
        {
          id: 'home',
          label: 'Home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
          </svg>`
        },
        {
          id: 'favorites',
          label: 'Favorites',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
          </svg>`
        },
        {
          id: 'map',
          label: 'Map',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
          </svg>`
        },
        {
          id: 'bookings',
          label: 'Bookings',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z" />
          </svg>`
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
          </svg>`
        }
      ]
    }
  }
}
</script>

<style src="../assets/css/components/tabbar.css"></style>