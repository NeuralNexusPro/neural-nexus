export default {
  namespaced: true,
  state: {
    // '我的'区域激活状态
    myActive: true,
    //  '任务与动态'区域激活状态
    tasksUpdatesActive: false,
    //  'appWindow'区域激活状态
    appWindowActive: false,
    // 产品名称
    productName: '企业智能体',
    tasksUpdatesCount: 0,
    initHover: false, //产品名称初始化动画,
    taskCount: 0,
    noticeCount: 0,
    situationCount: 0,
  },
  mutations: {
    setInitHover(state, initHover: boolean) {
      state.initHover = initHover;
    },
    setMyActive(state, myActive: boolean) {
      state.myActive = myActive;
      if (state.myActive) {
        state.tasksUpdatesActive = false;
        state.appWindowActive = false;
      }
    },
    setTasksUpdatesActive(state, tasksUpdatesActive: boolean) {
      state.tasksUpdatesActive = tasksUpdatesActive;
      if (state.tasksUpdatesActive) {
        state.myActive = false;
        state.appWindowActive = false;
      }
    },
    setAppWindowActive(state, appWindowActive: boolean) {
      state.appWindowActive = appWindowActive;
      if (state.appWindowActive) {
        state.myActive = false;
        state.tasksUpdatesActive = false;
      }
    },
    setProductName(state, productName: string) {
      state.productName = productName;
    },
    setTasksUpdatesCount(state, tasksUpdatesCount: number) {
      state.tasksUpdatesCount = tasksUpdatesCount;
    },
    setTaskCount(state, taskCount: number) {
      state.taskCount = taskCount;
    },
    setNoticeCount(state, noticeCount: number) {
      state.noticeCount = noticeCount;
    },
    setSituationCount(state, situationCount: number) {
      state.situationCount = situationCount;
    },
  },
  actions: {},
};
