import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import FavoritesPage from '../components/FavoritesPage.vue'
import ProfilePage from '../components/ProfilePage.vue'
import BookingHistoryPage from '../components/BookingHistoryPage.vue'
import BookingDetailsPage from '../components/BookingDetailsPage.vue'
import StadiumDetails from '../components/StadiumDetails.vue'
import StadiumBooking from '../components/StadiumBooking.vue'
import AuthPage from '../components/Auth.vue'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingHistoryPage
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetails',
    component: BookingDetailsPage,
    props: true
  },
  {
    path: '/stadium/:id',
    name: 'StadiumDetails',
    component: StadiumDetails,
    props: true
  },
  {
    path: '/stadium/:id/book',
    name: 'StadiumBooking',
    component: StadiumBooking,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
