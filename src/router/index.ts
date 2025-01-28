import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const processedRoutes = routes.map((route) => ({
  path: route.path,
  component: route.layout,
  children: [
    {
      name: route.name,
      path: '',
      component: route.component,
    },
  ],
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: processedRoutes,
})

export default router
