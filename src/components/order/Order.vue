<template>
<!-- 订单管理功能 -->
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if=" scope.row.pay_status === '1' ">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <!-- <template slot-scope="scope">   -->
          <template>  
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑订单对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="province">
          <el-cascader v-model="addressForm.province" 
            :options="citydate"  :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailed">
          <el-input v-model="addressForm.detailed"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" >
      <!-- 时间线 -->
      <div class="block">
        <div class="radio">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">倒序</el-radio>
            <el-radio :label="false">正序</el-radio>
          </el-radio-group>
        </div>
        <el-timeline :reverse="reverse">
          <el-timeline-item v-for="(progress, index) in progressInfo" :key="index"
            :timestamp="progress.time">
            {{progress.context}}  
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>


  </div>
</template>

<script type="text/ecmascript-6">
import citydate from './citydata.js'
  export default {
    data() {
      return {
        // 查询数据对象
        queryInfo:{
          query:'',     // 查询参数
          pagenum:1,    // 当前页码
          pagesize:10   // 每页显示条数
        },
        total:0,      // 总条数
        orderList:[], // 订单数据列表
        // 控制订单对话框的显示与隐藏
        addressVisible:false,
        // 订单对话框的表单数据对象
        addressForm:{
          province:[],    // 省市区
          detailed:''     // 详细地址
        },
        // 表单验证规则
        addressFormRules:{
          province: [   // 省市区验证
            { required: true, message: '请选择省市区/县', trigger: 'blur' },
          ],
          detailed: [   // 详细地址验证
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
        },
        // 省市区县的数据
        citydate,
        // 级联选择器选项配置对象
        props:{
          expandTrigger: 'hover'
        },
        // 控制物流进度对话框的显示与隐藏
        progressVisible:false,
        // 物流进度数据列表(自定义数据)
        progressInfo:[
          {
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ],
        // 排序的默认显示状态
        reverse:true
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      // 获取订单列表数据
      async getOrderList (){
        // 获取订单列表数据的请求，注意参数
        let { data:res } = await this.$http.get('orders',{
          params:this.queryInfo
        })
        if(res.meta.status !== 200) return this.$message.error('获取订单列表失败')
        this.$message.success('获取订单列表成功')
        // 将总条数保存到data中
        this.total = res.data.total
        // 将订单数据保存到data中
        this.orderList = res.data.goods
      },
       // 监听每页条数的事件
      handleSizeChange (newVal){
        this.queryInfo.pagesize = newVal
        this.getOrderList()
      },
      // 监听当前页码的事件
      handleCurrentChange (newVal){
        this.queryInfo.pagenum = newVal
        this.getOrderList()
      },
      // 点击显示订单的编辑对话框
      showEditBox (){
        // 显示对话框
        this.addressVisible = true
      },
      // 监听对话框的关闭事件
      addressDialogClosed (){
        // 重置表单
        this.$refs.addressFormRef.resetFields()
      },
      // 显示物流进度对话框
      async showProgressBox (){
        // 后台接口出错(自定义数据)
        /* let { data:res } = await this.$http.get('/kuaidi/804909574412544580')
        if(res.meta.status !== 200) return this.$message.error('获取物流信息失败！')
        this.$message.success('获取物流信息成功！')
        this.progressInfo = res.data */

        // 展示对话框
        this.progressVisible = true
        console.log(this.progressInfo);

      },
     


    },
  }
</script>

<style lang="less" scoped>

/* 编辑订单对话框的级联选择器样式 */
.el-cascader {
  width: 100%;
}

// 物流进度对话框的排序栏样式
.radio {
  margin-bottom: 20px;
}
</style>
