<template>
  <div class="login_container"> 
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
            <img src="../assets/wgw.jpg" alt="" title="login_logo">
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
                username:'admin',
                password:'123456'
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
        login (){
            this.$refs.loginFromRef.validate( async valid => {
                // 如果返回true则不发送登录请求
                if(!valid) return
                // 发送登录请求
                let { data:res } = await this.$http.post('login',this.loginForm)
                // 状态不为200则登录失败
                if(res.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功');
                /*  1.将登录成功之后的token,保存到客户端的sessionstorage中
                 *      1.1 项目中除了登录之外的其他API接口,必须在登录之后才能访问
                 *      1.2 token只应在当前网站打开期间生效,所以将token保存在sessionstorage中
                 */
                // console.log(res);
                window.sessionStorage.setItem('token_key',res.data.token)
                /*  2.通过编程式导航跳转到后台主页,路由地址是/home
                 */
                let token = window.sessionStorage.getItem('token_key')
                if(token){
                    setTimeout(() => {
                        this.$router.push('/home')
                    }, 2000);
                }
                

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
