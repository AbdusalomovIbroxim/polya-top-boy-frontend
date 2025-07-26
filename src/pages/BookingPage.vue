<template>
  <div class="booking-page">
    <!-- Header -->
    <div class="booking-header">
      <div class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </div>
      <h2 class="booking-title">Book a field</h2>
    </div>

    <!-- Select a time -->
    <h2 class="section-title">Select a time</h2>
    <div class="time-selector">
      <div class="date-group">
        <p class="date-option inactive">Today</p>
        <p class="date-option active">Tomorrow</p>
        <p class="date-option inactive">Sun, Jul 21</p>
      </div>
      <div class="time-group">
        <p class="time-option inactive">10:00</p>
        <p class="time-option active">10:30</p>
        <p class="time-option inactive">11:00</p>
      </div>
    </div>

    <!-- Number of players -->
    <h2 class="section-title">Number of players</h2>
    <div class="players-input-container">
      <label class="players-input-label">
        <input
          v-model="numberOfPlayers"
          class="players-input"
          placeholder="Enter number of players"
          type="number"
          min="1"
        />
      </label>
    </div>

    <!-- Payment options -->
    <h2 class="section-title">Payment options</h2>
    <div class="payment-options">
      <label class="payment-option">
        <input
          v-model="paymentOption"
          type="radio"
          value="deposit"
          name="payment-option"
          class="payment-radio"
        />
        <div class="payment-info">
          <p class="payment-name">Deposit</p>
          <p class="payment-price">$20</p>
        </div>
      </label>
      <label class="payment-option">
        <input
          v-model="paymentOption"
          type="radio"
          value="full"
          name="payment-option"
          class="payment-radio"
        />
        <div class="payment-info">
          <p class="payment-name">Full payment</p>
          <p class="payment-price">$100</p>
        </div>
      </label>
      <label class="payment-option">
        <input
          v-model="paymentOption"
          type="radio"
          value="group"
          name="payment-option"
          class="payment-radio"
        />
        <div class="payment-info">
          <p class="payment-name">Group payment</p>
          <p class="payment-price">$10 per person</p>
        </div>
      </label>
    </div>

    <!-- Continue button -->
    <div class="continue-button-container">
      <button
        @click="handleContinue"
        class="continue-button"
      >
        <span>Continue</span>
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

.booking-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 16px;
  padding-bottom: 8px;
  justify-content: space-between;
}

.back-button {
  color: #131712;
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  cursor: pointer;
}

.booking-title {
  color: #131712;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.015em;
  flex: 1;
  text-align: center;
  padding-right: 48px;
}

.section-title {
  color: #131712;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.015em;
  padding: 0 16px 12px 16px;
  padding-top: 20px;
}

.time-selector {
  display: flex;
  padding: 0 16px 4px 16px;
}

.date-group, .time-group {
  display: flex;
  flex: 1;
}

.date-option, .time-option {
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.015em;
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 16px;
  border-radius: 8px;
  margin: 0 2px;
}

.date-option.inactive, .time-option.inactive {
  color: #c0ccbd;
}

.date-option.active, .time-option.active {
  color: #131712;
  background: #f1f4f1;
}

.date-option:first-child, .time-option:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.date-option:last-child, .time-option:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.players-input-container {
  display: flex;
  max-width: 480px;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
  padding: 0 16px 12px 16px;
}

.players-input-label {
  display: flex;
  flex-direction: column;
  min-width: 160px;
  flex: 1;
}

.players-input {
  display: flex;
  width: 100%;
  min-width: 0;
  flex: 1;
  resize: none;
  overflow: hidden;
  border-radius: 8px;
  color: #131712;
  outline: none;
  border: none;
  background: #f1f4f1;
  height: 56px;
  padding: 16px;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
}

.players-input::placeholder {
  color: #6d8566;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid #dee4dc;
  padding: 15px;
  flex-direction: row-reverse;
  cursor: pointer;
}

.payment-radio {
  height: 20px;
  width: 20px;
  border: 2px solid #dee4dc;
  background: transparent;
  color: transparent;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
}

.payment-radio:checked {
  border-color: #131712;
  background-image: url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(19,23,18)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e');
}

.payment-info {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.payment-name {
  color: #131712;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.payment-price {
  color: #6d8566;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
}

.continue-button-container {
  display: flex;
  padding: 0 16px 12px 16px;
}

.continue-button {
  display: flex;
  min-width: 84px;
  max-width: 480px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  height: 48px;
  padding: 0 20px;
  flex: 1;
  background: #53d22c;
  color: #131712;
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.015em;
  border: none;
}

.continue-button:hover {
  background: #4bc026;
}
</style> 