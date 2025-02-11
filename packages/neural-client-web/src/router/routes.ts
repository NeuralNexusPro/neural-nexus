import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/404.vue';
import NotPermission from '@/views/401.vue';

export type TMenuItem = {
  key: string;
  label: string;
  tag?: string;
  href?: string;
  icon?: string;
  suffixIcon?: string;
  disabled?: boolean;
  hidden?: boolean;
  children?: TMenuItem[];
};

type RouteItem = RouteRecordRaw & { name: string } & {
  meta?: {
    label: TMenuItem['label'];
    hidden?: TMenuItem['hidden'];
    icon?: TMenuItem['icon'];
    disabled?: TMenuItem['disabled'];
    noHref?: boolean;
  };
} & { children?: RouteItem[] };

let routes: RouteItem[] = [
  {
    path: '/',
    name: 'default',
    component: Home,
  },
  {
    path: '/neural-client',
    name: 'homepage',
    component: Home,
  },

  {
    path: '/neural-client/401',
    name: '401',
    component: NotPermission,
  },
  // TODO: 验证
  {
    path: '/neural-client/:pathMatch(@app-.*)*',
    name: 'homepage',
    component: Home,
  },

  {
    path: '/login',
    name: 'loginpage',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: NotFound,
  },
];
export default routes;
