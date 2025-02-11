// @ts-expect-error TS(2339): Property '__ng_portal_global_context__' does not e... Remove this comment to see the full error message
const userInfoFromContext = window?.__ng_portal_global_context__?.employee;

const _shellheader = {
  themeName: 'default',
  // 系统信息
  productInfo: {
    logoName: '联合学习',
    logoUrl: '', // logo 图片
    title: '角色工作台',
    isNotShowSubTitle: false, // 副标题组件是否显示
    subtitle: 'Ency Design Pro',
    subtitleList: ['立即体验', '立即下载'],
  },
  // 用户信息
  userInfo: {},
  // 不同路由跳转
  // centerMenuList: {
  //   isShow: true,
  //   componentName: 'ShellEnnCenterTools',
  //   toolsList: [
  //     { id: 'fanneng001', title: '首页', goUrl: '/homepage/@app-' },
  //     { id: 'fanneng002', title: '工具箱', goUrl: '/tools/@app-' },
  //     { id: 'fanneng003', title: '消息', goUrl: '/aboutdemo' },
  //     { id: 'fanneng004', title: '集市', goUrl: '/market' },
  //     { id: 'fanneng005', title: '理正', goUrl: '/management/@app-' },
  //     { id: 'fanneng006', title: '获取数据DEMO', goUrl: '/datademo/@app-' },
  //     { id: 'fanneng000', title: '理正首页配置', goUrl: '/managementindex' },
  //   ]
  // },
  // tab切换(缓存当前tab页面)
  // centerTab: {
  //   isShow: true,
  //   componentName: 'ShellEnnCenterTab',
  //   toolsList: [
  //     { id: 'fanneng001', title: '首页', componentName: 'contentOne' },
  //     { id: 'fanneng002', title: '工具箱', componentName: 'contentTwo' },
  //   ]
  // },
  // 头部icon信息
  operationList: [
    {
      id: 'SA00001',
      title: '搜索框', // 文本内容不变，为了符合交互规范
      iconName: '',
      isShow: true,
      isOpenInput: false, // input框是否展开
      componentName: 'ShellEnnSearch',
      alias: 'search',
    },
    {
      id: 'SA00002',
      title: '搜索',
      iconName: 'icon-search',
      isShow: true,
      componentName: '',
      alias: 'search',
    },
    {
      id: 'SA00003',
      title: '联系我们',
      iconName: 'icon-contactus',
      isShow: true,
      componentName: 'ShellEnnContactUs',
      alias: 'contactus',
    },
    {
      id: 'SA00004',
      title: '其他',
      iconName: 'icon-additionalaction',
      isShow: true,
      componentName: 'ShellEnnOther',
      alias: 'additional',
    },
    {
      id: 'SA00005',
      title: '我的收藏',
      iconName: 'icon-favorite',
      isShow: true,
      componentName: 'ShellEnnMyCollection',
      alias: 'favorite',
    },
    {
      id: 'SA00006',
      title: '待办',
      iconName: 'icon-todos',
      isShow: true,
      componentName: 'ShellEnnTodos',
      count: 3, // 通过此属性判定是否有气泡
      alias: 'todos',
    },
    {
      id: 'SA00007',
      title: '通知',
      iconName: 'icon-notification',
      isShow: true,
      componentName: 'ShellEnnNotice',
      count: 32, // 通过此属性判定是否有气泡
      alias: 'notification',
    },
    {
      id: 'SA00008',
      title: '更多', // 是一定存在的
      iconName: 'icon-overflow',
      isShow: true,
      componentName: 'ShellEnnMore',

    },
    {
      id: 'SA0009',
      title: '个人中心', // 是一定存在的
      iconName: 'icon-touxiang',
      isShow: true,
      componentName: 'ShellEnnPersonalCenter',
      alias: 'userInfo',
    },
    {
      id: 'SA00010',
      title: '切换产品',
      iconName: 'icon-qiehuanchanpin',
      isShow: true,
      componentName: 'ShellEnnSwitchProducts',
      alias: 'switchProducts',
    },
  ],
  // 功能信息：如通知、搜索、代办......
};

export default {
  getShellHeader (cb: any) {
    cb && cb(_shellheader);
    return _shellheader;
  },
};
