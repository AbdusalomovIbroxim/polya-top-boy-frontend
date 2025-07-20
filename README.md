# Polyatop - Stadium Booking Telegram Web App

Мобильное приложение для бронирования стадионов, интегрированное с Telegram Web App.

## 🚀 Особенности

- **Telegram Web App интеграция** - авторизация через Telegram бота
- **Мобильная адаптация** - оптимизировано для мобильных устройств
- **JWT аутентификация** - безопасная авторизация с автоматическим обновлением токенов
- **Фильтрация стадионов** - по региону и типу
- **Современный UI** - чистый и интуитивный интерфейс

## 📱 Telegram Web App настройка

### 1. Настройка бота в BotFather

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Создайте нового бота или выберите существующего
3. Отправьте команду `/newapp` или `/setmenubutton`
4. Выберите вашего бота
5. Укажите URL вашего приложения (например: `https://yourdomain.com`)
6. Укажите название кнопки (например: "Открыть приложение")

### 2. Настройка Web App URL

В BotFather настройте Web App URL для вашего бота:

```
/setmenubutton
@your_bot_username
https://yourdomain.com
```

### 3. Проверка настроек

Убедитесь, что в настройках бота указан правильный Web App URL и что приложение доступно по этому URL.

## 🛠 Установка и запуск

### Требования

- Node.js 18+ 
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```

## 🔧 Конфигурация

### API настройки

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### Telegram Web App

Приложение автоматически определяет, запущено ли оно в Telegram Web App и получает необходимые данные для авторизации.

## 📁 Структура проекта

```
src/
├── api/           # API функции
│   ├── auth.js    # Авторизация Telegram
│   └── fields.js  # API стадионов
├── assets/        # Статические ресурсы
│   └── css/       # Стили
├── components/    # Vue компоненты
├── pages/         # Страницы приложения
├── utils/         # Утилиты
│   └── telegram.js # Telegram Web App утилиты
└── App.vue        # Главный компонент
```

## 🔐 Авторизация

Приложение использует Telegram Web App для авторизации:

1. **Инициализация** - приложение автоматически инициализирует Telegram Web App SDK
2. **Получение данных** - извлекает `initData` для проверки на бэкенде
3. **JWT токены** - получает access и refresh токены после успешной авторизации
4. **Автообновление** - автоматически обновляет токены каждые 10 минут

## 🌐 API интеграция

### Эндпоинты

- `POST /telegram-auth/telegram_auth/` - авторизация через Telegram
- `POST /telegram-auth/refresh/` - обновление токена
- `POST /telegram-auth/verify/` - проверка токена
- `GET /fields/` - получение списка стадионов
- `GET /fields/regions/` - получение регионов
- `GET /fields/types/` - получение типов стадионов

### CORS настройки

Убедитесь, что ваш бэкенд настроен для работы с CORS:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "http://localhost:5173",  # для разработки
]

CORS_ALLOW_CREDENTIALS = True
```

## 📱 Использование

1. **Запуск через Telegram** - откройте приложение через кнопку в вашем боте
2. **Авторизация** - происходит автоматически через Telegram
3. **Просмотр стадионов** - используйте фильтры для поиска
4. **Бронирование** - выберите стадион и время (в разработке)

## 🐛 Отладка

### Проверка Telegram Web App

1. Убедитесь, что приложение запущено через Telegram бота
2. Проверьте консоль браузера на наличие ошибок
3. Убедитесь, что `window.Telegram.WebApp` доступен

### Проверка initData

В консоли браузера проверьте:

```javascript
console.log('Telegram WebApp:', window.Telegram?.WebApp);
console.log('initData:', window.Telegram?.WebApp?.initData);
```

## 📄 Лицензия

MIT License
