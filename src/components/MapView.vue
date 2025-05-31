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
  mounted() {
    console.log('MapView mounted. Stadiums:', this.stadiums);
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(this.initMap);
    } else {
      console.error('Yandex Maps API not loaded');
    }
  },
  beforeUnmount() {
    console.log('MapView beforeUnmount. Destroying map.');
    if (this.map) {
      this.clearMarkers();
      if (this.map.behaviors) {
        this.map.behaviors.removeAll();
      }
      this.map.events.removeAll();
      this.map.destroy();
      this.map = null;
      console.log('Map destroyed.');
    }
  },
  methods: {
    closeMap() {
      setTimeout(() => {
        this.$emit('close');
        console.log('Emitting close event after timeout.');
      }, 50);
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