// Telegram Web App SDK utilities

/**
 * Инициализирует Telegram Web App
 * @returns {Object|null} Telegram Web App объект или null если не доступен
 */
export function initTelegramWebApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Инициализируем Telegram Web App
    tg.ready(); // Сообщаем Telegram что приложение готово
    tg.expand(); // Разворачиваем на весь экран
    
    // Настраиваем тему
    tg.setHeaderColor('#6d8566');
    tg.setBackgroundColor('#ffffff');
    
    return tg;
  }
  return null;
}

/**
 * Получает данные пользователя из Telegram Web App
 * @returns {Object|null} Данные пользователя или null
 */
export function getTelegramUser() {
  const tg = window.Telegram?.WebApp;
  if (tg && tg.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
}

/**
 * Получает initData из Telegram Web App
 * @returns {string} initData строка
 */
export function getTelegramInitData() {
  const tg = window.Telegram?.WebApp;
  if (tg && tg.initData) {
    return tg.initData;
  }
  
  // Fallback для web.telegram.org
  const hash = window.location.hash;
  if (hash) {
    const match = hash.match(/tgWebAppData=([^&]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  return '';
}

/**
 * Проверяет, запущено ли приложение в Telegram Web App
 * @returns {boolean}
 */
export function isTelegramWebApp() {
  return !!(window.Telegram && window.Telegram.WebApp);
}

/**
 * Показывает главное кнопку Telegram Web App
 * @param {string} text - Текст кнопки
 * @param {Function} callback - Функция обратного вызова
 */
export function showMainButton(text, callback) {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(callback);
    tg.MainButton.show();
  }
}

/**
 * Скрывает главную кнопку Telegram Web App
 */
export function hideMainButton() {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.MainButton.hide();
  }
}

/**
 * Показывает всплывающее уведомление
 * @param {string} message - Сообщение
 * @param {string} type - Тип уведомления ('error', 'success', 'info')
 */
export function showAlert(message, type = 'info') {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.showAlert(message);
  } else {
    // Fallback для браузера
    alert(message);
  }
}

/**
 * Показывает подтверждение
 * @param {string} message - Сообщение
 * @param {Function} callback - Функция обратного вызова
 */
export function showConfirm(message, callback) {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.showConfirm(message, callback);
  } else {
    // Fallback для браузера
    const result = confirm(message);
    callback(result);
  }
} 