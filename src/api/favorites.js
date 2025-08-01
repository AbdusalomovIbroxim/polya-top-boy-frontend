import { api } from './api.js';

// Получение списка избранных стадионов пользователя
export async function getUserFavorites() {
  try {
    console.log('DEBUG: getUserFavorites called');
    const response = await api.get('/favorites/');
    console.log('DEBUG: getUserFavorites response', response);
    console.log('DEBUG: Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error getting user favorites:', error);
    console.error('DEBUG: Error response:', error.response);
    console.error('DEBUG: Error message:', error.message);
    throw error;
  }
}

// Добавление стадиона в избранное
export async function addToFavorites(stadiumId) {
  try {
    console.log('DEBUG: addToFavorites called', stadiumId);
    const response = await api.post('/favorites/', { sport_venue: stadiumId });
    console.log('DEBUG: addToFavorites response', response);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error adding to favorites:', error);
    
    // Если стадион уже в избранном, считаем это успехом
    if (error.response && error.response.status === 400) {
      console.log('DEBUG: Stadium already in favorites, treating as success');
      return { success: true, message: 'Stadium already in favorites' };
    }
    
    throw error;
  }
}

// Удаление стадиона из избранного
export async function removeFromFavorites(stadiumId) {
  try {
    console.log('DEBUG: removeFromFavorites called', stadiumId);
    const response = await api.delete(`/favorites/${stadiumId}/`);
    console.log('DEBUG: removeFromFavorites response', response);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error removing from favorites:', error);
    
    // Если стадион не найден в избранном, считаем это успехом
    if (error.response && error.response.status === 404) {
      console.log('DEBUG: Stadium not found in favorites, treating as success');
      return { success: true, message: 'Stadium not in favorites' };
    }
    
    throw error;
  }
}

// Проверка, находится ли стадион в избранном
// Получаем весь список избранного и проверяем, есть ли там нужный стадион
export async function checkFavoriteStatus(stadiumId) {
  try {
    console.log('DEBUG: checkFavoriteStatus called', stadiumId);
    const response = await api.get('/favorites/');
    console.log('DEBUG: checkFavoriteStatus response', response);
    
    // Проверяем, есть ли стадион в списке избранного
    const favorites = response.data;
    const isFavorite = favorites.some(favorite => 
      favorite.sport_venue === stadiumId || 
      favorite.sport_venue_details?.id === stadiumId
    );
    
    return { is_favorite: isFavorite };
  } catch (error) {
    console.error('DEBUG: Error checking favorite status:', error);
    return { is_favorite: false };
  }
} 