import { TTask } from '@/types/app';
import { dispatchCustomEvent } from '@/utils/common';

export default {
  namespaced: true,
  state: {
    list: [],
    total: 0,
  },
  mutations: {
    setList(state, value: TTask[]) {
      state.list = value;
    },
    setTotal(state, value: number) {
      state.total = value;
    },
  },
  actions: {
    removeItem({ commit, state }, id: string) {
      const data = [...state.list];
      const num = state.total - 1;
      const index = data.findIndex(v => v.id === id);
      if (index > -1) {
        data.splice(index, 1);
        commit('setList', data);
        commit('setTotal', num);
      }
    },
    addItem({ commit, state }, item: TTask) {
      const data = [...state.list];
      const num = state.total + 1;
      if (item) {
        data.unshift(item);
        commit('setList', data);
        commit('setTotal', num);
      }
    },
  },
};
