<template>
  <div class="back-container" id="back-container" @click="clickBackHandle">
    <a title="返回"><i class="iconfont icon-a-fanhui"></i> <span class="title">返回</span></a>
  </div>
</template>
<script>
export default {
  name: 'Back',
  methods: {
    clickBackHandle() {
      this.$emit('goBack');
    },
  },
};
</script>
<style lang="scss" scoped>
.back {
  &-container {
    height: 100%;
    padding: 0 17px;
    box-sizing: border-box;
    cursor: pointer;
    .icon-a-fanhui {
      font-size: 8px;
      color: $EnnWKN6;
      margin-right: 5px;
    }
    .title {
      @extend .T2;
      font-weight: 400;
      color: $EnnWKN6;
      white-space: nowrap;
    }
    a {
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &:hover {
      .icon-a-fanhui,
      .title {
        color: $EnnWKB5;
      }
    }
  }
}
</style>
