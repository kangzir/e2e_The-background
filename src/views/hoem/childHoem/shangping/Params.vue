<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <el-alert
        title="警告提示的文案"
        type="warning" :closable="false">
      </el-alert>
      <!-- 选择器 -->
        <p>选择商品分类：
          <el-cascader
          v-model="cartListKeys"
          :options="cartList"
          :props="cartListProps"
          @change="handleChange"
          clearable>
          </el-cascader>
        </p>
      <!-- Tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button class="Tabbtn" @click="addVisible= true" type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
          <el-table :data="manyTabdata" border >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" 
                :key="index" 
                closable
                @close="TabClose(index,scope.row)">
                {{item}}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" 
                size="small"
                @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="ModifyData(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button @click="remoData(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button class="Tabbtn" @click="addVisible= true" type="primary" size="mini"  :disabled="isDisabled">添加属性</el-button>
          <el-table :data="onlyTabdata" border >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="TabClose(index,scope.row)">{{item}}</el-tag>
                 <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" 
                size="small"
                @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="ModifyData(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button @click="remoData(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 弹框 -->
    <el-dialog
      :title="'添加'+isTitle"
      :visible.sync="addVisible"
      width="50%"
      @close="addClose">
      <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="100px">
        <el-form-item :label="isTitle" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSub">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog
      :title="'修改'+isTitle"
      :visible.sync="ModifyVisible"
      width="50%"
      @close="ModifyClose">
      <el-form :model="ModifyForm" ref="ModifyFormRef" :rules="ModifyRules" label-width="100px">
        <el-form-item :label="isTitle" prop="attr_name">
          <el-input v-model="ModifyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="ModifySub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name:'',
    data() {
      return {
        // 请求的数据
        cartList:[],
        //选择的内容
        cartListKeys:[],
        // 配置练级内容
        cartListProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },
        // Tabs默认显示
        activeName:'many',

        manyTabdata:[],
        onlyTabdata:[],
        addVisible:false,

        addForm:{
         cat_name:'' 
        },
        addRules:{
          cat_name:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        },
        ModifyRules:{
          attr_name:[
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        },
        ModifyVisible : false,
        ModifyForm : {},
        valsArr:[]
      }
    },
    created() {
      this._getcartList()
    },
    methods: {
      _getcartList(){
        this.$http.get('categories').then( res =>{
          this.cartList = res.data.data
        })
      },
      _getMOlist(){
        this.$http.get(`categories/${this.caetId}/attributes`,{params:{sel:this.activeName}}).then( res =>{
           res.data.data.forEach( item =>{
             item.inputVisible = false
             item.inputValue = ''
             item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
           })
          console.log(res.data.data);
          if(this.activeName === 'many'){
             this.manyTabdata = res.data.data
          }else if(this.activeName === 'only'){
             this.onlyTabdata = res.data.data
          }
        })
      },
      //练级发生改变是触发
      handleChange(){
        // console.log(this.cartListKeys);
        if(this.cartListKeys.length !== 3){
          this.cartListKeys = []
          this.manyTabdata = []
          this.onlyTabdata = []
          return
        }else{

        }
        this._getMOlist()
      },
      // Tab点击切换时候触发
      handleTabClick(){
        console.log(this.activeName);
          this._getMOlist()
      },
      addClose(){
        this.$refs.addFormRef.resetFields()
      },
      //<!-- 添加添加 -->
      addSub(){
        this.$refs.addFormRef.validate( valid =>{
          console.log(valid);
          if(valid === false) return
          this.$http.post(`categories/${this.caetId}/attributes`,{
            attr_name:this.addForm.cat_name,
            attr_sel:this.activeName
          }).then( res =>{
            console.log(res);
            this.addVisible = false
            this._getMOlist()
          })
        })
      },
      //删除
      remoData (scope) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
        this.$http.delete(`categories/${scope.cat_id}/attributes/${scope.attr_id}`).then( res =>{
        console.log(res);
        this._getMOlist()
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
      ModifyData (scope) {
        this.$http.get(`categories/${scope.cat_id}/attributes/${scope.attr_id}`,{params : {attr_sel:this.activeName}}).then( res=>{
          this.ModifyForm = res.data.data
          console.log(this.ModifyForm);
        })
        this.ModifyVisible = true
      },
      // 提交修改
      ModifySub(){
        this.$refs.ModifyFormRef.validate( valid => {
          console.log(valid);
          if(valid === false) return 
          this.$http.put(`categories/${this.ModifyForm.cat_id}/attributes/${this.ModifyForm.attr_id}`,this.ModifyForm).then( res =>{
            // console.log(res);
            this.ModifyVisible = false
            this._getMOlist()
          })
        })
      },
      ModifyClose(){

      },

      handleInputConfirm(row) {
        if(row.inputValue.trim().length === 0){
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue)
        row.inputValue = ''
        row.inputVisible = false
        this._PUT(row)
      },
      _PUT(row){
        this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }).then( res =>{
          console.log(res);
        })
      },
      showInput(scope){
        scope.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //点击Tab删除
      TabClose(index,row){
        console.log(index);
        row.attr_vals.pop(index)
        this._PUT(row)
      }
    },
    computed: {
      isDisabled(){
        if(this.cartListKeys.length !== 3 ){
          return true
        }
        return false
      },
      // 当前选中的id
      caetId () {
        if(this.cartListKeys.length === 3){
          return this.cartListKeys[2]
        }
          return
      },
      isTitle(){
        if(this.activeName === 'many'){
          return '动态参数'
        }else{
          return '静态属性'
        }
      },
    }
  }
</script>


<style scoped lang="less">
 .el-breadcrumb{
   margin-bottom: 15px;
 }
 .el-cascader{
   margin-top: 15px;
 }
 .el-tabs{
   margin-top: 15px;
 }
 .Tabbtn{
   margin-bottom: 15px;
 }
 .input-new-tag{
   width: 100px;
 }
    .el-tag{
     margin: 0 10px;
   }
</style>