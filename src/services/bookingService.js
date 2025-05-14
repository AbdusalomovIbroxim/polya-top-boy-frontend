import api from './api'

export const bookingService = {
  async getBookings() {
    return api.get('/bookings/')
  },

  async createBooking(bookingData) {
    return api.post('/bookings/', bookingData)
  },

  async updateBooking(id, bookingData) {
    return api.put(`/bookings/${id}/`, bookingData)
  },

  async deleteBooking(id) {
    return api.delete(`/bookings/${id}/`)
  },

  async getBookingById(id) {
    return api.get(`/bookings/${id}/`)
  }
}

export default bookingService 