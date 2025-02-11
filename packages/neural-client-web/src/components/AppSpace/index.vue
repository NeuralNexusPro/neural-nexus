<template>
  <div class="neural-appspace-container" id="neural-appspace-container">
    <div :class="['neural-nexus-container', fold]">
      <div id="neural-nexus"></div>
    </div>
    <div class="tabs-container">
      <div class="tabs-header">
        <div class="extend">
          <div class="icon-container" @mouseover="isHover = true" @mouseleave="isHover = false">
            <el-tooltip effect="dark" :key="tabIsFullscreen ? 'fullscreen' : 'cancelFc'" :content="tabIsFullscreen ? '全屏' : '退出全屏'" placement="right" class="image">
              <div>
                <img
                  class="chat-logo"
                  :class="tabIsFullscreen ? 'fullscreen' : 'cancelFc'"
                  :src="isHover ? 'https://res.ennew.com/image/png/9cc5d3b3ad415c9a6ee2f97b4661793a.png' : ''"
                  @click.stop="handleFullscreenTab"
                />
                <SvgIcon
                  class="icon"
                  :key="tabIsFullscreen ? 'fullscreen' : 'cancelFc'"
                  :class="tabIsFullscreen ? 'fullscreen' : 'cancelFc'"
                  :iconClass="tabIsFullscreen ? 'fullscreen' : 'cancelFc'"
                  @click.stop="handleFullscreenTab"
                />
              </div>
            </el-tooltip>
          </div>
          <!-- <SvgIcon iconClass="spaceMenu" ref="menuRef" @click="showMenu" v-click-outside="onClickOutside" /> -->
          <el-popover placement="bottom-start" :content-class="'sapce-menu-container'" :show-arrow="false" :visible="visible" width="fit-content" trigger="click">
            <template #reference>
              <SvgIcon iconClass="spaceMenu" @click="showMenu" id="menu-trigger" />
            </template>
            <menu-container :visible="visible" v-click-outside="onClickOutside" />
          </el-popover>
        </div>
        <!-- 已经收藏的应用 -->
        <ul class="tabs-header-ul tabs-header-ul-collected">
          <li
            v-for="(item, ind) in multiTaskTabsListCollected"
            :key="'multitasktabs-' + ind"
            :id="'multitasktabs-' + item.id"
            :title="item.title"
            v-show="item.isShow"
            :class="[addSelectedClass(item.id), 'loading']"
            @click="taskTabsClick($event, item)"
          >
            <div class="title" :id="item.id">
              <div class="text">{{ item.title }}</div>
            </div>
          </li>
        </ul>
        <!-- 分割线 -->
        <el-divider direction="vertical" class="tabs-header-vertical"></el-divider>
        <ul class="tabs-header-ul" id="ennwk-multiTaskTabs" ref="tabsRef">
          <li
            v-for="(item, ind) in multiTaskTabsListShow"
            :key="'multitasktabs-' + ind"
            :id="'multitasktabs-' + item.id"
            :title="item.title"
            v-show="item.isShow"
            :class="[addSelectedClass(item.id), 'loading']"
            @click="taskTabsClick($event, item)"
          >
            <div class="title" :id="item.id">
              <div class="text">{{ item.title }}</div>
              <el-icon :size="16" :class="{ colledted: item.collected, loading: !item.collected }" @click="closePage(item.id, $event)"><Close /></el-icon>
              <!-- <i class="el-icon-close close" :class="{ colledted: item.collected, loading: !item.collected }" @click="closePage(item.id, $event)"></i> -->
            </div>

            <el-popover v-show="item.children" popper-class="multitasktabs-popover" placement="bottom" transition="fade-in-linear" width="200" trigger="click">
              <ul class="popover-ul">
                <li v-for="(childItem, ind) in item.children" :key="'multitasktabsHide-' + ind" :title="childItem.title">
                  <a :href="childItem.toUrl" onclick=" return false; ">{{ childItem.title }}</a>
                </li>
              </ul>
              <div :id="item.id">
                <i class="el-icon-arrow-down" :id="item.id"></i>
              </div>
            </el-popover>
          </li>
        </ul>
        <div :class="['overflow-menu', dropdownIconStyle]" v-show="moreIsHide">
          <el-dropdown ref="hideMenuDrop" trigger="click" :hide-on-click="false" placement="bottom-end" @visible-change="multiTaskChangeClick">
            <el-icon><ArrowDown /></el-icon>
            <template #dropdown>
              <el-dropdown-menu :class="multiTaskTabsHideListClass">
                <el-dropdown-item v-for="(item, idx) in multiTaskTabsHideList" :key="idx" command="item.title">
                  <!-- <span class="title" @click="changePlacesHandle(item)" :title="item.title">{{ item.title }}</span> -->
                  <div class="hide-menu" @click="taskTabsClick($event, item)" :class="{ active: currentId === item.id }">
                    <div class="text">{{ item.title }}</div>
                    <el-icon :size="16" :class="{ colledted: item.collected, loading: !item.collected }" class="close" @click="closePage(item.id, $event)"><Close /></el-icon>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="tabs-content">
        <div class="iframe-container hasTab" id="iframe-container"></div>
      </div>
      <!-- <PageLoading></PageLoading> -->
    </div>
    <!-- TODO: fix 上层用了动画，动画限制组件内根元素在同一个 template 中，后续解决 -->
    <!-- <el-affix class="affix" :offset="150" position="bottom">
      <div class="icon-wrapper">
        <el-icon class="fold-icon" :size="30" @click="handleFold">
          <Others />
        </el-icon>
      </div>
    </el-affix> -->
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, nextTick, onUnmounted, inject, watch } from 'vue';
import { useStore } from 'vuex';
import MenuContainer from '@/components/MenuContainer/index.vue';
import { ArrowDown, Close } from '@element-plus/icons-vue';

