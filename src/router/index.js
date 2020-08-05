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
const Login = () => import(/*login_hoem_welcome*/ '../views/Login')
const Hoem = () =>import(/*login_hoem_welcome*/ '../views/hoem/Hoem')
const Welcome = () => import(/*login_hoem_welcome*/ '../views/hoem/childHoem/Welcome')

const Users = () =>import(/*Users_Roles_Rights*/'../views/hoem/childHoem/users/Users')
//权限
const Roles = () =>import(/*Users_Roles_Rights*/'../views/hoem/childHoem/quanxian/Roles')
const Rights = () =>import(/*Users_Roles_Rights*/'../views/hoem/childHoem/quanxian/Rights')
// 商品管理
const Goods = () => import(/*Goods_Params*/'../views/hoem/childHoem/shangping/Goods')
const Params = () => import(/*Goods_Params*/'../views/hoem/childHoem/shangping/Params')
const Categories = () => import(/*Goods_Params*/'../views/hoem/childHoem/shangping/Categories')
 const Adduser = () =>import(/*Goods_Params*/'../views/hoem/childHoem/shangping/Adduser')

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
        component:Login,
        meta:{
          title : '登录'
        }
      },
      {
        path:'/hoem',
        component:Hoem,
        children:[
          {
            path:'/hoem',
            redirect:'/welcome',
          },
          {
            path:'/welcome',
            component:Welcome,
            meta:{
              title : '首页'
            }
          },
          {
            path:'/users',
            component:Users,
            meta:{
              title : '用户列表'
            }
          },
          {
            path:'/roles',
            component:Roles,
            meta:{
              title : '角色列表'
            }
          },
          {
            path:'/rights',
            component:Rights,
            meta:{
              title : '权限列表'
            }
          },
          {
            path:'/goods',
            component:Goods,
            meta:{
              title : '商品列表'
            }
          },
          {
            path:'/params',
            component:Params,
            meta:{
              title : '分类参数'
            }
          },
          {
            path:'/categories',
            component:Categories,
            meta:{
              title : '商品分类'
            }
          },
          {
            path:'/goods/adduser',
            component:Adduser,
            meta:{
              title : '添加商品'
            }
          },
          {
            path:'/orders',
            component:Orders,
            meta:{
              title : '订单列表'
            }
          },
          {
            path:'/reports',
            component:Reports,
            meta:{
              title : '数据统计'
            }
          }
        ]
      }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
 //导航守卫 
router.beforeEach((to, from, next) => {

  console.log(to);
  document.title = to.meta.title
  // 如果访问的url是(/login) 那么可以直接访问登录页面
  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})
export default router
