<template>
<!-- 权限列表功能 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 使用表格渲染权限列表 -->
        <el-table :data="rightsList" style="width: 100%" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template v-slot:default="slotProps">
                    <el-tag v-if="slotProps.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="slotProps.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

  </div>

  
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
        return {
            rightsList:[]   // 权限列表
        }
    },
    created() {
        // 获取所有的权限
        this.getRightsList()
    },
    methods: {
        // 获取权限列表的事件方法
        async getRightsList (){
            // 发送请求获取权限列表，使用列表的形式展示 list/tree 
            let { data:res } = await this.$http.get('rights/list')
            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
            // 获取成功后赋给定义的权限列表
            this.rightsList = res.data
            console.log(this.rightsList);
        }
    },
  }
</script>

<style scoped>

 
</style>
