<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <AppHeader 
        title="Футбольные поля"
        :showBackButton="false"
        :showSettings="false"
      />
      <FilterTabs 
        @filter-changed="handleFilterChange"
      />
      
      <!-- List View -->
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <HomeSkeleton />
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center p-8 text-red-500">
        {{ error }}
      </div>

      <!-- Stadiums list -->
      <template v-else>
        <StadiumCard 
          v-for="stadium in filteredStadiums" 
          :key="stadium.id" 
          :stadium="stadium" 
        />
      </template>
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import AppHeader from './Header.vue'
import FilterTabs from './FilterTabs.vue'
import StadiumCard from './StadiumCard.vue'
import NavigationBar from './NavigationBar.vue'
import HomeSkeleton from './HomeSkeleton.vue'
import { stadiumService } from '@/services/stadiumService'

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    FilterTabs,
    StadiumCard,
    NavigationBar,
    HomeSkeleton
  },
  data() {
    return {
      activeFilters: {
        region: null,
        type: null
      },
      stadiums: [],
      loading: false,
      error: null
    }
  },
  computed: {
    filteredStadiums() {
      return this.stadiums.filter(stadium => {
        // Filter by region
        if (this.activeFilters.region && this.activeFilters.region !== 'Все') {
          if (stadium.city !== this.activeFilters.region) {
            return false;
          }
        }

        // Filter by type
        if (this.activeFilters.type && this.activeFilters.type !== 'Все') {
          if (stadium.type !== this.activeFilters.type) {
            return false;
          }
        }

        return true;
      });
    }
  },
  methods: {
    handleFilterChange(filters) {
      this.activeFilters = filters;
      this.fetchStadiums();
    },
    async fetchStadiums() {
      this.loading = true;
      this.error = null;
      try {
        const response = await stadiumService.getStadiums({
          city: this.activeFilters.region === 'Все' ? undefined : this.activeFilters.region,
          type: this.activeFilters.type === 'Все' ? undefined : this.activeFilters.type
        });
        console.log('API Response:', response);
        this.stadiums = response.results.map(stadium => {
          console.log('Processing stadium:', stadium);
          console.log('Stadium images:', stadium.images);
          const processedStadium = {
            id: stadium.id,
            name: stadium.name,
            address: stadium.address,
            price_per_hour: stadium.price_per_hour,
            images: stadium.images ? stadium.images.map(img => img.image) : [],
            city: stadium.city,
            type: stadium.type
          };
          console.log('Processed stadium:', processedStadium);
          return processedStadium;
        });
        console.log('Final processed stadiums:', this.stadiums);
      } catch (error) {
        this.error = 'Не удалось загрузить стадионы';
        console.error('Error fetching stadiums:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchStadiums();
  }
}
</script> 