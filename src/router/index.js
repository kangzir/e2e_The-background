import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
 //push
 const VueRouterPush = VueRouter.prototype.push 
 VueRouter.prototype.push = function push (to) {
     return VueRouterPush.call(this, to).catch(err => err)
 }
  //replace
 const VueRouterReplace = VueRouter.prototype.replace
 VueRouter.prototype.replace = function replace (to) {
   return VueRouterReplace.call(this, to).catch(err => err)
 }
// import Login from ('../views/Login')
const Login = () => import('../views/Login')
const Hoem = () =>import('../views/hoem/Hoem')

const Welcome = () => import('../views/hoem/childHoem/Welcome')
const Users = () =>import('../views/hoem/childHoem/users/Users')

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
        children:[
          {
            path:'/hoem',
            redirect:'/welcome'
          },
          {
            path:'/welcome',
            component:Welcome
          },
          {
            path:'/users',
            component:Users
          }
        ]
      }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
 //导航守卫 
router.beforeEach((to, from, next) => {
  //如果访问的url是(/login) 那么可以直接访问登录页面
  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
  // if(to.path === "/login") return next()
  // //获取当前的 token
  // const istoken = window.sessionStorage.getItem('token')
  // //判断如果没有token就是为登录直接挑转到登录页面
  // if(!istoken){
  //   return next('/login')
  // }else{
  //   // 如果有可以直接访问
  //   next()
  // }
})
export default router