import { ElIcon, ClickOutside as vClickOutside } from 'element-plus';
import { Logger, getCharacterWidth, debounce } from '@/utils/format';
import bootstrap, { DefaultAdaptor } from '@neural-nexus/nexus-client';
import { channel } from '@ennew/one-portal-channel';
import type { IPage } from '@/store/index';
import { BroadcastEvent, Terminal } from '@neural-nexus/nexus-protocol';
import { getAppCode } from '@/utils/common';
import { useDebounceFn } from '@vueuse/core';
import { COPILOT_MODE_ID } from '@/config/constants';

const $store = useStore();
const uninstall = ref();
const menuRef = ref();
const tabsRef = ref();
const isHover = ref(false);

const visible = computed(() => $store.state.pageContainer.showMenuContainer);
const showMenu = () => {
  const value = $store.state.pageContainer.showMenuContainer;
  $store.commit('pageContainer/setShowMenuContainer', !value);
};
const onClickOutside = event => {
  if (event.target?.href?.baseVal === '#icon-spaceMenu') {
    return;
  }
  $store.commit('pageContainer/setShowMenuContainer', false);
};

const sidebarMenuData = computed(() => $store.state.sidebarMenuData);
const activePage = computed(() => $store.state.pageContainer.activePage);
const authSdk = inject('authSdk');

