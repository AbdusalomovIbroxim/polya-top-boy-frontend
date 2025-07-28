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
    <div v-else class="booking-content">
      <!-- Header -->
      <div class="booking-header">
        <button class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="booking-title">Book Field</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- Time Selection -->
      <div class="form-section">
        <h3 class="section-title">Select a time</h3>
        <div class="time-slots">
          <div 
            v-for="(slot, index) in availableTimeSlots" 
            :key="index"
            @click="selectTimeSlot(index)"
            :class="['time-slot', { active: selectedTimeSlotIndex === index }]"
          >
            <div class="slot-date">{{ slot.date }}</div>
            <div class="slot-time">{{ slot.time }}</div>
          </div>
        </div>
      </div>

      <!-- Booking Summary -->
      <div v-if="selectedTimeSlotIndex !== null" class="form-section">
        <h3 class="section-title">Booking Summary</h3>
        <div class="summary-card">
          <div class="summary-header">
            <div class="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h4 class="summary-title">Your Booking</h4>
          </div>
          <div class="summary-details">
            <div class="summary-row">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ availableTimeSlots[selectedTimeSlotIndex].date }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Time:</span>
              <span class="summary-value">{{ availableTimeSlots[selectedTimeSlotIndex].time }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Duration:</span>
              <span class="summary-value">1 hour</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="message error">
        <div class="message-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="message success">
        <div class="message-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        </div>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Bottom Spacer -->
      <div class="bottom-spacer"></div>
    </div>

    <!-- Fixed Button -->
    <div class="fixed-button-container">
      <button
        @click="handleBooking"
        class="booking-button"
        :disabled="selectedTimeSlotIndex === null || isSubmitting"
      >
        <div v-if="isSubmitting" class="button-spinner"></div>
        <span v-else>{{ isSubmitting ? 'Creating Booking...' : 'Create Booking' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { createBooking } from '../api/fields.js';

const route = useRoute();
const router = useRouter();
const { isAuth, isLoading, checkAuth } = useAuth();

// Reactive data
const selectedTimeSlotIndex = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Available time slots
const availableTimeSlots = ref([
  { 
    date: 'Today', 
    time: '10:00',
    value: new Date().toISOString().split('T')[0],
    startTime: '10:00'
  },
  { 
    date: 'Tomorrow', 
    time: '10:30',
    value: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '10:30'
  },
  { 
    date: 'Sun, Jul 21', 
    time: '11:00',
    value: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    startTime: '11:00'
  }
]);

// Methods
function selectTimeSlot(index) {
  selectedTimeSlotIndex.value = index;
}

function formatDateTime(date, time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date(date);
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateObj.toISOString();
}

async function handleBooking() {
  if (selectedTimeSlotIndex.value === null || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const selectedSlot = availableTimeSlots.value[selectedTimeSlotIndex.value];
    
    const startDateTime = formatDateTime(selectedSlot.value, selectedSlot.startTime);
    const endDateTime = formatDateTime(selectedSlot.value, '11:00'); // 1 hour duration

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
  background: #f8f9fa;
  font-family: 'Manrope', 'Noto Sans', sans-serif;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
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
  background: #f8f9fa;
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

.booking-content {
  padding-bottom: 100px;
}

.booking-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  color: #131712;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
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
  text-align: center;
}

.header-spacer {
  width: 40px;
}

.form-section {
  padding: 0 20px 24px 20px;
}

.section-title {
  color: #131712;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  letter-spacing: -0.015em;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-slot {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.time-slot.active {
  border-color: #53d22c;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.slot-date {
  font-weight: 600;
  font-size: 16px;
}

.slot-time {
  font-weight: 600;
  font-size: 16px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 2px solid #53d22c;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #53d22c;
  border-radius: 10px;
  color: white;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #131712;
  margin: 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  border-top: 2px solid #53d22c;
  padding-top: 12px;
  margin-top: 8px;
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

.message {
  margin: 0 20px 16px 20px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.message.error {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.message.success {
  background: #efe;
  border: 1px solid #cfc;
  color: #3c3;
}

.message-icon {
  flex-shrink: 0;
}

.bottom-spacer {
  height: 20px;
}

.fixed-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
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