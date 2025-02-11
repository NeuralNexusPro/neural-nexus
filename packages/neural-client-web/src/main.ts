import { createApp, provide } from 'vue';
import '@/assets/css/index.css';
import '@/assets/theme/index.css';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import { Manager } from '@neural-nexus/neural-channel';
import OperationManager from '@/plugins/operationManager';
import { SET_OPERATION_MANAGER } from '@/store/mutation_types';

// TODO: 迁移：

import store from './store';
import SvgIcon from '@/components/SvgIcon.vue';
// iconfonts
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont';

// 全局样式
import '@/styles/index.scss';
//  vite svg register
import 'virtual:svg-icons-register';

import App from './App.vue';
import router from './router';

async function init() {
  const channel = new Manager({
    enableLogging: true
  });
  channel.setup();
  const app = createApp(App);
  app.component('SvgIcon', SvgIcon);
  app.use(store);
  app.provide('channel', channel);
  store.commit(SET_OPERATION_MANAGER, new OperationManager(50));
  app.use(ElementPlus);
  app.use(router).mount('#app');
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component as any)
  }

  window.Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
      console.warn('用户已授权');
    } else {
      console.warn('用户未授权');
    }
  });
}

init();