const menus = computed<IPage[]>(() => $store.state.pageContainer.openedPages);
const multiTaskTabsListShow = computed(() => {
  return $store.state.pageContainer.openedPages.map(el => {
    return {
      isShow: true,
      id: el.id,
      title: el.name || el.title,
      collected: el.collected,
    };
  });
});
watch(multiTaskTabsListShow, value => {
  const el = tabsRef.value;
  if (!el) return;
  nextTick(() => {
    const hideMenus: any[] = [];
    const nodes = (el.children as unknown as HTMLDivElement[]) || [];
    const maxWidth = document.body.clientWidth - 23 - 64 - 16 - 1;
    let width = 0;
    nodes.forEach((node, index) => {
      const nodeWidth = parseInt(getComputedStyle(node).width);
      width += nodeWidth;
      if (width >= maxWidth) {
        hideMenus.push(value[index]);
      }
    });
    moreIsHide.value = width >= maxWidth;
    multiTaskTabsHideList.value = hideMenus;
  });
});
// 已经收藏的应用
const multiTaskTabsListCollected = computed(() => {
  return $store.state.pageContainer.collectPages.map(el => {
    return {
      isShow: true,
      id: el.id,
      title: el.name || el.title,
      collected: el.collected,
    };
  });
});
const multiTaskTabsList = menus;
const currentId = computed(() => $store.state.pageContainer.activePage);
const refreshId = ref($store.state.pageContainer.activePage);
const multiTaskTabsHideList = ref<IPage[]>([]);
const multiTaskTabsHideListClass = computed(() => {
  return multiTaskTabsHideList.value.length > 0 ? 'ennwk-multiTaskTabs-dropdown' : 'ennwk-multiTaskTabs-dropdown hide';
});
const fold = computed(() => {
  if ($store.state.app.showCopilot) {
    return 'unfold';
  }
  return 'fold';
});
const crumbsTotalWidth = ref(0);
const moreIsHide = ref(false);
const dropdownIconStyle = ref('');
const getCrumbsWdith = function () {
  const _totalWidth = document.getElementById('app')?.clientWidth as number;
  const _backDom = document.getElementById('back-container');
  const _backWidth = _backDom ? (document.getElementById('back-container')?.clientWidth as number) : 0;

  crumbsTotalWidth.value = _totalWidth - _backWidth - 25;
};
/**
 * 计算字体宽度
 * 25 icon宽度；
 * 21 文本宽度+padding
 * 4 ul padding
 * (x.title.length > 7 ? 21 : 0 = '...'的宽度
 */
const computedWidth = function (x) {
  return !x.children
    ? getCharacterWidth(x.title.length > 7 ? x.title.substr(0, 7) : x.title) + 21 + 25 + 4 + (x.title.length > 7 ? 21 : 0)
    : getCharacterWidth(x.title.length > 7 ? x.title.substr(0, 7) : x.title) + 21 + 25 * 2 + 4 + (x.title.length > 7 ? 21 : 0);
};
const filterMultiTaskTabsList = function (flag) {
  return multiTaskTabsList.value.filter(item => item.isShow === flag);
};
const showDropDownHideMenu = function () {
  // multiTaskTabsHideList.value = filterMultiTaskTabsList(false);
};

