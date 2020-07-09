<template>
    
  <el-container>
    <!-- 头部 -->
  <el-header>
    <div>
      <img src="../../assets/logo.png" alt="">
      <span>电商管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
  <!-- 左侧 -->
    <el-aside :width="isColl?'64px':'200px'">
      <div class="tobtn-box">
        <el-button @click="tggleCol" class="tobtn">|||</el-button>
      </div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409bff"
      :unique-opened="true"
      :collapse="isColl"
      :collapse-transition="false"
      :router="true"
      :default-active="isGang">
        <el-submenu :index="item.id + ''" v-for="(item) in menuslist" :key="item.id">
          <template slot="title">
            <i :class="icons[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
            <!-- 子菜单 -->
            <el-menu-item 
              :index="'/'+chiitem.path" 
              v-for="(chiitem) in item.children" 
              :key="chiitem.id"
              @click="ziClick('/'+chiitem.path)"
            >
               <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{chiitem.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 主体内容块 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>


<script>
  export default {
    name:'hoem',
    data() {
      return {
        menuslist:{},
        icons:{
          '125':'iconfont icon-yonghu1',
          '103':'iconfont icon-kongjianfenxi',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        },
        isColl:false,
        isGang:''
      }
    },
    created() {
      this._getMenus()
      // 页面创造之前把token中的高亮内容赋给data中的isGang
      // this.isGang = window.sessionStorage.getItem('active')
      this.isGang = window.sessionStorage.getItem('active')
    },
    methods: {
      //退出当前账号
      logout(){
        //清除本地(token)缓存
        window.sessionStorage.clear(),
        // 跳转的登录页面
        this.$router.replace('/login')
      },
      //请求列表详情数据
      _getMenus(){
        let data = {}
        this.$http.get('menus').then( res =>{
          data = res.data
              // 数据获取失败提示 
          if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
              //成功把值赋给data的menuslist
          this.menuslist = data.data
        })
      },
      // 显示隐藏侧边栏
      tggleCol(){
        this.isColl = !this.isColl
      },
      // 点击高亮效果修复
      ziClick(active){
        console.log(active);
        // 传过来的值保存到sessionStorage中
        window.sessionStorage.setItem('active',active)

        this.isGang = active
      }
    },
  }
</script>


<style scoped lang="less" type="text/less">
.el-container{
  height: 100%;
}
 .el-header{
   background-color: #373d41;
   display: flex;
   justify-content: space-between;
   align-items: center;
   div{
     display: flex;
     img{
       width: 50px;
     }
     span{
       font-size: 20px;
       color: #f6f6f6;
       align-self: center;
       margin-left: 10px;
     }
   }
 }
 .el-aside{
   background-color: #333744;
 }
 .el-main{
   background-color: #eaedf1;
   border-radius: 0;
 }
 .iconfont {
   margin-right: 5px;
 }
 .tobtn-box{
   background-color: rgb(104, 104, 104);
   text-align: center;
   padding: 5px 0;
 }
 .tobtn{
   text-align: center;
   color: #fff;
  //  cursor: pointer;
   background-color: rgb(104, 104, 104);
   border: none;
   width: 100%;
   letter-spacing: 3px;
 }
</style>