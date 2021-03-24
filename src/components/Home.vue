<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      Header
      <el-button type="info"  @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-内容区 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 主体内容主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      // 退出点击事件
      logout (){
        window.sessionStorage.clear()
        let token = window.sessionStorage.getItem('token_key')
        if(!token) {
          setTimeout(() => {
            this.$router.push({path:'/login'})
          }, 1000);
        }
        
      }
    },
  }
</script>

// 
<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #151D21;
}
.el-aside {
  background-color: #0F1624;
}
.el-main {
  background-color: #E5EAEE;
}


 
</style>
