<template>
  <div class="home-root">
    <div>
      <div class="navbar">
        <h2 class="navbar-title">Fields</h2>
      </div>
      <div class="filters-row">
        <div class="filter-btn" @click="openRegionModal">
          Region
          <span :class="['filter-arrow', { open: openFilter === 'region' }]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="#131712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </div>
        <div class="filter-btn" @click="openTypeModal">
          Type
          <span :class="['filter-arrow', { open: openFilter === 'type' }]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="#131712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </div>
      </div>
      <div v-if="loading" class="stadium-list"><div>Загрузка...</div></div>
      <div v-else class="stadium-list">
        <div class="stadium-card" v-for="stadium in stadiums" :key="stadium.id">
          <div class="stadium-img" :style="{ backgroundImage: 'url(' + (stadium.images?.[0]?.image || '') + ')' }"></div>
          <div class="stadium-content">
            <p class="stadium-title">{{ stadium.name }}</p>
            <p class="stadium-desc">{{ stadium.description }}</p>
            <div class="stadium-info-row">
              <div class="stadium-info">
                <p>Narxi: {{ formatPrice(stadium.price_per_hour) }} so'm/soat</p>
                <p>4.8 (120 reviews)</p>
              </div>
              <button class="stadium-open-btn"><span>Open</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Region -->
    <div v-if="openFilter === 'region'" class="modal-overlay" @click.self="closeModal">
      <div class="modal-popup">
        <div class="modal-header">
          <span>Выберите регион</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div v-if="regionsLoading" class="modal-list-loading">Загрузка...</div>
        <ul v-else class="modal-list">
          <li v-for="region in regions" :key="region.id" class="modal-list-item" @click="selectRegion(region)">{{ region.name_ru }}</li>
        </ul>
      </div>
    </div>
    <!-- Modal for Type -->
    <div v-if="openFilter === 'type'" class="modal-overlay" @click.self="closeModal">
      <div class="modal-popup">
        <div class="modal-header">
          <span>Выберите тип</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div v-if="typesLoading" class="modal-list-loading">Загрузка...</div>
        <ul v-else class="modal-list">
          <li v-for="type in types" :key="type.id" class="modal-list-item" @click="selectType(type)">{{ type.name }}</li>
        </ul>
      </div>
    </div>
    <div>
      <div class="tabbar">
        <a class="tabbar-item active" href="#">
          <span class="tabbar-icon">
            <!-- Home SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
            </svg>
          </span>
          <span class="tabbar-label">Home</span>
        </a>
        <a class="tabbar-item" href="#">
          <span class="tabbar-icon">
            <!-- Favorites SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
            </svg>
          </span>
          <span class="tabbar-label">Favorites</span>
        </a>
        <a class="tabbar-item" href="#">
          <span class="tabbar-icon">
            <!-- Map SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
            </svg>
          </span>
          <span class="tabbar-label">Map</span>
        </a>
        <a class="tabbar-item" href="#">
          <span class="tabbar-icon">
            <!-- Bookings SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z" />
            </svg>
          </span>
          <span class="tabbar-label">Bookings</span>
        </a>
        <a class="tabbar-item" href="#">
          <span class="tabbar-icon">
            <!-- Profile SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </svg>
          </span>
          <span class="tabbar-label">Profile</span>
        </a>
      </div>
      <div class="tabbar-spacer"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getSportVenues, getRegions, getTypes } from '../api/fields';

export default {
  name: 'HomePage',
  setup() {
    const stadiums = ref([]);
    const loading = ref(true);
    const openFilter = ref(null);
    // Modal state
    const regions = ref([]);
    const regionsLoading = ref(false);
    const types = ref([]);
    const typesLoading = ref(false);

    function openRegionModal() {
      openFilter.value = openFilter.value === 'region' ? null : 'region';
      if (openFilter.value === 'region' && regions.value.length === 0) {
        regionsLoading.value = true;
        getRegions().then(data => {
          regions.value = data;
        }).finally(() => {
          regionsLoading.value = false;
        });
      }
    }
    function openTypeModal() {
      openFilter.value = openFilter.value === 'type' ? null : 'type';
      if (openFilter.value === 'type' && types.value.length === 0) {
        typesLoading.value = true;
        getTypes().then(data => {
          types.value = data;
        }).finally(() => {
          typesLoading.value = false;
        });
      }
    }
    function closeModal() {
      openFilter.value = null;
    }
    function selectRegion(region) {
      // TODO: handle region selection
      closeModal();
    }
    function selectType(type) {
      // TODO: handle type selection
      closeModal();
    }

    onMounted(async () => {
      loading.value = true;
      try {
        const data = await getSportVenues();
        stadiums.value = data.results;
      } catch (e) {
        stadiums.value = [];
      } finally {
        loading.value = false;
      }
    });

    function formatPrice(price) {
      if (!price) return '-';
      const num = Math.round(Number(price) * 3000);
      return num.toLocaleString('ru-RU');
    }

    return {
      stadiums, loading, formatPrice, openFilter, regions, regionsLoading, types, typesLoading,
      openRegionModal, openTypeModal, closeModal, selectRegion, selectType
    };
  }
};
</script>

<style src="../assets/css/home.css"></style> 