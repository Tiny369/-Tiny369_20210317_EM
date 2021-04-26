// 引入express
const express = require('express')
// 导入包compression
const compression = require('compression');

// 创建 web 服务器
const app = express()

// 启用中间件（在托管静态资源之前启用）
app.use(compression());
// 托管静态资源
app.use(express.static('./dist'))

// 启动 web 服务器
app.listen(80, () => {
 console.log('web server running at http://127.0.0.1')
})