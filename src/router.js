import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import StadiumPage from './pages/StadiumPage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/stadium/:id', name: 'stadium', component: StadiumPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;