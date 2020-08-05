<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex*1" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab标签导航 -->
    <el-form :model="addForm" label-position="top" :rules="addRules" ref="addRef" label-width="100px">
      <el-tabs @tab-click="tabClick" :before-leave="valida" :tab-position="'left'" v-model="activeIndex">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input type="number" v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <!-- 练级选中器 -->
          <el-form-item>
            <el-cascader
              v-model="addForm.goods_cat"
              :options="CatList"
              :props="catProps"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item 
          :label="item.attr_name"
          v-for="(item) in manyTabData" 
          :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border 
              :label="item"
              v-for="(item,index) in item.attr_vals" :key="index">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="(item) in onlyTabData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://timemeetyou.com:8889/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="successImg">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button class="addbtn" @click="add" type="primary">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    </el-card>
    <!-- 图片的 -->
    <el-dialog
      :visible.sync="imgVisible"
      width="50%">
      <img :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>


<script>
import _ from 'lodash'
  export default {
    name:'adduser',
    // let 我叫康康 :
    data() {
      return {
        // 步骤条的选择index
        activeIndex:0,
        // 选择的表单内容
        addForm:{
          goods_name:'',
          goods_price:null,
          goods_weight:null,
          goods_number:null,

          //练级选中的
          goods_cat:[],
          // 图片
          pics:[],
          // 文本编辑器 介绍
          goods_introduce:'',

          attrs:[]
        },
        // 表单校验规则
        addRules:{
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price:[
            { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_weight:[
            { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          goods_number:[
            { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
        },
        //练级配置
        catProps:{
          expandTrigger: 'hover',
          label:'cat_name',
          value:'cat_id',
          CatList:'CatList'
        },
        //请求的练级中的数据
        CatList:[],
        //动态商品参数
        manyTabData:[],
        //静态商品属性
        onlyTabData:[],
        // 上传图片的请求头
        headersObj:{
          Authorization : window.sessionStorage.getItem('token')
        },
        //点击查看图片的弹框
        imgVisible : false,
        // 击查看图片的url
        imgUrl:''
      }
    }, 
    created() {
      this._getCatList()
    },
    methods: {
      //请求的
      _getCatList(){
        this.$http.get('categories').then( res =>{
          this.CatList = res.data.data
          console.log(this.CatList);
        })
      },
      // 练级选择器活动时触发的
      handleChange () {
        if(this.addForm.goods_cat.length !== 3){
          this.addForm.goods_cat = []
        }
        console.log(this.addForm.goods_cat);
      },
      // Tabs切换之前触发
      valida(activeName, oldActiveName){
        if(oldActiveName === '0' && 
        this.addForm.goods_cat.length !== 3
        ||oldActiveName === '0' && this.addForm.goods_name.trim().length === 0){
          this.$message.error('请输入选择内容')
          return false
        }
      },
      // Tab点击时候触发
      tabClick() {
        console.log(this.activeIndex);
        // 请求动态商品参数
        if(this.activeIndex === '1'){
          this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:'many'}}).then( res=>{
            
            res.data.data.forEach( item =>{
              item.attr_vals = 
              item.attr_vals.length === 0 ? []
              :item.attr_vals.split(' ')
            })
            this.manyTabData = res.data.data
            console.log(res.data.data);
          })
        }
        //请求静态商品属性
        if(this.activeIndex === '2'){
          this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:'only'}}).then( res=>{
            console.log(res);
            this.onlyTabData = res.data.data
          })
        }
      },
      // 上传图片点击查看时
      handlePreview (file){
        this.imgVisible = true
        this.imgUrl = file.response.data.url
        console.log(file);
      },
      // 删除上传图片
      handleRemove (file, fileList){
        // console.log(file, fileList);
        //获取删除照片的路径
        const Durl = file.response.data.tmp_path
        //addForm.pics对比Durl中的路径返回对应的index
        const i = this.addForm.pics.findIndex( x => x.pic === Durl)
        //根据index删除
        this.addForm.pics.splice(i,1)
      },
      // 上传成功触发
      successImg(response){
        const pic = {pic:response.data.tmp_path}
        this.addForm.pics.push(pic)
        console.log(this.addForm);
      },
      // 最终添加商品
      add(){
        this.$refs.addRef.validate( valid =>{
          if(valid === false) return this.$message.error('请出入对应的表单内容')
          console.log(this.addForm);
          const form = _.cloneDeep(this.addForm)
          
          this.manyTabData.forEach( item =>{
            const obj = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
            form.attrs.push(obj)
          })
          this.onlyTabData.forEach( item =>{
            const obj = {attr_id:item.attr_id,attr_value:item.attr_vals}
            form.attrs.push(obj)
          })
          form.goods_cat = form.goods_cat.join(',')
          console.log(form);

          this.$http.post('goods',form).then( res =>{
            console.log(res);

            if(res.status !== 200) return this.$message.error('添加商品失败')
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
          })
        })
      }

    },
    computed: {
      // 获取id
      catId () {
        if(this.addForm.goods_cat.length === 3){
          return this.addForm.goods_cat[2]
        }
      }
    },
  }
</script>


<style scoped lang="less">
 .el-breadcrumb{
   margin-bottom: 15px;
 }
 .el-steps{
   margin: 15px 0;
 }
.el-checkbox{
  margin: 0;
}
.el-dialog{
  img{
    width: 100%;
  }
}
.addbtn{
  margin-top: 15px;
}
</style>