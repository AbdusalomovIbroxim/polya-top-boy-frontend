<template>
  <div class="favorites-page">
    <!-- Header -->
    <div class="favorites-header">
      <h2 class="favorites-title">Избранное</h2>
    </div>

    <!-- Content -->
    <div class="favorites-list">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Загрузка избранного...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Ошибка загрузки</h3>
        <p class="error-text">{{ error }}</p>
        <button @click="loadFavorites" class="retry-button">
          Попробовать снова
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">❤️</div>
        <h3 class="empty-title">Нет избранных стадионов</h3>
        <p class="empty-text">
          Добавьте стадионы в избранное, чтобы быстро находить их здесь.
        </p>
      </div>

      <!-- Favorites list -->
      <div v-else class="favorites-grid">
        <div 
          v-for="(stadium, index) in favorites" 
          :key="stadium?.id || index"
          class="stadium-card"
          @click="goToStadium(stadium.id)"
        >
          <!-- Stadium Image -->
          <div class="stadium-image" :style="getStadiumImageStyle(stadium)"></div>
          
          <!-- Stadium Info -->
          <div class="stadium-info">
            <h3 class="stadium-title">{{ getStadiumTitle(stadium) }}</h3>
            <div class="stadium-details">
              <span class="distance">{{ getStadiumDistance(stadium) }}</span>
              <span class="separator">·</span>
              <span class="rating">{{ getStadiumRating(stadium) }}</span>
              <span class="reviews">({{ getStadiumReviews(stadium) }})</span>
            </div>
          </div>
          
          <!-- Price -->
          <div class="stadium-price">
            <span class="price-value">{{ getStadiumPrice(stadium) }}</span>
            <span class="price-unit">/час</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';
import '../assets/css/favorites.css';

const router = useRouter();
const { isAuth, checkAuth } = useAuth();

const favorites = ref([]);
const isLoading = ref(false);
const error = ref('');

// Загрузка избранных стадионов
async function loadFavorites() {
  isLoading.value = true;
  error.value = '';
  
  try {
    // TODO: Заменить на реальный API вызов
    // const data = await getFavorites();
    
    // Временные данные для демонстрации
    const mockData = [
      {
        id: 1,
        name: "Stadium A",
        image: "https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️",
        distance: "1.2 км",
        rating: 5.0,
        reviews: 120,
        price: 20000
      },
      {
        id: 2,
        name: "Stadium B", 
        image: "https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️",
        distance: "2.5 км",
        rating: 4.8,
        reviews: 85,
        price: 25000
      },
      {
        id: 3,
        name: "Stadium C",
        image: "https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️", 
        distance: "3.1 км",
        rating: 4.5,
        reviews: 60,
        price: 30000
      }
    ];
    
    favorites.value = mockData;
  } catch (err) {
    console.error('Error loading favorites:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load favorites. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Получение стиля изображения стадиона
function getStadiumImageStyle(stadium) {
  if (!stadium) {
    return {
      backgroundImage: 'url(https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️)'
    };
  }
  
  let imageUrl = 'https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️';
  
  if (stadium.image) {
    imageUrl = stadium.image;
  } else if (stadium.images && stadium.images.length > 0) {
    imageUrl = stadium.images[0].image;
  }
  
  return {
    backgroundImage: `url(${imageUrl})`
  };
}

// Получение названия стадиона
function getStadiumTitle(stadium) {
  if (!stadium) return 'Unknown Stadium';
  return stadium.name || 'Unknown Stadium';
}

// Получение расстояния до стадиона
function getStadiumDistance(stadium) {
  if (!stadium) return 'Unknown';
  return stadium.distance || 'Unknown';
}

// Получение рейтинга стадиона
function getStadiumRating(stadium) {
  if (!stadium || !stadium.rating) return '0.0';
  return stadium.rating.toFixed(1);
}

// Получение количества отзывов
function getStadiumReviews(stadium) {
  if (!stadium || !stadium.reviews) return '0';
  return stadium.reviews;
}

// Получение цены стадиона
function getStadiumPrice(stadium) {
  if (!stadium || !stadium.price) return '0';
  return stadium.price.toLocaleString('ru-RU');
}

// Переход к стадиону
function goToStadium(stadiumId) {
  router.push(`/stadium/${stadiumId}`);
}

onMounted(async () => {
  console.log('DEBUG: FavoritesPage mounted');
  
  try {
    await checkAuth();
    console.log('DEBUG: Auth check completed, isAuth =', isAuth.value);
    
    if (isAuth.value) {
      console.log('DEBUG: User authenticated, loading favorites');
      await loadFavorites();
    } else {
      console.log('DEBUG: User not authenticated, but loading favorites anyway');
      await loadFavorites();
    }
  } catch (error) {
    console.error('DEBUG: Auth check failed:', error);
    await loadFavorites();
  }
});
</script> 