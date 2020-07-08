import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'
//全局注册提示框
Vue.prototype.$message = Message

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
