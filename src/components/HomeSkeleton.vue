<template>
  <div class="home-skeleton">
    <!-- Навбар скелетон -->
    <div class="navbar-skeleton">
      <div class="skeleton skeleton-title" style="width: 80px; height: 20px;"></div>
    </div>
    
    <!-- Фильтры скелетон -->
    <div class="filters-skeleton">
      <div class="skeleton skeleton-button" style="width: 120px; height: 40px;"></div>
      <div class="skeleton skeleton-button" style="width: 100px; height: 40px;"></div>
    </div>
    
    <!-- Список стадионов скелетон -->
    <div class="stadiums-skeleton">
      <div v-for="i in 6" :key="i" class="stadium-card-skeleton">
        <div class="skeleton skeleton-image" style="height: 150px;"></div>
        <div class="stadium-info-skeleton">
          <div class="skeleton skeleton-title" style="width: 70%; margin-bottom: 8px;"></div>
          <div class="skeleton skeleton-text" style="width: 50%; margin-bottom: 4px;"></div>
          <div class="skeleton skeleton-text" style="width: 60%;"></div>
        </div>
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
.home-skeleton {
  padding: 1rem;
}

.navbar-skeleton {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.filters-skeleton {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stadiums-skeleton {
  display: grid;
  gap: 1rem;
}

.stadium-card-skeleton {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stadium-info-skeleton {
  padding: 1rem;
}
</style> 