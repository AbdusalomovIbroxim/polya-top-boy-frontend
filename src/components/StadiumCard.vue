<template>
  <div class="p-4 @container">
    <div class="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
      <div class="relative w-full aspect-video overflow-hidden">
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
          <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#4ddf20] text-[#131711] text-sm font-medium leading-normal">
            <span class="truncate">Book</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      minSwipeDistance: 50
    }
  },
  methods: {
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