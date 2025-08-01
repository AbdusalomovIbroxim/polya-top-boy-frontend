<template>
  <div class="favorites-skeleton">
    <!-- Хедер скелетон -->
    <div class="favorites-header-skeleton">
      <div class="skeleton skeleton-title" style="width: 150px; height: 24px;"></div>
    </div>

    <!-- Список избранного скелетон -->
    <div class="favorites-list-skeleton">
      <div v-for="i in 4" :key="i" class="stadium-card-skeleton">
        <div class="stadium-image-skeleton">
          <div class="skeleton skeleton-image" style="height: 80px; width: 80px; border-radius: 8px;"></div>
        </div>
        <div class="stadium-info-skeleton">
          <div class="skeleton skeleton-title" style="width: 70%; margin-bottom: 8px;"></div>
          <div class="stadium-details-skeleton">
            <div class="skeleton skeleton-text" style="width: 60px;"></div>
            <div class="skeleton skeleton-text" style="width: 40px;"></div>
            <div class="skeleton skeleton-text" style="width: 30px;"></div>
          </div>
        </div>
        <div class="stadium-price-skeleton">
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
          <div class="skeleton skeleton-text" style="width: 40px; margin-top: 4px;"></div>
        </div>
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
.favorites-skeleton {
  padding: 1rem;
}

.favorites-header-skeleton {
  margin-bottom: 1.5rem;
}

.favorites-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stadium-card-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stadium-image-skeleton {
  flex-shrink: 0;
}

.stadium-info-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stadium-details-skeleton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stadium-price-skeleton {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}
</style> 