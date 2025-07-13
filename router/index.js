import { createRouter, createWebHistory } from 'vue-router'
import MainMap from '../src/components/MainMap.vue'

const routes = [
  {
    path:'/',
    name: 'Home',
    component:MainMap
  },
  {
    path: '/map',
    name: 'Map',
    component: MainMap
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
