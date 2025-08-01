<template>
  <div class="stadium-page" v-if="stadium">
    <!-- Навбар -->
    <div class="stadium-navbar">
      <button @click="goBack" class="nav-back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      
      <button 
        class="nav-favorite-btn" 
        :class="{ 'favorite-active': isFavorite }"
        @click="toggleFavorite"
        :disabled="isFavoriteLoading"
      >
        <svg v-if="!isFavoriteLoading" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
          <path v-if="isFavorite" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          <path v-else d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div v-else class="loading-spinner-small"></div>
      </button>
    </div>

    <div class="gallery-block" v-if="stadium.images && stadium.images.length">
      <img :src="activeImage" alt="stadium" class="main-image" />
      <div class="gallery-thumbs">
        <img
          v-for="img in stadium.images"
          :key="img.id"
          :src="img.image"
          :alt="'thumb-' + img.id"
          :class="['thumb', { active: img.image === activeImage }]"
          @click="activeImage = img.image"
        />
      </div>
    </div>
    <h1 class="stadium-title" style="text-overflow: none; white-space: none;">{{ stadium.name }}</h1>
    <div class="info-row">
      <span class="price">{{ formatPrice(stadium.price_per_hour) }} сум/час</span>
      <span class="address"><span class="icon">📍</span>{{ stadium.address }}</span>
    </div>
    <div class="mapbox-block" v-if="stadium.latitude && stadium.longitude">
      <div ref="mapContainer" class="mapbox-map"></div>
    </div>
    <div class="map-block" v-else-if="stadium.yandex_map_url">
      <iframe
        :src="stadium.yandex_map_url"
        width="100%"
        height="200"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <p class="description">{{ stadium.description }}</p>
    <div class="action-buttons">
      <button class="book-btn" @click="handleBookStadium">Забронировать</button>
    </div>
  </div>
  <StadiumSkeleton v-else />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSportVenue } from '../api/fields';
import { useAuth } from '../composables/useAuth';
import { StadiumSkeleton } from '../components';
import { addToFavorites, removeFromFavorites, checkFavoriteStatus } from '../api/favorites';

const route = useRoute();
const router = useRouter();
const { isAuth } = useAuth();
const stadium = ref(null);
const activeImage = ref('');
const mapContainer = ref(null);
const isFavorite = ref(false);
const isFavoriteLoading = ref(false);
let mapInstance = null;
let mapboxgl;

function goBack() {
  router.back();
}

function formatPrice(value) {
  if (!value) return '-';
  const num = parseInt(value, 10);
  if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + ' млн';
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + ' тыс';
  return num.toLocaleString('ru-RU');
}

function handleBookStadium() {
  if (isAuth.value) {
    // Пользователь авторизован - переходим на страницу бронирования
    router.push(`/booking/${stadium.value.id}`);
  } else {
    // Пользователь не авторизован - перенаправляем на логин
    router.push('/login');
  }
}

// Проверка статуса избранного
async function checkFavorite() {
  if (!isAuth.value || !stadium.value) {
    isFavorite.value = false;
    return;
  }
  
  try {
    isFavoriteLoading.value = true;
    console.log('DEBUG: Checking favorite status for stadium:', stadium.value.id);
    const data = await checkFavoriteStatus(stadium.value.id);
    isFavorite.value = data.is_favorite || false;
    console.log('DEBUG: Favorite status result:', isFavorite.value);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    isFavorite.value = false;
  } finally {
    isFavoriteLoading.value = false;
  }
}

// Добавление/удаление из избранного
async function toggleFavorite() {
  if (!isAuth.value) {
    router.push('/login');
    return;
  }
  
  if (!stadium.value) return;
  
  try {
    isFavoriteLoading.value = true;
    
    if (isFavorite.value) {
      console.log('DEBUG: Removing from favorites:', stadium.value.id);
      await removeFromFavorites(stadium.value.id);
      isFavorite.value = false;
      console.log('DEBUG: Successfully removed from favorites');
    } else {
      console.log('DEBUG: Adding to favorites:', stadium.value.id);
      await addToFavorites(stadium.value.id);
      isFavorite.value = true;
      console.log('DEBUG: Successfully added to favorites');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    // Показываем пользователю ошибку, если что-то пошло не так
    // Можно добавить toast уведомление здесь
  } finally {
    isFavoriteLoading.value = false;
  }
}

async function loadMapbox() {
  if (!mapboxgl) {
    mapboxgl = (await import('mapbox-gl')).default;
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJyYWhhbTEyMzEyMzEyIiwiYSI6ImNtZDdlNHc5MDBldGcya3M0Y3hobW40MzQifQ.76GHpdTXl6QHMnN_F6GAng';
  }
}

async function initMap() {
  if (!stadium.value || !stadium.value.latitude || !stadium.value.longitude) return;
  await loadMapbox();
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  const lng = Number(stadium.value.longitude);
  const lat = Number(stadium.value.latitude);

  // Подожди, пока DOM полностью прогрузится
  await nextTick();

  // Создай карту
  mapInstance = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 15,
  });

  // Установи маркер
  new mapboxgl.Marker({ color: '#36d900' })
    .setLngLat([lng, lat])
    .addTo(mapInstance);

  // Вызови resize после создания карты и отображения контейнера
  setTimeout(() => {
    mapInstance.resize();
    mapInstance.setCenter([lng, lat]); // Повторно центрируем
  }, 200); // Лучше чуть позже, чтобы быть уверенным

  // 🔒 Убираем moveend/zoomend — это лишнее
}

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      stadium.value = await getSportVenue(id);
      if (stadium.value.images && stadium.value.images.length) {
        activeImage.value = stadium.value.images[0].image;
      }
      if (stadium.value.latitude && stadium.value.longitude) {
        await initMap();
      }
      
      // Проверяем статус избранного после загрузки стадиона
      await checkFavorite();
    } catch (e) {
      stadium.value = null;
    }
  }
});

