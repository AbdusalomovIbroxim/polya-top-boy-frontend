<template>
  <div class="fixed inset-0 z-50 bg-white">
    <div class="relative w-full h-full">
      <button 
        @click="closeMap" 
        class="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div id="map" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script>
/* global ymaps */

export default {
  name: 'MapView',
  props: {
    stadiums: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      map: null,
      markers: [],
      isMapReady: false
    }
  },
  mounted() {
    console.log('Mounted MapView with stadiums:', this.stadiums);
    // Проверяем, загружен ли API Яндекс Карт
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(this.initMap);
    } else {
      console.error('Yandex Maps API not loaded');
    }
  },
  beforeUnmount() {
    // Очищаем карту при уничтожении компонента
    if (this.map) {
      this.clearMap();
      this.map.destroy();
      this.map = null;
    }
  },
  methods: {
    closeMap() {
      this.$emit('close');
    },
    initMap() {
      try {
        console.log('Initializing map...');
        // Создаем карту без стандартных элементов управления
        this.map = new ymaps.Map('map', {
          center: [41.3111, 69.2797], // Центр Ташкента
          zoom: 11,
          controls: [] // Убираем все стандартные элементы управления
        });

        // Добавляем обработчики событий
        this.map.events.add('boundschange', this.handleBoundsChange);
        this.map.events.add('actionend', this.handleActionEnd);

        // Добавляем маркеры для каждого стадиона
        this.addMarkers();
        this.isMapReady = true;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
    clearMap() {
      // Удаляем все маркеры
      this.markers.forEach(marker => {
        this.map.geoObjects.remove(marker);
        marker.destroy();
      });
      this.markers = [];
    },
    addMarkers() {
      if (!this.map || !this.isMapReady) return;

      try {
        console.log('Adding markers for stadiums:', this.stadiums);
        // Очищаем старые маркеры
        this.clearMap();

        // Добавляем новые маркеры
        this.stadiums.forEach(stadium => {
          console.log('Processing stadium:', stadium);
          if (stadium.latitude && stadium.longitude) {
            console.log('Adding marker for stadium:', stadium.name, 'at coordinates:', stadium.latitude, stadium.longitude);
            const marker = new ymaps.Placemark(
              [parseFloat(stadium.latitude), parseFloat(stadium.longitude)],
              {
                balloonContent: `
                  <div class="p-2">
                    <h3 class="font-bold text-lg">${stadium.name}</h3>
                    <p class="text-gray-600">${stadium.address}</p>
                    <p class="text-green-600 font-medium">${stadium.price_per_hour} сум/час</p>
                    <button 
                      onclick="window.location.href='/stadium/${stadium.id}'"
                      class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Подробнее
                    </button>
                  </div>
                `
              },
              {
                preset: 'islands#greenDotIcon',
                openBalloonOnClick: true
              }
            );

            // Добавляем обработчик клика на маркер
            marker.events.add('click', () => {
              window.location.href = `/stadium/${stadium.id}`;
            });

            this.map.geoObjects.add(marker);
            this.markers.push(marker);
          } else {
            console.warn('Stadium missing coordinates:', stadium);
          }
        });

        // Если есть маркеры, центрируем карту по ним
        if (this.markers.length > 0) {
          console.log('Centering map on markers');
          const bounds = this.map.geoObjects.getBounds();
          if (bounds) {
            this.map.setBounds(bounds, {
              checkZoomRange: true
            });
          }
        } else {
          console.warn('No markers were added to the map');
        }
      } catch (error) {
        console.error('Error adding markers:', error);
      }
    },
    handleBoundsChange() {
      // Обработка изменения границ карты
      if (this.map) {
        // Можно добавить дополнительную логику при изменении масштаба
      }
    },
    handleActionEnd() {
      // Обработка окончания действия (зум, перемещение и т.д.)
      if (this.map) {
        // Можно добавить дополнительную логику после завершения действия
      }
    }
  },
  watch: {
    stadiums: {
      handler(newStadiums) {
        console.log('Stadiums updated:', newStadiums);
        if (this.map && this.isMapReady) {
          this.addMarkers();
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style> 