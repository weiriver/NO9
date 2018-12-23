import Vue from 'vue'
import Router from 'vue-router'
// import storage from './storage'
// import train from './train'
// import repair from './repair'
import station from './station'
import sysSetup from './sysSetup'

const Desktop = () => import('@/views/desktop/Index')
const Login = () => import('@/views/login/Index')
const Subindex = () => import('@/views/subindex/Subindex')
const Refresh = () => import('@/views/subindex/Refresh')
const PrintPage = () => import('@/views/subindex/PrintPage')
const PrintStatementPage = () => import('@/views/subindex/PrintStatement')

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/a',
      name: 'subView',
      component: Subindex
    },
    {
      path: '/desktop',
      name: 'desktop',
      component: Desktop
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/refresh',
      name: 'Refresh',
      component: Refresh
    },
    {
      path: '/printPage',
      name: 'PrintPage',
      component: PrintPage
    },
    {
      path: '/printStatementPage',
      name: 'printStatementPage',
      component: PrintStatementPage
    },
    ...station,
    ...sysSetup,
    // ...storage,
    // ...repair,
    // ...train,
    {
      path: '*',
      redirect: '/desktop' // 默认跳转到登录
    }
  ]
})
