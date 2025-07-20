<template>
  <div class="home-root">
    <Navbar title="Fields" />
    <div class="filters-bar">
      <FilterDropdown
        :items="regionOptions"
        v-model="selectedRegion"
        placeholder="Все регионы"
        class="filter-dropdown-inline"
      />
      <FilterDropdown
        :items="typeOptions"
        v-model="selectedType"
        placeholder="Все типы"
        class="filter-dropdown-inline"
      />
    </div>
    <StadiumList 
      :stadiums="stadiums"
      :loading="loading"
      @stadium-click="handleStadiumClick"
      @stadium-open="handleStadiumOpen"
    />
    <Tabbar 
      activeTab="home"
      @tab-change="handleTabChange"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getSportVenues, getRegions, getTypes } from '../api/fields';
import { 
  Navbar, 
  StadiumList, 
  FilterDropdown, 
  Tabbar 
} from '../components';


export default {
  name: 'HomePage',
  components: {
    Navbar,
    StadiumList,
    FilterDropdown,
    Tabbar
  },
  setup() {
    const stadiums = ref([]);
    const loading = ref(true);
    const regions = ref([]);
    const types = ref([]);
    const selectedRegion = ref('');
    const selectedType = ref('');

    const regionOptions = computed(() => [
      { id: '', name: 'Все регионы' },
      ...regions.value.map(r => ({ id: r.id, name: r.name_ru || r.name }))
    ]);
    const typeOptions = computed(() => [
      { id: '', name: 'Все типы' },
      ...types.value.map(t => ({ id: t.id, name: t.name_ru || t.name }))
    ]);

    onMounted(async () => {
      loading.value = true;
      try {
        const [venues, reg, typ] = await Promise.all([
          getSportVenues(),
          getRegions(),
          getTypes()
        ]);
        stadiums.value = venues.results;
        regions.value = reg.results || reg;
        types.value = typ.results || typ;
      } catch (e) {
        console.error('Error loading data:', e);
        stadiums.value = [];
      } finally {
        loading.value = false;
      }
    });

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

    return {
      stadiums, 
      loading, 
      regions,
      types,
      selectedRegion,
      selectedType,
      regionOptions,
      typeOptions,
      handleStadiumClick,
      handleStadiumOpen,
      handleTabChange
    };
  }
};
</script>

<style src="../assets/css/pages/home.css"></style> 