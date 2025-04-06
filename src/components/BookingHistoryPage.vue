<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <BookingHistoryHeader />
      <BookingList :bookings="bookings" />
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'
import BookingHistoryHeader from './BookingHistoryHeader.vue'
import BookingList from './BookingList.vue'

export default {
  name: 'BookingHistoryPage',
  components: {
    NavigationBar,
    BookingHistoryHeader,
    BookingList
  },
  data() {
    return {
      bookings: [
        {
          id: 1,
          fieldName: 'Футбольное поле "Зеленый газон"',
          location: 'Ташкент, Чиланзар',
          image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
          time: '18:00 - 19:30',
          status: 'Завершено',
          date: '15 июня 2023'
        },
        {
          id: 2,
          fieldName: 'Спортивный комплекс "Олимпия"',
          location: 'Ташкент, Мирзо-Улугбек',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          time: '20:00 - 21:30',
          status: 'Отклонено',
          date: '10 июня 2023'
        },
        {
          id: 3,
          fieldName: 'Футбольный центр "Молодежный"',
          location: 'Ташкент, Юнусабад',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1293&q=80',
          time: '19:00 - 20:30',
          status: 'Не оплачено',
          date: '5 июня 2023'
        },
        {
          id: 4,
          fieldName: 'Спортивный комплекс "Динамо"',
          location: 'Ташкент, Шайхантахур',
          image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
          time: '17:00 - 18:30',
          status: 'Подтверждено',
          date: '1 июня 2023'
        },
        {
          id: 5,
          fieldName: 'Футбольное поле "Звезда"',
          location: 'Ташкент, Алмазар',
          image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
          time: '16:00 - 17:30',
          status: 'Отменено',
          date: '20 июня 2023'
        },
        {
          id: 6,
          fieldName: 'Спортивный центр "Победа"',
          location: 'Ташкент, Яккасарай',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          time: '15:00 - 16:30',
          status: 'Просрочено',
          date: '25 июня 2023'
        }
      ]
    }
  }
}
</script> 