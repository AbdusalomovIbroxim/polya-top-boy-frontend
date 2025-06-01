<template>
  <div class="pb-3">
    <div class="flex border-b border-[#dee5dc] px-4 gap-4">
      <!-- Region Filter -->
      <div class="relative">
        <button 
          class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100"
          @click="toggleRegionDropdown"
        >
          <span class="text-sm font-medium text-[#131711]">{{ selectedRegion || 'Регион' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div v-if="showRegionDropdown" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <button 
            v-for="region in regions" 
            :key="region"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            @click="selectRegion(region)"
          >
            {{ region }}
          </button>
        </div>
      </div>

      <!-- Map View Button -->
      <!-- <button 
        class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100"
        @click="toggleMapView"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span class="text-sm font-medium text-[#131711]">Карта</span>
      </button> -->

      <!-- Field Type Filter -->
      <div class="relative">
        <button 
          class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100"
          @click="toggleTypeDropdown"
        >
          <span class="text-sm font-medium text-[#131711]">{{ selectedType || 'Тип поля' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div v-if="showTypeDropdown" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <button 
            v-for="type in fieldTypes" 
            :key="type"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            @click="selectType(type)"
          >
            {{ type }}
          </button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'FilterTabs',
  data() {
    return {
      showRegionDropdown: false,
      showTypeDropdown: false,
      selectedRegion: null,
      selectedType: null,
      regions: ['Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Наманган'],
      fieldTypes: ['Футбол', 'Теннис', 'Волейбол', 'Баскетбол', 'Все']
    }
  },
  methods: {
    toggleRegionDropdown() {
      this.showRegionDropdown = !this.showRegionDropdown;
      this.showTypeDropdown = false;
    },
    toggleTypeDropdown() {
      this.showTypeDropdown = !this.showTypeDropdown;
      this.showRegionDropdown = false;
    },
    selectRegion(region) {
      this.selectedRegion = region;
      this.showRegionDropdown = false;
      this.$emit('filter-changed', {
        region: region,
        type: this.selectedType
      });
    },
    selectType(type) {
      this.selectedType = type;
      this.showTypeDropdown = false;
      this.$emit('filter-changed', {
        region: this.selectedRegion,
        type: type
      });
    },
    toggleMapView() {
      this.$emit('toggle-map');
    }
  }
}
</script> 