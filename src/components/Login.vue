<template>
  <div class="login-div">
       <h1 style="position: absolute;color: #fff;left: 50%;transform: translateX(-50%); top: 13%;">SongGod</h1>
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="https://www.songgod.cn/group1/M00/00/03/rBoksV9k_EiAQz5mAADJ7XWh1G861.JPEG" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="userPassword">
          <el-input v-model="loginForm.userPassword" prefix-icon="el-icon-goods" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm" >登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 验证码 -->
    <Vcode
      :show="isShow"
      @success="onSuccess"
      @close="close"
      :canvasWidth="500"
      :canvasHeight="350"
    />
  </div>
</template>
<script>
import Vcode from 'vue-puzzle-vcode'
export default {
    name: 'Login',
    data() {
        return {
            // 这是登录表单数据绑定对象
            loginForm: {
                userName: 'admin',
                userPassword: '123456',
            },
            // 表单验证规则
            loginFormRules: {
                userName: [
                    {
                        required: true,
                        message: '请输入登录名称',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                userPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur',
                    },
                ],
            },
            isShow: false,
            
        }
    },
    components: {
        Vcode,
    },
    methods: {
        // 重置表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        async getUserInfo() {
            const { data: res } = await this.$http.get('/info')
            if (res.code !== 200) {
                return this.$message.error('获取用户信息失败:' + res.msg)
            } else {
                // 保存用户
                this.$store.commit('setUserInfo', res.data)
            }
        },
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.get('/login', {
                    params: {
                        userName: this.loginForm.userName,
                        userPassword: this.loginForm.userPassword,
                    },
                })
                if (res.code !== 200) {
                    this.isShow = false
                    if (res.msg === null) {
                        this.$message.error('账户不存在..0.0..')
                    } else {
                        this.$message.error(res.msg)
                    }
                    return
                }
                this.$message({
                    title: '登入成功',
                    message: '欢迎你进入系统',
                    type: 'success',
                })
                // 将登录成功之后 token 保存到客户端 sessionStorage
                window.sessionStorage.setItem('token', res.data)
                this.getUserInfo()
                this.$router.push('/home')
            })
        },
        // 拼图成功
        onSuccess() {
            this.login()
        },
        close() {
            this.isShow = false
        },
        // 点击登录校验-拼图出现
        submitForm() {
            // 表单校验
            this.$refs.loginFormRef.validate((valid) => {
                // 验证通过
                if (valid) {
                    // 拼图出现
                    window.sessionStorage.clear()
                    this.isShow = true
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
.slide-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
}

.testCode {
    width: 650px;
    height: 480px;
    position: absolute;
    left: 50%;
    top: 53%;
    background-color: #fcfcfc;
    border-radius: 1%;
    transform: translate(-50%, -68%);
}
.login-div {
    background-color: #333744;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
