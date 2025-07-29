<template>
  <div class="bookings-page">
    <!-- Debug info -->
    <div v-if="debug" style="background: yellow; padding: 10px; margin: 10px;">
      <p>DEBUG: isLoading = {{ isLoading }}</p>
      <p>DEBUG: error = {{ error }}</p>
      <p>DEBUG: bookings.length = {{ bookings.length }}</p>
      <p>DEBUG: filteredBookings.length = {{ filteredBookings.length }}</p>
      <p>DEBUG: activeTab = {{ activeTab }}</p>
      <p>DEBUG: isAuth = {{ isAuth }}</p>
    </div>
    
    <!-- Simple test content -->
    <div style="padding: 20px;">
      <h1>Bookings Page Test</h1>
      <p>If you see this, the component is loading correctly.</p>
      <button @click="loadBookings">Load Bookings</button>
    </div>
    
    <!-- Header -->
    <div class="bookings-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </button>
      <h2 class="bookings-title">My Bookings</h2>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          @click="activeTab = 'upcoming'"
          :class="['tab', { active: activeTab === 'upcoming' }]"
        >
          <span class="tab-text">Upcoming</span>
        </button>
        <button 
          @click="activeTab = 'past'"
          :class="['tab', { active: activeTab === 'past' }]"
        >
          <span class="tab-text">Past</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="bookings-list">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading bookings...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Error loading bookings</h3>
        <p class="error-text">{{ error }}</p>
        <button @click="loadBookings" class="retry-button">
          Try Again
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3 class="empty-title">No {{ activeTab }} bookings</h3>
        <p class="empty-text">
          {{ activeTab === 'upcoming' 
            ? 'You don\'t have any upcoming bookings yet.' 
            : 'You don\'t have any past bookings yet.' 
          }}
        </p>
      </div>

      <!-- Bookings list -->
      <div v-else>
        <div 
          v-for="booking in filteredBookings" 
          :key="booking.id"
          class="booking-item"
        >
          <div class="booking-image" :style="getBookingImageStyle(booking)"></div>
          <div class="booking-info">
            <p class="booking-title">{{ getBookingTitle(booking) }}</p>
            <p class="booking-details">{{ getBookingDetails(booking) }}</p>
          </div>
          <div class="booking-actions">
            <button 
              v-if="activeTab === 'upcoming' && canCancelBooking(booking)"
              @click="cancelBookingById(booking.id)"
              :disabled="cancelingBookingId === booking.id"
              class="cancel-button"
            >
              {{ cancelingBookingId === booking.id ? 'Canceling...' : 'Cancel' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserBookings, cancelBooking } from '../api/bookings.js';
import { useAuth } from '../composables/useAuth.js';
import '../assets/css/bookings.css';

const router = useRouter();
const { isAuth, checkAuth } = useAuth();

const activeTab = ref('upcoming');
const bookings = ref([]);
const isLoading = ref(false);
const error = ref('');
const cancelingBookingId = ref(null);
const debug = ref(true); // Временно включим для отладки

// Загрузка бронирований
async function loadBookings() {
  isLoading.value = true;
  error.value = '';
  
  try {
    console.log('DEBUG: loadBookings called');
    const data = await getUserBookings();
    console.log('DEBUG: Bookings data received:', data);
    bookings.value = data;
    console.log('DEBUG: Bookings loaded:', data);
  } catch (err) {
    console.error('DEBUG: Error loading bookings:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load bookings. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Фильтрация бронирований по активному табу
const filteredBookings = computed(() => {
  const now = new Date();
  
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.start_time);
    
    if (activeTab.value === 'upcoming') {
      return bookingDate >= now;
    } else {
      return bookingDate < now;
    }
  });
});

// Получение заголовка бронирования
function getBookingTitle(booking) {
  return booking.sport_venue?.name || 'Unknown Field';
}

// Получение деталей бронирования
function getBookingDetails(booking) {
  const venue = booking.sport_venue?.name || 'Unknown Stadium';
  const startTime = formatTime(booking.start_time);
  const endTime = formatTime(booking.end_time);
  
  return `${venue} · ${startTime} - ${endTime}`;
}

// Форматирование времени
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Получение стиля изображения
function getBookingImageStyle(booking) {
  const imageUrl = booking.sport_venue?.image || 'https://via.placeholder.com/56x56/53d22c/ffffff?text=🏟️';
  return {
    backgroundImage: `url(${imageUrl})`
  };
}

// Проверка возможности отмены
function canCancelBooking(booking) {
  const bookingDate = new Date(booking.start_time);
  const now = new Date();
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
  
  // Можно отменить за 2 часа до начала
  return hoursUntilBooking > 2;
}

// Отмена бронирования
async function cancelBookingById(bookingId) {
  cancelingBookingId.value = bookingId;
  
  try {
    await cancelBooking(bookingId);
    
    // Удаляем бронирование из списка
    const index = bookings.value.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings.value.splice(index, 1);
    }
    
    console.log('Booking canceled successfully');
  } catch (err) {
    console.error('Error canceling booking:', err);
    error.value = 'Failed to cancel booking. Please try again.';
  } finally {
    cancelingBookingId.value = null;
  }
}

function goBack() {
  router.back();
}

onMounted(async () => {
  console.log('DEBUG: BookingsPage mounted');
  console.log('DEBUG: Component is loading...');
  
  // Простая проверка без редиректа для тестирования
  try {
    await checkAuth();
    console.log('DEBUG: Auth check completed, isAuth =', isAuth.value);
    
    if (isAuth.value) {
      console.log('DEBUG: User authenticated, loading bookings');
      await loadBookings();
    } else {
      console.log('DEBUG: User not authenticated, but not redirecting for testing');
    }
  } catch (error) {
    console.error('DEBUG: Auth check failed:', error);
    // Не редиректим для тестирования
  }
});
</script> 