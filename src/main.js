import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/normalize.css'
import './assets/css/base.css'
import './assets/font/iconfont.css'
import tree from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
// 配置全局url
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1'

// 需要授权的 API 请求头中添加使用Authorization字段 = `token`令牌 有token的内容才有权限获取内容
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')

  
return config;
});
// 把axios添加到vue原型上
Vue.prototype.$http = axios

Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 数据树
Vue.component('tree',tree)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
