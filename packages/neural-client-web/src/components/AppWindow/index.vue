<template>
  <div class="app-window-container">
    <div class="neural-appspace-container" id="neural-appspace-container">
      <div class="tabs-container">
        <div class="tabs-header">
          <el-tabs
            v-model="activeName"
            class="tab-bar-container"
            max-tab-width="206"
            :tab-more-icon="ArrowDown"
            closable
            no-bottom-line
            type="title"
            @edit="handleTabsEdit"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane v-for="item in pageList" :key="item.id" :label="item.title" :name="item.id"> </el-tab-pane>          
          </el-tabs>
          <div class="app-window-close">
            <el-icon :size="22" @click="closeAppWindow()"><Close /></el-icon>
          </div>
        </div>
        <div class="tabs-content">
          <!-- 用于隔离 iframe事件，否则拖拽改变窗口大小事件, 无法透过iframe-->
          <div class="iframe-event-isolation" v-if="appWindowIsDrag"></div>
          <div class="iframe-container hasTab" id="iframe-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';

const $store = useStore();

const activeName = computed(() => $store.state.pageContainer.activePage);
const pageList = computed(() => $store.state.pageContainer.openedPages);
const appWindowIsDrag = computed(() => $store.state.app.appWindowIsDrag);
const appPageConfig = computed(() => $store.state.pageContainer.appPageConfig);
watch(pageList, value => {
  if (value.length === 0) {
    $store.commit('menuHeader/setAppWindowActive', false);
  }
});

const handleTabsClick = tab => {
  $store.dispatch('openPageById', tab.props.name);
};

const closePageTab = pageId => {
  const tabs = pageList.value;
  let tempActiveName = activeName.value;
  if (tempActiveName === pageId) {
    tabs.forEach((tab, index) => {
      if (tab.id === pageId) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          tempActiveName = nextTab.id;
        }
      }
    });
    tempActiveName = undefined;
  }
  $store.commit('pageContainer/removeAppPageConfig', pageId);
  $store.dispatch('mixinsClose', pageId);
  $store.commit('pageContainer/setActivePage', tempActiveName);
};
const handleTabsEdit = (targetName, action) => {
  console.log(targetName, action, appPageConfig);
  if (action === 'remove') {
    const pageConfig = appPageConfig.value.get(targetName);
    if (pageConfig?.closeConfirm) {
      const closeText = pageConfig.closeConfirmText || '是否确认离开页面？';
      ElMessageBox.confirm(closeText, '离开页面', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => closePageTab(targetName))
        .catch(() => {});
    } else {
      closePageTab(targetName);
    }
  }
};

const closeAppWindow = () => {
  $store.commit('menuHeader/setAppWindowActive', false);
};
</script>
<style lang="scss">
@import './index.scss';
@import '@/styles/breadCrumbsUl.scss';
.iframe-event-isolation {
  z-index: 10000;
  position: absolute;
  width: 100%;
  height: 100%;
}

.tab-bar-container {
  width: calc(100% - 30px);
  .el-tabs__header {
    background-color: transparent;
    margin: 0;
    --el-block-item-bg-color-hover: #e5e9f5;
  }
  .el-tabs__active-bar {
    background-color: transparent;
  }
  .el-tabs--title {
    border-radius: 8px 8px 0 0;
  }
  .el-tabs__item {
    margin-top: 4px;
    padding: 0 20px !important;
  }
  .el-tabs__item {
    &.is-active {
      background-color: #ffffff;
    }
  }
  .el-tabs__item {
    border-radius: 8px 8px 0 0;
  }
  .el-button.el-button--secondary.is-single-icon {
    --el-color-primary: #000000;
  }
  .el-tabs__tab-more-icon .el-icon {
    font-size: 16px;
  }
  .el-tabs__nav-more {
    margin-top: 12px !important;
    .el-icon {
      font-size: 14px;
    }
  }
  .el-button.is-single-icon {
    width: 24px;
  }
  .el-button {
    height: 24px;
  }
}

.initFrame {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 500ms ease;
  overflow-y: hidden;
}
.create {
  z-index: -1;
  transform: translate3d(200%, 0, 0);
}
iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
