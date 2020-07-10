<template>
  <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">权限一</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '1'">权限二</el-tag>
            <el-tag type="danger" v-else>权限三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
  export default {
    name:'rights',
    data() {
      return {
        rightsList:[]
      }
    },
    created() {
      this._getRightsList()
    },
    methods: {
      _getRightsList () {
        this.$http.get('rights/list').then( res =>{
          console.log(res);
          this.rightsList = res.data.data
        })
      }
    },
  }
</script>


<style scoped lang="less">
 .el-breadcrumb{
   margin-bottom: 15px;
 }
 .el-table{
   margin-top: 15px;
 }
</style>