import api from './api'

export const favoriteService = {
  // Получить список избранных полей
  getFavorites() {
    return api.get('/favorites/')
  },

  // Добавить поле в избранное
  addToFavorites(playgroundId) {
    return api.post('/favorites/', {
      playground: playgroundId
    })
  },

  // Удалить поле из избранного
  removeFromFavorites(favoriteId) {
    return api.delete(`/favorites/${favoriteId}/`)
  }
} 