<template>
  <div class="profile-skeleton">
    <!-- Хедер скелетон -->
    <div class="profile-header-skeleton">
      <div class="avatar-section-skeleton">
        <div class="skeleton skeleton-avatar"></div>
        <div class="user-info-skeleton">
          <div class="skeleton skeleton-title" style="width: 150px; margin-bottom: 8px;"></div>
          <div class="skeleton skeleton-text" style="width: 100px; margin-bottom: 4px;"></div>
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
        </div>
      </div>
      <div class="skeleton skeleton-button" style="width: 100px; height: 40px;"></div>
    </div>

    <!-- Информационная карточка скелетон -->
    <div class="info-card-skeleton">
      <div class="skeleton skeleton-title" style="width: 200px; margin-bottom: 1rem;"></div>
      <div class="info-grid-skeleton">
        <div v-for="i in 4" :key="i" class="info-item-skeleton">
          <div class="skeleton skeleton-text" style="width: 120px;"></div>
          <div class="skeleton skeleton-text" style="width: 100px;"></div>
        </div>
      </div>
    </div>

    <!-- Статистика скелетон -->
    <div class="stats-card-skeleton">
      <div class="skeleton skeleton-title" style="width: 150px; margin-bottom: 1rem;"></div>
      <div class="stats-grid-skeleton">
        <div v-for="i in 3" :key="i" class="stat-item-skeleton">
          <div class="skeleton skeleton-title" style="width: 40px; height: 30px; margin-bottom: 8px;"></div>
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
        </div>
      </div>
    </div>

    <!-- Действия скелетон -->
    <div class="actions-card-skeleton">
      <div class="skeleton skeleton-title" style="width: 120px; margin-bottom: 1rem;"></div>
      <div class="actions-grid-skeleton">
        <div v-for="i in 3" :key="i" class="action-item-skeleton">
          <div class="skeleton skeleton-button" style="width: 100%; height: 50px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileSkeleton'
}
</script>

<style scoped>
.profile-skeleton {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.profile-header-skeleton {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-card-skeleton, .stats-card-skeleton, .actions-card-skeleton {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.info-grid-skeleton {
  display: grid;
  gap: 1rem;
}

.info-item-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item-skeleton:last-child {
  border-bottom: none;
}

.stats-grid-skeleton {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item-skeleton {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.actions-grid-skeleton {
  display: grid;
  gap: 0.75rem;
}

.action-item-skeleton {
  width: 100%;
}

@media (max-width: 480px) {
  .profile-header-skeleton {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid-skeleton {
    grid-template-columns: 1fr;
  }
  
  .info-item-skeleton {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style> 