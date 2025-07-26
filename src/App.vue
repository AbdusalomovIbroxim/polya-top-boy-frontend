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
  }
}
</script>

<template>
  <router-view></router-view>
  <Tabbar v-if="$route.name !== 'login'" />
</template>

<style src="./assets/css/app.css"></style>
