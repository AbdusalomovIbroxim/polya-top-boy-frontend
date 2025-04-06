<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <div class="flex flex-col gap-2 bg-white p-4 pb-2">
        <div class="flex items-center h-12 justify-end"></div>
        <p class="text-[#131711] tracking-light text-[28px] font-bold leading-tight">My Favorites</p>
      </div>
      
      <div v-for="stadium in favoriteStadiums" :key="stadium.id" class="p-4">
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

export default {
  name: 'FavoritesPage',
  components: {
    NavigationBar
  },
  data() {
    return {
      favoriteStadiums: [
        {
          id: 1,
          name: 'Pier 40',
          location: 'New York, NY',
          image: 'https://cdn.usegalileo.ai/sdxl10/fb181260-a540-4659-a807-c8362cf91735.png'
        },
        {
          id: 2,
          name: 'East River Park',
          location: 'New York, NY',
          image: 'https://cdn.usegalileo.ai/sdxl10/2d0134a2-67c0-45d8-a439-2e7fd898852e.png'
        },
        {
          id: 3,
          name: 'Chelsea Piers',
          location: 'New York, NY',
          image: 'https://cdn.usegalileo.ai/sdxl10/be45af0d-f473-4ed4-a848-285d6c752490.png'
        }
      ]
    }
  }
}
</script> 