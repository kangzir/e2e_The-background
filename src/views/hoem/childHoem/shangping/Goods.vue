<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="7">
          <!-- //输入框 -->
          <el-input @clear="cleardata" v-model="goodsInfo.query" placeholder="请输入商品内容" width="70px" clearable>
            <el-button @click="_getgoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      <!-- 按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="adduserCk">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表单 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column min-width="100px" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="100px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="100px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="ModifyData(scope.row)"></el-button>
            <el-button @click="deleteData(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改商品数据弹框 -->
    <el-dialog
      title="修改商品数据"
      :visible.sync="ModifyDataVisible"
      width="50%">
      <el-form :model="ModifyDataInof" ref="ModifyDataRef" label-width="70px">
        <el-form-item label="商品名称">
          <el-input v-model="ModifyDataInof.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)">
          <el-input v-model="ModifyDataInof.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="ModifyDataInof.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="ModifyDataInof.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ModifyDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="ModifyDataSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name:'goods',
    data() {
      return {
        goodsInfo:{
          query : '',
          pagenum : 1,
          pagesize : 5
        },
        goodsList:[],
        total:0,
        ModifyDataVisible:false,
        ModifyDataInof:{}
      }
    },
    created() {
      this._getgoodsList()
    },
    methods: {
      // 请求数据
      _getgoodsList(){
        this.$http.get('goods',{params:this.goodsInfo}).then( res=>{
          if(res.data.meta.status !== 200) return this.$message.error('获取列表失败')
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        })
      },
      // 清空搜索框重新请求数据
      cleardata(){
        this._getgoodsList()
      },
      //要显示多少条
      handleSizeChange(newsize){
        this.goodsInfo.pagesize = newsize
        this._getgoodsList()
      },
      // 要显示那一页
      handleCurrentChange(page){
        this.goodsInfo.pagenum = page
        this._getgoodsList()
      },
      // 修改数据获取
      ModifyData(slot){
        this.ModifyDataVisible = true
        this.$http.get('goods/'+slot.goods_id).then( res=>{
          // console.log(res);
          if(res.data.meta.status !== 200) return this.$message.error('获取失败')
          this.$message.success('获取成功')
          this.ModifyDataInof = res.data.data
          console.log(this.ModifyDataInof);
        })
      },
      // 修改数据提交
      ModifyDataSub(){
        this.$http.put('goods/'+this.ModifyDataInof.goods_id,this.ModifyDataInof)
        .then( res =>{
          // console.log(res);
          if(res.data.meta.status !== 200) return this.$message.error('修改商品参数失败')
          this.$message.success('修改商品参数成功')
          this._getgoodsList(),
          this.ModifyDataVisible = false
        })
      },
      //点击删除
      deleteData(scope){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
         this.$http.delete('goods/'+scope.goods_id).then( res =>{
           console.log(res);
           this._getgoodsList()
         })
        this.$message({
        type: 'success',
         message: '删除成功!'
        });
        return
        }).catch(() => {
        this.$message({
        type: 'info',
        message: '已取消删除'
        });
        });
      },
      //跳转到添加用户页面
      adduserCk(){
        this.$router.push('/goods/adduser')
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
 .el-table{
   font-size: 12px;
 }
</style>