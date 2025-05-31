<template>
  <div class="map-container">
    <div id="map" ref="mapElement"></div>
    <button class="close-button" @click="$emit('close')">Закрыть карту</button>
    <div v-if="loading" class="loading-indicator">Загрузка карты...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
/* global ymaps */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

export default {
  name: 'MapView',
  props: {
    stadiums: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const mapElement = ref(null);
    const map = ref(null);
    const loading = ref(true);
    const error = ref(null);
    let objectManager = null;

    const initMap = () => {
      try {
        ymaps.ready(() => {
          if (!mapElement.value) return;

          map.value = new ymaps.Map(mapElement.value, {
            center: [41.2995, 69.2401], // Центр Ташкента
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl'],
          });

          objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
            clusterDisableClickZoom: false
          });
          map.value.geoObjects.add(objectManager);

          addMarkers(props.stadiums);

          loading.value = false;
        });
      } catch (e) {
        console.error("Error initializing Yandex Map:", e);
        error.value = "Ошибка загрузки карты. Попробуйте позже.";
        loading.value = false;
      }
    };

    const addMarkers = (stadiums) => {
      if (!objectManager) return;

      const features = stadiums.map((stadium) => ({
        type: 'Feature',
        id: stadium.id,
        geometry: {
          type: 'Point',
          coordinates: [stadium.latitude, stadium.longitude],
        },
        properties: {
          hintContent: stadium.name,
        },
      }));

      objectManager.removeAll();
      objectManager.add(features);
    };

    onMounted(() => {
      if (typeof ymaps === 'undefined') {
        error.value = "Яндекс Карты не загружены. Проверьте подключение или ключ API.";
        loading.value = false;
      } else {
        initMap();
      }
    });

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.destroy();
        map.value = null;
        objectManager = null;
      }
    });

    watch(() => props.stadiums, (newStadiums) => {
      addMarkers(newStadiums);
    });

    return { mapElement, loading, error };
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  cursor: pointer;
}

.loading-indicator,
.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.error-message {
  color: red;
}
</style> 