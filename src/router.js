import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import StadiumPage from './pages/StadiumPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { useAuth } from './composables/useAuth';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/stadium/:id', name: 'stadium', component: StadiumPage },
  { path: '/login', name: 'login', component: LoginPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('DEBUG: Router beforeEach', { to: to.path, from: from.path, fullPath: to.fullPath });
  
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

export default router;