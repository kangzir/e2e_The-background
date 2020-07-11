<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- //按钮 -->
      <el-button type="primary" @click="addClick">添加分类</el-button>
      <!-- 表格 -->
      <tree class="tree" :data="CategoriesInfo"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      :show-row-hover="false"
      border
      >
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-check isicon" v-if="scope.row.cat_deleted === false"></i>
        <i class="el-icon-close" v-else></i>
      </template>
      <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="success" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="warning" size="mini">二级</el-tag>
          <el-tag v-else type="danger" size="mini">三级</el-tag>
      </template>
      <template slot="opj" slot-scope="scope">
          <el-button @click="ModifyClass(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button @click="deleteCateg(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
      </tree>

            <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CategoriesList.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="CategoriesList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改 -->
    <el-dialog
      title="修改分类"
      :visible.sync="ModifyClassVisible"
      width="50%">
      <el-form :model="ModifyClassInof" ref="ModifyClassRef" label-width="70px">
        <el-form-item label="分类名称">
          <el-input @change="ModifyClassSub" v-model="ModifyClassInof.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ModifyClassVisible = false">取 消</el-button>
        <el-button type="primary" @click="ModifyClassSub">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="addClassifyVisible"
      width="50%"
      @close="ClassifyClose">
      <el-form :model="addClassifyInof" ref="addClassifyRef" label-width="70px">
        <el-form-item label="分类名称" prop="">
          <el-input v-model="addClassifyInof.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <el-cascader
            v-model="CascaderVal"
            :options="CategoricalDataList"
            :props="sdataProps"
            @change="handleChange"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addClassifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassifySub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name:'',
    data() {
      return {
        CategoriesList:{
          // type:null,
          pagenum:1,
          pagesize:5
        },
        total:0,
        CategoriesInfo:[],
        columns:[
          {
            label:'分类名称',
            prop:'cat_name'
          },
          {
            label:'是否有效',
            type:'template',
            template:'isok'
          },
          {
            label:'排序',
            type:'template',
            template:'order'
          },
          {
            label:'操作',
            type:'template',
            template:'opj',
          }
        ],
        ModifyClassVisible:false,
        // 选择的
        ModifyClassInof:{},
        //添加
        addClassifyVisible:false,
        addClassifyInof:{
          cat_pid:0,
          cat_name:'',
          cat_level:0
        },

        CascaderVal:[],
        sdataProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },
        CategoricalDataList:[]
      }
    },
    created() {
      this._getCategories()
    },
    methods: {
      _getCategories () {
        this.$http.get('categories',{params:this.CategoriesList}).then( res =>{
          this.CategoriesInfo = res.data.data.result
          this.total = res.data.data.total
        })
      },
      handleSizeChange(newsize){
        this.CategoriesList.pagesize = newsize
        this._getCategories()
      },
      handleCurrentChange(page){
        this.CategoriesList.pagenum = page
        this._getCategories()
      },
      // 删除
      deleteCateg(scope){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$http.delete('categories/'+scope.cat_id).then( res =>{
            console.log(res);
            this._getCategories()
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
      // 修改
      ModifyClass(scope){
        this.$http.get('categories/'+scope.cat_id).then( res =>{
          console.log(res);
          this.ModifyClassInof = res.data.data
        })
        this.ModifyClassVisible = true
      },
      // 修改提交
      ModifyClassSub(){
        console.log(this.ModifyClassInof);
        if(!this.ModifyClassInof.cat_name) return this.$message.error('请输入内容')
        this.$http.put('categories/'+this.ModifyClassInof.cat_id,{cat_name:this.ModifyClassInof.cat_name}).then( res =>{
          console.log(res);
          if(res.data.meta.status !== 200 )return this.$message.error('更新数据失败')
          this.$message.success(res.data.meta.msg)
          this.ModifyClassVisible = false
          this._getCategories()
        })
      },
      //添加分类 addClassifyVisible
      addClick(){
        this.$http.get('categories', { params: {type:2}}).then( res =>{
          this.CategoricalDataList = res.data.data
          console.log(this.CategoricalDataList);
        })
        this.addClassifyVisible = true
      },
      //添加分类提交
      addClassifySub() {
          console.log(this.addClassifyInof);
        if(!this.addClassifyInof.cat_name) return this.$message.error('请输入内容')

        this.$http.post('categories',this.addClassifyInof).then( res =>{
          console.log(res);
        this.addClassifyVisible = false
        this._getCategories()
        })
      },
       //关闭时重置内容
      ClassifyClose(){
        console.log('guanbile');
        console.log(this.$refs.addClassifyRef);
        // this.$refs.addClassifyRef.resetFields()
        this.CascaderVal =[]
        this.addClassifyInof.cat_level = 0
        this.addClassifyInof.cat_pid = 0
      },
      // 发生改变触发
      handleChange(){
        console.log(this.CascaderVal);
        if(this.CascaderVal.length > 0){
          this.addClassifyInof.cat_pid = this.CascaderVal[this.CascaderVal.length - 1]
          this.addClassifyInof.cat_level = this.CascaderVal.length
        }else{
          this.addClassifyInof.cat_pid = 0
          this.addClassifyInof.cat_level = 0
        }
      },
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
 .el-pagination{
   margin-top: 15px;
 }
 .tree{
   margin-top: 15px;
 }
 .isicon{
  background:rgb(30, 197, 0);
  color:#fff;
  border-radius: 50%;
 }
</style>