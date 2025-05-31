<template>
    <div class="map-container">
      <div id="map" ref="mapElement"></div>
      <button class="close-button" @click="$emit('close')">Закрыть карту</button>
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
  
      const isValidCoords = (lat, lng) =>
        typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
  
      const initMap = () => {
        if (!mapElement.value || !ymaps?.Map) {
          console.warn('[MapView] mapElement или ymaps.Map недоступны');
          return;
        }
  
        if (map.value) {
          map.value.destroy(); // Чистим перед повторной инициализацией
        }
  
        map.value = new ymaps.Map(mapElement.value, {
          center: [41.2995, 69.2401],
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl'],
        });
  
        props.stadiums.forEach((stadium, index) => {
          const { latitude, longitude, name, address, price_per_hour } = stadium;
          const lat = parseFloat(latitude);
          const lng = parseFloat(longitude);
            
          console.log('123 ', lat, lng);
          
          if (!isValidCoords(lat, lng)) {
            console.warn(`[MapView] Неверные координаты для стадиона #${index}:`, stadium);
            return;
          }
  
          const placemark = new ymaps.Placemark(
            [lat, lng],
            {
              hintContent: name,
              balloonContent: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 10px 0; font-size: 16px;">${name}</h3>
                  <p style="margin: 0 0 5px 0;">${address}</p>
                  <p style="margin: 0; color: #4ddf20;">${price_per_hour} сум/час</p>
                </div>
              `,
            },
            {
              preset: 'islands#greenSportIcon',
              iconColor: '#4ddf20',
            }
          );
  
          map.value.geoObjects.add(placemark);
        });
      };
  
      onMounted(() => {
        ymaps.ready(() => initMap());
      });
  
      watch(() => props.stadiums, () => {
        if (ymaps?.Map) {
          setTimeout(() => initMap(), 100);
        }
      });
  
      onBeforeUnmount(() => {
        if (map.value) {
          map.value.destroy();
          map.value = null;
        }
      });
  
      return { mapElement };
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
    background-color: white;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  