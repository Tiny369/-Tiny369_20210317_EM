<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.gif" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"  @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-内容区 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 左侧菜单数据
        menulist:[]
      }
    },
    created() {   // 加载后立即获取菜单
      this.getMenuList()
    },
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
      },
      // 获取所有的菜单
      async getMenuList (){
        let { data:res } = await this.$http.get('menus')
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
        console.log(res);
      }
    },
  }
</script>


<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #151D21;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content:space-between;
  align-items: center;
  >div {
    display: flex;
    align-items: center;
    >img {
      width: 61px;
      height: 56px;
    }
  }
}
.el-aside {
  background-color: #0F1624;
}
.el-main {
  background-color: #E5EAEE;
}


 
</style>
