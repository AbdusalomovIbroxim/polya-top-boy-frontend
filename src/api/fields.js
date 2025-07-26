import api from "./api";

function withoutAuthHeaders(config) {
  if (!localStorage.getItem('access')) {
    if (config && config.headers) {
      delete config.headers.Authorization;
    }
  }
  return config;
}

async function getSportVenues(params = {}) {
  const config = { params };
  withoutAuthHeaders(config);
  const response = await api.get('/sport-venues/', config);
  return response.data;
}

async function getSportVenue(id) {
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get(`/sport-venues/${id}/`, config);
  return response.data;
}

async function getRegions() {
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get('/regions/', config);
  return response.data;
}

async function getTypes() {
  const config = {};
  withoutAuthHeaders(config);
  const response = await api.get('/types/', config);
  return response.data;
}

export { getSportVenues, getSportVenue, getRegions, getTypes };

