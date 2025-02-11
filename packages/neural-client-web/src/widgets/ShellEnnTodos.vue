<template>
  <div class="ShellEnn_box todos">
    <el-tabs class="ShellEnnTabs" tab-position="top" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="今日代办" name="0">
        <dl class="list">
          <dd>
            <div class="item">
              <span class="avatar A"></span>
            </div>
            <div class="item">
              <h6>代办</h6>
              <p>
                内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容
                内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容内容内容内容内容内容内容容内容容内容
              </p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar B"></span>
            </div>
            <div class="item">
              <h6>代办</h6>
              <p>内容内容内容内容内容内容内容内容内容内容内 容内容内容内容</p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar C"></span>
            </div>
            <div class="item">
              <h6>代办</h6>
              <p>内容内容内容内容内容内容内容内容内容内容内 容内容内容内容</p>
            </div>
          </dd>
          <dt><span class="searchAll">查看全部</span></dt>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="最常使用" name="1">
        <div class="no-content">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwuneirong"></use>
          </svg>
          <span class="title">你已查看所有通知</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCharacterWidth } from '@/utils/format';

export default {
  name: 'ShellEnnTodos',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnTodos',
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
          activeBarElement.style.width = `${getCharacterWidth(tabFirstElement.innerText, 10) - 24}px`;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.ShellEnn_box {
  &.todos {
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
      margin: 0 24px;
    }
    .el-tab-pane {
      .list {
        display: flex;
        flex-direction: column;
        > dd {
          flex: 1;
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          .item {
            &:first-of-type {
              padding-right: 8px;
              .avatar {
                width: 24px;
                height: 24px;
                display: block;
                border-radius: 12px;
                &.A {
                  background-color: #36b39a;
                }
                &.B {
                  background-color: #4b7afa;
                }
                &.C {
                  background-color: #f3ae49;
                }
              }
            }
            &:nth-of-type(2) {
              flex: 1;
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
            }
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
    .no-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      padding: 78px 0 102px 0;
      .icon {
        width: 60px;
        height: 54px;
        fill: currentColor;
        overflow: hidden;
      }
      .title {
        margin-top: 16px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 21px;
      }
    }
  }
}
</style>
