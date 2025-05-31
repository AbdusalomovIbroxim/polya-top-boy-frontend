<template>
  <div class="w-full h-full relative">
    <div id="map" class="w-full h-full"></div>
    <div class="absolute bottom-4 right-4 flex flex-col gap-2">
      <button 
        @click="zoomIn" 
        class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button 
        @click="zoomOut" 
        class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
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
    initMap() {
      try {
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
        // Очищаем старые маркеры
        this.clearMap();

        // Добавляем новые маркеры
        this.stadiums.forEach(stadium => {
          if (stadium.latitude && stadium.longitude) {
            const marker = new ymaps.Placemark(
              [parseFloat(stadium.latitude), parseFloat(stadium.longitude)],
              {
                balloonContent: `
                  <div class="p-2">
                    <h3 class="font-bold text-lg">${stadium.name}</h3>
                    <p class="text-gray-600">${stadium.address}</p>
                    <p class="text-green-600 font-medium">${stadium.price_per_hour} сум/час</p>
                    <a href="/stadium/${stadium.id}" class="text-blue-600 hover:underline">Подробнее</a>
                  </div>
                `
              },
              {
                preset: 'islands#greenDotIcon',
                openBalloonOnClick: true
              }
            );

            this.map.geoObjects.add(marker);
            this.markers.push(marker);
          }
        });
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
    },
    zoomIn() {
      if (this.map) {
        const currentZoom = this.map.getZoom();
        this.map.setZoom(currentZoom + 1);
      }
    },
    zoomOut() {
      if (this.map) {
        const currentZoom = this.map.getZoom();
        this.map.setZoom(currentZoom - 1);
      }
    }
  },
  watch: {
    stadiums: {
      handler() {
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
  min-height: 500px;
}
</style> 