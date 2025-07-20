<template>
  <div class="error-container">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-8h2v6h-2z"/>
      </svg>
    </div>
    <div class="error-title">Ошибка авторизации</div>
    <div class="error-message">{{ error }}</div>
    <div v-if="debugInfo" class="error-debug">
      <strong>Отладочная информация:</strong><br>
      {{ debugInfo }}
    </div>
    <div class="error-actions">
      <button class="retry-btn" @click="$emit('retry')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Попробовать снова
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorScreen',
  props: {
    error: {
      type: String,
      required: true
    },
    debugInfo: {
      type: String,
      default: ''
    }
  },
  emits: ['retry']
}
</script>

<style src="../assets/css/components/loading.css"></style> 