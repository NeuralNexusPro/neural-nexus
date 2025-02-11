<template>
  <div class="app-shell-ency-about">
    <SvgIcon iconClass="404" className="NotFound" />
    <div class="message">{{ message }}</div>
    <el-button type="primary" @click="clickHandle">{{ btnText }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    message: {
      type: String,
      default: '抱歉，你访问的页面不存在...',
    },
    btnText: {
      type: String,
      default: '主按钮',
    },
  },
  methods: {
    clickHandle() {
      this.$emit('mainBtn');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-shell-ency-about {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  .NotFound {
    width: 320px;
    height: 320px;
  }
  .message {
    color: $EnnWKN8;
    font-size: 14px;
    margin: 16px 0;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .el-button {
    height: 30px;
    line-height: 30px;
    padding: 0 16px;
    font-size: 14px;
  }
}
@media screen and (max-width: 800px) {
  .app-shell-ency-about {
    .NotFound {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
