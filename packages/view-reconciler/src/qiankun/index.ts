import { loadMicroApp } from 'qiankun';
import Reconciler, { IOnePage } from '../base/reconciler';
import { ChannelLifecycleMessageType } from '../message';
import { getMetaInfo, getRequest } from '../utils';

export default class QiankunReconciler extends Reconciler {
  microApp: any;

  static URL_RGX = /(qiankun:\/\/)?([^\/\s]+\/?)(.*)/i;
  constructor(view: IOnePage, globalState: {[key: string]: any} = {}, iframeContentId: string) {
    super(view, globalState, iframeContentId);
    this.microApp = null;
  }

  getPath(): any {
    const { routerPath, baseRoute, appId } = getMetaInfo(this.view, QiankunReconciler.URL_RGX);

    return {
      routerPath,
      baseRoute,
      appId,
      query: getRequest(`${baseRoute}${routerPath}`)
    }
  }

  setRoute() {
    const { routerPath, baseRoute, appId } = this.getPath();

    (window as any).__MICRO_APP_BASE_ROUTE__ = baseRoute;
    (window as any).__MICRO_APP_NAME__ = appId;
  }

  create () {
    super.create();
  }

  start () {
    super.start();

    const { path, query, baseRoute, appId } = this.getPath();
    this.setRoute();

    this.channelManger.trigger(ChannelLifecycleMessageType.PUSH_ROUTER_STACK_WITH_VALIDATE, {
      type: this.constructor.name,
      view: this.view.data,
      path,
      query,
      baseRoute,
      appId
    });

    // 开始挂载真正的内容
    const microAppNode = document.createElement('div');
    microAppNode.id = `qiankun-micro-app-${this.view.data.id}`;
    microAppNode.classList.add('postmate-injected-iframe');

    const { url } = this.view.data;

    this.microApp = loadMicroApp(
      {
        name: `${this.view.data.id}`,
        entry: url.slice('qiankun:'.length),
        container: `#${microAppNode.id}`,
        props: {
          globalState: this.globalState,
          page: this.view.data,
          appId: `#${microAppNode.id}`,
          ...this.view.context
        }
      },
      {
        sandbox: {
          strictStyleIsolation: false,
          experimentalStyleIsolation: true,
        },
      }
    );

    (this.view.mountNode as HTMLElement).appendChild(microAppNode);
    this.channelManger.trigger(ChannelLifecycleMessageType.PAGE_LOADING_FINISH);
  }

  pause () {
    super.pause();
    
    this.microApp && this.microApp.update && this.microApp.update({
      message: 'unActive',
      payload: this.view.data
    });
  }

  resume (isActive: boolean, isResume: boolean) {

    if (isActive) {
      this.setRoute();
    }

    this.microApp && this.microApp.update && this.microApp.update({
      message: 'active',
      payload: this.view.data
    });
    super.resume(isActive, isResume);
  }

  stop () {
    super.stop();
  }

  destroy () {
    // 销毁 qiankun 微应用
    this.microApp && this.microApp.unmount && this.microApp.unmount();
    super.destroy();
  }

  restart () {
    const { query, path, appId, baseRoute } = this.getPath();
    this.channelManger.trigger(ChannelLifecycleMessageType.PUSH_ROUTER_STACK, {
      type: this.constructor.name,
      view: this.view.data,
      path,
      query,
      appId,
      baseRoute
    })

    this.setRoute();
    super.restart();
  }

  refresh (isActive: boolean) {
    super.refresh(isActive);
  }

  update (payload = {}) {
    // 更新发消息
    this.microApp.update && this.microApp.update(payload);
  }
}
