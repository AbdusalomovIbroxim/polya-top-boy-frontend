<template>
  <div class="w-full h-full">
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<script>
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
    // Инициализируем карту после загрузки компонента
    ymaps.ready(this.initMap);
  },
  methods: {
    initMap() {
      // Создаем карту
      this.map = new ymaps.Map('map', {
        center: [41.3111, 69.2797], // Центр Ташкента
        zoom: 11,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Добавляем маркеры для каждого стадиона
      this.addMarkers();
    },
    addMarkers() {
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