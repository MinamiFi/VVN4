import Vue from 'vue'
import VueRouter from 'vue-router'
import insights from '@/components/Insights/insights.vue'
import explorer from '@/components/Explorer/explorer.vue'
import global from '@/components/global/global.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/global'
  },
  {
    path: '/insights',
    name: 'insights',
    component: insights
  },
  {
    path: '/explorer',
    component: explorer
  },
  {
    path: '/global',
    component: global
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
