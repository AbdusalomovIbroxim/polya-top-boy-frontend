<script>
import { LoadingScreen, ErrorScreen, Tabbar } from './components'
import './assets/css/main.css'
import { provide } from 'vue';
import { useAuth } from './composables/useAuth';

export default {
  name: 'App',
  components: {
    LoadingScreen,
    ErrorScreen,
    Tabbar
  },
  setup() {
    const {
      user,
      isAuth,
      authError,
      debugInfo,
      isLoading,
      retryAuth,
      logout
    } = useAuth();

    provide('user', user);
    provide('logout', logout);

    return {
      isAuth,
      authError,
      debugInfo,
      isLoading,
      retryAuth
    };
  }
}
</script>

<template>
  <LoadingScreen v-if="isLoading" />
  <ErrorScreen 
    v-else-if="!isAuth && authError" 
    :error="authError"
    :debugInfo="debugInfo"
    @retry="retryAuth"
  />
  <template v-else>
    <router-view></router-view>
    <Tabbar />
  </template>
</template>

<style src="./assets/css/app.css"></style>
