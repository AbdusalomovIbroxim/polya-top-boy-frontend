<template>
    <div class="relative flex size-full min-h-screen flex-col bg-white" style='font-family: Lexend, "Noto Sans", sans-serif;'>
      <div class="flex-1 overflow-y-auto pb-36">
        <div class="flex items-center bg-white p-4 gap-4">
          <router-link to="/" class="text-[#131711]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
          </router-link>
          <h1 class="text-[#131711] text-lg font-bold">Детали стадиона</h1>
        </div>

        <div v-if="loading" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ddf20]"></div>
        </div>
  
        <div v-else-if="error" class="p-4 text-center text-red-500">
          {{ error }}
        </div>
  
        <template v-else-if="stadium">
          <div class="relative w-full aspect-video">
            <div v-if="!stadium.images || stadium.images.length === 0" 
                 class="absolute inset-0 w-full h-full bg-[#f5f5f5] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>

            <div v-else v-for="(image, index) in stadium.images" 
                 :key="index"
                 class="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover transition-all duration-500"
                 :class="{ 
                   'opacity-100 scale-100': currentImageIndex === index, 
                   'opacity-0 scale-110': currentImageIndex !== index 
                 }"
                 :style="{ backgroundImage: `url(${image.image})` }">
            </div>
            
            <div v-if="stadium.images.length > 1" 
                 class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            
                 <button v-for="(_, index) in stadium.images" 
                      :key="index"
                      @click="currentImageIndex = index"
                      class="w-2 h-2 rounded-full transition-all duration-300"
                      :class="currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'">
              </button>
            </div>
          </div>
          <div class="p-4 flex flex-col gap-4">
          
            <div>
              <h2 class="text-2xl font-bold text-[#131711] mb-2">{{ stadium.name }}</h2>
              <p class="text-[#6c8764] text-base">{{ stadium.price_per_hour }} сум/час</p>
            </div>
  
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-[#6c8764]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ stadium.city }}</span>
              </div>
              <p class="text-[#6c8764] text-sm">{{ stadium.address }}</p>
              <a :href="stadium.yandex_map_url" target="_blank" class="flex items-center gap-2 text-[#4ddf20] text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Открыть на Яндекс Картах
              </a>
            </div>
  
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-semibold text-[#131711]">Описание</h3>
              <p class="text-[#6c8764] text-sm whitespace-pre-line">{{ stadium.description }}</p>
            </div>
  
            <button 
              @click="goToBooking"
              class="w-full bg-[#4ddf20] text-white py-4 rounded-xl font-bold text-base mt-4"
            >
              Забронировать
            </button>
          </div>
        </template>
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
        if (!this.stadium?.images?.length) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.stadium.images.length
      },
      prevImage() {
        if (!this.stadium?.images?.length) return;
        this.currentImageIndex = this.currentImageIndex === 0 
          ? this.stadium.images.length - 1 
          : this.currentImageIndex - 1
      },
      goToBooking() {
        if (!this.id) {
          this.error = 'ID стадиона не найден';
          return;
        }
        this.$router.push(`/stadium/${this.id}/book`);
      },
      async fetchStadiumDetails() {
        if (!this.id) {
          this.error = 'ID стадиона не найден';
          this.loading = false;
          return;
        }

        this.loading = true;
        this.error = null;
        
        try {
          console.log('Fetching stadium details for ID:', this.id);
          const response = await stadiumService.getStadiumDetails(this.id);
          console.log('Received stadium data:', response);
          
          if (!response) {
            throw new Error('Пустой ответ от сервера');
          }
          
          this.stadium = response;
        } catch (error) {
          console.error('Ошибка при загрузке деталей стадиона:', error);
          this.error = error.message || 'Не удалось загрузить информацию о стадионе. Пожалуйста, попробуйте позже.';
          this.stadium = null;
        } finally {
          this.loading = false;
        }
      }
    },
    created() {
      this.fetchStadiumDetails();
    },
    watch: {
      id: {
        immediate: true,
        handler(newId) {
          if (newId) {
            this.fetchStadiumDetails();
          }
        }
      }
    }
  }
  </script> 