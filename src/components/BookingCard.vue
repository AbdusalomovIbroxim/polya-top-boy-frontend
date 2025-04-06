<template>
  <div class="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="flex">
      <div class="w-24 h-24 bg-cover bg-center" :style="{ backgroundImage: `url(${booking.image})` }"></div>
      <div class="flex flex-col justify-between p-3 flex-1">
        <div>
          <h3 class="text-[#131711] text-base font-bold leading-tight tracking-[-0.015em]">{{ booking.fieldName }}</h3>
          <p class="text-[#6c8764] text-sm font-normal leading-normal">{{ booking.location }}</p>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-1">
            <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 size-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
              </svg>
            </div>
            <p class="text-[#131711] text-sm font-normal leading-normal">{{ booking.time }}</p>
          </div>
          <div :class="getStatusClass(booking.status)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ booking.status }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center p-3 border-t border-[#f1f4f0]">
      <div class="flex items-center gap-2">
        <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 size-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM208,208H48V96H208Zm0-144H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"></path>
          </svg>
        </div>
        <p class="text-[#131711] text-sm font-normal leading-normal">{{ booking.date }}</p>
      </div>
      <button @click="goToDetails" class="text-[#131711] text-sm font-medium">Подробнее</button>
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
    goToDetails() {
      this.$router.push(`/bookings/${this.booking.id}`)
    }
  }
}
</script> 