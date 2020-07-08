import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// import Login from ('../views/Login')
const Login = () => import('../views/Login')
const Hoem = () =>import('../views/hoem/Hoem')
  const routes = [
      {
        path:'',
        redirect:'/login'
      },
      {
        path:'/login',
        component:Login
      },
      {
        path:'/hoem',
        component:Hoem,
      }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 可以直接访问登录页面
  if(to.path === "/login") return next()
  //获取当然的 token
  const istoken = window.sessionStorage.getItem('token')
  //判断如果没有token就是没登录直接挑转到登录页面
  if(!istoken) return next('/login')
  // 如果有可以直接访问
  next()
})
export default router
