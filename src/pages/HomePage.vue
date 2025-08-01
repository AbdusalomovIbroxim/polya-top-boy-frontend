<template>
  <div class="home-root">
    <HomeSkeleton v-if="loading" />
    <div v-else>
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
        :loading="false"
        @stadium-click="handleStadiumClick"
        @stadium-open="handleStadiumOpen"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getSportVenues, getRegions, getTypes } from '../api/fields';
import { 
  Navbar, 
  StadiumList, 
  FilterDropdown,
  HomeSkeleton
} from '../components';

export default {
  name: 'HomePage',
  components: {
    Navbar,
    StadiumList,
    FilterDropdown,
    HomeSkeleton
  },
  setup() {
    const stadiums = ref([]);
    const loading = ref(true);
    const regions = ref([]);
    const types = ref([]);
    const selectedRegion = ref('');
    const selectedType = ref('');
    const router = useRouter();

    const regionOptions = computed(() => [
      { id: '', name: 'Все регионы' },
      ...regions.value.map(r => ({ id: r.id, name: r.name_ru || r.name }))
    ]);
    const typeOptions = computed(() => [
      { id: '', name: 'Все типы' },
      ...types.value.map(t => ({ id: t.id, name: t.name_ru || t.name }))
    ]);

    onMounted(async () => {
      console.log('DEBUG: HomePage onMounted');
      loading.value = true;
      try {
        const [venues, reg, typ] = await Promise.all([
          getSportVenues(),
          getRegions(),
          getTypes()
        ]);
        console.log('DEBUG: venues', venues);
        console.log('DEBUG: reg', reg);
        console.log('DEBUG: typ', typ);
        stadiums.value = venues.results;
        regions.value = reg.results || reg;
        types.value = typ.results || typ;
      } catch (e) {
        console.error('DEBUG: Error loading data:', e);
        stadiums.value = [];
      } finally {
        loading.value = false;
        console.log('DEBUG: loading.value', loading.value);
      }
    });

    // Добавляю реакцию на фильтры
    watch([selectedRegion, selectedType], async () => {
      console.log('DEBUG: watch filter', selectedRegion.value, selectedType.value);
      loading.value = true;
      try {
        const params = {};
        if (selectedRegion.value) params.region = selectedRegion.value;
        if (selectedType.value) params.sport_venue_type = selectedType.value;
        const venues = await getSportVenues(params);
        console.log('DEBUG: filtered venues', venues);
        stadiums.value = venues.results;
      } catch (e) {
        console.error('DEBUG: Error loading filtered venues:', e);
        stadiums.value = [];
      } finally {
        loading.value = false;
      }
    });

    function handleStadiumClick(stadium) {
      console.log('DEBUG: Stadium clicked:', stadium);
    }

    function handleStadiumOpen(stadium) {
      if (stadium && stadium.id) {
        console.log('DEBUG: Stadium open:', stadium.id);
        router.push(`/stadium/${stadium.id}`);
      }
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
      handleStadiumOpen
    };
  }
};
</script>

<style src="../assets/css/pages/home.css"></style> 