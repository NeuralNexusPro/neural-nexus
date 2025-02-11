import { getLeafMenus } from '@/utils/common';
import * as _ from 'lodash';

export interface IPage {
  id: string;
  type: string;
  name: string;
  icon: string;
  path: string;
  depth: number;
  isLeaf: boolean;
  collected: boolean;
  childrens: IPage[];
}

export interface ITab {
  isShow: boolean;
  id: string;
  title: string;
  collected: boolean;
}

export default {
  namespaced: true,
  state: {
    // 当前激活的页面
    activePage: undefined,
    // 已经打开的页面
    openedPages: [],
    // 收藏的页面
    collectPages: [],
    // 与菜单绑定的页面
    menuPages: [],
    showMenuContainer: false,
    appPageConfig: new Map()
  },
  mutations: {
    setActivePage(state, pageId: string) {
      state.activePage = pageId;
    },
    setOpenedPages(state, pages: IPage[]) {
      state.openedPages = _.uniqBy(pages, 'id');
    },
    setMenuPages(state, pages) {
      state.menuPages = pages;
    },
    setShowMenuContainer(state, value: boolean) {
      state.showMenuContainer = value;
    },
    setAppPageConfig(state, config) {
      if (!state.appPageConfig.has(config.pageId)) {
        state.appPageConfig.set(config.pageId, config)
      }
    },
    removeAppPageConfig(state, pageId) {
      state.appPageConfig.delete(pageId)
    },
  },
  actions: {
    init({ commit, dispatch, state }) {
      if (!state.activePage) {
        if (state.openedPages.length <= 0) {
          commit('nav/setAppWindowActive', false, { root: true })
          return;
        }
        const [head] = state.openedPages;

        head && dispatch('openPage', head, { root: true });
      } else {
        dispatch('openPageById', state.activePage);
      }
    },
    closePage({ commit, state }, id: string) {
      commit(
        'setOpenedPages',
        state.openedPages.filter(el => el.id !== id)
      );
    },
    pushPage({ commit, state }, page: IPage) {
      const pages = [...state.openedPages, page];
      // 如果添加了一个非空页面，则需要把空页面删除
      if (page.id !== 'empty') {
        const index = pages.findIndex(v => v.id === 'empty');
        if (index > -1) {
          pages.splice(index, 1);
        }
      }
      commit('setAppPageConfig', page);
      commit('setOpenedPages', pages);
      commit('setActivePage', page.id);
    },
    initMenuPages({ commit, dispatch }, pages) {
      commit('setOpenedPages', []);
      commit('setMenuPages', pages);
    },
    openTopPage({ dispatch, state }) {
      const pages = state.menuPages;
      const openedPages = state.openedPages;
      const leafPages = getLeafMenus(pages);
      const emptyPage = {
        id: 'empty',
        name: '空页面',
        icon: 'additionalaction',
        path: `https://taobao.com`,
      };
      const topPage = leafPages.length > 0 ? leafPages[0] : emptyPage;
      if (openedPages.length === 0) {
        dispatch('openPage', topPage, { root: true });
      }
    },
  },
};
