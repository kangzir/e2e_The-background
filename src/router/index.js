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
//权限
const Roles = () =>import('../views/hoem/childHoem/quanxian/Roles')
const Rights = () =>import('../views/hoem/childHoem/quanxian/Rights')
// 商品管理
const Goods = () => import('../views/hoem/childHoem/shangping/Goods')
const Params = () => import('../views/hoem/childHoem/shangping/Params')
const Categories = () => import('../views/hoem/childHoem/shangping/Categories')
 const Adduser = () =>import('../views/hoem/childHoem/shangping/Adduser')

//  订单管理
const Orders = () =>import('../views/hoem/childHoem/dingdan/Orders')

const Reports = () =>import('../views/hoem/childHoem/shujv/Reports')
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
          },
          {
            path:'/roles',
            component:Roles
          },
          {
            path:'/rights',
            component:Rights
          },
          {
            path:'/goods',
            component:Goods,
          },
          {
            path:'/params',
            component:Params
          },
          {
            path:'/categories',
            component:Categories
          },
          {
            path:'/goods/adduser',
            component:Adduser
          },
          {
            path:'/orders',
            component:Orders
          },
          {
            path:'/reports',
            component:Reports
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
  // //判断如果没有token就是为登录直接挑转到登录页     面
  // if(!istoken){
  //   return next('/login')
  // }else{
  //   // 如果有可以直接访问
  //   next()
  // }
})
export default router
