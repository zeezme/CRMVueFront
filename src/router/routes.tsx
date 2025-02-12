import AuthLayout from '@/common/layouts/AuthLayout.vue'
import DefaultLayout from '@/common/layouts/DefaultLayout.vue'

export interface IDefaultRoutes {
  group: string | undefined
  path: string
  name: string
  label: string
  showInMenu: boolean
  icon: string
  component: () => object
  layout: Object
  meta: {
    requiresAuth: boolean
  }
}

export const routes: IDefaultRoutes[] = [
  {
    group: 'Demo',
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
    group: 'Debug',
    label: 'Debug',
    showInMenu: true,
    icon: 'pi pi-code',
    component: () => import('../views/debug/DebugView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    group: '',
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
    group: 'Demo',
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
  {
    group: 'Documentação',
    path: '/state',
    name: 'state',
    label: 'Estado',
    showInMenu: true,
    icon: 'pi pi-book',
    component: () => import('../views/state/StateView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    group: 'Documentação',
    path: '/input',
    name: 'input',
    label: 'Inputs',
    showInMenu: true,
    icon: 'pi pi-pen-to-square',
    component: () => import('../views/input/InputView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    group: 'Documentação',
    path: '/toast',
    name: 'toast',
    label: 'Toasts',
    showInMenu: true,
    icon: 'pi pi-envelope',
    component: () => import('../views/toast/ToastView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    group: 'Documentação',
    path: '/listing',
    name: 'listing',
    label: 'Listing',
    showInMenu: true,
    icon: 'pi pi-list',
    component: () => import('../views/listing/ListingView.vue'),
    layout: AuthLayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    group: 'Me',
    path: '/cv',
    name: 'cv',
    label: 'Curriculum',
    showInMenu: false,
    icon: 'pi pi-list',
    component: () => import('../views/curriculum/CurriculumView.vue'),
    layout: DefaultLayout,
    meta: {
      requiresAuth: false,
    },
  },
]
