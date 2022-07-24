import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

Vue.use(Router)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    next('/login')
  } else{
    next()
  }

})

export default router
