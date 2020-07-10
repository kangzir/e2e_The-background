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
      <el-row :gutter="25">
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="_getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="_getUsersList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
           <el-button type="primary" @click="addForm">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="users" style="width: 100%" border stripe >
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="uses">
            <el-switch v-model="uses.row.mg_state" @change="tggchange(uses.row)"></el-switch> 
          </template>
        </el-table-column>

        <el-table-column prop="" label="操作" width="180px">
          <template v-slot:default="uses">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogForm(uses.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(uses.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum*1"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total*1">
        </el-pagination>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="qingkong">
      <span>
        <el-form 
         ref="addFormsRef" 
         :model="addForms"
         label-width="80px"
         :rules="addFormsRules"
         >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForms.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForms.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForms.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForms.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validation">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的模态框 -->
    <el-dialog
      title="修改内容"
      :visible.sync="ModifyForm"
      width="50%"
      @close="ModifyClose">
      <span>
        <el-form :model="ModifyFormInfo" :rules="ModifyFormRules" ref="ModifyFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="ModifyFormInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ModifyFormInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ModifyFormInfo.email"></el-input>
          </el-form-item>
        </el-form>          
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ModifyForm = false">取 消</el-button>
        <el-button type="primary" @click="validModifyForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'users',
    data() {
      // 自定义邮箱验证规则
      let checkEmail = (rule, value, callback) =>{
        const regEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
        if(regEmail.test(value)){
          callback()
        }else{
          callback(new Error('请正确的邮箱'))
        }
      }
      // 自定义手机号验证规则
      let checkMobile = (rule, value, callback) =>{
        const regMobile = /^((\(\d{2,3}\))|(\d{3}\-))?1(3|5|8|9)\d{9}$/
        if(regMobile.test(value)){
          callback()
        }else{
          callback('请输入正确的手机号')
        }
      }
      return {
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2
        },
        users:[],
        pagenum:'',
        total:'',
        dialogVisible:false,
        //添加用户
        addForms:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        //添加用户规则
        addFormsRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator : checkEmail, trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机柜', trigger: 'blur' },
            { validator : checkMobile, trigger: 'blur' }
          ],
        },
        ModifyForm:false,
        //获取修改用户的内容
        ModifyFormInfo:{},
        //修改用户的规则
        ModifyFormRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator : checkEmail, trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机柜', trigger: 'blur' },
            { validator : checkMobile, trigger: 'blur' }
          ],
        }
      }
    },
    created () {
      this._getUsersList()
    },
    methods: {
      _getUsersList(){
        let data = {}
        this.$http.get('users',{params:this.queryInfo}).then( res =>{
          data = res.data
          // console.log(data);
          if(data.meta.status !== 200){
            this.$message.error(data.meta.msg)
          }else{
            this.users = data.data.users
            this.pagenum = data.data.pagenum
            this.total = data.data.total
          }
        })
      },
      // 一页显示多少条
      handleSizeChange(newsize){
        // console.log(newsize);
        this.queryInfo.pagesize = newsize
        this._getUsersList()
      },
      // 点击页码切换
      handleCurrentChange(newpage){
        // console.log(newpage);
        this.queryInfo.pagenum = newpage
        this._getUsersList()
      },
      // 修改状态
      tggchange (userInfo) {
        // console.log(userInfo);
        this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then( res =>{
          console.log(res);
          if(res.data.meta.status !== 200){
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('修改状态失败')
          }
            this.$message.success('修改状态成功')
        })
      },
      // 点击弹出模态框
      addForm(){
        this.dialogVisible = true
      },
      // 关闭模态框清空里面的内容
      qingkong(){
        this.$refs.addFormsRef.resetFields()
      },
      //点击提交验证
      validation(){
        this.$refs.addFormsRef.validate( valid =>{
          // console.log(valid);
          // 规则合法进行下一步请求
          if(valid == false) return
          //发送添加请求
          this.$http.post('users',this.addForms).then( res =>{
            console.log(res);
            // 请求失败提示
            if(res.data.meta.status !== 201) return this.message.error('添加用户失败')
            //请求成功
            this.dialogVisible = false
            this._getUsersList()
          })
        })
      },

      // 获取修改的内容
      dialogForm(id){
        this.ModifyForm = true
        this.$http.get('users/'+id).then( res =>{
          console.log(res);
          if(res.data.meta.status !== 200){
            this.$message.error('获取失败')
          }else{
            this.$message.success('获取成功')
            this.ModifyFormInfo = res.data.data
          }
        })
      },
      // 关闭修改的模特清空内容
      ModifyClose(){
        this.$refs.ModifyFormRef.resetFields()
      },
      // 修改的提交验证
      validModifyForm(){
        this.$refs.ModifyFormRef.validate( valid =>{
          // console.log(valid);
          if(valid === false){
            return this.$message.error('格式错误,请输入正确的格式')
          }else{
            this.$http.put('users/'+this.ModifyFormInfo.id,
            {email:this.ModifyFormInfo.email,
            mobile:this.ModifyFormInfo.mobile}).then( res =>{
              console.log(res);
              if(res.data.meta.status !== 200){
                return this.$message.error('更新失败')
              }else{
                this.$message.success(res.data.meta.msg)
                this.ModifyForm = false
                this._getUsersList()
              }
            })
          }

        })
      } ,
      //删除用户
      deleteUser (id) {
         this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
          this.$http.delete('users/'+id).then( res =>{
            this._getUsersList()
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