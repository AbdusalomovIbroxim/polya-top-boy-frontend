import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.12.0.191:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Authorization header if access token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;