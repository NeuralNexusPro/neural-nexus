const _sidemenus = [
  {
    id: 'robs_1',
    name: '规则管理',
    icon: 'additionalaction',
    children: [
      {
        id: 'S2',
        name: '规则库基本信息',
        type: 'link',
        path: '//aliyun.com',
      },
      {
        id: 'S23',
        name: '实体对象管理',
        type: 'link',
        path: '//www.taobao.com/',
      },
      {
        id: 'v3',
        name: '脚本规则管理',
        type: 'link',
        path: '//1688.com',
      },
      {
        id: 'v4',
        name: '脚本规则编排',
        type: 'link',
        path: '//tmall.com',
      },
      {
        id: 'V5',
        name: '校验规则',
        type: 'link',
        path: '//y.qq.com/?ADTAG=myqq#type=index',
      },
      {
        id: 'V6',
        name: '自定义业务规则',
        type: 'link',
        path: '//www.tencent.com/zh-cn',
      },
    ],
  },
  {
    id: '9999',
    name: 'qiankun',
    icon: 'additionalaction',
    path: 'qiankun://localhost:8081',
  },
  {
    id: '9990',
    name: 'iframe',
    icon: 'additionalaction',
    path: '//localhost:8082',
  },
];

export default {
  getSideMenus(cb: any) {
    cb && cb(_sidemenus);
    return _sidemenus;
  },
};
