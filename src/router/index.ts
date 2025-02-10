import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { globalStore } from '@/common/config/globalStore'
import api from '@/common/helpers/api'

const processedRoutes = routes.map((route) => ({
  path: route.path,
  component: route.layout,
  children: [
    {
      name: route.name,
      path: '',
      component: route.component,
      meta: route.meta,
    },
  ],
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: processedRoutes,
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') return next()

  if (!to.meta.requiresAuth) return next()

  const { token } = globalStore.getState()

  if (!token.value) return next('/login')

  const { data: isJwtValid } = await api({
    endpoint: 'verify-token',
    method: 'POST',
    data: { token: token.value },
  })
  console.log(isJwtValid)

  if (isJwtValid === false) {
    globalStore.resetState()

    return next('/login')
  }

  return next()
})

export default router
