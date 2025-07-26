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
      <div class="date-selector">
        <div 
          v-for="(date, index) in availableDates" 
          :key="index"
          @click="selectDate(index)"
          :class="['date-card', { active: selectedDateIndex === index }]"
        >
          <div class="date-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span class="date-label">{{ date.label }}</span>
        </div>
      </div>
      
      <!-- Start Time Selection -->
      <div class="time-section">
        <h3 class="time-section-title">Start Time</h3>
        <div class="time-selector-container">
          <div class="time-grid">
            <div 
              v-for="(time, index) in availableStartTimes" 
              :key="index"
              @click="selectStartTime(index)"
              :class="['time-card', { active: selectedStartTimeIndex === index }]"
            >
              {{ time }}
            </div>
          </div>
        </div>
      </div>

      <!-- Duration Selection -->
      <div class="time-section">
        <h3 class="time-section-title">Duration</h3>
        <div class="duration-selector">
          <div 
            v-for="(duration, index) in availableDurations" 
            :key="index"
            @click="selectDuration(index)"
            :class="['duration-card', { active: selectedDurationIndex === index }]"
          >
            <div class="duration-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <span class="duration-label">{{ duration.label }}</span>
            <span class="duration-price">{{ duration.price }}</span>
          </div>
        </div>
      </div>

      <!-- Booking Summary -->
      <div v-if="selectedStartTimeIndex !== null && selectedDurationIndex !== null" class="booking-summary">
        <div class="summary-card">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="summary-content">
            <h4 class="summary-title">Booking Summary</h4>
            <p class="summary-time">
              {{ availableDates[selectedDateIndex].label }} • 
              {{ availableStartTimes[selectedStartTimeIndex] }} - 
              {{ getEndTime() }}
            </p>
            <p class="summary-duration">
              Duration: {{ availableDurations[selectedDurationIndex].label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Number of players -->
    <h2 class="section-title">Number of players</h2>
    <div class="players-input-container">
      <div class="input-wrapper">
        <div class="input-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <input
          v-model="numberOfPlayers"
          class="players-input"
          placeholder="Enter number of players"
          type="number"
          min="1"
        />
      </div>
    </div>

    <!-- Payment options -->
    <h2 class="section-title">Payment options</h2>
    <div class="payment-options">
      <div 
        @click="paymentOption = 'deposit'"
        :class="['payment-card', { active: paymentOption === 'deposit' }]"
      >
        <div class="payment-icon deposit-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <div class="payment-content">
          <h3 class="payment-title">Deposit</h3>
          <p class="payment-description">Pay only $20 to secure your booking</p>
          <div class="payment-price">$20</div>
        </div>
        <div class="payment-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      </div>

      <div 
        @click="paymentOption = 'full'"
        :class="['payment-card', { active: paymentOption === 'full' }]"
      >
        <div class="payment-icon full-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="payment-content">
          <h3 class="payment-title">Full payment</h3>
          <p class="payment-description">Pay the full amount upfront</p>
          <div class="payment-price">$100</div>
        </div>
        <div class="payment-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      </div>

      <div 
        @click="paymentOption = 'group'"
        :class="['payment-card', { active: paymentOption === 'group' }]"
      >
        <div class="payment-icon group-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="payment-content">
          <h3 class="payment-title">Group payment</h3>
          <p class="payment-description">Split the cost among players</p>
          <div class="payment-price">$10 per person</div>
        </div>
        <div class="payment-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- Continue button -->
    <div class="continue-button-container">
      <button
        @click="handleContinue"
        class="continue-button"
        :disabled="!canContinue"
      >
        <span>Continue</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12,5 19,12 12,19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const numberOfPlayers = ref('');
const paymentOption = ref('deposit');
const selectedDateIndex = ref(1);
const selectedStartTimeIndex = ref(null);
const selectedDurationIndex = ref(null);

// Доступные даты
const availableDates = ref([
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Sun, Jul 21', value: 'sun-jul-21' }
]);

// Доступные времена начала
const availableStartTimes = ref([
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
  '20:00', '21:00', '22:00'
]);

// Доступные продолжительности
const availableDurations = ref([
  { label: '1 hour', value: 1, price: '$25' },
  { label: '2 hours', value: 2, price: '$45' },
  { label: '3 hours', value: 3, price: '$65' },
  { label: '4 hours', value: 4, price: '$80' }
]);

// Проверка возможности продолжить
const canContinue = computed(() => {
  return selectedStartTimeIndex.value !== null && 
         selectedDurationIndex.value !== null && 
         numberOfPlayers.value.trim() !== '';
});

function selectDate(index) {
  selectedDateIndex.value = index;
}

function selectStartTime(index) {
  selectedStartTimeIndex.value = index;
}

function selectDuration(index) {
  selectedDurationIndex.value = index;
}

function getEndTime() {
  if (selectedStartTimeIndex.value === null || selectedDurationIndex.value === null) {
    return '';
  }
  
  const startTime = availableStartTimes.value[selectedStartTimeIndex.value];
  const duration = availableDurations.value[selectedDurationIndex.value].value;
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = hours + duration;
  
  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function goBack() {
  router.back();
}

function handleContinue() {
  console.log('Booking data:', {
    stadiumId: route.params.stadiumId,
    selectedDate: availableDates.value[selectedDateIndex.value],
    startTime: availableStartTimes.value[selectedStartTimeIndex.value],
    endTime: getEndTime(),
    duration: availableDurations.value[selectedDurationIndex.value],
    numberOfPlayers: numberOfPlayers.value,
    paymentOption: paymentOption.value
  });
  
  alert('Booking submitted!');
}
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Manrope', 'Noto Sans', sans-serif;
}

.booking-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 16px;
  padding-bottom: 8px;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.back-button {
  color: #131712;
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.back-button:hover {
  background: #f8f9fa;
  transform: scale(1.05);
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
  padding: 0 16px;
}

.date-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.date-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.date-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.date-card.active {
  border-color: #53d22c;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.date-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
}

.date-label {
  font-weight: 600;
  font-size: 14px;
}

.time-section {
  margin-bottom: 20px;
}

.time-section-title {
  color: #131712;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding: 0 4px;
}

.time-selector-container {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.time-card {
  padding: 12px 8px;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
  background: #f8f9fa;
  border: 2px solid transparent;
}

.time-card:hover {
  background: #e9f5e6;
  color: #53d22c;
  transform: scale(1.05);
}

.time-card.active {
  background: #53d22c;
  color: white;
  box-shadow: 0 2px 8px rgba(83, 210, 44, 0.3);
}

.duration-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.duration-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.duration-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.duration-card.active {
  border-color: #53d22c;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.duration-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
}

.duration-label {
  font-weight: 600;
  font-size: 14px;
}

.duration-price {
  font-weight: 700;
  font-size: 16px;
  color: #53d22c;
}

.duration-card.active .duration-price {
  color: white;
}

.booking-summary {
  margin-top: 20px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid #53d22c;
}

.summary-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #53d22c;
  border-radius: 12px;
  color: white;
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #131712;
}

.summary-time {
  font-size: 14px;
  color: #53d22c;
  font-weight: 500;
  margin: 0 0 2px 0;
}

.summary-duration {
  font-size: 12px;
  color: #6d8566;
  margin: 0;
}

.players-input-container {
  padding: 0 16px;
}

.input-wrapper {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6d8566;
  z-index: 1;
}

.players-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 16px 16px 16px 48px;
  font-size: 16px;
  background: transparent;
  color: #131712;
  transition: all 0.3s ease;
}

.players-input:focus {
  background: #f8f9fa;
}

.players-input::placeholder {
  color: #6d8566;
}

.payment-options {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.payment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.payment-card.active {
  border-color: #53d22c;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.payment-card.active::before {
  opacity: 1;
}

.payment-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.deposit-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.full-icon {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.group-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #131712;
}

.payment-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.payment-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #131712;
}

.payment-description {
  font-size: 14px;
  color: #6d8566;
  margin: 0 0 8px 0;
}

.payment-price {
  font-size: 18px;
  font-weight: 700;
  color: #53d22c;
}

.payment-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #53d22c;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.payment-card.active .payment-check {
  opacity: 1;
  transform: scale(1);
}

.continue-button-container {
  padding: 16px;
  margin-top: 20px;
}

.continue-button {
  width: 100%;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.continue-button:disabled {
  background: #e9ecef;
  color: #6d8566;
  cursor: not-allowed;
  box-shadow: none;
}

.continue-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(83, 210, 44, 0.4);
}

.continue-button:not(:disabled):active {
  transform: translateY(0);
}
</style> 