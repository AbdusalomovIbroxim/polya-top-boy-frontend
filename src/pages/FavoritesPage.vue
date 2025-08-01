<template>
  <div class="favorites-page">
    <!-- Header -->
    <div class="favorites-header">
      <h2 class="favorites-title">Избранное</h2>
    </div>

    <!-- Content -->
    <div class="favorites-list">
      <!-- Loading state -->
      <FavoritesSkeleton v-if="isLoading" />

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
        >
          <!-- Stadium Image -->
          <div class="stadium-image" :style="getStadiumImageStyle(stadium)" @click="goToStadium(stadium)"></div>
          
          <!-- Stadium Info -->
          <div class="stadium-info" @click="goToStadium(stadium)">
            <h3 class="stadium-title">{{ getStadiumTitle(stadium) }}</h3>
            <div class="stadium-details">
              <span class="distance">{{ getStadiumDistance(stadium) }}</span>
              <span class="separator">·</span>
              <span class="rating">{{ getStadiumRating(stadium) }}</span>
              <span class="reviews">({{ getStadiumReviews(stadium) }})</span>
            </div>
          </div>
          
          <!-- Price -->
          <div class="stadium-price" @click="goToStadium(stadium)">
            <span class="price-value">{{ getStadiumPrice(stadium) }}</span>
            <span class="price-unit">/час</span>
          </div>
          
          <!-- Remove from favorites button -->
          <button 
            class="remove-favorite-btn"
            @click.stop="removeFromFavoritesHandler(stadium.id)"
            title="Удалить из избранного"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';
import { FavoritesSkeleton } from '../components';
import { getUserFavorites, removeFromFavorites } from '../api/favorites.js';
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
    console.log('DEBUG: Loading favorites from API');
    const data = await getUserFavorites();
    console.log('DEBUG: Favorites data received:', data);
    
    // Проверяем структуру данных
    if (data && Array.isArray(data)) {
      console.log('DEBUG: Data is array with length:', data.length);
      favorites.value = data;
    } else if (data && typeof data === 'object') {
      console.log('DEBUG: Data is object, checking for results property');
      if (data.results && Array.isArray(data.results)) {
        console.log('DEBUG: Using data.results array');
        favorites.value = data.results;
      } else {
        console.log('DEBUG: Data is object but no results array, using as single item');
        favorites.value = [data];
      }
    } else {
      console.log('DEBUG: Data is not array or object, setting empty array');
      favorites.value = [];
    }
    
    console.log('DEBUG: Final favorites.value:', favorites.value);
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
  
  // Получаем данные стадиона из структуры API
  const stadiumData = stadium.sport_venue_details || stadium;
  
  let imageUrl = 'https://via.placeholder.com/80x80/53d22c/ffffff?text=🏟️';
  
  if (stadiumData.image) {
    imageUrl = stadiumData.image;
  } else if (stadiumData.images && stadiumData.images.length > 0) {
    imageUrl = stadiumData.images[0].image;
  }
  
  return {
    backgroundImage: `url(${imageUrl})`
  };
}

// Получение названия стадиона
function getStadiumTitle(stadium) {
  if (!stadium) return 'Unknown Stadium';
  const stadiumData = stadium.sport_venue_details || stadium;
  return stadiumData.name || 'Unknown Stadium';
}

// Получение расстояния до стадиона
function getStadiumDistance(stadium) {
  if (!stadium) return 'Unknown';
  const stadiumData = stadium.sport_venue_details || stadium;
  return stadiumData.distance || 'Unknown';
}

// Получение рейтинга стадиона
function getStadiumRating(stadium) {
  if (!stadium) return '0.0';
  const stadiumData = stadium.sport_venue_details || stadium;
  if (!stadiumData.rating) return '0.0';
  return stadiumData.rating.toFixed(1);
}

// Получение количества отзывов
function getStadiumReviews(stadium) {
  if (!stadium) return '0';
  const stadiumData = stadium.sport_venue_details || stadium;
  return stadiumData.reviews || '0';
}

// Получение цены стадиона
function getStadiumPrice(stadium) {
  if (!stadium) return '0';
  const stadiumData = stadium.sport_venue_details || stadium;
  if (!stadiumData.price_per_hour) return '0';
  return parseInt(stadiumData.price_per_hour).toLocaleString('ru-RU');
}

// Переход к стадиону
function goToStadium(stadium) {
  // Получаем ID стадиона из структуры API
  const stadiumId = stadium.sport_venue || stadium.sport_venue_details?.id || stadium.id;
  router.push(`/stadium/${stadiumId}`);
}

// Удаление из избранного
async function removeFromFavoritesHandler(stadiumId) {
  try {
    console.log('DEBUG: Removing from favorites:', stadiumId);
    await removeFromFavorites(stadiumId);
    console.log('DEBUG: Successfully removed from favorites');
    
    // Обновляем список избранного
    await loadFavorites();
  } catch (err) {
    console.error('Error removing from favorites:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to remove from favorites. Please try again.';
  }
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