import AuthLayout from '@/common/layouts/AuthLayout.vue'
import DefaultLayout from '@/common/layouts/DefaultLayout.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    label: 'Home',
    showInMenu: true,
    icon: 'pi pi-home',
    component: () => import('../views/home/HomeView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/debug',
    name: 'debug',
    label: 'Debug',
    showInMenu: false,
    icon: 'pi pi-home',
    component: () => import('../views/debug/DebugView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    label: 'Login',
    showInMenu: false,
    icon: 'pi pi-home',
    component: () => import('../views/login/LoginView.vue'),
    layout: DefaultLayout,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/person',
    name: 'person',
    label: 'Person',
    showInMenu: true,
    icon: 'pi pi-user',
    component: () => import('../views/person/PersonView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
]
