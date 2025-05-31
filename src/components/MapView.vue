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
  
      const isValidCoords = (lat, lng) => {
        const valid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
        if (!valid) {
          console.warn('Неверные координаты:', { lat, lng });
        }
        return valid;
      };
  
      const renderMap = () => {
        console.log('[MapView] renderMap вызван');
        console.log('[MapView] props.stadiums:', props.stadiums);
  
        if (!mapElement.value || !ymaps?.Map) {
          console.warn('[MapView] mapElement или ymaps.Map недоступны');
          return;
        }
  
        if (map.value && typeof map.value.destroy === 'function') {
          console.log('[MapView] Удаление старой карты');
          map.value.destroy();
          map.value = null;
        }
  
        map.value = new ymaps.Map(mapElement.value, {
          center: [41.2995, 69.2401],
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl']
        });
  
        props.stadiums.forEach((stadium, index) => {
            const { latitude, longitude, name, address, price_per_hour } = stadium;

            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            console.log(`[MapView] Обработка стадиона #${index}:`, stadium);

            if (!isValidCoords(lat, lng)) {
                console.warn('[MapView] Неверные координаты:', { lat, lng });
                console.warn('[MapView] Пропущен стадион из-за координат:', stadium);
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
                `
                },
                {
                preset: 'islands#greenSportIcon',
                iconColor: '#4ddf20'
                }
            );

            map.value.geoObjects.add(placemark);
            });
      };
  
      onMounted(() => {
        console.log('[MapView] onMounted вызван');
        ymaps.ready(() => {
          console.log('[MapView] ymaps готов');
          setTimeout(() => {
            renderMap();
          }, 0);
        });
      });
  
      watch(() => props.stadiums, (newVal) => {
        console.log('[MapView] stadiums обновились:', newVal);
        if (ymaps?.Map) {
          setTimeout(() => {
            renderMap();
          }, 100);
        }
      });
  
      onBeforeUnmount(() => {
        console.log('[MapView] onBeforeUnmount: очистка карты');
        if (map.value && typeof map.value.destroy === 'function') {
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
  