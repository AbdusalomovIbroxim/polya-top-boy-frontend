<template>
  <div class="mobile-app-root">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import telegramAuth from './services/telegramAuth';

const router = useRouter();

onMounted(() => {
  const isAuthenticated = telegramAuth.isAuthenticated();
  const currentPath = router.currentRoute.value.path;
  
  if (!isAuthenticated && currentPath !== '/auth') {
    router.push('/auth');
  }
  
  if (isAuthenticated && currentPath === '/auth') {
    router.push('/');
  }
});
</script>

<style>
</style>
