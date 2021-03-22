<template>
  <div class="login_container"> 
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="" title="login_logo">
        </div>
        <!-- 登录表单区域 -->
        <el-form label-width="0" class="login_form">
            <!-- 用户名 -->
            <el-form-item>
                <el-input ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item>
                <el-input ></el-input>
            </el-form-item>
           <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary">登录</el-button>
                <el-button type="info">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
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
