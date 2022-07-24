<template>
  <div class="login_container">
    <div class="login_box">
    <!-- 头像区域 -->
    <div class="avatar_box">
      <img src="../assets/logo.png">
    </div>
    <!-- 登录表单区 -->
      <el-form label-width="0px" ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10之间', tigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 5, max: 10, message: '长度为5-10', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录的预验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm)
        if (res.meta.status != 200) return this.$message.error('登陆失败！')
        this.$message.success('登陆成功!')
        // 1.将登录成功之后的token，保存到客户端sessionStorage中
        //  1.1项目中出了登录之外的其它API接口，必须再登录之后才能访问
        //  1.2 token 只应再当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token)
        //  2.通过编程式导航 跳转到后台主页，路由地址是'/home'
        this.$router.push("/home")
      });
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
 width: 450px;
 height: 300px;
 background-color: #fff;
 position:absolute;
 left:50%;
 top:50%;
 transform: translate(-50%,-50%);
 .avatar_box{
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border:1px solid #eee;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  img{
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background-color: #eee;
  }
}

.login_form{
  box-sizing: border-box;
  position:absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}

.btns{
  display: flex;
  justify-content:flex-end;

}
}

</style>