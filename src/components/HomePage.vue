<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <AppHeader />
      <FilterTabs @tab-changed="filterChanged" />
      
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
      activeFilter: 'All',
      stadiums: [],
      loading: false,
      error: null
    }
  },
  computed: {
    filteredStadiums() {
      if (this.activeFilter === 'All') {
        return this.stadiums;
      } else if (this.activeFilter === 'Tashkent') {
        return this.stadiums.filter(stadium => stadium.city === 'Tashkent');
      } else if (this.activeFilter === 'Favorites') {
        // В реальном приложении здесь будет логика для избранных стадионов
        return [];
      }
      return this.stadiums;
    }
  },
  methods: {
    filterChanged(filter) {
      this.activeFilter = filter;
    },
    async fetchStadiums() {
      this.loading = true;
      this.error = null;
      try {
        const response = await stadiumService.getStadiums({
          city: this.activeFilter === 'Tashkent' ? 'Tashkent' : undefined
        });
        this.stadiums = response.results.map(stadium => ({
          id: stadium.id,
          name: stadium.name,
          location: `${stadium.city}, ${stadium.address}`,
          price: `$${stadium.price_per_hour}`,
          images: stadium.images.map(img => img.image)
        }));
      } catch (error) {
        this.error = 'Failed to load stadiums';
        console.error('Error fetching stadiums:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchStadiums();
  },
  watch: {
    activeFilter() {
      this.fetchStadiums();
    }
  }
}
</script> 