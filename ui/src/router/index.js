import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    meta: {
      title: 'Server Management'
    },
    path: '/management',
    name: 'management',
    component: () => import(/* webpackChunkName: "management" */ '../views/Management.vue')
  },
  {
    meta: {
      title: 'Settings'
    },
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    meta: {
      title: 'Server Dashboard'
    },
    path: '/server/:server',
    name: 'server',
    component: () => import(/* webpackChunkName: "serverdashboard" */ '../views/Server.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "missing" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
