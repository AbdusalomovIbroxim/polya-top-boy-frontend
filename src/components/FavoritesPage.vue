<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <div class="flex flex-col gap-2 bg-white p-4 pb-2">
        <div class="flex items-center h-12 justify-end"></div>
        <p class="text-[#131711] tracking-light text-[28px] font-bold leading-tight">My Favorites</p>
      </div>
      
      <div v-if="isLoading" class="p-4 text-center text-gray-500">
        Загрузка...
      </div>
      
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else-if="favoriteStadiums.length === 0" class="p-4 text-center text-gray-500">
        У вас пока нет избранных полей
      </div>
      
      <div v-else v-for="stadium in favoriteStadiums" :key="stadium.id" class="p-4">
        <div
          class="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]"
          :style="{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url('${stadium.image}')`
          }"
        >
          <div class="flex w-full items-end justify-between gap-4 p-4">
            <div class="flex max-w-[440px] flex-1 flex-col gap-1">
              <p class="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">{{ stadium.name }}</p>
              <p class="text-white text-base font-medium leading-normal">{{ stadium.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'
import { favoriteService } from '../services/favoriteService'

export default {
  name: 'FavoritesPage',
  components: {
    NavigationBar
  },
  data() {
    return {
      favoriteStadiums: [],
      isLoading: false,
      error: null
    }
  },
  async created() {
    await this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      this.isLoading = true
      this.error = null
      try {
        const response = await favoriteService.getFavorites()
        this.favoriteStadiums = response.data.results.map(favorite => ({
          id: favorite.id,
          name: favorite.playground_details.name,
          location: `${favorite.playground_details.city}, ${favorite.playground_details.address}`,
          image: favorite.playground_details.images?.[0]?.image || 'https://cdn.usegalileo.ai/sdxl10/fb181260-a540-4659-a807-c8362cf91735.png'
        }))
      } catch (error) {
        this.error = 'Не удалось загрузить избранные поля'
        console.error('Error fetching favorites:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script> 