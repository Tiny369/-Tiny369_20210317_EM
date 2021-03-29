import Vue from 'vue'
import Router from 'vue-router'
// 引入Login组件
import Login from './components/Login.vue'
// 引入Home组件
import Home from './components/Home.vue'
// 引入Welcome组件
import Welcome from './components/Welcome.vue'

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
                { path:'/welcome',component:Welcome },
                { path:'/home',redirect:'/welcome' },
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