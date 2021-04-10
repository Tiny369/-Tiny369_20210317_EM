<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      
      <!-- 表格 -->

      <!-- 分页区域 -->

    </el-card>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        
      }
    },
    created() {
      
    },
    methods: {
      
    },
  }
</script>

<style lang="less" scoped>

 
</style>
