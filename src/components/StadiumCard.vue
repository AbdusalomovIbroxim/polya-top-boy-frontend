<template>
  <div class="p-4 @container">
    <div class="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
      <div class="relative w-full aspect-video overflow-hidden">
        <!-- Кнопка избранного -->
        <button 
          @click.stop="toggleFavorite"
          class="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            :class="{ 'fill-red-500 stroke-red-500': isFavorite }"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Слайдер изображений -->
        <div class="relative w-full h-full">
          <div v-for="(image, index) in stadium.images" 
               :key="index"
               class="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover rounded-xl transition-all duration-500"
               :class="{ 
                 'opacity-100 scale-100': currentImageIndex === index, 
                 'opacity-0 scale-110': currentImageIndex !== index 
               }"
               :style="{ backgroundImage: `url(${image})` }"
               @touchstart="touchStart"
               @touchmove="touchMove"
               @touchend="touchEnd">
          </div>
        </div>
        
        <!-- Индикаторы слайдов -->
        <div v-if="stadium.images.length > 1" 
             class="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-2 z-10">
          <button v-for="(_, index) in stadium.images" 
                  :key="index"
                  @click="currentImageIndex = index"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'">
          </button>
        </div>
      </div>
      
      <div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
        <p class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em]">{{ stadium.name }}</p>
        <div class="flex items-end gap-3 justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-[#6c8764] text-base font-normal leading-normal">{{ stadium.location }}</p>
            <p class="text-[#6c8764] text-base font-normal leading-normal">{{ stadium.price }}/hour</p>
          </div>
          <button 
            @click="$router.push(`/stadium/${stadium.id}`)"
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#4ddf20] text-[#131711] text-sm font-medium leading-normal">
            <span class="truncate">Book</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { favoriteService } from '../services/favoriteService'

export default {
  name: 'StadiumCard',
  props: {
    stadium: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentImageIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
      minSwipeDistance: 50,
      isFavorite: false,
      favoriteId: null
    }
  },
  async created() {
    await this.checkFavoriteStatus()
  },
  methods: {
    async checkFavoriteStatus() {
      try {
        const response = await favoriteService.getFavorites()
        const favorite = response.data.results.find(f => f.playground === this.stadium.id)
        if (favorite) {
          this.isFavorite = true
          this.favoriteId = favorite.id
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    },
    async toggleFavorite() {
      try {
        if (this.isFavorite) {
          await favoriteService.removeFromFavorites(this.favoriteId)
          this.isFavorite = false
          this.favoriteId = null
        } else {
          const response = await favoriteService.addToFavorites(this.stadium.id)
          this.isFavorite = true
          this.favoriteId = response.data.id
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
      }
    },
    touchStart(event) {
      this.touchStartX = event.touches[0].clientX
    },
    touchMove(event) {
      this.touchEndX = event.touches[0].clientX
    },
    touchEnd() {
      const swipeDistance = this.touchEndX - this.touchStartX
      
      if (Math.abs(swipeDistance) > this.minSwipeDistance) {
        if (swipeDistance > 0) {
          this.prevImage()
        } else {
          this.nextImage()
        }
      }
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.stadium.images.length
    },
    prevImage() {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.stadium.images.length - 1 
        : this.currentImageIndex - 1
    }
  }
}
</script>

<style scoped>
.transition-all {
  will-change: transform, opacity;
}
</style> 