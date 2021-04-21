import Vue from 'vue'
import Router from 'vue-router'
// 引入Login组件
import Login from './components/Login.vue'
// 引入Home组件
import Home from './components/Home.vue'
// 引入Welcome组件
import Welcome from './components/Welcome.vue'
// 引入users组件
import users from './components/user/users.vue'
// 引入Rights组件
import Rights from './components/power/Rights.vue'
// 引入Roles组件
import Roles from './components/power/Roles.vue'
// 引入Cate组件 /categories
import Cate from './components/goods/Cate.vue'
// 引入Params组件 
import Params from './components/goods/Params.vue'
// 引入List组件 
import goodsList from './components/goods/List.vue'
// 引入goodsList/add组件 
import Add from './components/goods/Add.vue'
// 引入order组件 
import Order from './components/order/Order.vue'


Vue.use(Router)

let router = new Router({
    mode: 'history',    // 使用history模式
    routes: [
        { path:'',redirect:'/login' },  // 重定向
        { path:'/login',component:Login },
        { 
            path:'/home',
            component:Home,
            // redirect:'/welcome',
            children:[
                { path:'/home',redirect:'/welcome' },
                { path:'/welcome',component:Welcome },
                { path:'/users',component:users },
                { path:'/rights',component:Rights },
                { path:'/roles',component:Roles },
                { path:'/params',component:Params },
                { path:'/categories',component:Cate },
                { path:'/goods',component:goodsList },
                { path:'/goods/add',component:Add },
                { path:'/orders',component:Order },
            ] 
        }
    ]
})

// 挂载路由导航守卫 ---> 全局前置守卫
router.beforeEach((to,from,next)=>{
    /**
     * to 将要访问的路径
     * from 代表从哪个路径跳转而来
     * next 是一个函数，表示放行
     *      next()放行  next('/xxxx')强制跳转
     */
    if(to.path === '/login') return next()
    let token = window.sessionStorage.getItem('token_key')
    if(!token) return next('/login')
    next()
})


export default router