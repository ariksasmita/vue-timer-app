// router.js
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeComponent from '../views/Home.vue'
import AboutComponent from '../views/About.vue'

const routes: Array<RouteRecordRaw>  = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: '/about',
    name: 'About',
    component: AboutComponent
  }
  // add more routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router