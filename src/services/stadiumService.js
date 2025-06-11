import api from './api';


export const stadiumService = {
    async getStadiums(params = {}) {
        try {
            const response = await api.get(`/playgrounds/`, {
                params: {
                    city: params.city,
                    type: params.type,
                    min_price: params.minPrice,
                    max_price: params.maxPrice,
                    company: params.company
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stadiums:', error);
            throw error;
        }
    },

    async getStadiumDetails(id) {
        console.log('API: Fetching stadium details for ID:', id)
        try {
            const response = await api.get(`/playgrounds/${id}/`, {
                withCredentials: true
            });
            console.log('API: Stadium details response:', response.data)
            return {
                id: response.data.id,
                name: response.data.name,
                city: response.data.company.city || 'Ташкент',
                address: response.data.company.address || 'Ташкент, Узбекистан',
                price_per_hour: response.data.price_per_hour,
                description: response.data.description || '',
                images: response.data.images.map(img => ({
                    image: img.image
                })),
                yandex_map_url: response.data.yandex_map_url || '',
                company: {
                    id: response.data.company.id,
                    username: response.data.company.username,
                    role: response.data.company.role
                }
            };
        } catch (error) {
            console.error('API: Error fetching stadium details:', error)
            throw error;
        }
    },

    async checkAvailability(id, date) {
        console.log('API: Starting checkAvailability request')
        console.log('API: Parameters:', { id, date })
        console.log('API: Full URL:', `/playgrounds/${id}/check_availability/`)
        
        if (!id) {
            console.error('API: Error - id is undefined or null')
            throw new Error('ID стадиона не указан')
        }
        
        if (!date) {
            console.error('API: Error - date is undefined or null')
            throw new Error('Дата не указана')
        }
        
        try {
            const timezoneOffset = new Date().getTimezoneOffset(); 
            console.log('API: Using timezone offset:', timezoneOffset)
            
            const requestConfig = {
                params: { date },
                headers: {
                    'X-Timezone-Offset': timezoneOffset.toString(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };
            
            console.log('API: Request configuration:', requestConfig)
            console.log('API: Sending request to:', `/playgrounds/${id}/check_availability/`)
            
            const response = await api.get(`/playgrounds/${id}/check_availability/`, requestConfig);
            
            console.log('API: Raw response:', response)
            console.log('API: Response data:', response.data)
            console.log('API: Response status:', response.status)
            console.log('API: Response headers:', response.headers)
            
            const result = {
                working_hours: response.data.working_hours,
                hours: response.data.hours,
                date: response.data.date,
                time_points: response.data.time_points || []
            };
            
            console.log('API: Processed result:', result)
            return result;
        } catch (error) {
            console.error('API: Error in checkAvailability:', error)
            console.error('API: Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                config: error.config
            })
            
            if (error.response) {
                // Сервер ответил с кодом ошибки
                console.error('API: Server error response:', error.response.data)
                throw new Error(error.response.data.detail || 'Ошибка сервера')
            } else if (error.request) {
                // Запрос был отправлен, но нет ответа
                console.error('API: No response received:', error.request)
                throw new Error('Нет ответа от сервера')
            } else {
                // Ошибка при настройке запроса
                console.error('API: Request setup error:', error.message)
                throw new Error('Ошибка при отправке запроса: ' + error.message)
            }
        }
    },

    async createBooking(bookingData) {
        console.log('API: Creating booking with data:', bookingData)
        try {
            const response = await api.post(`/bookings/`, bookingData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('API: Booking created successfully:', response.data)
            return {
                id: response.data.id,
                playground: response.data.playground,
                playground_details: response.data.playground_details,
                user: response.data.user,
                user_details: response.data.user_details,
                start_time: response.data.start_time,
                end_time: response.data.end_time,
                status: response.data.status,
                payment_status: response.data.payment_status,
                payment_url: response.data.payment_url,
                qr_code: response.data.qr_code,
                total_price: response.data.total_price,
                deposit_amount: response.data.deposit_amount,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at,
                session_key: response.data.session_key
            };
        } catch (error) {
            console.error('API: Error creating booking:', error)
            if (error.response) {
                console.error('API: Error response status:', error.response.status)
                console.error('API: Error response data:', error.response.data)
                console.error('API: Error response headers:', error.response.headers)
            } else if (error.request) {
                console.error('API: No response received:', error.request)
            } else {
                console.error('API: Error setting up request:', error.message)
            }
            throw error;
        }
    },

    async getAvailableTimeSlots(stadiumId, date) {
        try {
            const response = await api.get(`/playgrounds/${stadiumId}/available-slots/`, {
                params: { date },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available time slots:', error);
            throw error;
        }
    },

    async getBookingHistory() {
        try {
            const response = await api.get(`/bookings/`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching booking history:', error);
            throw error;
        }
    },

    async cancelBooking(bookingId) {
        try {
            const response = await api.post(`/bookings/${bookingId}/cancel/`, {}, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error canceling booking:', error);
            throw error;
        }
    }
}; 