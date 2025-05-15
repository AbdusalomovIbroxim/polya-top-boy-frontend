<template>
  <div class="flex flex-col gap-4">
    <!-- Скелетон для карточек стадионов -->
    <div v-for="n in 3" :key="n" class="skeleton-card w-full">
      <div class="skeleton-image w-full rounded-2xl"></div>
      <div class="p-4 flex flex-col gap-2">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line location"></div>
        <div class="skeleton-line price"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSkeleton'
}
</script>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px 16px 0 0;
  width: 100%;
  object-fit: cover;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.title {
  width: 70%;
  height: 24px;
}

.skeleton-line.location {
  width: 85%;
}

.skeleton-line.price {
  width: 40%;
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