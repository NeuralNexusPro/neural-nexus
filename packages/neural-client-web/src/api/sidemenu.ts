import { ROLE_PAGE_URL } from '../config/env.js';

const _sidemenus = [
  {
    id: 'taobao',
    icon: 'additionalaction',
    name: '淘宝',
    path: 'taobao',
  },
  {
    id: 'aliyun',
    icon: 'additionalaction',
    name: 'aliyun',
    path: 'https://aliyun.com',
  }
];

export default {
  getSideMenus(cb: any) {
    cb && cb(_sidemenus);
    return _sidemenus;
  },
};

export const setApplicationMenus = (menus: any) => {
  if (!Array.isArray(menus) || !menus?.length) {
    return;
  }
  const application = _sidemenus.find(v => v.id === 'application');
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  application.childrens.push(...menus);
};
