<template>
  <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand" prop="roleName">
          <template slot-scope="scope">
            <el-row class="quanx1" v-for="(item) in scope.row.children" :key="item.id">
              <!-- //第一权限 -->
              <el-col :span="5"><el-tag @close="deletequanx(scope.row,item.id)" closable>{{item.authName}} <i class="el-icon-caret-right"></i></el-tag>
                    
              </el-col>
              <!-- //第二三权限 -->
              <el-col :span="15" id="biank">
                <el-row  :class="{bort:index===0}" v-for="(item1,index) in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag @close="deletequanx(scope.row,item1.id)" closable type="success">{{item1.authName}}<i class="el-icon-caret-right"></i></el-tag>
                  </el-col>
                  <el-col :span="14">
                    <!-- 三权限 -->
                    <el-row id="item1"  v-for="(item2) in item1.children" :key="item2.id">
                      <el-col>
                        <el-tag @close="deletequanx(scope.row,item2.id)" closable type="warning">{{item2.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
              <el-col></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="ModifyRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
            <el-button @click="Grant(scope.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限树分配 -->
    <el-dialog
      title="提示"
      :visible.sync="GrantVisible"
      width="50%"
      @close="GrantVisibleClose">
      <el-tree
        :data="GrantList"
        :props="GrantProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="GrantVisibleRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GrantVisible = false">取 消</el-button>
        <el-button type="primary" @click="GrantVisiblebao">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%">
      <el-form ref="addRoleRef" :model="addRoleInfo" label-width="80px">

        <el-form-item label="角色名称">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>

      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleVisibleMo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //编辑角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="ModifyRoleVisible"
      width="50%"
      @close="ModifyRoleClose">
      <el-form ref="ModifyRoleRef" :model="ModifyRoleInfo" :rules="ModifyRoleRules" label-width="80px">

        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="ModifyRoleInfo.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ModifyRoleInfo.roleDesc"></el-input>
        </el-form-item>

      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="ModifyRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="ModifyRoleInfoMo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name:'roles',
    data() {
      return {
        rolesList:[],
        GrantVisible:false,
        GrantList:[],
        GrantProps:{
          children: 'children',
          label: 'authName'
        },
        defKeys:[],
        refId:null,
        addRoleVisible:false,

        addRoleInfo:{
          roleName:'',
          roleDesc:''
        },
        ModifyRoleInfo:{},
        ModifyRoleVisible:false,
        ModifyRoleRules:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          roleDesc:[
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this._getRolesList()
    },
    methods: {
      //添加角色
      addRole(){
        this.addRoleVisible = true

      },
      addRoleVisibleMo (){

        this.$refs.addRoleRef.resetFields()

        this.$refs.addRoleRef.validate( valid=>{
          console.log(valid);
          if(valid === false){
            return 
          }else{
            this.$http.post('roles',this.addRoleInfo).then( res =>{
              console.log(res);
              if(res.data.meta.status!==201) return
              this.$message.success('添加角色成功')
              this.addRoleVisible = false
              this._getRolesList()
            })
          }
        })

      },
      //删除角色
      deleteRole(scope){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.$http.delete('roles/'+scope.id).then( res =>{
              console.log(res);
              this._getRolesList()
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
      //获取角色
      ModifyRole(node){
        this.ModifyRoleVisible = true
        this.$http.get('roles/'+node.id).then(res =>{
          console.log(res);
          if(res.data.meta.status !== 200 )return this.$message.error('获取角色失败')
          this.$message.success(res.data.meta.msg)
          this.ModifyRoleInfo = res.data.data
        })
      },
      //修改角色
      ModifyRoleInfoMo(){
        this.$refs.ModifyRoleRef.validate(valid =>{
          if(valid === false){
            return
          }else{
            this.$http.put('roles/'+this.ModifyRoleInfo.roleId,this.ModifyRoleInfo).then( res=>{
              console.log(res);
              this.ModifyRoleVisible = false
              this._getRolesList()
            })
          }
        })
      },
      // 关闭编辑角色模态框清空内容
      ModifyRoleClose(){
        this.$refs.ModifyRoleRef.resetFields()
      },      
      // 获取数据
      _getRolesList () {
        this.$http.get('roles').then( res =>{
          this.rolesList = res.data.data
          // console.log( this.rolesList);
        })
      },
      // 点击删除
      deletequanx(scope,id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${scope.id}/rights/${id}`).then( res =>{
            console.log(res);
            scope.children = res.data.data
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
      // 获取权限树
      Grant(scope){
        this.refId = scope.id
        this.$http.get('rights/tree').then( res =>{
          this.GrantList = res.data.data
          if(res.data.meta.status!==200) return this.$message.error('获取权限列表失败')
            this.$message.success('获取权限列表成功')
            // 使用递归函数
            this.getGrantVisible(scope,this.defKeys)
            console.log(this.GrantList);
        })
        this.GrantVisible = true
      },
      // 关闭当然弹框清除数组中的数据
      GrantVisibleClose(){
        this.defKeys = []
      },
      //递归 
      getGrantVisible(node,arr){
        //没有children属性的节点为三级节点
        if(!node.children){
          return arr.push(node.id)
        }else{
          // 循环出所有节点
          node.children.forEach( item => this.getGrantVisible(item,arr))
        }
      },
      // 请求分配权限
      GrantVisiblebao () {
        //发送请求
        const arrId = [
          ...this.$refs.GrantVisibleRef.getCheckedKeys(),
          ...this.$refs.GrantVisibleRef.getHalfCheckedKeys()
        ]
        const srtId = arrId.join(',')
        console.log(srtId)
        // const data = null
        this.$http.post(`roles/${this.refId}/rights`,{rids:srtId}).then( res =>{
          console.log(res);
          if(res.data.meta.status !== 200)return this.$message.error('添加权限失败')
          this.$message.success('添加权限成功')
          this.GrantVisible = false
          this._getRolesList()
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
 .el-col{
  //  border-top: 1px solid #000;
 }
 .quanx1{
   display: flex;
   display: flex;
   .el-col{
     align-self: center;
     .el-row{
       display: flex;
       .el-col{
         margin: 0 50px;
         .el-tag{
        align-self: center;
         }
       }
     }
   }
 }
      #biank{
       border-bottom: 1px solid rgb(236, 236, 236);
     }
 .el-tag{
   margin: 10px 0;
 }
 .bort{
   border-top: 1px solid rgb(236, 236, 236);
 }
 #item1{
   display: flex;
 }
</style>