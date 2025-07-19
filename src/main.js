import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import StadiumPage from './views/StadiumPage.vue'
import ProfileView from './views/ProfileView.vue';
import FavoritesView from './views/FavoritesView.vue';
import MapView from './views/MapView.vue';
import TelegramAuthView from './views/TelegramAuthView.vue';
import 'mapbox-gl/dist/mapbox-gl.css';

const routes = [
  { path: '/', component: HomeView },
  { path: '/stadium/:id', component: StadiumPage, props: true },
  { path: '/profile', component: ProfileView },
  { path: '/favorites', component: FavoritesView },
  { path: '/map', component: MapView },
  { path: '/auth', component: TelegramAuthView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app') 