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
    
    <!-- Header -->
    <div class="bookings-header">
      <!-- <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </button> -->
      <h2 class="bookings-title">Мои бронирования</h2>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          @click="activeTab = 'upcoming'"
          :class="['tab', { active: activeTab === 'upcoming' }]"
        >
          <span class="tab-text">Предстоящие</span>
        </button>
        <button 
          @click="activeTab = 'past'"
          :class="['tab', { active: activeTab === 'past' }]"
        >
          <span class="tab-text">Прошедшие</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="bookings-list">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Загрузка бронирований...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Ошибка загрузки</h3>
        <p class="error-text">{{ error }}</p>
        <button @click="loadBookings" class="retry-button">
          Попробовать снова
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3 class="empty-title">
          {{ activeTab === 'upcoming' ? 'Нет предстоящих бронирований' : 'Нет прошедших бронирований' }}
        </h3>
        <p class="empty-text">
          {{ activeTab === 'upcoming' 
            ? 'У вас пока нет предстоящих бронирований.' 
            : 'У вас пока нет прошедших бронирований.' 
          }}
        </p>
      </div>

      <!-- Bookings list -->
      <div v-else class="bookings-grid">
        <div 
          v-for="(booking, index) in filteredBookings" 
          :key="booking?.id || index"
          class="booking-card"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="venue-image" :style="getBookingImageStyle(booking)"></div>
            <div class="venue-info">
              <h3 class="venue-title">{{ getBookingTitle(booking) }}</h3>
              <span class="booking-status" :class="getStatusClass(booking)">
                {{ getBookingStatus(booking) }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <div class="booking-details">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span class="detail-text">{{ getBookingDetails(booking) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💰</span>
                <span class="detail-text">{{ getBookingPrice(booking) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💳</span>
                <span class="detail-text">{{ getBookingDeposit(booking) }}</span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <button 
              v-if="activeTab === 'upcoming' && canCancelBooking(booking)"
              @click="cancelBookingById(booking.id)"
              :disabled="cancelingBookingId === booking.id"
              class="cancel-button"
            >
              <span class="button-icon">❌</span>
              <span class="button-text">
                {{ cancelingBookingId === booking.id ? 'Отмена...' : 'Отменить' }}
              </span>
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
const debug = ref(false); // Отключим debug режим

// Загрузка бронирований
async function loadBookings() {
  isLoading.value = true;
  error.value = '';
  
  try {
    console.log('DEBUG: loadBookings called');
    const data = await getUserBookings();
    console.log('DEBUG: Bookings data received:', data);
    
    // Проверяем структуру данных
    if (data && Array.isArray(data)) {
      console.log('DEBUG: Data is array with length:', data.length);
      bookings.value = data;
    } else if (data && typeof data === 'object') {
      console.log('DEBUG: Data is object, checking for results property');
      if (data.results && Array.isArray(data.results)) {
        console.log('DEBUG: Using data.results array');
        bookings.value = data.results;
      } else {
        console.log('DEBUG: Data is object but no results array, using as single item');
        bookings.value = [data];
      }
    } else {
      console.log('DEBUG: Data is not array or object, setting empty array');
      bookings.value = [];
    }
    
    console.log('DEBUG: Final bookings.value:', bookings.value);
  } catch (err) {
    console.error('DEBUG: Error loading bookings:', err);
    console.error('DEBUG: Error details:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    });
    error.value = err.response?.data?.message || err.message || 'Failed to load bookings. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Фильтрация бронирований по активному табу
const filteredBookings = computed(() => {
  console.log('DEBUG: filteredBookings computed called');
  console.log('DEBUG: bookings.value:', bookings.value);
  console.log('DEBUG: activeTab.value:', activeTab.value);
  
  if (!bookings.value || !Array.isArray(bookings.value)) {
    console.log('DEBUG: bookings is not array, returning empty array');
    return [];
  }
  
  const now = new Date();
  
  const filtered = bookings.value.filter(booking => {
    console.log('DEBUG: Processing booking:', booking);
    
    if (!booking.start_time) {
      console.log('DEBUG: Booking has no start_time:', booking);
      return false;
    }
    
    const bookingDate = new Date(booking.start_time);
    console.log('DEBUG: Booking date:', bookingDate);
    
    if (activeTab.value === 'upcoming') {
      const isUpcoming = bookingDate >= now;
      console.log('DEBUG: Is upcoming:', isUpcoming);
      return isUpcoming;
    } else {
      const isPast = bookingDate < now;
      console.log('DEBUG: Is past:', isPast);
      return isPast;
    }
  });
  
  console.log('DEBUG: Filtered bookings:', filtered);
  return filtered;
});

// Получение заголовка бронирования
function getBookingTitle(booking) {
  console.log('DEBUG: getBookingTitle called with:', booking);
  if (!booking) {
    console.log('DEBUG: booking is null/undefined');
    return 'Unknown Field';
  }
  
  // Используем sport_venue_details.name если доступно
  const title = booking.sport_venue_details?.name || booking.sport_venue?.name || 'Unknown Field';
  console.log('DEBUG: Booking title:', title);
  return title;
}

// Получение деталей бронирования
function getBookingDetails(booking) {
  console.log('DEBUG: getBookingDetails called with:', booking);
  if (!booking) {
    console.log('DEBUG: booking is null/undefined');
    return 'Unknown Stadium · Unknown Time';
  }
  
  const venue = booking.sport_venue_details?.name || booking.sport_venue?.name || 'Unknown Stadium';
  const startTime = formatTime(booking.start_time);
  const endTime = formatTime(booking.end_time);
  const date = formatDate(booking.start_time);
  
  const details = `${venue} · ${date} · ${startTime} - ${endTime}`;
  console.log('DEBUG: Booking details:', details);
  return details;
}

// Форматирование даты
function formatDate(dateString) {
  console.log('DEBUG: formatDate called with:', dateString);
  if (!dateString) {
    return 'Unknown Date';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('DEBUG: Error formatting date:', error);
    return 'Error';
  }
}

// Форматирование времени
function formatTime(dateString) {
  console.log('DEBUG: formatTime called with:', dateString);
  if (!dateString) {
    console.log('DEBUG: dateString is empty, returning "Unknown"');
    return 'Unknown';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.log('DEBUG: Invalid date, returning "Invalid"');
      return 'Invalid';
    }
    const formatted = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    console.log('DEBUG: Formatted time:', formatted);
    return formatted;
  } catch (error) {
    console.error('DEBUG: Error formatting time:', error);
    return 'Error';
  }
}

// Получение стиля изображения
function getBookingImageStyle(booking) {
  console.log('DEBUG: getBookingImageStyle called with:', booking);
  if (!booking) {
    console.log('DEBUG: booking is null/undefined');
    return {
      backgroundImage: 'url(https://via.placeholder.com/56x56/53d22c/ffffff?text=🏟️)'
    };
  }
  
  // Используем первое изображение из массива images
  let imageUrl = 'https://via.placeholder.com/56x56/53d22c/ffffff?text=🏟️';
  
  if (booking.sport_venue_details?.images && booking.sport_venue_details.images.length > 0) {
    imageUrl = booking.sport_venue_details.images[0].image;
  } else if (booking.sport_venue?.image) {
    imageUrl = booking.sport_venue.image;
  }
  
  console.log('DEBUG: Image URL:', imageUrl);
  return {
    backgroundImage: `url(${imageUrl})`
  };
}

// Получение статуса бронирования
function getBookingStatus(booking) {
  if (!booking) return 'Unknown';
  
  const status = booking.status;
  const paymentStatus = booking.payment_status;
  
  if (status === 'PENDING' && paymentStatus === 'PENDING') {
    return 'Ожидает оплаты';
  } else if (status === 'CONFIRMED') {
    return 'Подтверждено';
  } else if (status === 'CANCELLED') {
    return 'Отменено';
  } else if (status === 'COMPLETED') {
    return 'Завершено';
  }
  
  return status || 'Unknown';
}

// Получение цены бронирования
function getBookingPrice(booking) {
  if (!booking || !booking.total_price) return 'Цена не указана';
  
  const price = parseFloat(booking.total_price);
  if (isNaN(price)) return 'Цена не указана';
  
  return `${price.toLocaleString('ru-RU')} сум`;
}

// Получение депозита
function getBookingDeposit(booking) {
  if (!booking || !booking.deposit_amount) return 'Депозит не указан';
  
  const deposit = parseFloat(booking.deposit_amount);
  if (isNaN(deposit)) return 'Депозит не указан';
  
  return `${deposit.toLocaleString('ru-RU')} сум`;
}

// Получение CSS класса для статуса
function getStatusClass(booking) {
  if (!booking) return 'status-unknown';
  
  const status = booking.status;
  const paymentStatus = booking.payment_status;
  
  if (status === 'PENDING' && paymentStatus === 'PENDING') {
    return 'status-pending';
  } else if (status === 'CONFIRMED') {
    return 'status-confirmed';
  } else if (status === 'CANCELLED') {
    return 'status-cancelled';
  } else if (status === 'COMPLETED') {
    return 'status-completed';
  }
  
  return 'status-unknown';
}

// Проверка возможности отмены
function canCancelBooking(booking) {
  console.log('DEBUG: canCancelBooking called with:', booking);
  if (!booking || !booking.start_time) {
    console.log('DEBUG: booking is null or has no start_time');
    return false;
  }
  
  try {
    const bookingDate = new Date(booking.start_time);
    if (isNaN(bookingDate.getTime())) {
      console.log('DEBUG: Invalid booking date');
      return false;
    }
    
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
    
    console.log('DEBUG: Hours until booking:', hoursUntilBooking);
    
    // Можно отменить за 2 часа до начала
    const canCancel = hoursUntilBooking > 2;
    console.log('DEBUG: Can cancel:', canCancel);
    return canCancel;
  } catch (error) {
    console.error('DEBUG: Error in canCancelBooking:', error);
    return false;
  }
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