<template>
  <div class="booking-skeleton">
    <!-- Хедер скелетон -->
    <div class="booking-header-skeleton">
      <div class="skeleton skeleton-title" style="width: 200px; height: 24px;"></div>
    </div>

    <!-- Информация о стадионе скелетон -->
    <div class="stadium-info-skeleton">
      <div class="skeleton skeleton-image" style="height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>
      <div class="stadium-details-skeleton">
        <div class="skeleton skeleton-title" style="width: 80%; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 4px;"></div>
        <div class="skeleton skeleton-text" style="width: 40%;"></div>
      </div>
    </div>

    <!-- Форма бронирования скелетон -->
    <div class="booking-form-skeleton">
      <div class="form-section-skeleton">
        <div class="skeleton skeleton-title" style="width: 150px; margin-bottom: 1rem;"></div>
        
        <div class="form-fields-skeleton">
          <div v-for="i in 4" :key="i" class="form-field-skeleton">
            <div class="skeleton skeleton-text" style="width: 100px; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-button" style="width: 100%; height: 40px;"></div>
          </div>
        </div>
      </div>

      <div class="form-section-skeleton">
        <div class="skeleton skeleton-title" style="width: 120px; margin-bottom: 1rem;"></div>
        
        <div class="time-slots-skeleton">
          <div v-for="i in 6" :key="i" class="time-slot-skeleton">
            <div class="skeleton skeleton-button" style="width: 80px; height: 40px;"></div>
          </div>
        </div>
      </div>

      <div class="form-section-skeleton">
        <div class="skeleton skeleton-title" style="width: 100px; margin-bottom: 1rem;"></div>
        
        <div class="price-summary-skeleton">
          <div class="price-row-skeleton">
            <div class="skeleton skeleton-text" style="width: 120px;"></div>
            <div class="skeleton skeleton-text" style="width: 80px;"></div>
          </div>
          <div class="price-row-skeleton">
            <div class="skeleton skeleton-text" style="width: 100px;"></div>
            <div class="skeleton skeleton-text" style="width: 60px;"></div>
          </div>
          <div class="price-total-skeleton">
            <div class="skeleton skeleton-title" style="width: 80px;"></div>
            <div class="skeleton skeleton-title" style="width: 100px;"></div>
          </div>
        </div>
      </div>

      <div class="submit-button-skeleton">
        <div class="skeleton skeleton-button" style="width: 100%; height: 50px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingSkeleton'
}
</script>

<style scoped>
.booking-skeleton {
  padding: 1rem;
}

.booking-header-skeleton {
  margin-bottom: 1.5rem;
}

.stadium-info-skeleton {
  margin-bottom: 2rem;
}

.stadium-details-skeleton {
  padding: 1rem;
}

.booking-form-skeleton {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section-skeleton {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-fields-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field-skeleton {
  display: flex;
  flex-direction: column;
}

.time-slots-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.price-summary-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-total-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.submit-button-skeleton {
  margin-top: 1rem;
}
</style> 