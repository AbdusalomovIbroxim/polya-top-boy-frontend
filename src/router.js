import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import StadiumPage from './pages/StadiumPage.vue';
import { useAuth } from './composables/useAuth';

const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/stadium/:id', name: 'stadium', component: StadiumPage, meta: { requiresAuth: true } },
  // Можно добавить роут для страницы логина, если она понадобится в будущем
  // { path: '/login', name: 'login', component: LoginPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuth, isLoading } = useAuth();

  // Если аутентификация еще не завершена, мы не можем принимать решение.
  // В App.vue будет показан экран загрузки или ошибки, так что навигация
  // по сути "заморожена" до получения статуса аутентификации.
  // Поэтому мы можем просто разрешить навигацию, а App.vue сам
  // решит, что показывать: страницу, загрузчик или ошибку.
  
  // Эта проверка нужна на случай, если пользователь попробует перейти по прямому URL
  // до того, как завершится начальная аутентификация.
  if (isLoading.value) {
    // Мы можем дождаться завершения, но это усложнит код.
    // Проще положиться на то, что App.vue контролирует отображение.
    // Просто пропускаем.
  }

  // После того как isLoading станет false, isAuth будет иметь актуальное значение.
  if (to.meta.requiresAuth && !isAuth.value && !isLoading.value) {
    // Пользователь не авторизован и пытается зайти на защищенный роут.
    // В нашем случае, App.vue уже показывает ErrorScreen, так что
    // можно отменить навигацию, чтобы избежать "моргания" компонента.
    return next(false);
  }

  next();
});

export default router;