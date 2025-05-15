<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Скелетон для карточек бронирований -->
    <div v-for="n in 3" :key="n" class="skeleton-booking">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="skeleton-line court-name"></div>
          <div class="skeleton-line date-time"></div>
        </div>
        <div class="skeleton-line status"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingHistorySkeleton'
}
</script>

<style scoped>
.skeleton-booking {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-line.court-name {
  width: 60%;
  height: 24px;
}

.skeleton-line.date-time {
  width: 40%;
}

.skeleton-line.status {
  width: 120px;
  height: 20px;
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