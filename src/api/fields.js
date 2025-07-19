import api from "./api";

async function getSportVenues(params = {}) {
  const response = await api.get('/sport-venues/', { params });
  return response.data;
}

async function getRegions() {
  const response = await api.get('/regions/');
  return response.data;
}

async function getTypes() {
  const response = await api.get('/types/');
  return response.data;
}

export { getSportVenues, getRegions, getTypes };

