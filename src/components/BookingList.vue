<template>
  <div class="flex flex-col gap-4 p-4">
    <BookingCard 
      v-for="booking in bookings" 
      :key="booking.id" 
      :booking="booking" 
    />
  </div>
</template>

<script>
import BookingCard from './BookingCard.vue'

export default {
  name: 'BookingList',
  components: {
    BookingCard
  },
  props: {
    bookings: {
      type: Array,
      required: true
    }
  }
}
</script> 