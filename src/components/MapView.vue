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
      markers: []
    };
  },
  watch: {
    stadiums: {
      handler: 'addMarkers',
      deep: true
    }
  },
  mounted() {
    console.log('MapView mounted. Stadiums:', this.stadiums);
    // Проверяем, загружен ли API Яндекс Карт и ждем его готовности
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(this.initMap);
    } else {
      console.error('Yandex Maps API not loaded');
      // Можно добавить отображение ошибки пользователю
    }
  },
  beforeUnmount() {
    console.log('MapView beforeUnmount. Destroying map.');
    // Очищаем и уничтожаем карту при уничтожении компонента
    if (this.map) {
      // Удаляем все геообъекты с карты
      this.clearMarkers();
       // Останавливаем все поведения карты
      if (this.map.behaviors) {
        this.map.behaviors.removeAll();
      }
      // Удаляем все обработчики событий карты
      this.map.events.removeAll();
      // Уничтожаем экземпляр карты
      this.map.destroy();
      this.map = null;
      console.log('Map destroyed.');
    }
  },
  methods: {
    closeMap() {
      // Добавляем небольшую задержку перед эмитом события close
      // Это может дать карте время для завершения текущих операций
      setTimeout(() => {
        this.$emit('close');
        console.log('Emitting close event after timeout.');
      }, 50); // Задержка 50 мс
    },
    initMap() {
      console.log('Initializing map...');
      try {
        this.map = new ymaps.Map('map', {
          center: [41.3111, 69.2797], // Центр Ташкента
          zoom: 11,
          controls: [] // Убираем все стандартные элементы управления
        });
        console.log('Map initialized.');
        // Добавляем маркеры после инициализации карты с небольшой задержкой
        // Это может помочь избежать ошибок, связанных с готовностью карты
        setTimeout(() => {
           this.addMarkers();
           console.log('addMarkers called after timeout.');
        }, 300); // Увеличиваем задержку до 300 мс

      } catch (error) {
        console.error('Error initializing map:', error);
        // Можно добавить отображение ошибки пользователю
      }
    },
    clearMarkers() {
       if (this.map && this.map.geoObjects) {
         console.log('Clearing existing markers.');
         this.map.geoObjects.removeAll();
         this.markers = [];
       }
    },
    addMarkers() {
      if (!this.map) {
        console.warn('Map not initialized, cannot add markers.');
        return;
      }
      console.log('Attempting to add markers. Stadiums count:', this.stadiums ? this.stadiums.length : 0);

      this.clearMarkers(); // Всегда очищаем перед добавлением новых

      if (!this.stadiums || this.stadiums.length === 0) {
        console.log('No stadiums to add markers for.');
        return;
      }

      const newMarkers = [];
      // Оборачиваем добавление маркеров в try...catch
      try {
        this.stadiums.forEach(stadium => {
          if (stadium.latitude && stadium.longitude) {
            const lat = parseFloat(stadium.latitude);
            const lon = parseFloat(stadium.longitude);
            if (!isNaN(lat) && !isNaN(lon)) {
               const marker = new ymaps.Placemark(
                [lat, lon],
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
               marker.events.add('click', () => {
                  window.location.href = `/stadium/${stadium.id}`;
                });

              // Добавляем маркер сразу на карту
              this.map.geoObjects.add(marker);
              newMarkers.push(marker);
              console.log(`Added marker for ${stadium.name} at [${lat}, ${lon}]`);

            } else {
               console.warn(`Invalid coordinates for stadium ${stadium.name}:`, stadium.latitude, stadium.longitude);
            }
          } else {
            console.warn(`Stadium missing coordinates for ${stadium.name}:`, stadium);
          }
        });

         // После добавления всех маркеров обновляем локальный массив
        this.markers = newMarkers;

        if (this.markers.length > 0) {
           console.log(`Attempting to center map on ${this.markers.length} markers.`);
           // Попробуем центрировать карту по добавленным объектам
           const bounds = this.map.geoObjects.getBounds();
            if (bounds) {
              this.map.setBounds(bounds, {
                checkZoomRange: true,
                duration: 0
              });
              console.log('Map centered on markers bounds:', bounds);
            } else {
               console.warn('Could not get bounds for geoObjects after adding markers.');
            }
        } else {
            console.log('No valid markers were added to map, cannot center.');
            // Возможно, центрировать на исходной точке или показать сообщение
        }
      } catch (error) {
         console.error('Error adding markers in catch block:', error);
         // Можно добавить отображение ошибки пользователю
      }
    },
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style> 