import BrowserStorage from '@/plugins/storage';
import { getAppIdFromRoute } from '../utils/format';
import { OFFLINE_STORE_CURRENT_PAGE_ID, OFFLINE_STORE_OPEN_PAGES } from '../config/constants';
import * as types from './mutation_types';
import {
  addRouterName,
  formatMenu,
  objDeepCopy,
  addTitleAtr,
  deepFlatten,
  menuCombination,
  Logger,
  isUndefine,
  isNull,
  findPage,
  idSplitPath,
  getHashByString,
} from '@/utils/format';

let browserStorage: any = null;
let runtime: any = null;
let _selfs: any = null;
let _iframeContentId: any = null;

// 初始化数据
export const initData = async ({ dispatch, commit, state }: any, params: any) => {
  Logger('渲染顺序').info('初始化数据');
  const { currentRouteName } = state;
  const { isAjaxAPICallBack, sidemenu, routerName, appId, iframeContentId, currentRefreshUrl, runtime: r } = params;
  let menuData = null;
  _iframeContentId = iframeContentId || 'iframe-container';
  const historyId = getAppIdFromRoute();
  currentRefreshUrl && commit(types.SET_CURRENTREFRESHURL, currentRefreshUrl || '');
  commit(types.SET_CURRENTROUTENAME, routerName);
  if (isAjaxAPICallBack) {
    menuData = await isAjaxAPICallBack();
  } else {
    menuData = await sidemenu;
  }
  menuData = formatMenu(menuData || []);
  runtime = r;
  browserStorage = new BrowserStorage(`${appId}/${routerName}`, {
    logger: Logger('离线存储').info,
  });
  if (isUndefine(menuData)) {
    return;
  }
  const flatMenu = deepFlatten(menuData);
  const pagesInfo = addTitleAtr(routerName, flatMenu).filter((el: any) => el.isLastLevel);
  const [head = {}] = pagesInfo;
  const { id = '' } = head;
  const storageCurrentId = await browserStorage.get(OFFLINE_STORE_CURRENT_PAGE_ID);
  storageCurrentId &&
    commit(types.SET_CURRENTSTATES, {
      activeIndex: storageCurrentId,
      menuActiveIndex: storageCurrentId,
      openeds: menuCombination(storageCurrentId),
    });
  const storageTabList = (await browserStorage.get(OFFLINE_STORE_OPEN_PAGES)) || [];
  const storagePageInfo = addRouterName(currentRouteName, storageTabList);
  if (storagePageInfo.length > 0) {
    if (storagePageInfo.length === 1) {
      commit(types.SET_BREADCRUMBSLIST, storagePageInfo);
    }
  }

  commit(types.SET_FIRSTLINKID, id);
  commit(types.SET_MENUS, pagesInfo);
  // commit('pageContainer/setOpenedPages', storagePageInfo);
  commit(types.SET_SIDEBARMENUDATA, objDeepCopy(menuData));
};

export const openPageFromRoute = async ({ dispatch, state, getters }: any, payload: any) => {
  const { firstLinkId } = state;
  const { appId } = payload;
  const isRootApp = appId === '/';
  if (!runtime.currentPage && isRootApp) {
    const headPage = getters.getPageFromMenu(firstLinkId);
    dispatch('openPage', headPage);
  } else {
    let page = getters.getPageFromMenu(appId);
    if (!page) {
      runtime.ui.openToast({
        message: '应用地址错误，未找到合法的子应用! 我们将回到第一个页面！',
        type: 'warning',
      });
      page = getters.getPageFromMenu(firstLinkId);
    }
    dispatch('openPage', page);
  }
};



export const setCurrentStates = ({ commit }: any) => {
  const { id } = runtime.currentPage.data;
  commit(types.SET_CURRENTSTATES, {
    activeIndex: id,
    menuActiveIndex: id,
    openeds: menuCombination(id),
  });
};

/**
 * 如果没有路径或者菜单，就去到第一个TAB位置，绑定真实数据时，再分情况
 * 1. 没有权限弹一个窗，叉掉后跳一个页面，只有头部，内容页面空白，两个选一个
 * 2. 还有种，有系统权限，有一些菜单有权限，分享的那个没有菜单，跳转第一个tab
 */
export const goToOneTab = async ({ dispatch, state }: any) => {
  if (state.multiTaskTabsList.length <= 0) {
    return;
  }
  const [head] = await runtime.getAllPages();

  await dispatch('openPage', head.data);
};

// 切换左边菜单收进淡出
export const toggleMenuClick = async ({ commit, state, dispatch }: any, callback: any) => {
  await commit(types.SET_ISSHOWMENU, !state.isShowMenu);
  callback(state.isShowMenu);
};

