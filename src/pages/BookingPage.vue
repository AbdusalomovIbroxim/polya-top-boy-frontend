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

      <!-- Date Selection -->
      <div class="form-section">
        <h3 class="section-title">Выберите дату</h3>
        <div class="calendar">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            @click="selectDate(index)"
            :class="['calendar-day', { active: selectedDateIndex === index }]"
          >
            <div class="day-name">{{ day.dayName }}</div>
            <div class="day-number">{{ day.dayNumber }}</div>
            <div class="day-label">{{ day.label }}</div>
          </div>
        </div>
      </div>

      <!-- Time Selection -->
      <div v-if="selectedDateIndex !== null" class="form-section">
        <h3 class="section-title">Выберите время</h3>
        <div class="time-slots">
          <div 
            v-for="(time, index) in availableTimes" 
            :key="index"
            @click="selectTime(index)"
            :class="['time-slot', { 
              active: isTimeSelected(index),
              'in-range': isTimeInRange(index) && !isTimeSelected(index)
            }]"
          >
            <div class="time-value">{{ time }}</div>
          </div>
        </div>
      </div>

      <!-- Booking Summary -->
      <div v-if="selectedDateIndex !== null && selectedStartTimeIndex !== null && selectedEndTimeIndex !== null" class="form-section">
        <h3 class="section-title">Детали бронирования</h3>
        <div class="summary-card">
          <div class="summary-header">
            <div class="summary-icon">📅</div>
            <div class="summary-title">Бронирование</div>
          </div>
          <div class="summary-details">
            <div class="summary-row">
              <span class="summary-label">Дата:</span>
              <span class="summary-value">{{ calendarDays[selectedDateIndex].fullDate }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Время:</span>
              <span class="summary-value">{{ availableTimes[selectedStartTimeIndex] }} - {{ availableTimes[selectedEndTimeIndex] }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Длительность:</span>
              <span class="summary-value">{{ getDuration() }} {{ getDuration() === 1 ? 'час' : getDuration() < 5 ? 'часа' : 'часов' }}</span>
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
        :disabled="selectedDateIndex === null || selectedStartTimeIndex === null || selectedEndTimeIndex === null || isSubmitting"
      >
        <div v-if="isSubmitting" class="button-spinner"></div>
        <span v-else>{{ isSubmitting ? 'Creating Booking...' : 'Create Booking' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { createBooking } from '../api/fields.js';

const route = useRoute();
const router = useRouter();
const { isAuth, isLoading, checkAuth } = useAuth();

const selectedDateIndex = ref(null);
const selectedStartTimeIndex = ref(null);
const selectedEndTimeIndex = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Генерация 7 дней календаря
const calendarDays = ref([]);
const availableTimes = ref([
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]);

// Инициализация календаря
function initCalendar() {
  const days = [];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  
  for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const dayName = dayNames[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = monthNames[date.getMonth()];
    
    let label = '';
    if (i === 0) label = 'Сегодня';
    else if (i === 1) label = 'Завтра';
    else label = `${dayName}, ${dayNumber} ${monthName}`;
    
    days.push({
      dayName,
      dayNumber,
      label,
      fullDate: date.toLocaleDateString('ru-RU', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: date.toISOString().split('T')[0]
    });
  }
  
  calendarDays.value = days;
}

function selectDate(index) {
  selectedDateIndex.value = index;
  selectedStartTimeIndex.value = null; // Сброс выбора времени при смене даты
  selectedEndTimeIndex.value = null;
}

function selectTime(index) {
  // Если не выбран начальный час, устанавливаем его
  if (selectedStartTimeIndex.value === null) {
    selectedStartTimeIndex.value = index;
    selectedEndTimeIndex.value = null;
  } 
  // Если начальный час выбран, но конечный нет
  else if (selectedEndTimeIndex.value === null) {
    // Проверяем, что конечное время после начального
    if (index > selectedStartTimeIndex.value) {
      selectedEndTimeIndex.value = index;
    } else {
      // Если выбрано время раньше начального, меняем начальное
      selectedStartTimeIndex.value = index;
      selectedEndTimeIndex.value = null;
    }
  } 
  // Если оба времени выбраны, начинаем новый выбор
  else {
    selectedStartTimeIndex.value = index;
    selectedEndTimeIndex.value = null;
  }
}

// Проверяем, является ли время выбранным
function isTimeSelected(index) {
  return selectedStartTimeIndex.value === index || selectedEndTimeIndex.value === index;
}

// Проверяем, находится ли время в выбранном диапазоне
function isTimeInRange(index) {
  if (selectedStartTimeIndex.value === null || selectedEndTimeIndex.value === null) {
    return false;
  }
  return index >= selectedStartTimeIndex.value && index <= selectedEndTimeIndex.value;
}

function formatDateTime(date, time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date(date);
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateObj.toISOString();
}

async function handleBooking() {
  if (selectedDateIndex.value === null || selectedStartTimeIndex.value === null || selectedEndTimeIndex.value === null || isSubmitting.value) return;
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const selectedDate = calendarDays.value[selectedDateIndex.value];
    const selectedStartTime = availableTimes.value[selectedStartTimeIndex.value];
    const selectedEndTime = availableTimes.value[selectedEndTimeIndex.value];
    
    const startDateTime = formatDateTime(selectedDate.date, selectedStartTime);
    const endDateTime = formatDateTime(selectedDate.date, selectedEndTime);
    
    const bookingData = {
      sport_venue: parseInt(route.params.stadiumId),
      start_time: startDateTime,
      end_time: endDateTime
    };
    await createBooking(bookingData);
    successMessage.value = 'Бронирование создано успешно!';
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Ошибка создания бронирования. Попробуйте еще раз.';
  } finally {
    isSubmitting.value = false;
  }
}

// Вычисление длительности в часах
function getDuration() {
  if (selectedStartTimeIndex.value === null || selectedEndTimeIndex.value === null) {
    return 0;
  }
  return selectedEndTimeIndex.value - selectedStartTimeIndex.value;
}

function goBack() {
  router.back();
}

onMounted(async () => {
  await checkAuth();
  initCalendar();
});

watch([isAuth, isLoading], ([auth, loading]) => {
  if (!loading && !auth) {
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

.calendar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px 0;
}

.calendar-day {
  background: white;
  border-radius: 16px;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  min-height: 80px;
  justify-content: center;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-color: #53d22c;
}

.calendar-day.active {
  border-color: #53d22c;
  background: linear-gradient(135deg, #53d22c 0%, #4bc026 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(83, 210, 44, 0.3);
}

.day-name {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-number {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.day-label {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.8;
  text-align: center;
  line-height: 1.2;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  /* max-height: 300px; */
  overflow-y: auto;
  padding: 4px 0;
}

.time-slot {
  background: white;
  border-radius: 12px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50px;
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

.time-slot.in-range {
  border-color: #53d22c;
  background: linear-gradient(135deg, rgba(83, 210, 44, 0.1) 0%, rgba(75, 192, 38, 0.1) 100%);
  color: #53d22c;
  box-shadow: 0 2px 8px rgba(83, 210, 44, 0.1);
}

.time-value {
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