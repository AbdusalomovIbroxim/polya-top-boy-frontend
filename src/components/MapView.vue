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
      markers: []
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
  methods: {
    initMap() {
      try {
        // Создаем карту
        this.map = new ymaps.Map('map', {
          center: [41.3111, 69.2797], // Центр Ташкента
          zoom: 11,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем маркеры для каждого стадиона
        this.addMarkers();
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
    addMarkers() {
      try {
        // Удаляем старые маркеры
        this.markers.forEach(marker => marker.destroy());
        this.markers = [];

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
                preset: 'islands#greenDotIcon'
              }
            );

            this.map.geoObjects.add(marker);
            this.markers.push(marker);
          }
        });
      } catch (error) {
        console.error('Error adding markers:', error);
      }
    }
  },
  watch: {
    stadiums: {
      handler() {
        if (this.map) {
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