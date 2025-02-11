// 迁移后的代码
import { createStore, createLogger } from 'vuex';
import state from './state';
import * as getters from './getters';
import * as actions from './actions';

import mutations from './mutations';

import nav from './modules/nav';
import app from './modules/app';
import notice from './modules/notice';
import pageContainer from './modules/page-container';
import runtime from './modules/runtime';

export * from './modules/nav';
export * from './modules/page-container';
export * from './modules/runtime';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
  modules: {
    nav,
    app,
    notice,
    runtime,
    pageContainer,
  },
  state,
  getters,
  mutations,
  actions,
  plugins: debug ? [createLogger()] : [],
});

export default store;
