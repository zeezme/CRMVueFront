import AuthLayout from '@/common/layouts/AuthLayout.vue'
import DefaultLayout from '@/common/layouts/DefaultLayout.vue'
import { defineAsyncComponent } from 'vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/login/LoginView.vue'),
    layout: DefaultLayout,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginView.vue'),
    layout: AuthLayout,
  },
]
