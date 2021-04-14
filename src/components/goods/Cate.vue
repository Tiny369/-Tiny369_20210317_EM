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
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      
      <!-- 表格 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
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
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCateShow(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 8, 15]"
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类对话框区域 -->
    <el-dialog  title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类表单区域 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
          <!-- 级联选择器 -->
          <!-- v-model：选中的值 options：用来指定数据源 props:用来指定配置对象 @change：当选中节点变化时触发-->
          <el-cascader v-model="selectedKeys" :options="parentCateList" 
            :props="cascaderProps" @change="parentCateChange" clearable >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框区域 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisibled" width="50%" >
      <el-form :model="editCateForm" :rules="editCateFormRules" 
          ref="editCateFormRef" label-width="150px" class="demo-ruleForm">
        <el-form-item label="当前分类名称：" prop="cat_name" >
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisibled = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>

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
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible:false,
        // 添加分类的表单数据对象
        addCateForm:{
          cat_pid:0,  // 父级分类的Id
          cat_name:'',  // 要添加的分类名称
          cat_level:0   // 分类的等级，默认要添加的是1级分类
        },
        // 添加分类表单的验证规则对象
        addCateFormRules:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        // 父级分类的数组列表 
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps: {
          checkStrictly: true,  // 可选择任意一级选项
          expandTrigger: 'hover', // 触发方式
          value:'cat_id', // 选项的值
          label:'cat_name', // 选项标签
          children:'children' // 选项的子选项
        },
        // 选中的父级分类的Id数组
        selectedKeys:[],
        // 控制点击编辑框的显示与隐藏
        editCateDialogVisibled:false,
        // 查询到的数据列表对象
        editCateForm:{},
        // 编辑分类框的验证规则
        editCateFormRules:{
          cat_name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
          ]
        },
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
        // console.log(res.data);
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
      },
      // 点击按钮显示添加分类对话框
      showAddCateDialog (){
        // 调用获取父级分类数据列表的方法
        this.getParentCateList()
        // 显示对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      async getParentCateList (){
        // 发送获取父级分类数据的请求
        let { data:res } =  await this.$http.get('categories',{
          params:{ type:2 } // 只获取一级和二级
        })
        // 根据响应状态码判断，提示
        if(res.meta.status !== 200) this.$message.error('父级分类数据获取失败')
        // 将获取到的父级分类数据保存给data
        this.parentCateList = res.data
        console.log(this.parentCateList);
      },
      // 选择项发生变化触发这个函数
      parentCateChange (){
        // 如果selectedkeys数组中的length大于0,证明选中了父级分类 ; 反之,就说明没有选中任何父级分类
        if(this.selectedKeys.length > 0){
          // 父级分类Id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          // 当前分类的等级
          this.addCateForm.cat_level = this.selectedKeys.length
        }else{
          // 父级分类Id
          this.addCateForm.cat_pid = 0
          // 当前分类的等级
          this.addCateForm.cat_level = 0
        }
        // console.log(this.selectedKeys);
      },
      // 点击按钮，添加新的分类
      addCate (){
        // 预验证
        this.$refs.addCateFormRef.validate(async valid=>{
          if(!valid) return
          // 发送添加分类请求，参数填写
          let { data:res } = await this.$http.post('categories',this.addCateForm)
          // 根据响应的状态码给出提示
          if(res.meta.status !== 201) return this.$message.error('添加分类失败！')
          // 提示成功
          this.$message.success('添加分类成功！')
          // 刷新列表
          this.getCateList()
          // 关闭对话框
          this.addCateDialogVisible = false
        })
        // console.log(this.addCateForm);
      },
      // 监听对话框的关闭事件，重置表单数据
      addCateDialogClosed (){
        // 重置表单
        this.$refs.addCateFormRef.resetFields()
        // 重置选中父级分类的Id数组
        this.selectedKeys = []
        // 重置父级id
        this.addCateForm.cat_pid = 0
        // 重置分类等级
        this.addCateForm.cat_level = 0
      },
      // 点击显示编辑框事件
      async editCateShow (id){
        // 发送请求根据Id查询分类
        let { data:res } = await this.$http.get('categories/'+id)
        if(res.meta.status !== 200) return this.$message.error('获取分类数据失败')
        // 获取到的数据保存到data中
        this.editCateForm = res.data
        // console.log(this.categories);
        // 显示编辑分类对话框
        this.editCateDialogVisibled = true
      },
      // 点击确定按钮修改名称
      editCateInfo (){
        // 预验证
        this.$refs.editCateFormRef.validate(async valid=>{
          if(!valid) return
          // 送编辑提交分类的请求，注意参数
          let { data:res} = await this.$http.put('categories/'+ this.editCateForm.cat_id,{
            cat_name:this.editCateForm.cat_name
          })
          if(res.meta.status !== 200) return this.$message.error('修改分类名称失败')
          this.$message.success('修改分类名称成功')
          // 刷新分类列表
          this.getCateList()
          // 关闭对话框
          this.editCateDialogVisibled = false
        })
      },
      // 删除当前分类
      async deleteCate (id){
        // 删除的弹框提示，全局挂载的弹框属性
        let resfirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)    // 异常必须捕获
        // 判断用户操作
        if(resfirm !== 'confirm') return this.$message.info('用户取消删除')
        // 发送删除当前分类的请求，注意参数
        let { data:res } = await this.$http.delete('categories/'+id)
        // 根据响应状态码给出提示
        if(res.meta.status !== 200) return this.$message.error('删除分类失败')
        // 提示成功
        this.$message.success('删除分类成功')
        // 刷新分类列表
        this.getCateList()
      }
    },
  }
</script>

<style lang="less" scoped>
// 第三方插件-表格样式
.treeTable {
  margin-top: 15px;
}
// 级联选择器样式
.el-cascader {
  width: 100%;
}

</style>
