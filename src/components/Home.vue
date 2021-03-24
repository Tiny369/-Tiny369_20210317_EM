<template>
  <div>
    <el-button type="info"  @click="logout">退出</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      // 退出点击事件
      logout (){
        window.sessionStorage.clear()
        let token = window.sessionStorage.getItem('token_key')
        if(!token) {
          setTimeout(() => {
            this.$router.push({path:'/login'})
          }, 1000);
        }
        
      }
    },
  }
</script>

<style scoped>

 
</style>
