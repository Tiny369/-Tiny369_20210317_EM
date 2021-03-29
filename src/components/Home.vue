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
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <!-- 折叠与展开元素 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu  background-color="#0f1624" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <!-- <el-submenu index="1" > -->
          <el-submenu :index="(item.id).toString()" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- <i class="el-icon-location"></i> -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <!-- <span>导航一</span> -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- <el-menu-item index="1-4-1"> -->
            <el-menu-item :index="(subItem.id).toString()"  v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!-- 图标 -->
                <!-- <i class="el-icon-location"></i> -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <!-- <span>导航一</span> -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 左侧菜单数据
        menulist:[],
        // 一级菜单图标数据
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        // 是否折叠
        isCollapse:false
      }
    },
    created() {   // 加载后立即获取菜单
      this.getMenuList()
    },
    methods: {
      // 退出功能点击事件
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
      },
      // 折叠与展开点击事件
      toggleCollapse (){
        this.isCollapse = !this.isCollapse
      },
    },
   
  }
</script>


<style lang="less" scoped>
.home_container {
  height: 100%;
}

// 头部区域样式
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

// 左侧侧边栏样式
.el-aside {
  background-color: #0F1624;
  // 一级菜单图标统一样式
  .iconfont {
    margin-right: 10px;
  }
  // 解决导航二级菜单展开列表时的右1px边框
  .el-menu {
    border-right: none;
  }
  // 折叠与展开样式
  .toggle_button {
    background-color: #333744;
    height: 27px;
    line-height: 25px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

// 右侧主体内容样式
.el-main {
  background-color: #E5EAEE;
}


 
</style>
