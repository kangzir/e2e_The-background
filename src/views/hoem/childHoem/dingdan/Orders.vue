<template>
  <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="ordersInfo.query" clearable @clear="_getordersList">
          <el-button @click="_getordersList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="ordersList" border select>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column  width="100px" label="订单价格" prop="order_price"></el-table-column>
        <el-table-column width="100px" label="是否付款" prop="">
            <el-tag type="danger">未付款</el-tag>
        </el-table-column>
        <el-table-column width="50px" label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="alterSub(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="alterLogistics(scope.row)" type="success" icon="el-icon-s-flag" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="alterVisible"
      width="50%">
      <el-form ref="alterRef" :model="alterForm" label-width="80px">
        <el-form-item label="省市区/县">
            <el-cascader
            v-model="alterForm.values"
            :options="Provi"
            :props="alterProps"
            @change="handleChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="alterForm.name"></el-input>
        </el-form-item>
      </el-form>  
    </el-dialog>
    <!-- 物流 -->
    <el-dialog
      title="修改地址"
      :visible.sync="LogisticsVisible"
      width="50%">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in Logistics"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>


<script>
import Provi from'./city_data2017_element'
  export default {
    name:'orders',
    data() {
      return {
        // 请求体参数
        ordersInfo:{
          query:'',
          pagenum:1,
          pagesize:5
        },
        // 请求好的订单列表
        ordersList:[],
        // 总条数
        total:0,
        alterVisible : false,
        alterForm:{
          name:'',
          values:[]
        },
        alterProps:{
          label:'label',
          value:'value',
          children:'children',
          expandTrigger: 'hover',
        },
        Provi:Provi,
        LogisticsVisible:false,
        Logistics:[],
        reverse:true
      }
    },
    created () {
      this._getordersList()
    },
    methods: {
      _getordersList(){
        this.$http.get('orders',{params:this.ordersInfo}).then( res =>{
          this.ordersList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.ordersList);
          console.log(this.ordersInfo);
        })
      },
      // 一页显示多少条
      handleSizeChange(newsize){
        this.ordersInfo.pagesize = newsize
        this._getordersList()
      },
      // 反页
      handleCurrentChange(page){
        this.ordersInfo.pagenum = page
        this._getordersList()
      },
      alterSub(row){
        this.alterVisible = true
      },
      handleChange() {

      },
      alterLogistics(row){
        this.$http.get('/kuaidi/1106975712662').then( res =>{
          this.Logistics = res.data.data
          console.log(this.Logistics);
        })
        this.LogisticsVisible = true
      }
    }
  }
</script>


<style scoped lang="less">
.el-breadcrumb{
   margin-bottom: 15px;
 }
 .el-table{
   margin: 15px 0;
 }
</style>