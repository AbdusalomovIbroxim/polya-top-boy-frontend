<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="isLoading" class="w-full text-center py-4">
      Загрузка бронирований...
    </div>
    <div v-else-if="error" class="w-full text-center py-4 text-red-500">
      {{ error }}
    </div>
    <div v-else-if="!bookings || bookings.length === 0" class="w-full text-center py-4 text-gray-500">
      <div class="flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>У вас пока нет бронирований</p>
        <p class="text-sm text-gray-400">Забронируйте корт, чтобы увидеть его здесь</p>
      </div>
    </div>
    <template v-else>
      <BookingCard 
        v-for="booking in bookings" 
        :key="booking?.id || index" 
        :booking="booking" 
      />
    </template>
  </div>
</template>

<script>
import BookingCard from './BookingCard.vue'
import { bookingService } from '../services/bookingService'

export default {
  name: 'BookingList',
  components: {
    BookingCard
  },
  data() {
    return {
      bookings: [],
      isLoading: true,
      error: null,
      totalCount: 0
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
        this.bookings = response.data.results || []
        this.totalCount = response.data.count || 0
      } catch (error) {
        console.error('Error fetching bookings:', error)
        this.error = 'Не удалось загрузить бронирования'
        this.bookings = []
        this.totalCount = 0
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script> 