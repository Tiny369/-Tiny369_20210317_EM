<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
       <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"></el-table-column>
        <el-table-column label="操作" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo:{
          query:'', // 查询参数
          pagenum:1,  // 当前页码
          pagesize:2  // 每页显示条数
        },
        // 初始数据保存用户列表
        userlist:[],
        // 初始数据保存总数
        total:0
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 获取用户列表事件方法
      async getUserList (){
        // 发送请求获取数据
        let {data:res} = await this.$http.get('users',{
          params:this.queryInfo
        })
        if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        // 将获取到的用户列表赋给userlist
        this.userlist = res.data.users
        // 将获取到的总数量赋给total
        this.total = res.data.total
        console.log(res);
      }
    },
  }
</script>

<style lang="less" scoped>
 
</style>
