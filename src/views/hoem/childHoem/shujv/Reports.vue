<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>

  </div>
</template>


<script>
// 1导入
import echarts from 'echarts'
import moduleName from 'lodash'
  export default {
    name:'Report',
    data () {
      return {
        option : {
          title: {
              text: ''
          },
          tooltip: {},
          legend: {
              data:['销量']
          },
          xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
    created() {
    },
    async mounted() {
      //3.挂载
      const myChart = echarts.init(document.getElementById('main'))
       const {data:res} = await this.$http.get('reports/type/1')
        //4数据内容
      const result = _.merge(res.data, this.option)
      //5.添加
      myChart.setOption(result);
    },
    methods: {
  }
  }
</script>


<style scoped lang="less">
.el-breadcrumb{
   margin-bottom: 15px;
 }
</style>