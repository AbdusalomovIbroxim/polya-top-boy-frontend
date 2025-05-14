<template>
    <div class="relative flex size-full min-h-screen flex-col bg-white" style='font-family: Lexend, "Noto Sans", sans-serif;'>
      <div class="flex-1 overflow-y-auto pb-36">
        <!-- Header -->
        <div class="flex items-center bg-white p-4 gap-4">
          <router-link to="/" class="text-[#131711]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
          </router-link>
          <h1 class="text-[#131711] text-lg font-bold">Детали стадиона</h1>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ddf20]"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="p-4 text-center text-red-500">
          {{ error }}
        </div>
  
        <template v-else-if="stadium">
          <!-- Stadium Image Slider -->
          <div class="relative w-full h-64">
            <div class="relative w-full h-full">
              <div v-for="(image, index) in stadium.images" 
                   :key="index"
                   class="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover transition-all duration-500"
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
  
            <!-- Navigation Arrows -->
            <button v-if="stadium.images.length > 1" 
                    @click="prevImage" 
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button v-if="stadium.images.length > 1" 
                    @click="nextImage" 
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
  
            <!-- Image Indicators -->
            <div v-if="stadium.images.length > 1" 
                 class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-2 z-10">
              <button v-for="(_, index) in stadium.images" 
                      :key="index"
                      @click="currentImageIndex = index"
                      class="w-2 h-2 rounded-full transition-all duration-300"
                      :class="currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'">
              </button>
            </div>
          </div>
  
          <div class="p-4">
            <h2 class="text-xl font-bold text-[#131711] mb-1">{{ stadium.name }}</h2>
            <p class="text-[#6c8764] text-sm">{{ stadium.location }}</p>
            <p class="text-[#131711] text-base mt-4">{{ stadium.description }}</p>
          </div>
  
          <div class="p-4 border-t border-[#f1f4f0]">
            <h3 class="text-lg font-bold text-[#131711] mb-4">Стоимость</h3>
            <div class="flex justify-between items-center">
              <p class="text-[#131711] text-base">За час</p>
              <p class="text-[#131711] text-xl font-bold">{{ stadium.price }}</p>
            </div>
          </div>
  
          <!-- Company Info -->
          <div class="p-4 border-t border-[#f1f4f0]">
            <h3 class="text-lg font-bold text-[#131711] mb-4">Информация о компании</h3>
            <div class="flex items-center gap-2">
              <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                </svg>
              </div>
              <p class="text-[#131711] text-base">{{ stadium.company.username }}</p>
            </div>
          </div>
        </template>
      </div>
  
      <!-- Book Button -->
      <div v-if="stadium" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f1f4f0]">
        <button @click="goToBooking" class="w-full py-3 px-4 bg-[#4ddf20] text-[#131711] rounded-xl font-medium">
          Забронировать
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { stadiumService } from '@/services/stadiumService'
  
  export default {
    name: 'StadiumDetailsPage',
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        stadium: null,
        loading: true,
        error: null,
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
      },
      goToBooking() {
        this.$router.push(`/stadium/${this.id}/book`);
      },
      async fetchStadiumDetails() {
        this.loading = true;
        this.error = null;
        
        try {
          this.stadium = await stadiumService.getStadiumDetails(this.id);
        } catch (error) {
          console.error('Ошибка при загрузке деталей стадиона:', error);
          this.error = 'Не удалось загрузить информацию о стадионе. Пожалуйста, попробуйте позже.';
        } finally {
          this.loading = false;
        }
      }
    },
    created() {
      this.fetchStadiumDetails();
    }
  }
  </script> 