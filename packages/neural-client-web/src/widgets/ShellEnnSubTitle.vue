<template>
  <el-dropdown :ref="refName + 'Ref'" trigger="click" placement="bottom-end" @command="handleCommand" @visible-change="visibleChange">
    <!-- :hide-on-click="false" -->
    <div class="operationCursor">&nbsp;</div>
    <el-dropdown-menu slot="dropdown" class="shellheader-subtitle-dropdown">
      <el-dropdown-item v-for="(item, index) in subtitleList" :key="'subtitle_' + index" :command="item"
        ><span class="item">{{ item }}</span></el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// 副标题组件

export default {
  name: 'ShellEnnSubTitle',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnSubTitle',
    },
    subtitleList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleCommand(e) {
      this.$emit('handleCommandSubtitle', e);
    },
    visibleChange(e) {
      this.$emit('changeSubtitle', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown {
  &.titleOperation {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    .operationCursor {
      height: 36px;
      cursor: pointer;
    }
  }
}
.el-dropdown-menu {
  &.el-popper {
    :deep(.popper__arrow) {
      left: auto !important;
      right: 8px !important;
    }
    :deep(&.shellheader-subtitle-dropdown) {
      @extend .L2;
      max-width: 188px;
      margin-right: 8px !important;
      .el-dropdown-menu__item {
        padding: 0 24px;
        @extend .T2;
        color: $EnnWKN7;

        &:not(.is-disabled):hover {
          background-color: $EnnWKLineItemHover;
          // color: $EnnWKB5;
        }
        &:hover,
        &:active {
          background-color: $EnnWKN1;
          a {
            &:link,
            &:hover {
              color: $EnnWKN8;
            }
          }
        }
        .item {
          display: block;
          min-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .popper__arrow {
        // left: 92% !important;
        right: 2px !important;
      }
    }
  }
}
</style>
