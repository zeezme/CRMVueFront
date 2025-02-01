import AuthLayout from '@/common/layouts/AuthLayout.vue'
import DefaultLayout from '@/common/layouts/DefaultLayout.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/login/LoginView.vue'),
    layout: DefaultLayout,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/person',
    name: 'person',
    component: () => import('../views/person/PersonView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
]
