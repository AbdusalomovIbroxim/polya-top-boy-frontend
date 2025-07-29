import { api } from './api.js';


export async function createBooking(bookingData) {
    try {
        console.log('DEBUG: Creating booking with data:', bookingData);
        const response = await api.post('/bookings/', bookingData);
        console.log('DEBUG: Booking created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('DEBUG: Error creating booking:', error);
        throw error;
    }
}

// Получение списка бронирований пользователя
export async function getUserBookings() {
  try {
    console.log('DEBUG: getUserBookings called');
    const response = await api.get('/bookings/');
    console.log('DEBUG: getUserBookings response', response);
    console.log('DEBUG: Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error getting user bookings:', error);
    console.error('DEBUG: Error response:', error.response);
    console.error('DEBUG: Error message:', error.message);
    throw error;
  }
}

// Отмена бронирования
export async function cancelBooking(bookingId) {
  try {
    console.log('DEBUG: cancelBooking called', bookingId);
    const response = await api.delete(`/bookings/${bookingId}/`);
    console.log('DEBUG: cancelBooking response', response);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error canceling booking:', error);
    throw error;
  }
} 