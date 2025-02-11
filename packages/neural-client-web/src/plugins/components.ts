/*
 * 公共组件
 * */
import type { App } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import Back from '@/components/Back.vue';
import Consolep from '@/components/Consolep/index.vue';
import EpMenu from '@/components/EpMenu/index.vue';
import PageLoading from '@/components/PageLoading/index.vue';
import NotFound from '@/components/Error/NotFound.vue';
/*  统一注册 baseComponents 目录下的全部组件 */

export default {
  install: (app: App) => {
    // 引入所有组件下的安装模块
    app.component('SvgIcon', SvgIcon);
    app.component('Back', Back);
    app.component('Consolep', Consolep);
    app.component('EpMenu', EpMenu);
    app.component('PageLoading', PageLoading);
    app.component('NotFound', NotFound);
  },
};
