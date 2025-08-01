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
  },
  watch: {
    '$route'(to, from) {
      // Дополнительная проверка для скролла вверх при смене маршрута
      if (to.path !== from.path) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="router-view-container">
      <router-view />
    </div>
    <div class="tabbar-space" v-if="$route.name !== 'login'"></div>
    <Tabbar v-if="$route.name !== 'login'" />
  </div>
</template>

<style src="./assets/css/app.css"></style>
