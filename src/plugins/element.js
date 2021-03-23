// 全局引入elment-ui
/* import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); */

// 按需引入elment-ui
import Vue from 'vue'
import { Button,Form,FormItem,Input } from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);