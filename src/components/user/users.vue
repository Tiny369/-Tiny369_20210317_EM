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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">  
          <!-- 使用作用域插槽 slot-scope="slotProps" / v-slot:default="slotProps"-->
          <template v-slot:default="slotProps"> <!-- 获取该行的所有数据 {{slotProps.row}} -->
            <el-switch v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope"> 
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框区域 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" >
      <!-- 内容主体区域 -->
      <span>这是一段信息</span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

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
          pagesize:2  // 当前每页显示的条数
        },
        // 初始数据保存用户列表
        userlist:[],
        // 初始数据保存总数
        total:0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible:false
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
      },
      // 监听 pagsize 改变的事件
      handleSizeChange (newSize){
        // console.log(newSize);
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange (newPage){
        // console.log(newPage);
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听 switch 开关状态的事件
      async userStateChanged (newUserInfo){ // newUserInfo新状态的值
        // 发请求用于操作更改服务器数据
        let { data:res } = await this.$http.put(`users/${newUserInfo.id}/state/${newUserInfo.mg_state}`)
        if(res.meta.status !== 200){
          // 如果更新失败返回上一次的状态
          newUserInfo.mg_state = !newUserInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
        // console.log(res);
      },
    },
  }
</script>

<style lang="less" scoped>
 
</style>
