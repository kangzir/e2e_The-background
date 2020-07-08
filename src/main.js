import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/normalize.css'
import './assets/css/base.css'
import './assets/font/iconfont.css'
Vue.config.productionTip = false
// 配置全局url
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1'
// 把axios添加到vue原型上
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
