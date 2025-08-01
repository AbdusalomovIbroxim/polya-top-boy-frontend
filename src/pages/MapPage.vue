<template>
  <div class="map-page">
    <MapSkeleton v-if="isLoading" />
    <div v-else>
      <!-- Header -->
      <div class="map-header">
        <h2 class="map-title">Карта стадионов</h2>
      </div>

      <!-- Map Container -->
      <div class="map-container">
        <div ref="mapContainer" class="map"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getSportVenues } from '../api/fields.js';
import { MapSkeleton } from '../components';
import '../assets/css/map.css';

const router = useRouter();
const mapContainer = ref(null);
const map = ref(null);
const isLoading = ref(true);

// Инициализация карты
async function initMap() {
  try {
    // Загружаем Mapbox
    const mapboxgl = await import('mapbox-gl');
    
    // Устанавливаем токен (замените на ваш токен)
    mapboxgl.default.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
    
    // Создаем карту
    map.value = new mapboxgl.default.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [69.2163, 41.2995], // Ташкент
      zoom: 12
    });

    // Загружаем стадионы
    await loadStadiums();
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error initializing map:', error);
    isLoading.value = false;
  }
}

// Загрузка стадионов
async function loadStadiums() {
  try {
    const stadiums = await getSportVenues();
    
    // Добавляем маркеры для каждого стадиона
    stadiums.forEach(stadium => {
      if (stadium.latitude && stadium.longitude) {
        // Создаем маркер
        const marker = new mapboxgl.default.Marker()
          .setLngLat([stadium.longitude, stadium.latitude])
          .addTo(map.value);

        // Добавляем popup
        const popup = new mapboxgl.default.Popup({ offset: 25 })
          .setHTML(`
            <div class="stadium-popup">
              <h3>${stadium.name}</h3>
              <p>${stadium.address || 'Адрес не указан'}</p>
              <button onclick="window.location.href='#/stadium/${stadium.id}'">
                Подробнее
              </button>
            </div>
          `);

        marker.setPopup(popup);
      }
    });
  } catch (error) {
    console.error('Error loading stadiums:', error);
  }
}

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script> 