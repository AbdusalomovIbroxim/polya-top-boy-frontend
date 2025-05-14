<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <div class="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">История бронирований</h2>
        <div class="flex w-12 items-center justify-end">
          <button
            class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#131711] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <div class="text-[#131711]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div class="flex p-4 @container">
        <div class="flex w-full flex-col gap-4 items-start">
          <div v-if="isLoading" class="w-full text-center py-4">
            Загрузка истории бронирований...
          </div>
          <div v-else-if="error" class="w-full text-center py-4 text-red-500">
            {{ error }}
          </div>
          <div v-else-if="bookings.length === 0" class="w-full text-center py-4 text-gray-500">
            У вас пока нет бронирований
          </div>
          <div v-else class="w-full space-y-4">
            <div v-for="booking in bookings" :key="booking.id" class="bg-white rounded-lg shadow p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-[#131711]">{{ booking.court_name }}</h3>
                  <p class="text-[#6c8764]">{{ formatDate(booking.date) }} {{ booking.time_slot }}</p>
                </div>
                <div class="text-right">
                  <span :class="getStatusClass(booking.status)">{{ getStatusText(booking.status) }}</span>
                </div>
              </div>
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
import { bookingService } from '../services/bookingService'

export default {
  name: 'BookingHistory',
  components: {
    NavigationBar
  },
  data() {
    return {
      bookings: [],
      isLoading: true,
      error: null
    }
  },
  async created() {
    await this.fetchBookings()
  },
  methods: {
    async fetchBookings() {
      this.isLoading = true
      this.error = null
      try {
        const response = await bookingService.getBookings()
        this.bookings = response.data
      } catch (error) {
        console.error('Error fetching bookings:', error)
        this.error = 'Не удалось загрузить историю бронирований'
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    },
    getStatusClass(status) {
      const classes = {
        'confirmed': 'text-green-600',
        'pending': 'text-yellow-600',
        'cancelled': 'text-red-600'
      }
      return classes[status] || 'text-gray-600'
    },
    getStatusText(status) {
      const statusTexts = {
        'confirmed': 'Подтверждено',
        'pending': 'Ожидает подтверждения',
        'cancelled': 'Отменено'
      }
      return statusTexts[status] || status
    }
  }
}
</script> 