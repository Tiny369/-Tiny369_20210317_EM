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
          <el-cascader class="opt_cascader" v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many" >
          <el-button type="primary" size="mini" 
            :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" 
            :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性对话框 -->
    <el-dialog :title=" `添加${titleText}` " :visible.sync="addDialogVisible" 
      width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" 
        ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数/属性对话框 -->
    <el-dialog :title=" `修改${titleText}` " :visible.sync="editDialogVisible" 
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" 
        ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

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
        selectedCateKeys:[],
        // 被激活的页签的名称
        activeName:'many',
        // 动态参数的数据
        manyTableData:[],
        // 静态属性的数据
        onlyTableData:[],
        // 控制添加参数/属性对话框的显示与隐藏
        addDialogVisible:false,
        // 添加参数的表单对象
        addForm:{
          attr_name:''
        },
        // 表单验证规则
        addFormRules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        },
        // 控制修改参数/属性对话框的显示与隐藏
        editDialogVisible:false,
        // 修改参数的表单对象
        editForm:{},
        // 修改表单的验证规则对象
        editFormRules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        },
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
        if(res.meta.status !== 200) return this.$message.error('获取商品分类数据列表失败')
        // 将获取到的商品分类列表数据保存给data
        this.cateList = res.data
        // console.log(this.cateList);
      },
      // 级联选择器选择项发生变化，触发这个函数
      handleChange (){
        this.getParamsData()
      },
      // tab 页签点击件的处理函数
      handleTabClick (){
        // console.log(this.activeName);
        this.getParamsData()
      },
      // 获取参数列表数据
      async getParamsData (){
        // 证明选中的不是三级分类
        if(this.selectedCateKeys.length !== 3){
          this.selectedCateKeys = []
          return
        }
        // 证明选中的是三级分类
        // console.log(this.selectedCateKeys)
        // 发送获取参数列表的请求； 根据所选分类的id，和当前所处的面板，获取对应的参数
        let { data:res } =  await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{ sel:this.activeName }
        })
        if(res.meta.status !== 200) return this.$message.error('参数列表获取失败')
        // console.log(res.data);
        // 获取到的数据进行判断是动态的还是静态的
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }
      },
      // 关闭对话框的监听事件
      addDialogClosed (){
        // 重置表单项
        this.$refs.addFormRef.resetFields()
      },
      // 点击确定按钮，添加参数/属性的事件函数
      addParams (){
        // 预验证
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          // 发送添加参数/属性的请求，注意参数
          let { data:res } = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status !== 201) return this.$message.error('添加参数失败！')
          // 提示成功
          this.$message.success('添加参数成功！')
          // 刷新列表
          this.getParamsData()
          // 关闭对话框
          this.addDialogVisible = false
        })
      },
      // 编辑参数按钮的点击事件
      async showEditDialog (attr_id){
        // 发请求，根据 ID 查询参数，注意参数
        let { data:res } =  await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        // 将获取的数据保存在data中
        this.editForm = res.data
        // console.log(this.editForm);
        // 显示对话框
        this.editDialogVisible = true
      },
      // 点击确定，提交修改参数的事件函数
      editParams (){
        // 预验证
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return
          // 发送编辑提交参数的请求，注意参数
          let { data:res } =  await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status !== 200) return this.$message.error('修改参数名失败')
          // 提示成功
          this.$message.success('修改参数名成功！')
          // 刷新列表
          this.getParamsData()
          // 关闭对话框
          this.editDialogVisible = false
        })
      },
      // 监听修改参数对话框的关闭事件函数
      editDialogClosed (){
        // 重置表单项
        this.$refs.editFormRef.resetFields()
      },
      // 点击删除按钮删除参数的事件
      async removeParams (attr_id){
        // 删除的弹框提示，全局挂载的弹框属性
        let resfirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)    // 异常必须捕获
        // 判断用户操作
        if(resfirm !== 'confirm') return this.$message.info('用户取消删除')
        // 发送 删除参数的请求，注意参数
        let { data:res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        // 根据响应状态码给出提示
        if(res.meta.status !== 200) return this.$message.error('删除参数失败')
        // 提示成功
        this.$message.success('删除参数成功')
        // 刷新参数列表
        this.getParamsData()
      },
       
    },
    computed:{
      // 如果按钮需要被禁用，返回true；否则返回false
      isBtnDisabled (){
        if(this.selectedCateKeys.length !== 3) return true
        return false
      },
      // 当前选中的三级分类Id
      cateId (){
        if(this.selectedCateKeys.length === 3){
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 定义添加对话框，提示的文本
      titleText (){
        if(this.activeName === 'many'){
          return '动态参数'
        }
        return '静态属性'
      }
    }
  }
</script>

<style lang="less" scoped>
/* 选择商品分类区域样式 */
.cat_opt {
  margin: 15px 0;
  font-size: 15px;
}
.opt_cascader {
  width: 25%;
}
</style>
