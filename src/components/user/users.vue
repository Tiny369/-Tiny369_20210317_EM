<template>
  <div>
    
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
       <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">  
          <!-- 使用作用域插槽 slot-scope="slotProps" / v-slot:default="slotProps"-->
          <template v-slot:default="slotProps"> <!-- 获取该行的所有数据 {{slotProps.row}} -->
            <el-switch v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope"> 
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFormRef" 
      label-width="70px" class="demo-ruleForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addDialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框区域 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" 
      label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo" >确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      // 验证邮箱的自定义规则
      let checkEmail = (rule, value, callback)=>{
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){    // 合法的邮箱
          return callback() 
        }else{
          callback(new Error('请输入合法的邮箱'))
        }
      }
      // 验证手机号的自定义规则
      let checkMobile = (rule, value, callback)=>{
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){     // 合法的手机号
          return callback()
        }else{
          callback(new Error('请输入合法的手机号'))
        }
      }
      return {
        // 获取用户列表的参数对象
        queryInfo:{
          query:'', // 查询参数
          pagenum:1,  // 当前页码
          pagesize:2  // 当前每页显示的条数
        },
        // 初始数据保存用户列表
        userlist:[],
        // 初始数据保存总数
        total:0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible:false,
        // 添加用户的表单对象
        addFrom:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        // 添加表单的验证规则对象
        addFromRules:{
          username: [   // 用户名规则
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [   // 密码规则
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [   // 邮箱规则 -- 自定义
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [   // 手机号规则 -- 自定义
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
        // 控制修改用户对话框的显示与隐藏 
        editDialogVisible:false,
        // 查询到的用户信息对象
        editForm:{},
        // 修改表单的验证规则对象
        editFormRules:{
          email: [    
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }  // 邮箱自定义规则 -- 
          ],
          mobile: [   
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }  // 手机号自定义规则 -- 
          ],
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 获取用户列表事件方法
      async getUserList (){
        // 发送请求获取数据
        let {data:res} = await this.$http.get('users',{
          params:this.queryInfo
        })
        if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        // 将获取到的用户列表赋给userlist
        this.userlist = res.data.users
        // 将获取到的总数量赋给total
        this.total = res.data.total
        console.log(res);
      },
      // 监听 pagsize 改变的事件
      handleSizeChange (newSize){
        // console.log(newSize);
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange (newPage){
        // console.log(newPage);
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听 switch 开关状态的事件
      async userStateChanged (newUserInfo){ // newUserInfo新状态的值
        // 发请求用于操作更改服务器数据
        let { data:res } = await this.$http.put(`users/${newUserInfo.id}/state/${newUserInfo.mg_state}`)
        if(res.meta.status !== 200){
          // 如果更新失败返回上一次的状态
          newUserInfo.mg_state = !newUserInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
        // console.log(res);
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed (){
        // 重置表单 - resetFields()
        this.$refs.addFormRef.resetFields()
      },
      // 添加新用户的点击事件
      addUser (){
        this.$refs.addFormRef.validate(async valid=>{
          // console.log(valid);
          if(!valid) return
          // 发送添加用户的请求
          let { data:res } = await this.$http.post('users',this.addFrom)
          if(res.meta.status != 201) return this.$message.error('用户添加失败')
          this.$message.success('用户添加成功');
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表的数据
          this.getUserList()
        })
      },
      // 展示编辑用户的对话框的点击事件
      async showEditDialog (id){
        // 发送查询请求
        let { data:res } = await this.$http.get('users/' + id)
        if(res.meta.status != 200) return this.$message.error('查询用户信息失败')
        console.log(res);
        // 查询到的数据赋值给用户对象
        this.editForm = res.data
        // 修改状态用于展示对话框
        this.editDialogVisible = true
      },
      // 修改用户对话框的关闭的点击事件
      editDialogClosed (){
        this.$refs.editFormRef.resetFields()
      },
      // 修改用户信息并提交的点击事件
      editUserInfo (){
        this.$refs.editFormRef.validate(async valid=>{    //  预验证
          if(!valid) return
          // 发起修改用户信息的请求，传对应的参数（所有参数都应保存在查询到的用户信息对象里）
          let { data:res } = await this.$http.put('users/'+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          // 判断状态码不为200提示更新失败
          if(res.meta.status != 200) return this.$message.error('更新用户信息失败')
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新用户列表数据
          this.getUserList()
          // 提示修改成功
          this.$message.success('更新用户信息成功');
        })
      }
    },
  }
</script>

<style lang="less" scoped>
 
</style>
