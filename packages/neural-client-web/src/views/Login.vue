<template>
  <div class="login">
    <!-- <div class="left-logo">
      <img src="@/assets/images/login-icon.png" />
    </div> -->
    <div class="flex-item">
      <div class="login-container">
        <div class="login-wrap">
          <h1>欢迎来到设备故障诊断系统</h1>
          <el-alert type="error" show-icon :title="errMsg" v-if="errMsg" @close="() => (this.errMsg = '')" />
          <div v-else style="height: 38px"></div>
          <el-form ref="ruleFormRef" label-position="vertical" :model="loginForm" :rules="rules" hide-required-asterisk>
            <el-form-item label="账号" prop="userName">
              <el-input v-model="loginForm.userName" />
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="loginForm.pwd" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleFormRef')" style="width: 100%; margin-top: 30px">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      errMsg: '',
      loginForm: {
        userName: '',
        pwd: '',
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!');
          // runtime request
          this.$router.push('/');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
.left-logo {
  width: 43%;
  background: linear-gradient(180deg, #3a69e7 0%, #2041c3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 80%;
  }
}
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
}
.flex-item {
  flex: 1;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: row;
}
.login-container {
  width: 100%;
  text-align: center;
}
.login-wrap {
  display: inline-block;
  margin: 0px auto;
  padding: 80px 50px;
  background: #ffffff;
  box-shadow: 0px 16px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #e1e5ec;
}
</style>
