<template>
  <div class="ShellEnn_box more">
    <ol>
      <template v-for="item in overflowMenuList">
        <li v-if="item.title" :key="'more-' + item.id_name" @click="handleCommand(item.componentName, item.id)">
          <span :class="['iconfont', item.iconName]"></span><span class="item">{{ item.title }}</span>
        </li>
      </template>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'ShellEnnMore',
  props: {
    overflowMenuList: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: '',
    },
    self: {
      type: Object,
    },
    iconHandleClick: {
      type: Function,
    },
  },
  methods: {
    handleCommand(command, _id) {
      this.self.$refs.contentRef.show();

      this.$emit('iconHandleClick', {
        e: this,
        componentName: command,
        id: _id,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.ShellEnn_box {
  &.more {
    max-height: 772px;
    min-width: 138px;
    max-width: 356px;
    overflow-y: auto;
    box-sizing: border-box;
    &::before {
      display: none;
    }
    > ol {
      margin: 10px 0;
      width: 100%;
      list-style: none;
      display: flex;
      flex-direction: column;
      li {
        flex: 1;
        padding: 0 26px;
        @extend .T2;
        color: $EnnWKN7;
        line-height: 44px;
        cursor: pointer;
        .iconfont {
          margin-right: 8px;
          font-size: 14px;
        }
        .item {
          display: inline-block;
        }
        &:hover {
          background-color: $EnnWKN1;
          a {
            &:link,
            &:hover {
              color: $EnnWKN8;
            }
          }
        }
      }
    }
  }
}
</style>
