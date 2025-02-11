<template>
  <div class="ShellEnn_box notification">
    <el-tabs class="ShellEnnTabs" tab-position="top" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通知 (4)" name="0">
        <dl class="list">
          <dd>
            <h6>通知名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内
            </p>
          </dd>
          <dd>
            <h6>通知名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容…
            </p>
          </dd>
          <dd>
            <h6>通知名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容…
            </p>
          </dd>
          <dt><span class="searchAll">查看全部</span></dt>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="消息 (3)" name="1">
        <dl class="list">
          <dd>
            <h6>消息名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容…
            </p>
          </dd>
          <dd>
            <h6>消息名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容…
            </p>
          </dd>
          <dd>
            <h6>消息名称</h6>
            <p>
              内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容…
            </p>
          </dd>
          <dt><span class="searchAll">查看全部</span></dt>
        </dl>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCharacterWidth } from '@/utils/format';

export default {
  name: 'ShellEnnNotice',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnNotice',
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeName: '0',
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    loadData() {
      // 元素渲染完后进行操作
      this.$nextTick(() => {
        const tabFirstElement = document.getElementById('tab-0');
        const activeBarElement = document.getElementsByClassName('el-tabs__active-bar')[0];
        if (tabFirstElement.classList.contains('is-active') && activeBarElement) {
          // el-tab默认距离右边有20边距
          // activeBarElement.style.width = `${
          //   tabFirstElement.clientWidth - 20
          // }px`;
          activeBarElement.style.width = `${getCharacterWidth(tabFirstElement.innerText, 7) - 24}px`;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.ShellEnn_box {
  &.notification {
    max-height: 772px;
    width: 356px;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50px;
      width: 100%;
      height: 1px;
      background-color: #e8e8e8;
      z-index: 1;
    }
    .ShellEnnTabs {
      // margin: 0 24px;
      .el-tabs__header {
        margin: 0 0 12px;
      }
      .el-tabs__content {
        margin: 0 24px;
      }
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        padding: 0 24px;
        outline: none;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        &:hover {
          color: $EnnWKB4;
        }
        &.is-active {
          color: $EnnWKB4;
        }
        &:focus,
        &.is-active,
        &.is-foucs {
          &:not(:active) {
            box-shadow: none;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
          }
        }
      }
      .el-tabs__active-bar {
        background-color: $EnnWKB4;
      }
      .el-tabs__nav-wrap {
        &::after {
          height: 0px;
        }
      }
    }
    .el-tab-pane {
      .list {
        display: flex;
        flex-direction: column;
        > dd {
          flex: 1;
          margin-top: 12px;
          h6 {
            font-size: 14px;
            color: #323233;
          }
          p {
            font-size: 12px;
            color: #969799;
            margin: 4px 0 12px 0;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;

            text-align: justify;
          }
          border-bottom: 1px #f6f7fb solid;
          &:last-of-type {
            border-bottom: none;
          }
        }
        > dt {
          padding: 12px 0;
          text-align: right;
          .searchAll {
            color: $EnnWKB4;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
// .ShellEnnTabs .el-tabs__item:focus.is-active.is-focus:not(:active) {
//   box-shadow: none;
//   border-top-left-radius: 20px;
//   border-top-right-radius: 20px;
// }
</style>
