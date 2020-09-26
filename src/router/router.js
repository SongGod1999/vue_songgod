import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Main from '@/components/Main.vue'
import ImgManagement from '@/components/imgmanagement/ImgManagement.vue'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/main',
    children: [
      { path: '/main', component: Main },
      { path: '/imgmanagement', component: ImgManagement },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表那个路径而来
  // next 是一个函数 表示放行
  // next()放行 next('/login/)强制跳转
  if (to.path === '/login') return next()
  const toKenStr = window.sessionStorage.getItem('token')
  if (!toKenStr) return next('/login')
  next()
})

export default router