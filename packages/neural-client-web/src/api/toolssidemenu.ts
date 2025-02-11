const _sidemenus = [
  {
    id: '001',
    name: '天猫官网',
    icon: 'additionalaction',
    path: '//tmall.com',
  },
  {
    id: '002',
    name: '阿里云',
    icon: 'additionalaction',
    path: '//aliyun.com',
  },
  {
    id: '003',
    name: '百度',
    icon: 'additionalaction',
    path: '//echarts.apache.org/zh/index.html',
  },
  {
    id: 'v9',
    name: 'qiankun',
    icon: 'additionalaction',
    path: 'qiankun://localhost:8081',
  },
  {
    id: 'vi0',
    name: 'iframe',
    icon: 'additionalaction',
    path: '//localhost:8082',
  },
];

export default {
  getSideMenus (cb: any) {
    cb && cb(_sidemenus);
    return _sidemenus;
  },
};
