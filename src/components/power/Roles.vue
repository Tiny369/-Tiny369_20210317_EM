<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column  type="expand" >
          <template v-slot:default="slotProps">  <!-- 使用作用域插槽 -->
            <el-row :class="['bdbottom',(i1 == 0 ? 'bdtop' : ''),'vcenter']" v-for="(item1,i1) in slotProps.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row :class="(i2 ==0 ?'':'bdtop','vcenter') " v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{slotProps.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column  label="#" type="index" ></el-table-column>
        <el-table-column  label="角色名称" prop="roleName" ></el-table-column>
        <el-table-column  label="角色描述" prop="roleDesc" ></el-table-column>
        <el-table-column  label="操作" width='300px'>
          <template slot-scope="scope">  <!-- 使用作用域插槽 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  <!-- 添加角色Dialog -->
  <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
    <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRoleInfo">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 编辑角色Dialog -->
  <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClosed">
    <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRoleInfo">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始数据保存角色列表的数组
      rolesList:[],
      // 控制添加角色对话框的显示与隐藏
      addRoleDialogVisible:false,
      // 添加角色的表单对象
      addRoleForm:{
        roleName:'',
        roleDesc:''
      },
      // 添加角色的表单验证规则
      addRoleFormRules:{
        roleName: [   // 角色名称规则
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [   // 角色描述规则
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
      },
      // 控制编辑角色对话框的显示与隐藏
      editRoleDialogVisible:false,
      // 查询到的角色信息对象
      editRoleForm:{},
      // 编辑角色的表单验证规则
      editRoleFormRules:{
        roleName: [   // 角色名称规则
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [   // 角色描述规则
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    // 创健实例后立即调用获取角色列表的方法
    this.getRolesList()
  },
  methods: {
    // 获取角色列表的监听事件
    async getRolesList (){
      // 发送请求获取角色列表
      let { data:res } = await this.$http.get('roles')
      // 根据状态码判断是否获取成功
      if(res.meta.status !== 200) return this.$message.error('角色列表获取失败!')
      // 获取成功赋值给初始的角色列表
      this.rolesList = res.data
      console.log(this.rolesList);
    },
    // 添加角色对话框的监听事件
    addRoleDialogClosed (){
      // 重置表单填写的数据
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加新角色的事件
    addRoleInfo (){
      // 预验证
      this.$refs.addRoleFormRef.validate(async valid=>{
        if(!valid) return
        // 发送添加角色的请求
        let { data:res } = await this.$http.post('roles',this.addRoleForm)
        // 根据状态码判断是否成功
        if(res.meta.status !== 201) return this.$message.error('角色添加失败!')
        this.$message.success('角色添加成功')
        // 关闭对话框
        this.addRoleDialogVisible = false
        // 刷新角色列表
        this.getRolesList()
      })
    },
    // 编辑角色对话框的点击事件
    async showEditRoleDialog (id){
      // 根据ID查询角色
      let { data:res } = await this.$http.get('roles/'+id)
      // 根据状态码判断是否成功
      if(res.meta.status !== 200 ) return this.$message.error('查询角色信息失败!')
      // 成功后将查询到的数据赋值给初始角色信息对象
      this.editRoleForm = res.data
      // 打开对话框
      this.editRoleDialogVisible = true
    },
    // 编辑角色对话框的监听事件
    editRoleDialogClosed (){
      // 重置表单填写的数据
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑角色成功后的事件
    editRoleInfo (){  
      // 预验证
      this.$refs.editRoleFormRef.validate(async valid=>{
        if(!valid) return
        // 发送修改角色的请求
        let { data:res } = await this.$http.put('roles/'+ this.editRoleForm.roleId,{
          roleName:this.editRoleForm.roleName,
          roleDesc:this.editRoleForm.roleDesc,
        })
        // 根据状态码判断是否成功
        if(res.meta.status !== 200 ) return this.$message.error('修改角色信息失败!')
        // 提示成功
        this.$message.success('修改角色信息成功')
        // 关闭对话框
        this.editRoleDialogVisible = false
        // 刷新角色列表
        this.getRolesList()
      })
    },
    // 删除角色的监听事件
    async removeRoleById (id){
      // 判断用户点击取消还是确定的回调
      let resfirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)  // 捕获点击取消时的异常
      // 判断用户是否点击取消按钮
      if(resfirm !== 'confirm') return this.$message.error('用户取消删除')
      // 发送删除角色的请求
      let { data:res } = await this.$http.delete('roles/'+id)
      // 根据状态码判断删除是否成功
      if(res.meta.status !== 200) return this.$message.error('删除角色失败!')
      // 提示删除角色成功
      this.$message.info('角色删除成功')
      // 刷新角色数据列表
      this.getRolesList()
    }

  },
}
</script>

<style lang="less" scoped>
  // 面包屑区域的样式
  .el-breadcrumb {
    margin-bottom: 15px;
  }
  // 卡片视图区域样式
  .el-card.box-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
  // 添加角色按钮区域样式
  .el-row {
    margin-bottom: 5px;
  }
  // tag标签样式
  .el-tag {
    margin: 7px;
  }
  // 顶部边框
  .bdtop {
    //  #eee
    border-top: 1px solid rgb(238, 8, 207);
  }
  // 底部边框
  .bdbottom {
    // #eee
    border-bottom: 1px solid rgb(238, 8, 207);
  }
  // 一级和二级权限列表的垂直/纵向居中
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>