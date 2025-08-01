import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import StadiumPage from './pages/StadiumPage.vue';
import LoginPage from './pages/LoginPage.vue';
import BookingPage from './pages/BookingPage.vue';
import BookingsPage from './pages/BookingsPage.vue';
import FavoritesPage from './pages/FavoritesPage.vue';
import MapPage from './pages/MapPage.vue';
import { useAuth } from './composables/useAuth';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/stadium/:id', name: 'stadium', component: StadiumPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/booking/:stadiumId', name: 'booking', component: BookingPage, meta: { requiresAuth: true } },
  { path: '/bookings', name: 'bookings', component: BookingsPage, meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favorites', component: FavoritesPage, meta: { requiresAuth: true } },
  { path: '/map', name: 'map', component: MapPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('DEBUG: Router beforeEach', { to: to.path, from: from.path, fullPath: to.fullPath });
  
  // Проверяем, содержит ли URL данные Telegram Web App
  if (to.path.includes('tgWebAppData') || to.fullPath.includes('tgWebAppData')) {
    console.log('DEBUG: Detected Telegram Web App URL, redirecting to home');
    return next('/');
  }
  
  const { isAuth } = useAuth();

  // Если роут требует авторизации и пользователь не авторизован
  if (to.meta.requiresAuth && !isAuth.value) {
    console.log('DEBUG: Redirecting to login (requires auth)');
    return next('/login');
  }

  // Если пользователь авторизован и пытается зайти на страницу логина
  if (to.name === 'login' && isAuth.value) {
    console.log('DEBUG: Redirecting to home (already auth)');
    return next('/');
  }

  console.log('DEBUG: Router allowing navigation to', to.path);
  next();
});

// Автоматический скролл вверх при переходе между страницами
router.afterEach((to, from) => {
  if (to.path !== from.path) {
    window.scrollTo(0, 0);
  }
});

export default router;