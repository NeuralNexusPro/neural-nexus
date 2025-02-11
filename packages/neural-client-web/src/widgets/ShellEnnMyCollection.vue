<template>
  <div class="ShellEnn_box mycollection">
    <el-tabs class="ShellEnnTabs" tab-position="top" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的收藏" name="0">
        <dl class="list">
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名</h6>
              <p>内容内容内容内容内容内容容内容容内容</p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名</h6>
              <p>内容内容内容内容内容内容</p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名</h6>
              <p>内容内容内容内容内容内容</p>
            </div>
          </dd>
          <dt><span class="searchAll">查看全部</span></dt>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="最常使用" name="1">
        <dl class="list">
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名1</h6>
              <p>内容内容内容内容内容内容容内容容内容</p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名1</h6>
              <p>内容内容内容内容内容内容</p>
            </div>
          </dd>
          <dd>
            <div class="item">
              <span class="avatar iconfont icon-qitacaozuo"></span>
            </div>
            <div class="item">
              <h6>应用名1</h6>
              <p>内容内容内容内容内容内容</p>
            </div>
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
  name: 'ShellEnnMyCollection',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnMyCollection',
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
  &.mycollection {
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
              padding-right: 12px;
              .avatar {
                width: 40px;
                height: 40px;
                background: #4b7afa;
                border-radius: 6px;
                display: block;
                text-align: center;
                line-height: 40px;
                &.iconfont {
                  font-size: 25px;
                  color: #ffffff;
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
  }
}
</style>
