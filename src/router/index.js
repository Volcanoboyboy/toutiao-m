import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'tabView',
    component: () => import('@/views/layout/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
