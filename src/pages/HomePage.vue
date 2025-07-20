<template>
  <div class="home-root">
    <div>
      <Navbar title="Fields" />
      <FiltersRow 
        :openFilter="openFilter"
        @openRegionModal="openRegionModal"
        @openTypeModal="openTypeModal"
      />
      <StadiumList 
        :stadiums="stadiums"
        :loading="loading"
        @stadium-click="handleStadiumClick"
        @stadium-open="handleStadiumOpen"
      />
    </div>
    
    <!-- Filter Modals -->
    <FilterModal
      :isOpen="openFilter === 'region'"
      title="Выберите регион"
      :items="regions"
      :loading="regionsLoading"
      @close="closeModal"
      @select="selectRegion"
    />
    
    <FilterModal
      :isOpen="openFilter === 'type'"
      title="Выберите тип"
      :items="types"
      :loading="typesLoading"
      @close="closeModal"
      @select="selectType"
    />
    
    <Tabbar 
      activeTab="home"
      @tab-change="handleTabChange"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getSportVenues, getRegions, getTypes } from '../api/fields';
import { 
  Navbar, 
  FiltersRow, 
  StadiumList, 
  FilterModal, 
  Tabbar 
} from '../components';

export default {
  name: 'HomePage',
  components: {
    Navbar,
    FiltersRow,
    StadiumList,
    FilterModal,
    Tabbar
  },
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
      console.log('Selected region:', region);
      closeModal();
    }

    function selectType(type) {
      // TODO: handle type selection
      console.log('Selected type:', type);
      closeModal();
    }

    function handleStadiumClick(stadium) {
      // TODO: handle stadium click - maybe navigate to detail page
      console.log('Stadium clicked:', stadium);
    }

    function handleStadiumOpen(stadium) {
      // TODO: handle stadium open - maybe open booking modal
      console.log('Stadium open:', stadium);
    }

    function handleTabChange(tabId) {
      // TODO: handle tab navigation
      console.log('Tab changed to:', tabId);
    }

    onMounted(async () => {
      loading.value = true;
      try {
        const data = await getSportVenues();
        stadiums.value = data.results;
      } catch (e) {
        console.error('Error loading stadiums:', e);
        stadiums.value = [];
      } finally {
        loading.value = false;
      }
    });

    return {
      stadiums, 
      loading, 
      openFilter, 
      regions, 
      regionsLoading, 
      types, 
      typesLoading,
      openRegionModal, 
      openTypeModal, 
      closeModal, 
      selectRegion, 
      selectType,
      handleStadiumClick,
      handleStadiumOpen,
      handleTabChange
    };
  }
};
</script>

<style scoped>
.home-root {
  min-height: 100vh;
  background: #f8f9fa;
}
</style> 