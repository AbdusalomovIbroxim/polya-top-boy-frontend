<template>
  <div class="bookings-skeleton">
    <!-- Хедер скелетон -->
    <div class="bookings-header-skeleton">
      <div class="skeleton skeleton-title" style="width: 180px; height: 24px;"></div>
    </div>

    <!-- Список бронирований скелетон -->
    <div class="bookings-list-skeleton">
      <div v-for="i in 5" :key="i" class="booking-card-skeleton">
        <div class="booking-header-skeleton">
          <div class="skeleton skeleton-title" style="width: 60%; margin-bottom: 8px;"></div>
          <div class="skeleton skeleton-text" style="width: 40%;"></div>
        </div>
        
        <div class="booking-details-skeleton">
          <div class="detail-row-skeleton">
            <div class="skeleton skeleton-text" style="width: 80px;"></div>
            <div class="skeleton skeleton-text" style="width: 120px;"></div>
          </div>
          <div class="detail-row-skeleton">
            <div class="skeleton skeleton-text" style="width: 60px;"></div>
            <div class="skeleton skeleton-text" style="width: 100px;"></div>
          </div>
          <div class="detail-row-skeleton">
            <div class="skeleton skeleton-text" style="width: 70px;"></div>
            <div class="skeleton skeleton-text" style="width: 80px;"></div>
          </div>
        </div>
        
        <div class="booking-status-skeleton">
          <div class="skeleton skeleton-button" style="width: 100px; height: 30px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingsSkeleton'
}
</script>

<style scoped>
.bookings-skeleton {
  padding: 1rem;
}

.bookings-header-skeleton {
  margin-bottom: 1.5rem;
}

.bookings-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card-skeleton {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-header-skeleton {
  margin-bottom: 1rem;
}

.booking-details-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-status-skeleton {
  display: flex;
  justify-content: flex-end;
}
</style> 