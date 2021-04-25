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
// 引入第三方插件（vue-table-with-tree-grid）
import ZkTable from 'vue-table-with-tree-grid'
// 引入第三方插件（vue-quill-editor）,富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入第三方插件（vue-quill-editor）富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//  导入nprogress包对应的JS和CSS
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'


// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'    // 配置请求的根路径
// 挂载前添加请求拦截器
axios.interceptors.request.use((config)=>{
  // 展示进度条
  Nprogress.start()
  // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token_key')
  // 最后必须 return config
  return config
})
// 响应拦截器
axios.interceptors.response.use((config)=>{
  // 隐藏进度条
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

// 注册第三方插件（vue-table-with-tree-grid）
Vue.component('tree-table',ZkTable)
// 注册第三方插件（vue-quill-editor）富文本编辑器,全局可用组件
Vue.use(VueQuillEditor)

// 创建全局事件过滤器，处理时间格式
Vue.filter('dateFormat',function (originVal){
  let dt = new Date(originVal)
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1 + '').padStart(2,'0')
  let d = (dt.getDate()  + '').padStart(2,'0')
  let hh = (dt.getHours()  + '').padStart(2,'0')
  let mm = (dt.getMinutes()  + '').padStart(2,'0')
  let ss = (dt.getSeconds()  + '').padStart(2,'0')
  return  `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
