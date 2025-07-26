<template>
  <div class="booking-page">
    <!-- Header -->
    <div class="flex items-center bg-white p-4 pb-2 justify-between">
      <div class="text-[#131712] flex size-12 shrink-0 items-center cursor-pointer" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </div>
      <h2 class="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Book a field</h2>
    </div>

    <!-- Select a time -->
    <h2 class="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Select a time</h2>
    <div class="flex px-4 py-1">
      <div class="group flex-1">
        <p
          class="text-[#c0ccbd] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg"
        >
          Today
        </p>
        <p
          class="text-[#131712] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg bg-[#f1f4f1]"
        >
          Tomorrow
        </p>
        <p
          class="text-[#c0ccbd] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg"
        >
          Sun, Jul 21
        </p>
      </div>
      <div class="group flex-1">
        <p
          class="text-[#c0ccbd] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg"
        >
          10:00
        </p>
        <p
          class="text-[#131712] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg bg-[#f1f4f1]"
        >
          10:30
        </p>
        <p
          class="text-[#c0ccbd] text-sm font-bold leading-normal tracking-[0.015em] flex h-11 items-center justify-center truncate px-4 text-center group-[:first-child]:rounded-l-lg group-[:last-child]:rounded-r-lg"
        >
          11:00
        </p>
      </div>
    </div>

    <!-- Number of players -->
    <h2 class="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Number of players</h2>
    <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
      <label class="flex flex-col min-w-40 flex-1">
        <input
          v-model="numberOfPlayers"
          class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#131712] focus:outline-0 focus:ring-0 border-none bg-[#f1f4f1] focus:border-none h-14 placeholder:text-[#6d8566] p-4 text-base font-normal leading-normal"
          placeholder="Enter number of players"
          type="number"
          min="1"
        />
      </label>
    </div>

    <!-- Payment options -->
    <h2 class="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Payment options</h2>
    <div class="flex flex-col gap-3 p-4">
      <label class="flex items-center gap-4 rounded-lg border border-solid border-[#dee4dc] p-[15px] flex-row-reverse">
        <input
          v-model="paymentOption"
          type="radio"
          value="deposit"
          class="h-5 w-5 border-2 border-[#dee4dc] bg-transparent text-transparent checked:border-[#131712] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#131712]"
          name="payment-option"
        />
        <div class="flex grow flex-col">
          <p class="text-[#131712] text-sm font-medium leading-normal">Deposit</p>
          <p class="text-[#6d8566] text-sm font-normal leading-normal">$20</p>
        </div>
      </label>
      <label class="flex items-center gap-4 rounded-lg border border-solid border-[#dee4dc] p-[15px] flex-row-reverse">
        <input
          v-model="paymentOption"
          type="radio"
          value="full"
          class="h-5 w-5 border-2 border-[#dee4dc] bg-transparent text-transparent checked:border-[#131712] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#131712]"
          name="payment-option"
        />
        <div class="flex grow flex-col">
          <p class="text-[#131712] text-sm font-medium leading-normal">Full payment</p>
          <p class="text-[#6d8566] text-sm font-normal leading-normal">$100</p>
        </div>
      </label>
      <label class="flex items-center gap-4 rounded-lg border border-solid border-[#dee4dc] p-[15px] flex-row-reverse">
        <input
          v-model="paymentOption"
          type="radio"
          value="group"
          class="h-5 w-5 border-2 border-[#dee4dc] bg-transparent text-transparent checked:border-[#131712] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#131712]"
          name="payment-option"
        />
        <div class="flex grow flex-col">
          <p class="text-[#131712] text-sm font-medium leading-normal">Group payment</p>
          <p class="text-[#6d8566] text-sm font-normal leading-normal">$10 per person</p>
        </div>
      </label>
    </div>

    <!-- Continue button -->
    <div class="flex px-4 py-3">
      <button
        @click="handleContinue"
        class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#53d22c] text-[#131712] text-base font-bold leading-normal tracking-[0.015em]"
      >
        <span class="truncate">Continue</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const numberOfPlayers = ref('');
const paymentOption = ref('deposit');

function goBack() {
  router.back();
}

function handleContinue() {
  // Здесь будет логика отправки данных бронирования
  console.log('Booking data:', {
    stadiumId: route.params.stadiumId,
    numberOfPlayers: numberOfPlayers.value,
    paymentOption: paymentOption.value
  });
  
  // Пока просто показываем алерт
  alert('Booking submitted!');
}
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: white;
  font-family: 'Manrope', 'Noto Sans', sans-serif;
}

/* Radio button styles */
:root {
  --radio-dot-svg: url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(19,23,18)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e');
}
</style> 