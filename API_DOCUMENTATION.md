# API Documentation

## Base URL
```
https://your-domain.com/api/
```

## Authentication

### JWT Tokens
API использует JWT токены для авторизации. Добавляйте токен в заголовок запроса:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Telegram Web App Authentication

**POST** `/telegram-auth/telegram_auth/`

Авторизация через Telegram Web App.

**Request Body:**
```json
{
    "init_data": "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%7D&auth_date=1234567890&hash=abc123..."
}
```

**Success Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "123456789@telegram.user",
        "first_name": "John",
        "last_name": "Doe",
        "role": "USER",
        "telegram_id": 123456789
    }
}
```

**Error Response (400):**
```json
{
    "error": "init_data is required"
}
```

### 2. Standard JWT Authentication

**POST** `/token/`

Стандартная авторизация по логину и паролю.

**Request Body:**
```json
{
    "username": "user@example.com",
    "password": "password123"
}
```

**Success Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Refresh Token

**POST** `/token/refresh/`

Обновление access токена с помощью refresh токена.

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. Verify Token

**POST** `/token/verify/`

Проверка валидности access токена.

**Request Body:**
```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
    "token_type": "access",
    "exp": 1234567890,
    "iat": 1234567890,
    "jti": "abc123",
    "user_id": 1
}
```

---

## User Management

### 1. Get Current User

**GET** `/users/me/`

Получить информацию о текущем пользователе.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "USER",
    "phone": "+1234567890",
    "telegram_id": 123456789,
    "telegram_username": "johndoe",
    "telegram_first_name": "John",
    "telegram_last_name": "Doe"
}
```

### 2. Update Current User

**PUT** `/users/update_me/`

Обновить данные текущего пользователя.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "role": "USER",
    "phone": "+1234567890"
}
```

### 3. Create User

**POST** `/users/`

Создать нового пользователя (только для админов).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "first_name": "New",
    "last_name": "User",
    "role": "USER"
}
```

**Success Response (201):**
```json
{
    "id": 2,
    "username": "newuser",
    "email": "newuser@example.com",
    "first_name": "New",
    "last_name": "User",
    "role": "USER"
}
```

---

## Sport Venues

### 1. List Sport Venues

**GET** `/sport-venues/`

Получить список всех спортивных площадок.

**Query Parameters:**
- `min_price` - минимальная цена за час
- `max_price` - максимальная цена за час
- `company` - ID компании
- `page` - номер страницы
- `page_size` - размер страницы

**Success Response (200):**
```json
{
    "count": 10,
    "next": "http://api.example.com/sport-venues/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Футбольное поле Центральное",
            "description": "Профессиональное футбольное поле",
            "price_per_hour": "50.00",
            "city": "Ташкент",
            "address": "ул. Спортивная, 1",
            "latitude": "41.2995",
            "longitude": "69.2401",
            "yandex_map_url": "https://yandex.ru/maps/...",
            "sport_venue_type": {
                "id": 1,
                "name": "Футбол",
                "description": "Футбольные поля"
            },
            "region": {
                "id": 1,
                "name_ru": "Ташкент",
                "name_uz": "Toshkent",
                "name_en": "Tashkent"
            },
            "deposit_amount": "50.00",
            "company": {
                "id": 1,
                "username": "company1",
                "email": "company@example.com"
            },
            "images": [
                {
                    "id": 1,
                    "image": "http://api.example.com/media/sport_venue_images/field1.jpg",
                    "created_at": "2024-01-01T10:00:00Z"
                }
            ],
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        }
    ]
}
```

### 2. Get Sport Venue Details

**GET** `/sport-venues/{id}/`

Получить детальную информацию о спортивной площадке.

**Success Response (200):**
```json
{
    "id": 1,
    "name": "Футбольное поле Центральное",
    "description": "Профессиональное футбольное поле",
    "price_per_hour": "50.00",
    "city": "Ташкент",
    "address": "ул. Спортивная, 1",
    "latitude": "41.2995",
    "longitude": "69.2401",
    "yandex_map_url": "https://yandex.ru/maps/...",
    "sport_venue_type": {
        "id": 1,
        "name": "Футбол",
        "description": "Футбольные поля"
    },
    "region": {
        "id": 1,
        "name_ru": "Ташкент",
        "name_uz": "Toshkent",
        "name_en": "Tashkent"
    },
    "deposit_amount": "50.00",
    "company": {
        "id": 1,
        "username": "company1",
        "email": "company@example.com"
    },
    "images": [
        {
            "id": 1,
            "image": "http://api.example.com/media/sport_venue_images/field1.jpg",
            "created_at": "2024-01-01T10:00:00Z"
        }
    ],
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
}
```

### 3. Create Sport Venue

**POST** `/sport-venues/`

