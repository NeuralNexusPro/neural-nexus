<template>
  <div class="ShellEnn_box switchProducts">
    <el-tabs class="ShellEnnTabs" tab-position="top" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="应用菜单 (4)" name="0">
        <dl class="list">
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名1</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名1</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名3</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名4</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名5</span>
          </dd>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="内容 (3)" name="1">
        <dl class="list">
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名1</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名2</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名3</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名4</span>
          </dd>
          <dd>
            <span class="avatar iconfont icon-qitacaozuo"></span>
            <span class="title">应用名5</span>
          </dd>
        </dl>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCharacterWidth } from '@/utils/format';

export default {
  name: 'ShellEnnSwitchProducts',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnSwitchProducts',
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
  &.switchProducts {
    max-height: 772px;
    width: 356px;
    overflow-y: auto;
    box-sizing: border-box;
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
    .el-tabs__content {
      margin: 0 24px 24px;
    }
    .el-tab-pane {
      .list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        > dd {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 12px;
          margin-bottom: 20px;
          width: 33.333%;

          text-align: center;

          .avatar {
            width: 40px;
            height: 40px;
            line-height: 40px;
            background: #4b7afa;
            border-radius: 6px;
            text-align: center;
            &.iconfont {
              font-size: 25px;
              color: #ffffff;
            }
          }
          .title {
            display: block;
            margin-top: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #323233;
            line-height: 20px;
            font-family: PingFangSC-Regular, PingFang SC;

            width: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
