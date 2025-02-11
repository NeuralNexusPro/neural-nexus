<template>
  <ul
    class="EnnEpMenu"
    :style="{ left: postions.x + 'px', top: postions.y + 'px' }"
  >
    <li @click="refreshClick">
      <i class="iconfont icon-shuaxin" /><span>刷新当前页</span>
    </li>
    <li @click="closeOthersClick">
      <i class="iconfont icon-guanbi" /><span>关闭其他标签页</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'EpMenu',
  props: ['currentId', 'postions'],
  inject: ['refreshPageClick', 'closeOthersPageClick'],
  methods: {
    refreshClick () {
      this.refreshPageClick(this.currentId);
      this.$emit('refreshTabState'); // 控制刷新样式
    },
    closeOthersClick () {
      this.closeOthersPageClick(this.currentId);
    },
  },
};
</script>

<style lang="scss" scoped>
.EnnEpMenu {
  list-style: none;
  position: absolute;
  z-index: 99999;
  width: 146px;
  background-color: $EnnWKBase;
  @extend .L2;
  border-radius: 2px;
  width: 146px;
  left: 0;
  top: 0;
  padding: 4px;
  box-sizing: border-box;
  li {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: default;
    border-radius: 2px;
    i {
      padding: 8px;
      &.iconfont {
        font-size: 16px;
        color: $EnnWKN7;
      }
    }
    span {
      @extend .T2;
      font-weight: 400;
      color: $EnnWKN8;
      line-height: 20px;
    }
    &:hover {
      background-color: $EnnWKN1;
    }
    &:active {
      background-color: $EnnWKB5;
      i,
      span {
        color: $EnnWKBase;
      }
    }
  }
}
</style>