// 添加面包屑菜单
export const addBreadCrumbFun = async ({ dispatch, state }: any, _newObj: any) => {
  Logger('渲染顺序').info('添加面包屑菜单', _newObj);
  const { item } = _newObj;
  _selfs.$nextTick(() => {
    _selfs.$refs.navigationRef &&
      _selfs.$refs.navigationRef.parentHandleclick &&
      _selfs.$refs.navigationRef.parentHandleclick({
        id: item.id,
        toUrl: item.url,
        title: item.title,
        name: item.title,
        isShow: true,
        fullId: item.fullId,
        address: `${state.currentRouteName}/@app-${item.id}`,
      });
  });
  const { id } = state.multiTaskTabsList[0];
  await dispatch(types.SET_CURRENTSTATES, id);
};

export const updateView = async ({ state, commit, getters, dispatch }: any) => {
  Logger('渲染顺序').info('获取当前的是单应用还是多应用');
  const { tabChildren, currentRouteName } = state;
  const { data } = runtime.currentPage;
  commit(types.SET_LLPAGECURRENTLIAN, runtime.getPageSize());

  dispatch(types.SET_CURRENTSTATES, data.id);
  const tabPages = await runtime.getAllPages();
  const tabList = tabPages.map((el: any) => ({
    ...el.data,
    address: `${currentRouteName}/@app-${el.data.id}`,
    isShow: el.data.id !== 'index' && el.data.id !== 'chat',
    isSelectd: true,
    children: tabChildren,
  }));

  commit(types.SET_MULTITASKTABSLIST, tabList);
};

// 供给子组件调用更新打开当前页面
export const handleOpenPageClick = async ({ commit, dispatch, state, getters }: any, newState: any) => {
  const { _id } = newState;
  commit(types.SET_ACTIONSOURCE, 'menu');
  const page = getters.getPageFromMenu(_id);
  const outPage = getters._currentOutPageItem(_id);
  commit(types.SET_ISSTOREFRESH, !isUndefine(runtime.getPage(_id))); // 设置后，在llpage周期控制显示 false代表普通重新激活

  await dispatch('setIsOrderWaiting', false);
  // check if alive then open tab
  // await dispatch('savePath');
  await dispatch('openPage', page || outPage);
};

// 供给外部调用更新打开当前页面
export const handleTabOpenPageClick = async ({ commit, dispatch, state }: any, newState: any) => {
  const { _id } = newState;
  commit(types.SET_ACTIONSOURCE, 'tab');
  commit(types.SET_ISSTOREFRESH, !isUndefine(runtime.getPage(_id))); // 设置后，在llpage周期控制显示 false代表普通重新激活
  const page = runtime.getPage(_id);

  await dispatch('openPage', page.data);
  await browserStorage.save('ennwk_currentId', state.activeIndex);
};


export const switchTabLoading = (_: any, open = false) => {
  const _PageLoading = document.getElementsByClassName('PageLoading');
  Logger('切换 loading ').info(`开启状态: ${open}`);
  Array.from(_PageLoading).map(x => {
    // @ts-expect-error TS(2339): Property 'style' does not exist on type 'Element'.
    x.style.display = open ? 'block' : 'none';
  });
};

export const mixinsClose = async ({ dispatch, commit, state, getters }: any, _id: any) => {
  if (runtime.getPage(_id)) {
    Logger('关闭点击的单个TAB').info('从缓存里面删除');

    await runtime.closePage(_id);

    // 关闭时，同时也关闭加载效果，防止打开下一个也没关
    await dispatch('switchTabLoading');
  }
  await dispatch('pageContainer/closePage', _id);
  if (!runtime.currentPage) {
    await dispatch('pageContainer/init');
  } else {
    const { data } = runtime.currentPage;
    await commit(types.SET_LLPAGECURRENTLIAN, runtime.getPageSize());
    // 防止面包屑
    if (state.llpageCurrentLian === 1) {
      await commit(types.SET_BREADCRUMBSLIST, []);
    }
    await dispatch(types.SET_CURRENTSTATES, data.id);
    await commit('pageContainer/setActivePage', data.id);
  }
};

// 关闭点击的单个TAB
export const closePageClick = async ({ dispatch, commit, state }: any, closeObj: any) => {
  // debugger;
  const { _id } = closeObj;
  await commit(types.SET_ISSTOREFRESH, false);

  await dispatch('mixinsClose', _id);
  await commit(types.SET_MULTITASKTABSLIST, state.multiTaskTabsList);
};

// 刷新当前页面
export const refreshPageClick = async ({ dispatch }: any, _id: any) => {
  const { id } = runtime.currentPage.data;
  try {
    runtime.refresh(runtime.getPage(id));
  } catch (error) {
    Logger('渲染顺序').info('没有 refresh 方法');
  }
};

// 关闭其他页面
export const closeOthersPageClick = async ({ dispatch, commit, state, getters }: any, _id: any) => {
  // Note: 这里不需要关闭其他了，在路由监听时，就添加了,所以关闭所有
  const currentPage = runtime.currentPage;
  const { data } = currentPage;
  await runtime.closeOthersPage(data.id);
  Logger('渲染顺序').info('关闭其他页面', runtime);
  await dispatch('updateView');
};

