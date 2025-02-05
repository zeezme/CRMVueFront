import AuthLayout from '@/common/layouts/AuthLayout.vue'
import DefaultLayout from '@/common/layouts/DefaultLayout.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    label: 'Home',
    showInMenu: true,
    icon: 'pi pi-home',
    component: () => import('../views/login/LoginView.vue'),
    layout: DefaultLayout,
    meta: {
      requiresAuth: false,
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
      requiresAuth: true,
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
