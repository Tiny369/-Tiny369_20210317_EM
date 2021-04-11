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
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
        show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:#67C23A" v-if=" scope.row.cat_deleted == false "></i>
          <i class="el-icon-error" style="color:#F56C6C" v-else></i>
        </template>
        <!-- 排序列 -->
         <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if=" scope.row.cat_level == 0 ">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if=" scope.row.cat_level == 1 ">二级</el-tag>
          <el-tag size="mini" type="warning" v-else-if=" scope.row.cat_level == 2 ">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 8, 15]"
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 查询条件
        queryInfo:{
          type:3, //  级别的分类
          pagenum:1,  // 当前页码值
          pagesize:5  // 每页显示多少条数据
        },
        // 商品分类的数据列表，默认为空数组
        cateList:[],
        // 总数据条数
        total:0,
        // 定义table指定列
        columns:[
          {
            label:'分类名称',
            prop:'cat_name'
          },
          {
            label:'是否有效',
            type:'template',  // 表示当前列定义的事模版列
            template:'isok' // 表示当前这一列使用的模版名称
          },
          {
            label:'排序',
            type:'template',  // 表示当前列定义的事模版列
            template:'sort' // 表示当前这一列使用的模版名称
          },
          {
            label:'操作',
            type:'template',  // 表示当前列定义的事模版列
            template:'operate' // 表示当前这一列使用的模版名称
          }
        ],
      }
    },
    created() { // 创建实例后调用获取商品分类列表的数据
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList (){
        // 发送获取商品分类数据列表的请求
        let { data:res } = await this.$http.get('categories',{  params:this.queryInfo }) 
        // 根据响应的状态码提示
        if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        // 将获取到的商品分类数据列表赋值给data
        this.cateList = res.data.result
        // 将获取到的总数据条数赋值给data
        this.total = res.data.total
        console.log(res.data);
      },
      // 监听 pagesize 改变
      handleSizeChange (newSize){
        // 改变的值立即赋值给data
        this.queryInfo.pagesize = newSize
        // 刷新列表
        this.getCateList()
      },
      // 监听 pagenum 改变
      handleCurrentChange (newPage){
        // 改变的值立即赋值给data
        this.queryInfo.pagenum = newPage
        // 刷新列表
        this.getCateList()
      }
    },
  }
</script>

<style lang="less" scoped>

 
</style>
