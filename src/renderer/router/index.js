import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login-page',
      component: require('@/components/Login').default
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/components/messaging/Main').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
