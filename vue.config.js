const px2rem = require('postcss-px2rem')
module.exports = {
    devServer:{
        open:true
    },
    // 关闭Eslint的规则
    lintOnSave:false
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
    
}