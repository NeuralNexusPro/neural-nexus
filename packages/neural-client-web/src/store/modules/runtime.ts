export default {
  namespaced: true,
  state: {
    nexus: null,
    application: null,
  },
  mutations: {
    setNexus(state, value) {
      state.nexus = value;
    },
    setApplication(state, value) {
      state.application = value;
    },
  },
  actions: {},
};
