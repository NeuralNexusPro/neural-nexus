import { getQuery } from '@/utils/common';

const projectNo = getQuery('_iop_projectNo');
const appNo = getQuery('_iop_appNo');
const tzAppCode = getQuery('_iop_tzAppCode');

const basePath = window.BASE_PATH ? window.BASE_PATH.slice(1) : 'neural-client-pro';

const state = {
  isOnlyOnePage: false, // 是否只会有一个页面
  firstLinkId: null, // 记录左菜单能点的第一个链接
  sidebarMenuData: null,
  isStoreFresh: false, // 在llpage周期控制显示 false代表普通重新激活
  isShowMenu: true,
  multiTaskTabsList: [],
  breadCrumbsList: [],
  // 菜单数据
  menus: [],
  activeIndex: null, // 当前选中的菜单ID
  menuActiveIndex: null, // 当前选中的菜单ID的全路径（带有父子关系）
  openeds: [],
  sideMenuListData: [], // Mock.sideMenuMock,
  llpageObj: null,
  llpageCurrentLian: 1,
  tabLength: 0,
  cunPages: [],
  currentPagesIndex: 0, // 打开的iframe记录
  currentPageItem: null, // 打开的对象
  isLLpageConsole: true, // 是否显示浮动的console
  isOpenPageFromeOutSide: false, // 是否从外部打开的,供给外部打开页面用
  isInitialLayout: true, // 是否初始化进入菜单 false 动画进场 true 进场无动画
  currentRouteName: basePath, // 当前路由的名字
  isNotShowDomBreadCrumbs: true, // 面包屑是否隐藏 true 为显示
  actionSource: '', // ''、tab、menu 区分点击源
  currentRefreshUrl: '',
  token: null,
  auth: true,
  basename: basePath ? `${basePath}/@app-role-workbench` : '/iop-role-workbench-front/@app-role-workbench',
  projectNo,
  appNo,
  tzAppCode,
  roleConfig: {},
  isOrderWaiting: false,
  workbenchMenus: [],
  pageTabs: [],
  showMenu: false,
  collectedMenus: [],
  logoId: '',
  operationManager: null,
  userInfo: {},
  leftMenuIcon: 'https://res.ennew.com/image/png/41b5944a261ece860105d7926a0e81af.png',
};

export default { ...state };