watch(() => stadium.value, async (val) => {
  if (val && val.latitude && val.longitude) {
    await initMap();
  }
});

// Следим за изменением статуса авторизации
watch(() => isAuth.value, async (newAuth) => {
  if (newAuth && stadium.value) {
    // Если пользователь авторизовался, проверяем статус избранного
    await checkFavorite();
  } else if (!newAuth) {
    // Если пользователь вышел, сбрасываем статус избранного
    isFavorite.value = false;
  }
});
</script>

<style scoped>
.stadium-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}

.stadium-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.nav-back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  height: 40px;
}

.nav-back-button:hover {
  background: #e9ecef;
  color: #495057;
}

.nav-back-button svg {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #131712;
  margin: 0;
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 12px;
}

.nav-favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  padding: 8px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  height: 40px;
  position: relative;
  overflow: hidden;
}

.nav-favorite-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.nav-favorite-btn:hover::before {
  width: 100%;
  height: 100%;
}

.nav-favorite-btn:hover {
  color: #495057;
  transform: scale(1.1);
}

.nav-favorite-btn.favorite-active {
  color: #e91e63;
  animation: heartBeat 0.6s ease-in-out;
}

.nav-favorite-btn.favorite-active:hover {
  color: #c2185b;
  transform: scale(1.15);
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

.nav-favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-favorite-btn svg {
  width: 20px;
  height: 20px;
}

.gallery-block {
  margin-bottom: 18px;
}
.main-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 10px;
  background: #f1f1f1;
}
.gallery-thumbs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.thumb {
  width: 60px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  border: 2px solid transparent;
  transition: border 0.2s, opacity 0.2s;
}
.thumb.active {
  opacity: 1;
  border: 2px solid #36d900;
}
.stadium-title {
  font-size: 1.5em;
  font-weight: 700;
  margin: 10px 0 8px 0;
  color: #131712;
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.08em;
}
.price {
  color: #36d900;
  font-weight: 600;
}
.address {
  color: #6d8566;
  display: flex;
  align-items: center;
}
.address .icon {
  margin-right: 6px;
}
.mapbox-block {
  margin: 18px 0 10px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.mapbox-map {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  position: relative;
}
/* Скрыть логотип и copyright Mapbox */
.mapbox-map .mapboxgl-ctrl-logo,
.mapbox-map .mapboxgl-ctrl-attrib,
.mapbox-map .mapboxgl-ctrl-bottom-right,
.mapbox-map .mapboxgl-ctrl-bottom-left {
  display: none !important;
}
.map-block {
  margin: 18px 0 10px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.description {
  margin: 18px 0 10px 0;
  font-size: 1.1em;
  color: #222;
  line-height: 1.5;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px 16px;
}
.action-buttons {
  margin-top: 18px;
}

.book-btn {
  background: #36d900;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1.1em;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(54,217,0,0.07);
}

.book-btn:hover {
  background: #28a700;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  border-top: 2px solid #6c757d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stadium-loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 768px) {
  .stadium-navbar {
    padding: 12px 0;
  }
  
  .nav-title {
    font-size: 1.1em;
    padding: 0 8px;
  }
  
  .nav-back-button,
  .nav-favorite-btn {
    min-width: 36px;
    height: 36px;
  }
  
  .nav-back-button svg,
  .nav-favorite-btn svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .stadium-navbar {
    padding: 8px 0;
  }
  
  .nav-title {
    font-size: 1em;
    padding: 0 4px;
  }
  
  .nav-back-button,
  .nav-favorite-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .nav-back-button svg,
  .nav-favorite-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style> 