// 外部调用方法

export const openPageById = async ({ getters, dispatch }: any, payload: any) => {
  const page = getters.getPageFromMenu(payload);
  if (!page) {
    runtime.ui.openToast({
      // @ts-expect-error TS(2304): Cannot find name 'id'.
      message: `应用${id} 不存在!`,
      type: 'warning',
    });
    return;
  }

  dispatch('openPage', page);
};

// 打开页面
export const openPage = async ({ commit, dispatch, state }: any, payload: any) => {
  if (isNull(payload) || isUndefine(payload)) {
    runtime.ui.openToast({
      message: '没有权限哟，打不开，此页面不存在,我们回到第一个TAB！',
      type: 'warning',
    });
    dispatch('goToOneTab');
    return;
  }

  const { id, name, title, path, url, address } = payload;
  // console.log(await runtime.getAllPages());
  await runtime.openPageByPageInfo({
    id: id,
    title: name || title,
    url: path || url,
    Logger: Logger,
    storagePath: address || `/${state.currentRouteName}/${`@app-${id}`}`,
    iframeContentId: _iframeContentId,
    currentRouteName: state.currentRouteName,
  });
  await dispatch('pageContainer/pushPage', payload);
  // await dispatch('updateView');
};

// 设置Tab标题
export const setTabTitle = ({ dispatch, commit, state }: any, { _currentId = '1-1', _title = '哈哈哈' }) => {
  const _multiTaskTabsList = state.multiTaskTabsList;
  const _tabIdIndex = _multiTaskTabsList.findIndex((x: any) => x.id === _currentId.toString());
  if (_tabIdIndex > -1) {
    _multiTaskTabsList[_tabIdIndex].title = _title;
    commit(types.SET_MULTITASKTABSLIST, _multiTaskTabsList);
  } else {
    dispatch('openMessageToast', {
      customClass: 'app-shell-ui', // 必填
      message: '设置标题失败',
    });
  }
};

// App shell 传递消息给子应用
export const llpageUpdate = ({ commit }: any, { pagePath, payload }: any) => {
  const page = findPage(pagePath, runtime);
  page && page.po && page.po.update(payload);
};

// 获取全局信息
export const getGlobalState = ({ commit }: any, initialState = {}) => {
  // 如 登陆后的用户信息之类的
  return { ...initialState };
};

// 设置是否初始化布局，是的话，给左菜单的动画是否初始化
export const setIsInitialLayout = ({ commit }: any, isFlag = true) => {
  commit(types.SET_ISINITIALLAYOUT, isFlag);
};

// 设置单应用里的路由面包屑菜单
export const setBreadCrumbs = ({ dispatch, commit, state }: any, breadCrumbs: any) => {
  if (!state.isOnlyOnePage) {
    dispatch('openMessageToast', {
      customClass: 'app-shellui', // 必填
      message: '只有在单应用下才能唤起',
    });
    return;
  }
  const breadCrumbsItem = {
    ...breadCrumbs,
    isShow: true,
  };

  _selfs.$nextTick(() => {
    _selfs.$refs.navigationRef.parentHandleclick(breadCrumbsItem);
  });
  const _temp = [...state.breadCrumbsList, ...[breadCrumbsItem]];
  commit(types.SET_BREADCRUMBSLIST, _temp);
  commit(types.SET_MULTITASKTABSLIST, [state.breadCrumbsList[0]]);
};

// 清除缓存（tab）
export const clearTab = ({ commit }: any) => {
  commit(types.SET_MULTITASKTABSLIST, []);
};

export const openOuterPage = async ({ dispatch, getters, state, commit }: any, payload: any) => {
  const { url, name, icon } = payload;
  const innerPage = getters.getPageByUrl(url);
  let page = null;
  if (innerPage) {
    page = {
      id: innerPage.id,
      title: innerPage.name || innerPage.title,
      url: innerPage.path || url,
      iframeContentId: _iframeContentId,
    };
  } else {
    const id = getHashByString(url);
    page = {
      id,
      title: name,
      url: url,
      iframeContentId: _iframeContentId,
    };
  }
  await runtime.openPageByPageInfo(page);
  await dispatch('setCurrentStates', page.id);
  commit(types.SET_LLPAGECURRENTLIAN, runtime.getPageSize());
  // await dispatch('updateView');
  commit('nav/setAppWindowActive', true);
  await dispatch('pageContainer/pushPage', page);
};

export const setToken = async ({ commit }: any, payload: any) => {
  commit(types.SET_TOKEN, payload.value);
};
export const setIsOrderWaiting = async ({ commit }: any, payload: any) => {
  commit(types.SET_ORDER_WAITING, payload);
};

export const setRoleConfig = async ({ commit }: any, payload: any) => {
  commit(types.SET_ROLE_CONFIG, payload);
};
