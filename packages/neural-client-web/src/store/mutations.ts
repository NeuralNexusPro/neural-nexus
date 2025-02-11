import * as types from './mutation_types';

const mutations = {
  [types.SET_FIRSTLINKID](state: any, newState: any) {
    state.firstLinkId = newState;
  },
  [types.SET_SIDEBARMENUDATA](state: any, newState: any) {
    state.sidebarMenuData = newState;
  },
  [types.SET_ISSTOREFRESH](state: any, newState: any) {
    state.isStoreFresh = newState;
  },
  [types.SET_CURRENTROUTENAME](state: any, newState: any) {
    state.currentRouteName = newState;
  },
  [types.SET_ISSHOWMENU](state: any, newState: any) {
    state.isShowMenu = newState;
  },
  [types.SET_MULTITASKTABSLIST](state: any, newState: any) {
    state.multiTaskTabsList = newState;
  },

  [types.SET_BREADCRUMBSLIST](state: any, newState: any) {
    state.breadCrumbsList = newState;
  },
  [types.SET_LLPAGECURRENTLIAN](state: any, newState: any) {
    state.llpageCurrentLian = newState;
  },
  [types.SET_MENUS](state: any, newState: any) {
    state.menus = newState;
  },
  [types.SET_CURRENTSTATES](state: any, item: any) {
    state.activeIndex = item.activeIndex;
    state.menuActiveIndex = item.menuActiveIndex;
    state.openeds = item.openeds;
  },
  [types.SET_ISOPENPAGEFROMEOUTSIDE](state: any, isFromOut: any) {
    state.isOpenPageFromeOutSide = isFromOut;
  },
  [types.SET_ISINITIALLAYOUT](state: any, isInitialLayout: any) {
    state.isInitialLayout = isInitialLayout;
  },
  [types.SET_ISNOTSHOWDOMBREADCRUMBS](state: any, newState: any) {
    state.isNotShowDomBreadCrumbs = newState;
  },
  [types.SET_CURRENTREFRESHURL](state: any, newState: any) {
    state.currentRefreshUrl = newState;
  },
  [types.SET_ACTIONSOURCE](state: any, newState: any) {
    state.actionSource = newState;
  },
  [types.SET_TOKEN](state: any, newState: any) {
    state.token = newState;
  },
  [types.SET_ORDER_WAITING](state: any, newState: any) {
    state.isOrderWaiting = newState;
  },
  [types.SET_ROLE_CONFIG](state: any, payload: any) {
    state.roleConfig = payload;
  },
  [types.SET_WORKBENCH_MENUS](state: any, newState: any) {
    state.workbenchMenus = newState;
  },
  [types.SET_PAGE_TABS](state: any, newState: any) {
    state.pageTabs = newState;
  },
  [types.SET_SHOW_MENU](state: any, newState: any) {
    state.showMenu = newState;
  },
  [types.SET_COLLECTED_MENUS](state: any, newState: any) {
    state.collectedMenus = newState;
  },
  [types.SET_LOGO_ID](state: any, newState: any) {
    state.logoId = newState;
  },
  [types.SET_OPERATION_MANAGER](state: any, newState: any) {
    state.operationManager = newState;
  },
};

export default mutations;
