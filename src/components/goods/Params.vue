<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警示区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 商品分类列表
        cateList:[],
        // 指定级联选择器的配置对象
        cateProps:{
          // checkStrictly: true,  // 可选择任意一级
          expandTrigger: 'hover', // 触发方式
          value: 'cat_id',  // 选项的值
          label: 'cat_name',  // 选项标签
          children:'children' // 选项的子选项
        },
        //  级联选择框双向绑定到的数组
        selectedCateKeys:[]
      }
    },
    created() {   // 创建实例后
      this.getCateList()
    },
    methods: {
      // 获取所有商品分类列表 事件函数
      async getCateList (){
        // 发送所有商品分类列表的请求
        let { data:res } =  await this.$http.get('categories')
        // 根据响应状态码判断，提示
        if(res.meta.status !== 200) this.$message.error('获取商品分类数据列表失败')
        // 将获取到的商品分类列表数据保存给data
        this.cateList = res.data
        // console.log(this.cateList);
      },
      // 级联选择器选择项发生变化，触发这个函数
      handleChange (){
        if(this.selectedCateKeys.length !== 3){
          this.selectedCateKeys = []
          return
        }
        console.log('选中成功');
        console.log(this.selectedCateKeys)
      }
      
    },
  }
</script>

<style lang="less" scoped>
/* 选择商品分类区域样式 */
.cat_opt {
  margin: 15px 0;
  font-size: 15px;
}
 
</style>
