<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div class="flex-1 overflow-y-auto pb-36">
      <!-- Header -->
      <div class="flex items-center bg-white p-4 gap-4">
        <router-link :to="`/stadium/${id}`" class="text-[#131711]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
          </svg>
        </router-link>
        <h1 class="text-[#131711] text-lg font-bold">Бронирование</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ddf20]"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>

      <!-- Booking Content -->
      <template v-else-if="stadium">
        <!-- Stadium Info -->
        <div class="p-4">
          <h2 class="text-xl font-bold text-[#131711] mb-1">{{ stadium.name }}</h2>
          <p class="text-[#6c8764] text-sm">{{ stadium.location }}</p>
        </div>

        <!-- Date Selection -->
        <div class="p-4 border-t border-[#f1f4f0]">
          <h3 class="text-lg font-bold text-[#131711] mb-4">Выберите дату</h3>
          <input 
            type="date" 
            v-model="selectedDate"
            :min="minDate"
            class="w-full p-3 rounded-xl border border-[#f1f4f0] focus:outline-none focus:border-[#4ddf20]"
          >
        </div>

        <!-- Time Selection -->
        <div v-if="timePoints.length > 0" class="p-4 border-t border-[#f1f4f0]">
          <h3 class="text-lg font-bold text-[#131711] mb-4">Выберите время</h3>
          
          <!-- Time Points -->
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="point in timePoints" 
              :key="point.time"
              @click="selectTimePoint(point)"
              class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              :class="getTimePointClass(point)"
              :disabled="!point.is_available"
            >
              {{ point.time }}
            </button>
          </div>

          <!-- Selected Time Info -->
          <div v-if="selectedStartTime" class="mt-4 p-4 bg-[#f1f4f0] rounded-xl">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-[#131711] text-sm">Начало</p>
                <p class="text-[#131711] font-medium">{{ selectedStartTime }}</p>
              </div>
              <div v-if="selectedEndTime">
                <p class="text-[#131711] text-sm">Конец</p>
                <p class="text-[#131711] font-medium">{{ selectedEndTime }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Available Slots -->
        <div v-else-if="selectedDate" class="p-4 border-t border-[#f1f4f0] text-center text-[#6c8764]">
          Нет доступных слотов на выбранную дату
        </div>

        <!-- Deposit Info -->
        <div v-if="selectedStartTime && selectedEndTime" class="p-4 border-t border-[#f1f4f0]">
          <h3 class="text-lg font-bold text-[#131711] mb-4">Депозит</h3>
          <div class="flex justify-between items-center">
            <p class="text-[#131711] text-base">Сумма депозита</p>
            <p class="text-[#131711] text-xl font-bold">{{ depositAmount }} сум</p>
          </div>
          <p class="text-[#6c8764] text-sm mt-2">Депозит равен стоимости одного часа игры</p>
        </div>
      </template>
    </div>

    <!-- Book Button -->
    <div v-if="canBook" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f1f4f0]">
      <button @click="createBooking" class="w-full py-3 px-4 bg-[#4ddf20] text-[#131711] rounded-xl font-medium">
        Подтвердить бронирование
      </button>
    </div>
  </div>
</template>

<script>
import { stadiumService } from '@/services/stadiumService'

export default {
  name: 'StadiumBooking',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      stadium: null,
      loading: true,
      error: null,
      selectedDate: new Date().toISOString().split('T')[0],
      minDate: new Date().toISOString().split('T')[0],
      timePoints: [],
      selectedStartTime: null,
      selectedEndTime: null
    }
  },
  computed: {
    depositAmount() {
      if (!this.stadium) return 0
      return this.stadium.price_per_hour
    },
    canBook() {
      return this.selectedStartTime && 
             this.selectedEndTime && 
             this.selectedEndTime > this.selectedStartTime
    }
  },
  methods: {
    getTimePointClass(point) {
      console.log('Getting class for time point:', point)
      if (!point.is_available) {
        return 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }
      
      if (point.time === this.selectedStartTime) {
        return 'bg-[#4ddf20] text-[#131711]'
      }
      
      if (point.time === this.selectedEndTime) {
        return 'bg-[#4ddf20] text-[#131711]'
      }
      
      if (this.selectedStartTime && this.selectedEndTime) {
        if (point.time > this.selectedStartTime && point.time < this.selectedEndTime) {
          return 'bg-[#4ddf20] text-[#131711]'
        }
      }
      
      return 'bg-[#f1f4f0] text-[#131711] hover:bg-[#e5e9e3]'
    },
    selectTimePoint(point) {
      console.log('Selecting time point:', point)
      if (!point.is_available) {
        console.log('Time point is not available, skipping selection')
        return
      }
      
      if (!this.selectedStartTime) {
        console.log('Setting start time:', point.time)
        this.selectedStartTime = point.time
      } else if (!this.selectedEndTime) {
        if (point.time > this.selectedStartTime) {
          console.log('Setting end time:', point.time)
          this.selectedEndTime = point.time
        } else {
          console.log('Resetting start time to:', point.time)
          this.selectedStartTime = point.time
        }
      } else {
        console.log('Resetting selection, new start time:', point.time)
        this.selectedStartTime = point.time
        this.selectedEndTime = null
      }
    },
    async fetchStadiumDetails() {
      console.log('Fetching stadium details for ID:', this.id)
      this.loading = true
      this.error = null
      
      try {
        this.stadium = await stadiumService.getStadiumDetails(this.id)
        console.log('Stadium details received:', this.stadium)
      } catch (error) {
        console.error('Error fetching stadium details:', error)
        this.error = 'Не удалось загрузить информацию о стадионе. Пожалуйста, попробуйте позже.'
      } finally {
        this.loading = false
        console.log('Stadium details fetch completed, loading:', this.loading)
      }
    },
    async fetchAvailableTimePoints() {
      console.log('Component: Starting fetchAvailableTimePoints')
      console.log('Component: Current state:', {
        selectedDate: this.selectedDate,
        id: this.id,
        loading: this.loading,
        error: this.error,
        stadium: this.stadium
      })
      
      if (!this.id) {
        console.error('Component: Error - stadium ID is missing')
        this.error = 'ID стадиона не найден'
        return
      }
      
      if (!this.selectedDate) {
        console.log('Component: No date selected, skipping time points fetch')
        return
      }
      
      this.loading = true
      console.log('Component: Set loading state to true')
      
      try {
        console.log('Component: Calling checkAvailability API with:', {
          id: this.id,
          date: this.selectedDate
        })
        
        const response = await stadiumService.checkAvailability(this.id, this.selectedDate)
        console.log('Component: API Response received:', response)
        
        this.timePoints = response.time_points || []
        console.log('Component: Time points set:', this.timePoints)
        
        if (this.timePoints.length === 0) {
          console.log('Component: No time points available')
        } else {
          console.log('Component: Available time points:', this.timePoints.map(tp => ({
            time: tp.time,
            is_available: tp.is_available
          })))
        }
      } catch (error) {
        console.error('Component: Error in fetchAvailableTimePoints:', error)
        console.error('Component: Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        this.error = error.message || 'Не удалось загрузить доступное время. Пожалуйста, попробуйте позже.'
        this.timePoints = []
      } finally {
        this.loading = false
        console.log('Component: Set loading state to false')
      }
    },
    async createBooking() {
      console.log('Starting booking process...')
      if (!this.canBook) {
        console.log('Cannot book: form validation failed')
        return
      }
      
      try {
        const bookingData = {
          playground: this.id,
          start_time: `${this.selectedDate} ${this.selectedStartTime}:00`,
          end_time: `${this.selectedDate} ${this.selectedEndTime}:00`
        }
        console.log('Sending booking data:', bookingData)
        
        const response = await stadiumService.createBooking(bookingData)
        console.log('Booking created successfully:', response)
        
        alert('Бронирование успешно создано!')
        
        this.$router.push('/')
      } catch (error) {
        console.error('Error creating booking:', error)
        if (error.response) {
          console.error('Server error response:', error.response.data)
          if (error.response.data.detail) {
            this.error = error.response.data.detail
          } else if (error.response.data.message) {
            this.error = error.response.data.message
          } else if (error.response.data.error) {
            this.error = error.response.data.error
          } else {
            this.error = 'Ошибка сервера: ' + JSON.stringify(error.response.data)
          }
        } else if (error.request) {
          console.error('No response received:', error.request)
          this.error = 'Нет ответа от сервера. Проверьте подключение к интернету.'
        } else {
          console.error('Request setup error:', error.message)
          this.error = 'Ошибка при отправке запроса: ' + error.message
        }
      }
    }
  },
  watch: {
    selectedDate() {
      console.log('Component: Date changed to:', this.selectedDate)
      console.log('Component: Resetting time selections')
      this.selectedStartTime = null
      this.selectedEndTime = null
      console.log('Component: Fetching new time points')
      this.fetchAvailableTimePoints()
    }
  },
  async created() {
    console.log('Component: Starting initialization')
    console.log('Component: Props:', { id: this.id })
    
    try {
      console.log('Component: Fetching stadium details')
      await this.fetchStadiumDetails()
      console.log('Component: Stadium details fetched:', this.stadium)
      
      console.log('Component: Fetching initial time points')
      await this.fetchAvailableTimePoints()
      console.log('Component: Initial time points fetched:', this.timePoints)
    } catch (error) {
      console.error('Component: Error during initialization:', error)
    }
  }
}
</script> 