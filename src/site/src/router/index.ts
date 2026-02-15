import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'
import SettingsView from '@/views/SettingsView.vue'
import LandingPageView from '@/views/landing/LandingPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        return isLoggedIn ? '/dashboard' : '/lp'
      },
    },
    {
      path: '/lp',
      name: 'landing',
      component: LandingPageView,
      // 認証不要、ログイン済みでもLPを表示
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: AuthCallbackView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      redirect: '/settings',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.name === 'login' && isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
