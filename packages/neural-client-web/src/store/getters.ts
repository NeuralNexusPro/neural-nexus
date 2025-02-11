import * as _ from 'lodash';
import { IPage } from './modules/page-container';
import { getLeafMenus } from '@/utils/common';
export const isNotExist = (state: any) => {
  if (!Array.isArray(state.pageInfo)) return;
  return state.pageInfo.filter((x: any) => x.id === state.activeIndex.toString())?.length > 0;
};
export const getPageFromMenu = (state: any) => {
  return (_id: any) => {
    const allPages = _.uniqBy([...state.menus, ...state.pageContainer.openedPages, ...getLeafMenus(state.pageContainer.menuPages)], 'id');
    return allPages.find((item: IPage) => item.id === _id);
  };
};
export const getPageByUrl = (state: any) => {
  return (url: any) => {
    let findItem = null;
    state.menus.map((item: any) => {
      if (item.path === url.toString()) {
        findItem = item;
      }
      if (item.childrens) {
        const subFindItem = item.childrens.find((x: any) => x.path === url.toString());
        if (subFindItem) {
          findItem = subFindItem;
        }
      }
    });
    return findItem;
  };
};

export const _currentOutPageItem = (state: any) => {
  return (_id: any) => state.multiTaskTabsList.find((x: any) => x.id === _id.toString());
};
export const _currentPagesIndex = (state: any) => {
  return (_id: any) => state.pageInfo.findIndex((x: any) => x.id === _id.toString());
};
export const tabLength = (state: any) => state.multiTaskTabsList.length;
export const _tabIdIndex = (state: any) => {
  return (_id: any) => state.multiTaskTabsList.findIndex((x: any) => x.id === _id.toString());
};
