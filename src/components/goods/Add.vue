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
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
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
        <el-tabs :tab-position=" 'left' "  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
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
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name"  v-for="item in manyTabelData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name"  v-for="item in onlyTabelData" :key="item.attr_id">
              <el-input v-model="item.attr_vals" ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- Upload 上传图片 -->
            <el-upload class="upload-demo" :action="UploadURL" 
              :on-preview="handlePreview" :on-remove="handleRemove" 
              list-type="picture" :headers="headerObj" :on-success="handleSuccess">  <!-- headers:设置上传的请求头,使用 `Authorization` 字段提供 `token` 令牌 -->
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
// 引入lodash库
import _ from 'lodash'  
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
          pics:[],          // 图片的数组
          goods_introduce:'',  // 商品介绍
          attrs:[]    // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
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
        },
        // 动态参数数据列表的数组
        manyTabelData:[],
        // 静态属性数据列表的数组
        onlyTabelData:[],
        UploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
        // 图片上传组件的headers请求头对象（需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌）
        headerObj:{
          Authorization:window.sessionStorage.getItem('token_key')
        },
        // 图片的Url地址
        previewPath:'',
        // 控制图片预览框的显示与隐藏
        previewVisible:false
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
      // 切换标签之前的钩子函数
      beforeTabLeave (activeName,oldActiveName){ 
        // 进入（新）activeName  离开（旧）oldActiveName
        if(oldActiveName === '0' && this.addFrom.goods_cat.length !== 3){
          this.$message.error('请选择商品分类！')
          return false
        }
      },
      // tab 被选中时触发的函数
      async tabClicked (){
        // console.log(this.activeIndex);
        // 访问的是动态参数面板
        if(this.activeIndex === '1'){   // 商品参数
          // 发送获取分类参数列表的请求，注意参数
          let { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{ sel:'many' }   // 动态参数
          })
          if(res.meta.status !== 200) return this.$message.error('获取分类参数数据失败')
          // 保存数据前，遍历attr_vals，并生成数组形式
          res.data.forEach(item => {
            // 判断级联选择器的选项值是否为空
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          // console.log(res.data);
          // 将获取的数据保存到data中
          this.manyTabelData = res.data
        }else if(this.activeIndex === '2'){   // 商品属性
           // 发送获取分类参数列表的请求，注意参数
          let { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{ sel:'only' } // 静态属性
          })
          if(res.meta.status !== 200) return this.$message.error('获取分类参数数据失败')
          // console.log(res.data);
          // 将获取的数据保存到data中
          this.onlyTabelData = res.data
          // console.log(this.onlyTabelData);
        }
      },
      // 处理图片预览效果
      handlePreview (file){
        // console.log(file);
        // 获取图片的Url地址
        this.previewPath = file.response.data.url
        // console.log(this.imgUrl);
        // 显示预览框
        this.previewVisible = true
      },
      // 处理移除图片的操作
      handleRemove (file){
        // console.log(file);
        // 1,获取将要删除的图片的临时路径
        let filePath = file.response.data.tmp_path
        // 2.从pics数组中,找到这个图片对应的索引值
        let i = this.addFrom.pics.findIndex(x => x.pic === filePath)
        // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
        this.addFrom.pics.splice(i,1)
        console.log(this.addFrom);
      },
      // 监听图片上传成功的事件函数
      handleSuccess (response){
        // console.log(response);
        // 拼接得到一个图片信息对象
        let picInfo = { pic:response.data.tmp_path}
        // 将图片信息对象，依次添加到data定义的图片数组中
        this.addFrom.pics.push(picInfo)
        console.log(this.addFrom);
      },
      // 添加商品
      addGoods (){
        console.log(this.addFrom);
        // 预验证
        this.$refs.addFromRef.validate(async valid => {
          if(!valid) return this.$message.error('请填写必要的表单项')
          // 执行添加的业务逻辑
          // lodash 深拷贝表单对象
          let from = _.cloneDeep(this.addFrom)  
          from.goods_cat = from.goods_cat.join(',')
          // 处理attrs商品的参数
          // 动态参数
          this.manyTabelData.forEach(item => {    
            let newInfo = { 
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' '), 
            }
            this.addFrom.attrs.push(newInfo)
          })
          // 静态属性
          this.onlyTabelData.forEach(item => {    
             let newInfo = { 
              attr_id:item.attr_id,
              attr_value:item.attr_vals, 
            }
            this.addFrom.attrs.push(newInfo)
          })
          // 将表单对象中处理好的attrs商品参数，赋值给深拷贝的对象（from）的attrs，最后需要提交的时from对象
          from.attrs = this.addFrom.attrs
          console.log(from);
          // 发起请求添加商品,商品的名称必须是唯一的
          let { data:res } = await this.$http.post('goods',from)
          if(res.meta.status !== 201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      },
    },
    computed:{
      // 获取三级分类Id
      cateId (){
        if(this.addFrom.goods_cat.length === 3){
          return this.addFrom.goods_cat[2]
        }
      },
    },
  }
</script>

<style lang="less" scoped>

// 复选框组样式
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
// 图片预览样式
.previewImg {
  width: 100%;
}

// 商品内容面板的样式
.btnAdd {
  margin-top: 15px;
}
</style>
