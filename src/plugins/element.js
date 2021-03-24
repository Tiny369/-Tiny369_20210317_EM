// 全局引入elment-ui
/* import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); */

/**
 * 按需引入elment-ui
 */
import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Aside,Main } from 'element-ui';     // 引入.....Message消息提示

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);

// 全局挂载
Vue.prototype.$message = Message