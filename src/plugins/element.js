// 全局引入elment-ui
/* import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); */

/**
 * 按需引入elment-ui
 */
import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui';     // 引入.....Message消息提示

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// 全局挂载
Vue.prototype.$message = Message