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
        <span>{{ booking.start_time }} - {{ booking.end_time }}</span>
      </div>

      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <span>{{ booking.status }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>{{ booking.payment_status }}</span>
        </div>
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
  methods: {
    openPaymentUrl() {
      if (this.booking.payment_url) {
        window.open(this.booking.payment_url, '_blank')
      }
    }
  }
}
</script> 