const multiTaskTabsChange = async function (type, itemIndex) {
  await getCrumbsWdith();
  await multiTaskTabsUpdateFun(type, itemIndex);
  await showDropDownHideMenu();
};
// 更新显示状态，进行响应显示
const multiTaskTabsUpdateFun = function (type = '', itemIndex = -1) {
  // console.log(`insertIndex-1:type=${type}; itemIndex=${itemIndex}`);
  const pageLen = multiTaskTabsList.value.length;
  if (pageLen >= 2) {
    let moveTab = null;
    let moveTabWidth = 0;
    // 初始化
    if (type === 'add') {
      moveTab = multiTaskTabsList[pageLen - 1];
      moveTabWidth = computedWidth(moveTab);
    } else if (type === 'exchange') {
      if (itemIndex === -1) {
        for (let i = 0; i < pageLen; i++) {
          if (currentId.value === pageLen[i].id) {
            itemIndex = i;
            break;
          }
        }
      }
      moveTab = multiTaskTabsList[itemIndex];
      moveTabWidth = computedWidth(moveTab);
    } else {
      if (type !== 'delete') {
        let currentIndex = -1;
        for (let i = 0; i < pageLen; i++) {
          if (currentId.value === multiTaskTabsList[i].id) {
            currentIndex = i;
            break;
          }
        }
        moveTab = multiTaskTabsList[currentIndex];
        itemIndex = currentIndex;
        moveTabWidth = computedWidth(moveTab);
      }
    }
    // 查找位置
    let insertIndex = -1;
    let currentWidth = 0;
    for (let j = 0; j < pageLen; j++) {
      currentWidth += computedWidth(multiTaskTabsList[j]);
      if (currentWidth + moveTabWidth >= crumbsTotalWidth.value) {
        insertIndex = j;
        // 非增加，不允许超过原来下标
        if (type !== 'add') {
          if (insertIndex > itemIndex) {
            insertIndex = itemIndex;
          }
        }
        break;
      }
    }
    // console.log(`insertIndex-2:insertIndex=${insertIndex}; itemIndex=${itemIndex}`);
    // 移动位置
    if (insertIndex > -1) {
      if (type === 'add') {
        for (let k = pageLen - 2; k >= 0; k--) {
          if (k < insertIndex) break;
          multiTaskTabsList[k + 1] = multiTaskTabsList[k];
        }
        // 插入
        multiTaskTabsList[insertIndex] = moveTab;
      } else {
        let tempTab = null;
        if (itemIndex - insertIndex === 1) {
          tempTab = multiTaskTabsList[insertIndex];
          multiTaskTabsList[insertIndex] = moveTab;
          multiTaskTabsList[itemIndex] = tempTab;
        } else {
          tempTab = multiTaskTabsList[itemIndex];
          for (let m = itemIndex - 1; m >= insertIndex; m--) {
            multiTaskTabsList[m + 1] = multiTaskTabsList[m];
          }
          multiTaskTabsList[insertIndex] = tempTab;
        }
      }
    }

    let multiTaskTabs;
    let isHide = false;
    const tablistShow: IPage[] = [];

    // 处理显示和隐藏
    currentWidth = 0;
    for (let index = 0; index < pageLen; index++) {
      multiTaskTabs = multiTaskTabsList[index];
      currentWidth += computedWidth(multiTaskTabs);
      // Logger('响应式计算').info(
      //   `${
      //     multiTaskTabs.title.length > 7 ? multiTaskTabs.title.substr(0, 7) + '...' : multiTaskTabs.title
      //   }, ${this.computedWidth(multiTaskTabs)}, ${currentWidth}, ${this.crumbsTotalWidth}`
      // );
      if (currentWidth >= crumbsTotalWidth.value) {
        // Logger('响应式计算').info('隐藏下标', index);
        // console.log(`insertIndex-3 index=${index}`);
        this.displayCount = this.multiTaskTabsList.length - index;
        tablistShow.push({ ...multiTaskTabs, isShow: false });
        isHide = true;
      } else {
        tablistShow.push({
          ...multiTaskTabs,
          isShow: true,
          isTest: 'test2',
        });
      }
    }
    // console.log(`insertIndex-3=${JSON.stringify(tablistShow)}`);
    console.log(tablistShow, 'wangcci');
    $store.commit('pageContainer/setOpenedPages', tablistShow);
    moreIsHide.value = isHide;
  }
};
const handleFold = function () {
  $store.commit('app/setShowCopilot', !$store.state.app.showCopilot);
};

