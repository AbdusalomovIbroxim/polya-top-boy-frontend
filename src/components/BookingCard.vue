<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex flex-col gap-4">
      <!-- Информация о площадке -->
      <div class="flex items-start gap-4">
        <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            v-if="booking.playground_details?.images?.[0]?.image" 
            :src="booking.playground_details.images[0].image" 
            :alt="booking.playground_details.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <router-link 
            :to="`/stadium/${booking.playground}`"
            class="text-lg font-semibold text-[#131711] hover:text-[#4a90e2] transition-colors"
          >
            {{ booking.playground_details?.name }}
          </router-link>
          <p class="text-[#6c8764] text-sm">{{ booking.total_price }} ₽</p>
          <p class="text-[#6c8764] text-sm">Депозит: {{ booking.deposit_amount }} ₽</p>
        </div>
      </div>

      <div class="flex items-center gap-2 text-[#6c8764]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ formatDateTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}</span>
      </div>

      <div class="flex gap-4 items-center">
        <div class="flex items-center gap-2">
          <span :class="getStatusClass(booking.status, booking.payment_status)">
            {{ getCombinedStatus(booking.status, booking.payment_status) }}
          </span>
        </div>
        <button 
          v-if="canBeCancelled(booking.status, booking.payment_status)"
          @click="cancelBooking"
          class="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Отменить
        </button>
      </div>

      <div v-if="booking.qr_code" class="flex justify-center">
        <img :src="booking.qr_code" alt="QR Code" class="w-32 h-32" />
      </div>

      <button 
        v-if="booking.payment_url && booking.payment_status === 'PENDING'"
        @click="openPaymentUrl"
        class="w-full bg-[#4a90e2] text-white py-2 px-4 rounded-lg hover:bg-[#357abd] transition-colors"
      >
        Оплатить
      </button>
    </div>
  </div>

  <!-- Модальное окно подтверждения отмены -->
  <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Затемненный фон с блюром -->
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
    
    <!-- Модальное окно -->
    <div class="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold text-[#131711] mb-4">Отмена бронирования</h3>
      
      <p class="text-[#6c8764] mb-6">
        {{ cancelModalMessage }}
      </p>

      <div class="flex gap-4">
        <button 
          @click="showCancelModal = false"
          class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Нет
        </button>
        <button 
          @click="confirmCancel"
          class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Да
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingCard',
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showCancelModal: false,
      cancelModalMessage: ''
    }
  },
  methods: {
    canBeCancelled(status, paymentStatus) {
      // Можно отменить только если статус PENDING или CONFIRMED
      return (status === 'PENDING' || status === 'CONFIRMED') && paymentStatus !== 'REFUNDED'
    },
    cancelBooking() {
      this.cancelModalMessage = 'Вы уверены, что хотите отменить бронирование?'
      
      if (this.booking.payment_status === 'PAID') {
        this.cancelModalMessage += '\n\nВнимание! При отмене бронирования депозит не подлежит возврату.'
      }
      
      this.showCancelModal = true
    },
    async confirmCancel() {
      try {
        // TODO: Добавить вызов API для отмены бронирования
        console.log('Cancelling booking:', this.booking.id)
        this.showCancelModal = false
      } catch (error) {
        console.error('Error cancelling booking:', error)
      }
    },
    getStatusClass(status, paymentStatus) {
      // Если бронирование отменено или возвращено - красный
      if (status === 'CANCELLED' || paymentStatus === 'REFUNDED') {
        return 'text-red-600'
      }
      // Если подтверждено или завершено - зеленый
      if (status === 'CONFIRMED' || status === 'COMPLETED') {
        return 'text-green-600'
      }
      // Если ожидает оплаты - желтый
      if (status === 'PENDING' && paymentStatus === 'PENDING') {
        return 'text-yellow-600'
      }
      // Если оплачено, но ожидает подтверждения - синий
      if (paymentStatus === 'PAID' && status === 'PENDING') {
        return 'text-blue-600'
      }
      // По умолчанию серый
      return 'text-gray-600'
    },
    getCombinedStatus(status, paymentStatus) {
      if (status === 'CANCELLED') {
        return 'Отменено'
      }
      if (status === 'COMPLETED') {
        return 'Завершено'
      }
      if (status === 'CONFIRMED') {
        return 'Подтверждено'
      }
      if (paymentStatus === 'REFUNDED') {
        return 'Возвращено'
      }
      if (status === 'PENDING' && paymentStatus === 'PENDING') {
        return 'Ожидает оплаты'
      }
      if (paymentStatus === 'PAID' && status === 'PENDING') {
        return 'Ожидает подтверждения'
      }
      return status
    },
    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    },
    formatTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    },
    openPaymentUrl() {
      if (this.booking.payment_url) {
        window.open(this.booking.payment_url, '_blank')
      }
    }
  }
}
</script> 