Создать новую спортивную площадку (только для продавцов).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
name: Футбольное поле
description: Описание поля
price_per_hour: 50.00
city: Ташкент
address: ул. Спортивная, 1
latitude: 41.2995
longitude: 69.2401
sport_venue_type: 1
region: 1
deposit_amount: 50.00
images: [file1, file2, ...]
```

**Success Response (201):**
```json
{
    "id": 1,
    "name": "Футбольное поле",
    "description": "Описание поля",
    "price_per_hour": "50.00",
    "city": "Ташкент",
    "address": "ул. Спортивная, 1",
    "latitude": "41.2995",
    "longitude": "69.2401",
    "sport_venue_type": 1,
    "region": 1,
    "deposit_amount": "50.00",
    "company": 1,
    "images": [],
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
}
```

### 4. Update Sport Venue

**PUT** `/sport-venues/{id}/`

Обновить спортивную площадку (только владелец).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### 5. Delete Sport Venue

**DELETE** `/sport-venues/{id}/`

Удалить спортивную площадку (только владелец).

**Headers:**
```
Authorization: Bearer <access_token>
```

### 6. Check Availability

**GET** `/sport-venues/{id}/check_availability/`

Проверить доступность площадки на определенную дату.

**Query Parameters:**
- `date` - дата в формате YYYY-MM-DD

**Success Response (200):**
```json
{
    "date": "2024-01-15",
    "working_hours": {
        "start": "08:00",
        "end": "22:30"
    },
    "time_points": [
        {
            "time": "08:00",
            "is_available": true
        },
        {
            "time": "08:30",
            "is_available": false
        },
        {
            "time": "09:00",
            "is_available": true
        }
    ]
}
```

---

## Sport Venue Types

### 1. List Sport Venue Types

**GET** `/types/`

Получить список всех типов спортивных площадок.

**Success Response (200):**
```json
[
    {
        "id": 1,
        "name": "Футбол",
        "description": "Футбольные поля",
        "icon": "http://api.example.com/media/playground_type_icons/football.png",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
    }
]
```

### 2. Create Sport Venue Type

**POST** `/types/`

Создать новый тип спортивной площадки.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
name: Баскетбол
description: Баскетбольные площадки
icon: [file]
```

---

## Favorites

### 1. List Favorites

**GET** `/favorites/`

Получить список избранных площадок текущего пользователя.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
[
    {
        "id": 1,
        "sport_venue": 1,
        "sport_venue_details": {
            "id": 1,
            "name": "Футбольное поле Центральное",
            "price_per_hour": "50.00",
            "city": "Ташкент"
        },
        "created_at": "2024-01-01T10:00:00Z"
    }
]
```

### 2. Add to Favorites

**POST** `/favorites/`

Добавить площадку в избранное.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "sport_venue": 1
}
```

### 3. Remove from Favorites

**DELETE** `/favorites/{id}/`

Удалить площадку из избранного.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## Bookings

### 1. List Bookings

**GET** `/bookings/`

Получить список бронирований.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `start_date` - дата начала (YYYY-MM-DDTHH:MM:SS)
- `end_date` - дата окончания (YYYY-MM-DDTHH:MM:SS)
- `status` - статус бронирования (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `sport_venue` - ID спортивной площадки
- `user` - ID пользователя

**Success Response (200):**
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "sport_venue": 1,
            "sport_venue_details": {
                "id": 1,
                "name": "Футбольное поле Центральное",
                "price_per_hour": "50.00"
            },
            "user": 1,
            "user_details": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John"
            },
            "start_time": "2024-01-15T10:00:00Z",
            "end_time": "2024-01-15T12:00:00Z",
            "status": "CONFIRMED",
            "payment_status": "PAID",
            "payment_url": "https://payment.example.com/...",
            "qr_code": "http://api.example.com/media/qr_codes/qr1.png",
            "total_price": "100.00",
            "deposit_amount": "50.00",
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        }
    ]
}
```

### 2. Create Booking

**POST** `/bookings/`

Создать новое бронирование.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "sport_venue": 1,
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T12:00:00Z"
}
```

**Success Response (201):**
```json
{
    "id": 1,
    "sport_venue": 1,
    "sport_venue_details": {
        "id": 1,
        "name": "Футбольное поле Центральное",
        "price_per_hour": "50.00"
    },
    "user": 1,
    "user_details": {
        "id": 1,
        "username": "johndoe",
        "first_name": "John"
    },
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T12:00:00Z",
    "status": "PENDING",
    "payment_status": "PENDING",
    "total_price": "100.00",
    "deposit_amount": "50.00",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
}
```

### 3. Confirm Booking

**POST** `/bookings/{id}/confirm/`

Подтвердить бронирование (только продавцы и админы).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
    "id": 1,
    "status": "CONFIRMED",
    "updated_at": "2024-01-01T10:00:00Z"
}
```

### 4. Cancel Booking

**POST** `/bookings/{id}/cancel/`

Отменить бронирование.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
    "id": 1,
    "status": "CANCELLED",
    "updated_at": "2024-01-01T10:00:00Z"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
```json
{
    "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
    "detail": "You do not have permission to perform this action."
}
```

**404 Not Found:**
```json
{
    "detail": "Not found."
}
```

**500 Internal Server Error:**
```json
{
    "detail": "Internal server error."
}
```

---

## Rate Limiting

API имеет ограничения на количество запросов:
- 1000 запросов в час для авторизованных пользователей
- 100 запросов в час для неавторизованных пользователей

---

## Pagination

Списки объектов поддерживают пагинацию:
- `page` - номер страницы (по умолчанию 1)
- `page_size` - размер страницы (по умолчанию 10, максимум 100)

---

## File Upload

Для загрузки файлов используйте `multipart/form-data`:
- Изображения площадок: `images`
- Иконки типов площадок: `icon`
- QR-коды: генерируются автоматически

---

## WebSocket (для будущих обновлений)

Планируется добавление WebSocket для:
- Уведомлений о статусе бронирования
- Обновлений в реальном времени
- Чат между пользователем и продавцом 