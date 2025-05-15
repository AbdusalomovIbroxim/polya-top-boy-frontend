<template>
  <div class="flex w-full flex-col gap-4 items-start mt-16">
    <div class="flex gap-4 flex-col items-start">
      <!-- Аватар скелетон -->
      <div class="skeleton-circle min-h-32 w-32"></div>
      
      <!-- Информация пользователя скелетон -->
      <div class="flex flex-col justify-center gap-2">
        <div class="skeleton-line username"></div>
        <div class="skeleton-line name"></div>
        <div class="skeleton-line phone"></div>
        <div class="skeleton-line date"></div>
      </div>
    </div>
    
    <!-- Кнопка скелетон -->
    <div class="skeleton-button"></div>
  </div>
</template>

<script>
export default {
  name: 'ProfileSkeleton'
}
</script>

<style scoped>
.skeleton-circle {
  border-radius: 50%;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 24px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.username {
  width: 180px;
  height: 28px;
}

.skeleton-line.name {
  width: 220px;
  height: 20px;
}

.skeleton-line.phone {
  width: 160px;
  height: 20px;
}

.skeleton-line.date {
  width: 200px;
  height: 20px;
}

.skeleton-button {
  width: 100%;
  max-width: 480px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@media (min-width: 480px) {
  .skeleton-button {
    width: auto;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style> 