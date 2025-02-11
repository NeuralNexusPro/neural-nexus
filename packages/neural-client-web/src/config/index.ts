const open = function () {
  // const vm = this;
  return [
    {
      type: 'ShellEnnSubTitle', // 可以通过type类型来判断展示那些组件内容
      modules: [
        {
          id: 'ShellEnnSubTitle',
          refName: 'ShellEnnSubTitle',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnSubTitle.vue... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnSubTitle.vue'),
          type: 'ShellEnnSubTitle',
        },
        {
          id: 'ShellEnnSearch',
          refName: 'ShellEnnSearch',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnSearch.vue' ... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnSearch.vue'),
          type: 'ShellEnnSearch',
        },
        {
          id: 'ShellEnnContactUs',
          refName: 'ShellEnnContactUs',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnContactUs.vu... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnContactUs.vue'),
          type: 'ShellEnnContactUs',
        },
        {
          id: 'ShellEnnOther',
          refName: 'ShellEnnOther',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnOther.vue' o... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnOther.vue'),
          type: 'ShellEnnOther',
        },
        {
          id: 'ShellEnnMyCollection',
          refName: 'ShellEnnMyCollection',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnMyCollection... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnMyCollection.vue'),
          type: 'ShellEnnMyCollection',
        },
        {
          id: 'ShellEnnTodos',
          refName: 'ShellEnnTodos',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnTodos.vue' o... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnTodos.vue'),
          type: 'ShellEnnTodos',
        },
        {
          id: 'ShellEnnNotice',
          refName: 'ShellEnnNotice',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnNotice.vue' ... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnNotice.vue'),
          type: 'ShellEnnNotice',
        },
        {
          id: 'ShellEnnMore',
          refName: 'ShellEnnMore',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnMore.vue' or... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnMore.vue'),
          type: 'ShellEnnMore',
        },

        {
          id: 'ShellEnnPersonalCenter',
          refName: 'ShellEnnPersonalCenter',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnPersonalCent... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnPersonalCenter.vue'),
          type: 'ShellEnnPersonalCenter',
        },
        {
          id: 'ShellEnnSwitchProducts',
          refName: 'ShellEnnSwitchProducts',
          // @ts-expect-error TS(2307): Cannot find module '@/widgets/ShellEnnSwitchProduc... Remove this comment to see the full error message
          component: () => import('@/widgets/ShellEnnSwitchProducts.vue'),
          type: 'ShellEnnSwitchProducts',
        },
      ],
    },
  ];
};

export const openModules = (vm: any) => {
  return open.call(vm);
};
