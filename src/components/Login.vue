<template>
  <div class="login_container"> 
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="" title="login_logo">
        </div>
        <!-- 登录表单区域 -->
        <el-form ref="loginFromRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <!-- <el-input prefix-icon="el-icon-user-solid"></el-input> -->
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <!-- <el-input prefix-icon="el-icon-search"></el-input> -->
                <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
           <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary"  @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
        return {
            // 登录表单的数据绑定对象loginForm
            loginForm:{
                username:'',
                password:''
            },
            // 登录表单的验证规则对象loginFormRules
            loginFormRules:{
                username: [     // 用户名验证属性的规则
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [     // 密码验证属性的规则
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        // 重置登录表单的点击监听方法
        resetLoginForm (){
            this.$refs.loginFromRef.resetFields()
        },
        // 登录前的预验证的点击监听方法
        login() {
            this.$refs.loginFromRef.validate( async valid => {
                // 如果不为true不发登录请求
                if(!valid) return
                // 发送登录请求
                let { data:res } = await this.$http.post('login',this.loginForm)
                // 状态不为200登录失败
                if(res.meta.status !== 200) return console.log('登录失败');
                alert('登录成功');
            })
        }
    },
  }
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box {
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            padding: 10px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgb(165, 233, 148);
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #fff;
            }
        }
        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            .btns {
               display: flex;
               justify-content: flex-end; 
            }
        }
    }
</style>    
