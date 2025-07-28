<template>
  <div class="booking-page">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>

    <!-- Not authorized state -->
    <div v-else-if="!isAuth" class="not-authorized-container">
      <div class="not-authorized-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>
      <h2 class="not-authorized-title">Access Denied</h2>
      <p class="not-authorized-text">You need to be logged in to book a field.</p>
      <button @click="router.push('/login')" class="login-button">
        Go to Login
      </button>
    </div>

    <!-- Main booking form -->
    <div v-else>
      <!-- Header -->
      <div class="booking-header">
        <div class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </div>
        <h2 class="booking-title">Book a field</h2>
      </div>

      <!-- Stadium Info -->
      <div v-if="stadium" class="stadium-info">
        <div class="stadium-card">
          <div class="stadium-image">
            <img v-if="stadium.image" :src="stadium.image" :alt="stadium.name" />
            <div v-else class="stadium-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
          </div>
          <div class="stadium-details">
            <h3 class="stadium-name">{{ stadium.name }}</h3>
            <p class="stadium-address">{{ stadium.address }}</p>
            <div class="stadium-price">${{ stadium.price_per_hour }}/hour</div>
          </div>
        </div>
      </div>

      <!-- Date Selection -->
      <div class="section">
        <h3 class="section-title">Select Date</h3>
        <div class="date-grid">
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
            <span class="date-value">{{ date.value }}</span>
          </div>
        </div>
      </div>

      <!-- Time Selection -->
      <div class="section">
        <h3 class="section-title">Select Time</h3>
        <div class="time-container">
          <!-- Start Time -->
          <div class="time-section">
            <h4 class="time-section-title">Start Time</h4>
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

          <!-- Duration -->
          <div class="time-section">
            <h4 class="time-section-title">Duration</h4>
            <div class="duration-grid">
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
        </div>
      </div>

      <!-- Booking Summary -->
      <div v-if="selectedStartTimeIndex !== null && selectedDurationIndex !== null" class="section">
        <h3 class="section-title">Booking Summary</h3>
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
            <div class="summary-row">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ availableDates[selectedDateIndex].label }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Time:</span>
              <span class="summary-value">{{ availableStartTimes[selectedStartTimeIndex] }} - {{ getEndTime() }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Duration:</span>
              <span class="summary-value">{{ availableDurations[selectedDurationIndex].label }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Total Price:</span>
              <span class="summary-value price">{{ availableDurations[selectedDurationIndex]?.price || '$0' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Number of Players -->
      <div class="section">
        <h3 class="section-title">Number of Players</h3>
        <div class="input-container">
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
              max="20"
            />
          </div>
        </div>
      </div>

      <!-- Payment Options -->
      <div class="section">
        <h3 class="section-title">Payment Options</h3>
        <div class="payment-grid">
          <div 
            @click="paymentOption = 'deposit'"
            :class="['payment-card', { active: paymentOption === 'deposit' }]"
          >
            <div class="payment-icon deposit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div class="payment-content">
              <h4 class="payment-title">Deposit</h4>
              <p class="payment-desc">Pay only $20 to secure your booking</p>
              <div class="payment-price">$20</div>
            </div>
            <div class="payment-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
          </div>

          <div 
            @click="paymentOption = 'full'"
            :class="['payment-card', { active: paymentOption === 'full' }]"
          >
            <div class="payment-icon full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="payment-content">
              <h4 class="payment-title">Full Payment</h4>
              <p class="payment-desc">Pay the full amount upfront</p>
              <div class="payment-price">{{ availableDurations[selectedDurationIndex]?.price || '$0' }}</div>
            </div>
            <div class="payment-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
          </div>

          <div 
            @click="paymentOption = 'group'"
            :class="['payment-card', { active: paymentOption === 'group' }]"
          >
            <div class="payment-icon group">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="payment-content">
              <h4 class="payment-title">Group Payment</h4>
              <p class="payment-desc">Split the cost among players</p>
              <div class="payment-price">$10 per person</div>
            </div>
            <div class="payment-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <div class="error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        <div class="success-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        </div>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Continue Button -->
      <div class="button-container">
        <button
          @click="handleBooking"
          class="booking-button"
          :disabled="!canContinue || isSubmitting"
        >
          <div v-if="isSubmitting" class="button-spinner"></div>
          <span v-else>{{ isSubmitting ? 'Creating Booking...' : 'Create Booking' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { getSportVenue, createBooking } from '../api/fields.js';

const route = useRoute();
const router = useRouter();
const { isAuth, isLoading, checkAuth } = useAuth();

// Reactive data
const stadium = ref(null);
const numberOfPlayers = ref('');
const paymentOption = ref('deposit');
const selectedDateIndex = ref(0);
const selectedStartTimeIndex = ref(null);
const selectedDurationIndex = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Available options
const availableDates = ref([
  { label: 'Today', value: new Date().toISOString().split('T')[0] },
  { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { label: 'Day after tomorrow', value: new Date(Date.now() + 172800000).toISOString().split('T')[0] }
]);

const availableStartTimes = ref([
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
  '20:00', '21:00', '22:00'
]);

const availableDurations = ref([
  { label: '1 hour', value: 1, price: '$25' },
  { label: '2 hours', value: 2, price: '$45' },
  { label: '3 hours', value: 3, price: '$65' },
  { label: '4 hours', value: 4, price: '$80' }
]);

// Computed properties
const canContinue = computed(() => {
  return selectedStartTimeIndex.value !== null && 
         selectedDurationIndex.value !== null && 
         numberOfPlayers.value.trim() !== '' &&
         stadium.value;
});

// Methods
async function loadStadium() {
  try {
    const stadiumId = route.params.stadiumId;
    if (stadiumId) {
      const stadiumData = await getSportVenue(stadiumId);
      stadium.value = stadiumData;
    }
  } catch (error) {
    console.error('Error loading stadium:', error);
    errorMessage.value = 'Failed to load stadium information';
  }
}

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

function formatDateTime(date, time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date(date);
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateObj.toISOString();
}

async function handleBooking() {
  if (!canContinue.value || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const selectedDate = availableDates.value[selectedDateIndex.value];
    const startTime = availableStartTimes.value[selectedStartTimeIndex.value];
    const duration = availableDurations.value[selectedDurationIndex.value];

    const startDateTime = formatDateTime(selectedDate.value, startTime);
    const endDateTime = formatDateTime(selectedDate.value, getEndTime());

    const bookingData = {
      sport_venue: parseInt(route.params.stadiumId),
      start_time: startDateTime,
      end_time: endDateTime
    };

    console.log('Creating booking with data:', bookingData);
    
    const result = await createBooking(bookingData);
    
    successMessage.value = 'Booking created successfully!';
    
    // Redirect to profile or home after successful booking
    setTimeout(() => {
      router.push('/profile');
    }, 2000);

  } catch (error) {
    console.error('Error creating booking:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to create booking. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  router.back();
}

// Lifecycle
onMounted(async () => {
  await checkAuth();
  if (!isAuth.value && !isLoading.value) {
    router.push('/login');
  } else {
    await loadStadium();
  }
});

// Watchers
watch([isAuth, isLoading], ([auth, loading]) => {
  if (!auth && !loading) {
    router.push('/login');
  }
});
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Manrope', 'Noto Sans', sans-serif;
  padding-bottom: 100px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #53d22c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #131712;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -0.015em;
}

.not-authorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
}

.not-authorized-icon {
  color: #53d22c;
  margin-bottom: 20px;
}

.not-authorized-title {
  color: #131712;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin-bottom: 10px;
}

.not-authorized-text {
  color: #6d8566;
  font-size: 16px;
  text-align: center;
  margin-bottom: 25px;
  padding: 0 20px;
}

.login-button {
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

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(83, 210, 44, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.booking-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  color: #131712;
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-right: 16px;
}

.back-button:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.booking-title {
  color: #131712;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.015em;
  flex: 1;
}

.stadium-info {
  padding: 16px;
}

.stadium-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stadium-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.stadium-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stadium-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stadium-details {
  flex: 1;
}

.stadium-name {
  font-size: 18px;
  font-weight: bold;
  color: #131712;
  margin: 0 0 4px 0;
}

.stadium-address {
  font-size: 14px;
  color: #6d8566;
  margin: 0 0 8px 0;
}

.stadium-price {
  font-size: 16px;
  font-weight: 600;
  color: #53d22c;
}

.section {
  padding: 16px;
  margin-bottom: 8px;
}

.section-title {
  color: #131712;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  letter-spacing: -0.015em;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.date-card {
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

.date-value {
  font-size: 12px;
  opacity: 0.8;
}

.time-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.time-section-title {
  color: #131712;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
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

.duration-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.duration-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
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

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 2px solid #53d22c;
}

.summary-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #53d22c;
  border-radius: 12px;
  color: white;
  margin-bottom: 16px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 14px;
  color: #6d8566;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  color: #131712;
  font-weight: 600;
}

.summary-value.price {
  color: #53d22c;
  font-weight: 700;
  font-size: 16px;
}

.input-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.input-wrapper {
  position: relative;
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
  border: 2px solid #e9ecef;
  border-radius: 12px;
  outline: none;
  padding: 16px 16px 16px 48px;
  font-size: 16px;
  background: transparent;
  color: #131712;
  transition: all 0.3s ease;
}

.players-input:focus {
  border-color: #53d22c;
  box-shadow: 0 0 0 3px rgba(83, 210, 44, 0.1);
}

.players-input::placeholder {
  color: #6d8566;
}

.payment-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.payment-icon.deposit {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.payment-icon.full {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.payment-icon.group {
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

.payment-desc {
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

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c33;
}

.error-icon {
  color: #c33;
  flex-shrink: 0;
}

.success-message {
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3c3;
}

.success-icon {
  color: #3c3;
  flex-shrink: 0;
}

.button-container {
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 10;
}

.booking-button {
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
  position: relative;
}

.booking-button:disabled {
  background: #e9ecef;
  color: #6d8566;
  cursor: not-allowed;
  box-shadow: none;
}

.booking-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(83, 210, 44, 0.4);
}

.booking-button:not(:disabled):active {
  transform: translateY(0);
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style> 