const multiTaskChangeClick = function (e) {
  dropdownIconStyle.value = e ? 'selected' : '';
  e && showDropDownHideMenu();
};
const _currentOperation = function (id) {
  $store.commit('pageContainer/setActivePage', id);
  $store.dispatch('handleOpenPageClick', { _id: id });
};
const deleteTaskTabHandle = async function (id) {
  const _tabId = await multiTaskTabsList.value.findIndex(x => x.id === id.toString());
  multiTaskTabsList.value.splice(_tabId, 1);
  await multiTaskTabsChange('delete', _tabId);
  await $store.dispatch('closePageClick', { _id: id });
};
const taskTabsClick = function (e, item) {
  const { id } = item;
  if (e.target.className === 'el-icon-close') {
    deleteTaskTabHandle(id);
  } else if (e.target.className === 'el-icon-arrow-down') {
    Logger('Tab事件').info('触发子面包屑');
  } else {
    refreshId.value = id;
    _currentOperation(id);
  }
};
// 关闭tab页
const closePage = async function (id, event) {
  event.stopPropagation();
  const list = [...multiTaskTabsListShow.value];
  const index = list.findIndex(v => v.id === id);
  list.splice(index, 1);
  // 如果关闭的是当前tab页,则关闭当前tab页,选中上一个tab页;否则仅从tabs中删除关闭的tab
  if (currentId.value === id) {
    await $store.dispatch('closePageClick', { _id: id });
    if (list.length > 0) {
      const _id = list[index > 0 ? index - 1 : 0]?.id;
      _id && (await $store.dispatch('handleOpenPageClick', { _id }));
    } else {
      // 如果关闭当前页之后,没有其他tab页了,就打开空页面
      await $store.dispatch('handleOpenPageClick', { _id: 'empty' });
    }
  } else {
    $store.commit('pageContainer/setOpenedPages', list);
  }
};
const addSelectedClass = function (id) {
  return currentId.value === id ? 'isSelected' : '';
};
// 更换位置
const changePlacesHandle = async function (item) {
  //  获取当前最后一个现实tab
  const lastDisplayId = item.id;
  let lastDisplayIndex = -1;
  let itemIndex = -1;
  for (let i = 0; i < multiTaskTabsList.value.length; i++) {
    if (multiTaskTabsList.value[i].isShow) {
      lastDisplayIndex = i;
    }
    if (multiTaskTabsList.value[i].id === item.id) {
      itemIndex = i;
    }
  }
  // 交换位置
  if (lastDisplayIndex !== itemIndex) {
    multiTaskTabsList.value[itemIndex] = multiTaskTabsList.value[lastDisplayIndex];
    multiTaskTabsList.value[lastDisplayIndex] = item;
  }
  await multiTaskTabsUpdateFun('exchange', lastDisplayIndex);
  await showDropDownHideMenu();
  await _currentOperation(lastDisplayId); // 操作当前选中状态
};
onMounted(() => {
  const message = {
    from: Terminal.PortalClient,
    to: Terminal.NexusClient,
    timestamp: new Date().getTime(),
    content: {
      type: BroadcastEvent.DetectPortalClient,
      payload: 'hello world',
    },
  };
  channel.debug();
  channel.broadcast(BroadcastEvent.DetectPortalClient, message);
  channel.on(BroadcastEvent.DrivePortalClient, async function (receive) {
    const { from, content } = receive;
    const { payload } = content;
    const { command, args } = payload;

    if (from === Terminal.NexusClient) {
      switch (command) {
        case 'openPage':
          await $store.dispatch('openPage', args);
          break;
        default:
          break;
      }
    }
  });
  const adaptor = new DefaultAdaptor({
    env: import.meta.env.VITE_APM_ENV,
    appId: getAppCode() || '',
    platform: 'pc',
    client: 'neural',
    isPreview: window.localStorage.getItem('isPreview') === 'true',
    showHistory: true,
    showHeader: false,
    botAvatar: '',
    userAvatar: '',
    auth: authSdk as any,
  });
  setTimeout(() => {
    uninstall.value = bootstrap({
      container: COPILOT_MODE_ID,
      adaptor: adaptor,
      config: {},
    });
  }, 1000);

  $store.dispatch('pageContainer/init');
});

onUnmounted(() => {
  uninstall.value!();
  $store.dispatch('closeAllPages');
  window.removeEventListener('resize', debounce(multiTaskTabsChange, 60, false));
  const cb = useDebounceFn(params => {
    const { toName, toUrl, id } = params;
    if (!toName || !toUrl) return;
    setTimeout(() => {
      const params = {
        id: String(id),
        url: toUrl,
        name: toName,
      };
      $store.dispatch('openPage', params);
    }, 800);
  }, 200);
  channel.on('openPageInApplication', cb);
});

// 处理全屏
const tabIsFullscreen = ref(false);
const handleFullscreenTab = () => {
  handleFold();
  // 类型切换太快，会影响图标
  setTimeout(() => {
    tabIsFullscreen.value = !tabIsFullscreen.value;
  }, 200);
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
@import '@/styles/breadCrumbsUl.scss';

.multitasktabs-popover.el-popover {
  width: auto !important;
  padding: 0 5px 0 0;
  margin-top: 10px !important;
  border: none;
  border-radius: 2px !important;
  @extend .L2;

  .popover-ul {
    height: 56px;
    @extend .UL-LI;
  }
}

.neural-appspace-container {
  #nprogress {
    .bar {
      background: rgba(0, 0, 0, 0.05) !important;
      height: 100%;
    }

    .peg {
      box-shadow: none;
    }
  }
}
.sapce-menu-container {
  padding: 0 0 !important;
  width: fit-content !important;
  max-width: 1200px !important;
}
</style>
