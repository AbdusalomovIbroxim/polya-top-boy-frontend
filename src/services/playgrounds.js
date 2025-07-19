import api from './api';

export default {
  // Получить список стадионов
  async getPlaygrounds(params = {}) {
    const response = await api.get('sport-venues/', { params });
    return response.data;
  },

  // Получить один стадион по id
  async getPlayground(id) {
    const response = await api.get(`sport-venues/${id}/`);
    return response.data;
  },
}; 