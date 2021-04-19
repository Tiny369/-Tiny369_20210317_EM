<template>
<!-- 添加商品页面功能 -->
  <div>

    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 文字提示 -->
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      <!-- 状态步骤条 parseInt() -->
      <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-tabs :tab-position=" 'left' "  v-model="activeIndex" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addFrom.goods_cat" :options="cateList"
                :props="cateProps" @change="handleChange">
              </el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 控制步骤条初始显示的索引（tab栏和步骤条共用属性）
        activeIndex:'0',
        // 添加商品的表单数据对象 
        addFrom:{
          goods_name:'',    // 商品名称
          goods_price:0,    // 商品价格
          goods_weight:0,   // 商品重量
          goods_number:0,   // 商品数量
          goods_cat:[],     // 商品分类数组
        },
        // 验证规则
        addFromRules:{
          goods_name: [     // 商品名称
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price: [     // 商品价格
            { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_weight: [   // 商品重量
            { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          goods_number: [   // 商品数量
            { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
          goods_cat: [   // 商品分类
            { required: true, message: '请选中商品分类', trigger: 'blur' },
          ],
        },
        // 商品分类数据的数组
        cateList:[],
        // 基于选项的配置对象
        cateProps:{
          expandTrigger: 'hover', //  触发方式
          label:'cat_name', // 指定选项标签
          value:'cat_id',   // 指定选项的值
          children:'children' // 指定选项的子选项
        }
      }
    },
    created() {   // 创建实例后调用获取商品分类列表的数据
      this.getCateList()
    },
    methods: {
      // 获取所有商品分类数据
      async getCateList (){
        // 发送获取商品分类数据列表的请求
        let { data:res } = await this.$http.get('categories') 
        // 根据响应的状态码提示
        if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        // 将获取到的商品分类数据列表赋值给data
        this.cateList = res.data
        // console.log(this.cateList);
      },
      // 监听级联选择器选项的改变的事件
      handleChange (){
        // 只允许选三级菜单
        if(this.addFrom.goods_cat.length !== 3){
          this.addFrom.goods_cat = []
          return 
        }
        console.log(this.addFrom.goods_cat);
      },
      beforeTabLeave (activeName,oldActiveName){ 
        // 进入（新）activeName  离开（旧）oldActiveName
        if(oldActiveName === '0' && this.addFrom.goods_cat.length !== 3){
          this.$message.error('请选择商品分类！')
          return false
        }
      },
    },
  }
</script>

<style lang="less">


 
</style>
