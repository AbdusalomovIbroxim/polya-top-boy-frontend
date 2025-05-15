<template>
  <div class="flex flex-col gap-4 w-full -mx-4" style="width:100vw;">
    <!-- Скелетон для избранных стадионов -->
    <div v-for="n in 3" :key="n" class="skeleton-favorite w-full">
      <div class="skeleton-image w-full rounded-2xl"></div>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line location"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoritesSkeleton'
}
</script>

<style scoped>
.skeleton-favorite {
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  width: 100%;
}

.skeleton-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
  width: 100%;
  object-fit: cover;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f1f4f0 25%, #e0e0e0 50%, #f1f4f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-line.title {
  width: 70%;
  height: 28px;
}

.skeleton-line.location {
  width: 85%;
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