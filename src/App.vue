<script>
import { Tabbar } from './components'
import './assets/css/main.css'
import { provide } from 'vue';
import { useAuth } from './composables/useAuth';

export default {
  name: 'App',
  components: {
    Tabbar
  },
  setup() {
    const {
      user,
      logout
    } = useAuth();

    provide('user', user);
    provide('logout', logout);

    return {};
  },
  mounted() {
    console.log('DEBUG: App.vue mounted');
  },
  updated() {
    console.log('DEBUG: App.vue updated, current route:', this.$route.name);
  }
}
</script>

<template>
  <div>
    <router-view />
    <div class="tabbar-space"></div>
    <Tabbar v-if="$route.name !== 'login'" />
  </div>
</template>

<style src="./assets/css/app.css"></style>
