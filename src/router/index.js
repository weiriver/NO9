import Vue from 'vue'
import Router from 'vue-router'
// import station from './station'
// import sysSetup from './sysSetup'
import {HMF} from './base'

// const Desktop = () => import('@/views/desktop/Index')
// const Login = () => import('@/views/login/Index')
// const Refresh = () => import('@/views/subindex/Refresh')
// const PrintPage = () => import('@/views/subindex/PrintPage')
// const PrintStatementPage = () => import('@/views/subindex/PrintStatement')
const test = () => import('@/views/subindex/test')

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/a',
      name: 'HMF',
      component: HMF,
      children: [
        {path: 'abc', component: test}
      ]
    },
    // {
    //   path: '/desktop',
    //   name: 'desktop',
    //   component: Desktop
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    // {
    //   path: '/refresh',
    //   name: 'Refresh',
    //   component: Refresh
    // },
    // {
    //   path: '/printPage',
    //   name: 'PrintPage',
    //   component: PrintPage
    // },
    // {
    //   path: '/printStatementPage',
    //   name: 'printStatementPage',
    //   component: PrintStatementPage
    // },
    // ...station,
    // ...sysSetup,
    {
      path: '*',
      redirect: '/a' // 默认跳转到登录
    }
  ]
})
