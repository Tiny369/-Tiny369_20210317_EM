import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
// 适配
import 'lib-flexible'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/Global.css'
// 按需引入element
import './plugins/element.js'

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'    // 配置请求的根路径
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
