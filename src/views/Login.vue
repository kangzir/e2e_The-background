<template>
  <div class="login">
    <div class="login-box">
      <!-- logo -->
      <div class="login-logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginFrom" ref="refloginForm" :rules="loginRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-yonghu1" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="form_btn">
          <el-button type="primary" @click="denglu">登录</el-button>
          <el-button type="info" @click="chongzhi">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        datas:{},
        loginFrom: {
          username:'admin',
          password:'123456' 
        },
        loginRules: {
          username:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      chongzhi(){
        this.$refs.refloginForm.resetFields() //清除ref为loginForm--form表单中的内容
      },
      denglu(){
        this.$refs.refloginForm.validate((valid) =>{ //获取ref为loginForm--form表单中的状态 合法为true不合法为false
          console.log(valid);
          // 等于false到这里直接结束
          if(!valid) return
          //POST请求 login--地址 --参数 
          this.$http.post('login',this.loginFrom).then( res =>{
            this.datas = res.data
            console.log(this.datas);
              //判断状态不为200(用户不存在) return 提示无法登录
            if(this.datas.meta.status !== 200) return this.$message.error(this.datas.meta.msg)
            //则登录成功(用户存在)
            this.$message.success(this.datas.meta.msg)
            //登录成功之后的token 保存到客户端的sessionStorage中
            window.sessionStorage.setItem('token',this.datas.data.token)
            // 登录成功之后跳转页面
            this.$router.push('/hoem')
          })
        })
      }
    },
  }
</script>

<style lang="less" scoped>
.login{
  background-color: #2b4b6b;
  height: 100%;
}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border-radius: 3px;
}
.login-logo{
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid rgb(231, 230, 230);
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  img{
    width: 100%;
    border-radius: 50%;
    background-color: #ddd;
  }
}
.form_btn{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>