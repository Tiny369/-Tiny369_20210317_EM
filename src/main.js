import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

import 'lib-flexible'
// 导入全局样式表
import './assets/Global.css'
// 按需引入element
import './plugins/element.js'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
