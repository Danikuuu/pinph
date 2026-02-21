import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         name: 'Home',     component: () => import('@/views/HomeView.vue') },
    { path: '/map',      name: 'Map',      component: () => import('@/views/MapView.vue') },
    { path: '/login',    name: 'Login',    component: () => import('@/views/LoginView.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/RegisterView.vue') },
    { path: '/profile',  name: 'Profile',  component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/saved',    name: 'Saved',    component: () => import('@/views/SavedView.vue'),   meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.init()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) return '/login'
})

export default router