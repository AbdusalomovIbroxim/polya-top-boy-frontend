import axios from 'axios'

const API_URL = 'https://polya-top-bot-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    })
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  async (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting to refresh token')
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await api.post('/token/refresh/', {
          refresh: refreshToken
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        return Promise.reject(refreshError)
      }
    }

    if (error.message === 'Network Error') {
      console.error('Network error occurred. Please check your internet connection.')
      return Promise.reject(new Error('Ошибка сети. Пожалуйста, проверьте подключение к интернету.'))
    }

    return Promise.reject(error)
  }
)

export const authService = {
  async login(username, password) {
    const response = await api.post('/token/', {
      username,
      password
    })
    const { access, refresh } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    return response.data
  },

  async verifyToken(token) {
    return api.post('/token/verify/', { token })
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await api.post('/token/refresh/', {
      refresh: refreshToken
    })
    const { access } = response.data
    localStorage.setItem('access_token', access)
    return access
  },

  async getCurrentUser() {
    return api.get('/users/me/')
  },

  async updateProfile(profileData) {
    return api.patch('/users/me/', profileData)
  },

  async getUserStats() {
    return api.get('/users/stats/')
  },

  async getUserGames() {
    return api.get('/users/games/')
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  async loginWithTelegram(initData) {
    console.log('Attempting Telegram login with initData:', initData)
    try {
      const response = await api.post('/auth/telegram/', {
        initData
      })
      console.log('Telegram login successful:', response.data)
      const { access, refresh, user } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(user))
      return response.data
    } catch (error) {
      console.error('Telegram login failed:', error)
      throw error
    }
  },
}

export default api;