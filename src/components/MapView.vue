<template>
  <div class="w-full h-full">
    <div id="map" class="w-full h-full"></div>
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