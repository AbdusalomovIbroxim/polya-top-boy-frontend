<template>
  <div class="map-skeleton">
    <!-- Хедер скелетон -->
    <div class="map-header-skeleton">
      <div class="skeleton skeleton-title" style="width: 200px; height: 24px;"></div>
    </div>

    <!-- Карта скелетон -->
    <div class="map-container-skeleton">
      <div class="skeleton skeleton-image" style="height: 400px; border-radius: 8px;"></div>
      
      <!-- Загрузка скелетон -->
      <div class="map-loading-skeleton">
        <div class="loading-spinner-skeleton"></div>
        <div class="skeleton skeleton-text" style="width: 150px; margin-top: 1rem;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapSkeleton'
}
</script>

<style scoped>
.map-skeleton {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-header-skeleton {
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.map-container-skeleton {
  flex: 1;
  position: relative;
  background: #f8f9fa;
}

.map-loading-skeleton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-spinner-skeleton {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 