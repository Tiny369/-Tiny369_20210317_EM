// 全局引入elment-ui
/* import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); */

/**
 * 按需引入elment-ui
 */
import Vue from 'vue'
import { 
    Button,
    Form,FormItem,Input,
    Message,    // 全局挂载
    Container,
    Header,Aside,Main,
    Menu,Submenu,MenuItemGroup,MenuItem,
    Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,
    Switch,Tooltip,
    Pagination,Dialog,MessageBox,
    Tag
} from 'element-ui';     // 引入.....Message消息提示

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);

// 全局挂载Message消息提示
Vue.prototype.$message = Message 
// 全局挂载MessageBox弹框
Vue.prototype.$confirm = MessageBox.confirm 

