<template>
  <div>
    <!-- <h2>my Hoem</h2> -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>


<script>
  export default {
    name:'hoem',
    methods: {
      logout(){
        window.sessionStorage.clear(),
        this.$router.replace('/login')
      }
    },
  }
</script>


<style scoped lang="less">

</style>