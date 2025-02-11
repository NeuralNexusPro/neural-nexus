import { getAppCode } from '@/utils/common';
import { axios } from './http';

// mock 接口  对接真实接口后可删除
export const getAppConfig = () => {
  return new Promise(reslove => {
    setTimeout(() => {
      const app = {
        logo: 'FILE_18964631118528',
        image: 'FILE_18964631480192',
        title: '欢迎是用恩牛智能工作台',
        subTitle: '你可以随时查看业务进展，了解你所关心的内容',
        background: '#9b9b9b',
        showTask: true,
        showNotice: true,
        showSituation: true,
        menus: [
          {
            key: '1',
            level: 1,
            name: '一级菜单1',
            icon: 'ency-shouye',
            goPage: { subAppId: 'workbench', type: '0' },
            goPageType: 'asset',
            openMethod: '0',
            children: [
              {
                key: '1-1',
                level: 2,
                name: '1-1级菜单',
                icon: 'ency-shouye',
                goPage: { subAppId: 'workbench', type: '0' },
                goPageType: 'asset',
                openMethod: '0',
                children: [
                  {
                    key: '1-1-1',
                    level: 3,
                    name: '1-1-1级菜单',
                    icon: 'ency-shouye',
                    goPage: { subAppId: 'workbench', type: '0' },
                    goPageType: 'asset',
                    openMethod: '0',
                  },
                ],
              },
              {
                key: '1-2',
                level: 2,
                name: '1-2级菜单',
                icon: 'ency-shouye',
                goPage: { subAppId: 'workbench', type: '0' },
                goPageType: 'asset',
                openMethod: '0',
              },
              {
                key: '1-3',
                level: 2,
                name: '1-3级菜单',
                icon: 'ency-shouye',
                goPage: { subAppId: 'workbench', type: '0' },
                goPageType: 'asset',
                openMethod: '0',
              },
            ],
          },
          {
            key: '2',
            level: 1,
            name: '一级菜单2',
            icon: 'customize',
            iconSvg: {
              svgId: 'FILE_18963528071680',
              svgUrl: 'blob:http://localhost:8088/7ca8e133-08d4-4dbe-9351-2970f727b4d3',
            },
            goPage: { subAppId: 'workbench', type: '0' },
            goPageType: 'asset',
            openMethod: '0',
          },
        ],
      };
      reslove(app);
    }, 1000);
  });
};

