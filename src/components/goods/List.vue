<template>
<!-- 商品列表功能 -->
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索/添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" 
            v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"  width="105px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"  width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"  width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" background
        :page-size="this.queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 查询参数对象
        queryInfo:{
          query:'',   // 查询参数
          pagenum:1,    // 当前页码
          pagesize:10   // 每页显示条数
        },
        // 商品列表数据
        goodsList:[],
        // 总数据条数
        total:0
      }
    },
    created() {   // 实例创建后调用获取数据函数
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的函数
      async getGoodsList (){
        // 发送获取列表数据的请求，注意请求参数
        let { data:res } = await this.$http.get('goods',{
          params:this.queryInfo
        })
        if(res.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
        this.$message.success('获取商品列表数据成功')
        // console.log(res.data);
        // 将获取到的数据保存到data中
        this.goodsList = res.data.goods
        // 将获取到的总数量保存到data中
        this.total = res.data.total
        // console.log(this.goodsList);
      },
      // 监听每页条数的事件
      handleSizeChange (newVal){
        this.queryInfo.pagesize = newVal
        this.getGoodsList()
      },
      // 监听当前页码的事件
      handleCurrentChange (newVal){
        this.queryInfo.pagenum = newVal
        this.getGoodsList()
      },
      // 点击按钮，删除商品事件
      async removeById (id){
        // 弹框提示是否删除该商品
        let resfirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(resfirm !== 'confirm') return this.$message.info('用户取消删除')
        // 发送删除当前商品的请求，注意参数
        let { data:res } = await this.$http.delete('goods/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.getGoodsList()
      },
      // 点击按钮，跳转至添加商品属性的页面事件
      goAddPage (){
        this.$router.push('/goods/add')
      },
    },
  }
</script>

<style scoped>

 
</style>
