<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div class="flex-1 overflow-y-auto pb-36">
      <!-- Header -->
      <div class="flex items-center bg-white p-4 gap-4">
        <router-link to="/bookings" class="text-[#131711]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
          </svg>
        </router-link>
        <h1 class="text-[#131711] text-lg font-bold">Детали бронирования</h1>
      </div>

      <!-- Field Image -->
      <div class="relative w-full h-48">
        <img :src="booking.image" class="w-full h-full object-cover" :alt="booking.fieldName">
      </div>

      <!-- Field Info -->
      <div class="p-4">
        <h2 class="text-xl font-bold text-[#131711] mb-1">{{ booking.fieldName }}</h2>
        <p class="text-[#6c8764] text-sm">{{ booking.location }}</p>
      </div>

      <!-- Date & Time -->
      <div class="p-4 border-t border-[#f1f4f0]">
        <h3 class="text-lg font-bold text-[#131711] mb-4">Дата и время</h3>
        <div class="flex items-center gap-2 mb-2">
          <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 w-10 h-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM208,208H48V96H208Zm0-144H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"></path>
            </svg>
          </div>
          <p class="text-[#131711] text-base">{{ booking.date }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 w-10 h-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
            </svg>
          </div>
          <p class="text-[#131711] text-base">{{ booking.time }}</p>
        </div>
      </div>

      <!-- Duration -->
      <div class="p-4 border-t border-[#f1f4f0]">
        <h3 class="text-lg font-bold text-[#131711] mb-4">Длительность</h3>
        <p class="text-[#131711] text-base">{{ booking.duration }}</p>
      </div>

      <!-- Price -->
      <div class="p-4 border-t border-[#f1f4f0]">
        <h3 class="text-lg font-bold text-[#131711] mb-4">Стоимость</h3>
        <div class="flex justify-between items-center">
          <p class="text-[#131711] text-base">Итого</p>
          <p class="text-[#131711] text-xl font-bold">{{ booking.price }} сум</p>
        </div>
      </div>

      <!-- Status -->
      <div class="p-4 border-t border-[#f1f4f0]">
        <h3 class="text-lg font-bold text-[#131711] mb-4">Статус</h3>
        <div :class="getStatusClass(booking.status)" class="inline-block px-3 py-1 rounded-full text-sm font-medium">
          {{ booking.status }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f1f4f0]">
      <button v-if="canCancel" @click="cancelBooking" class="w-full py-3 px-4 bg-red-100 text-red-800 rounded-xl font-medium">
        Отменить бронирование
      </button>
      <p class="text-center text-[#6c8764] text-sm mt-4">
        Нужна помощь? <a href="#" class="text-[#131711] font-medium">Связаться с поддержкой</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingDetailsPage',
  props: {
    bookingId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      booking: null
    }
  },
  computed: {
    canCancel() {
      return this.booking && ['Подтверждено', 'Не оплачено'].includes(this.booking.status)
    }
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case 'Подтверждено':
          return 'bg-green-100 text-green-800';
        case 'Отменено':
          return 'bg-red-100 text-red-800';
        case 'Не оплачено':
          return 'bg-yellow-100 text-yellow-800';
        case 'Завершено':
          return 'bg-gray-100 text-gray-800';
        case 'Отклонено':
          return 'bg-red-100 text-red-800';
        case 'Просрочено':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    async fetchBookingDetails() {
      // Здесь будет запрос к API для получения деталей бронирования
      // Пока используем моковые данные
      this.booking = {
        id: this.bookingId,
        fieldName: 'Футбольное поле "Зеленый газон"',
        location: 'Ташкент, Чиланзар',
        image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
        date: '15 июня 2023',
        time: '18:00 - 19:30',
        duration: '1.5 часа',
        price: '150,000',
        status: 'Подтверждено'
      }
    },
    async cancelBooking() {
      // Здесь будет логика отмены бронирования
      if (confirm('Вы уверены, что хотите отменить бронирование?')) {
        try {
          // Здесь будет запрос к API для отмены бронирования
          this.booking.status = 'Отменено'
        } catch (error) {
          console.error('Ошибка при отмене бронирования:', error)
        }
      }
    }
  },
  created() {
    this.fetchBookingDetails()
  }
}
</script> 