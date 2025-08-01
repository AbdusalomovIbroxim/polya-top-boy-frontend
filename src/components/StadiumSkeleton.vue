<template>
  <div class="stadium-skeleton">
    <!-- Изображение стадиона скелетон -->
    <div class="stadium-image-skeleton">
      <div class="skeleton skeleton-image" style="height: 250px; width: 100%;"></div>
    </div>

    <!-- Информация о стадионе скелетон -->
    <div class="stadium-info-skeleton">
      <div class="stadium-header-skeleton">
        <div class="skeleton skeleton-title" style="width: 80%; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 4px;"></div>
        <div class="skeleton skeleton-text" style="width: 40%;"></div>
      </div>

      <!-- Рейтинг и отзывы скелетон -->
      <div class="rating-skeleton">
        <div class="skeleton skeleton-text" style="width: 60px; height: 20px;"></div>
        <div class="skeleton skeleton-text" style="width: 80px;"></div>
      </div>

      <!-- Детали стадиона скелетон -->
      <div class="stadium-details-skeleton">
        <div v-for="i in 4" :key="i" class="detail-item-skeleton">
          <div class="skeleton skeleton-text" style="width: 100px;"></div>
          <div class="skeleton skeleton-text" style="width: 150px;"></div>
        </div>
      </div>

      <!-- Описание скелетон -->
      <div class="description-skeleton">
        <div class="skeleton skeleton-title" style="width: 120px; margin-bottom: 1rem;"></div>
        <div v-for="i in 3" :key="i" class="skeleton skeleton-text" style="width: 100%; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 70%;"></div>
      </div>

      <!-- Кнопки действий скелетон -->
      <div class="actions-skeleton">
        <div class="skeleton skeleton-button" style="width: 100%; height: 50px; margin-bottom: 1rem;"></div>
        <div class="skeleton skeleton-button" style="width: 100%; height: 50px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumSkeleton'
}
</script>

<style scoped>
.stadium-skeleton {
  background: white;
}

.stadium-image-skeleton {
  position: relative;
  width: 100%;
}

.stadium-info-skeleton {
  padding: 1.5rem;
}

.stadium-header-skeleton {
  margin-bottom: 1.5rem;
}

.rating-skeleton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stadium-details-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description-skeleton {
  margin-bottom: 2rem;
}

.actions-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style> 