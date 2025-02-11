import { transformMenuToPage } from '@/utils/common';
import BrowserStorage from '@/plugins/storage';
import { initData } from '@/store/actions' 
import { OFFLINE_STORE_CURRENT_PAGE_ID, OFFLINE_STORE_OPEN_PAGES } from '@/config/constants';
import { Logger } from '@/utils/format';

type TAppInfo = {
  appCode: string;
  projectCode: string;
  tzAppCode: string;
};

export default {
  namespaced: true,
  state: {
    logo: 'https://res.ennew.com/image/png/d7cbf46490cdfa5b592f9c2b72ae8692.png',
    image: 'https://res.ennew.com/image/png/76e8450e00d48d49d575d420ae375c1a.png?optimize=true',
    title: '欢迎使用 Neural Nexus AI Based 交互框架',
    subTitle: '',
    background: '#f3f6ff00',
    showTask: true,
    showNotice: true,
    showSituation: true,
    showRecommend: true,
    showCopilot: false,
    menus: [],
    cardList: [],
    info: {},
    customModule: [],
    runtime: undefined,
    browserStorage: undefined
  },
  mutations: {
    setLogo(state, logo) {
      if (logo) {
        state.logo = logo;
      }
    },
    setImage(state, image) {
      if (image) {
        state.image = image;
      }
    },
    setTitle(state, title) {
      if (title) {
        state.title = title;
      }
    },
    setSubTitle(state, subTitle) {
      if (subTitle) {
        state.subTitle = subTitle;
      }
    },
    setBackground(state, background) {
      if (background) {
        state.background = background;
      }
    },
    setShowTask(state, showTask) {
      state.showTask = !!showTask;
    },
    setShowNotice(state, showNotice) {
      state.showNotice = !!showNotice;
    },
    setShowSituation(state, showSituation) {
      state.showSituation = !!showSituation;
    },
    setShowRecommend(state, showRecommend) {
      state.showRecommend = !!showRecommend;
    },
    setMenus(state, menus) {
      if (Array.isArray(menus)) {
        state.menus = menus;
      }
    },
    setInfo(state, info: TAppInfo) {
      if (info) {
        state.info = info;
      }
    },
    setShowCopilot(state, show) {
      state.showCopilot = show;
    },
    setCardList(state, list) {
      state.cardList = list;
    },
    setCustomModule(state, customModule) {
      state.customModule = customModule;
    },
    setRuntime(state, runtime) {
      state.runtime = runtime;
    },
    setBrowserStorage(state, browser) {
      state.browserStorage = browser;
    }
  },

  actions: {
    async initApp({ commit, dispatch }, params) {
      try {
        const routerName = window.BASE_PATH ? window.BASE_PATH.slice(1) : 'neural-client';
        dispatch('initData', params, { root: true });
        commit('setBrowserStorage', new BrowserStorage(`${routerName}`, {
          logger: Logger('离线存储').info,
        }));
        commit('setRuntime', params.runtime);
      } catch (error) {
        console.error(error);
      }
    },
    async initInfo({ commit }, appid: string) {
    },

    async closeAllPages ({ commit, state, rootState }: any) {
      const { pageContainer } = rootState;
      const { runtime, browserStorage } = state;
      const { openedPages = [], activePage } = pageContainer;
    
      Logger('存储数据').info('开始存储打开页面数据');

      activePage && (await browserStorage.save(OFFLINE_STORE_CURRENT_PAGE_ID, activePage));
      await browserStorage.save(
        OFFLINE_STORE_OPEN_PAGES,
        openedPages.map((el: any) => {
          const { children, context, ...others } = el;
    
          return others;
        })
      );
      commit('pageContainer/setActivePage', undefined);
      await runtime.closeAllpage();
    }
  },
};
