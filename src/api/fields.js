import { api } from "./api";

function withoutAuthHeaders(config) {
  if (!localStorage.getItem('access')) {
    if (config && config.headers) {
      delete config.headers.Authorization;
    }
  }
  return config;
}

async function getSportVenues(params = {}) {
  console.log('DEBUG: getSportVenues called', params);
  const config = { params };
  withoutAuthHeaders(config);
  const response = await api.get('/sport-venues/', config);
  console.log('DEBUG: getSportVenues response', response);
  return response.data;
}

async function getSportVenue(id) {
  console.log('DEBUG: getSportVenue called', id);
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get(`/sport-venues/${id}/`, config);
  console.log('DEBUG: getSportVenue response', response);
  return response.data;
}

async function getSportVenueWithPrice(id) {
  console.log('DEBUG: getSportVenueWithPrice called', id);
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get(`/sport-venues/${id}/`, config);
  console.log('DEBUG: getSportVenueWithPrice response', response);
  return response.data;
}

async function getSportVenueAvailability(id, date) {
  console.log('DEBUG: getSportVenueAvailability called', id, date);
  const config = { params: { date } };
  withoutAuthHeaders(config);
  const response = await api.get(`/sport-venues/${id}/check_availability/`, config);
  console.log('DEBUG: getSportVenueAvailability response', response);
  return response.data;
}

async function getRegions() {
  console.log('DEBUG: getRegions called');
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get('/regions/', config);
  console.log('DEBUG: getRegions response', response);
  return response.data;
}

async function getTypes() {
  console.log('DEBUG: getTypes called');
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get('/types/', config);
  console.log('DEBUG: getTypes response', response);
  return response.data;
}

// Создание брони
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

export { getSportVenues, getSportVenue, getSportVenueWithPrice, getSportVenueAvailability, getRegions, getTypes };

