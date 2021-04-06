<template>
<!-- 角色列表功能 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>  
        <!-- 索引列 --> 
        <el-table-column label="#" type="index"></el-table-column>   
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template v-slot:default="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添角色户对话框区域 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%">
      <span>aa</span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        rolesList:[],  // 角色列表
        addRoleDialogVisible:false  // 添加角色
      }
    },
    created() {
      //  获取所有角色列表
      this.getRolesList()
    },
    methods: {
      //  获取角色列表的事件方法
      async getRolesList (){
        // 发送请求获取角色列表
        let { data:res } = await this.$http.get('roles')
        if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        // 获取成功后赋给定义的角色列表
        this.rolesList = res.data 
        console.log(this.rolesList);
      },
      addRole (){
        this.addRoleDialogVisible = true
      }
    },
  }
</script>

<style scoped>

 
</style>
