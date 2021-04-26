const px2rem = require('postcss-px2rem')
module.exports = {
    devServer:{
        open:true
    },
    // 关闭Eslint的规则
    lintOnSave:false,
    // 原生webpack配置
    /* configureWebpack:{
    } */
    /* css: {//添加postcss配置
        loaderOptions: {
            postcss: {
                plugins:[
                    px2rem({
                        remUnit: 75   //设计稿等分后的rem值  375/10
                    })
                ]
            }
        }
    }, */
    // 通过 chainWebpack 自定义打包入口
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {      
            config.entry('app').clear().add('./src/main-prod.js')
            // 通过 externals 加载外部 CDN 资源
            config.set('externals', {
                vue: 'Vue', 'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress', 'vue-quill-editor': 'VueQuillEditor'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }

}