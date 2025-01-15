import microApp, { unmountApp } from '@micro-zoe/micro-app';
import Reconciler, { IDestoryOptions, IOnePage } from '../base/reconciler';
import { getMetaInfo, getRequest } from '../utils';
import { ChannelLifecycleMessageType } from '..//message';
export default class MicroAppReconciler extends Reconciler {

  static URL_RGX = /(microapp:\/\/)?([^\/\s]+\/?)(.*)/i;

  microAppNode: HTMLElement | null;
  appId: string;
  
  constructor(view: IOnePage, globalState: {[key: string]: any} = {}, iframeContentId: string) {
    super(view, globalState, iframeContentId);
    this.microAppNode = null;
  }

  getPath(): any {
    const { baseRoute, routerPath, base, appId  } = getMetaInfo(this.view, MicroAppReconciler.URL_RGX);

    console.log(baseRoute, routerPath, base, appId);

    return {
      base, appId, baseRoute, routerPath,
      query: getRequest(`${baseRoute}${routerPath}`)
    }
  }

  create () {
    super.create();
    microApp.start();
  }

  start () {
    super.start();
    this.channelManger.trigger(ChannelLifecycleMessageType.PAGE_LOADING_START);
    // 创建 micro-app
    this.microAppNode = document.createElement('micro-app');

    const { path, query, baseRoute, routerPath, base, appId } = this.getPath();
    // push router first
    // to active micro app router
    // then load micro app

    this.channelManger.trigger(ChannelLifecycleMessageType.PUSH_ROUTER_STACK_WITH_VALIDATE, {
      type: "MicroApp",
      view: this.view.data,
      path, 
      query,
      baseRoute,
      appId
    })
    this.appId = appId;
    this.microAppNode.setAttribute('name', appId);
    this.microAppNode.setAttribute('url', `//${base}`);
    this.microAppNode.setAttribute('baseroute', baseRoute);
    this.microAppNode.setAttribute('data', JSON.stringify({
      globalState: this.globalState,
      page: this.view.data,
      routerPath
    }));

    (this.view.mountNode as HTMLElement).appendChild(this.microAppNode);
    this.channelManger.trigger(ChannelLifecycleMessageType.PAGE_LOADING_FINISH);
  }

  pause () {
    super.pause();
  }

  resume (isActive: boolean, isResume: boolean) {
    if (isActive) {
      const { baseRoute, routerPath } = this.getPath();
      (this.microAppNode as HTMLElement).setAttribute('baseroute', baseRoute);
      microApp.setData(this.appId, {
        baseRoute,
        routerPath
      })
    }
    super.resume(isActive, isResume);
  }

  stop () {
    super.stop();
  }

  destroy (opts: IDestoryOptions) {
    const { callback = () => void 0 } = opts;
    // destroy
    unmountApp(this.appId, { destroy: true }).then(callback);

    super.destroy()
  }

  restart () {
    const { path, query, baseRoute, appId } = this.getPath();
    this.channelManger.trigger(ChannelLifecycleMessageType.PUSH_ROUTER_STACK, {
      type: this.constructor.name,
      view: this.view.data,
      path,
      query,
      baseRoute,
      appId
    });
    super.restart();
  }

  refresh (isActive: boolean) {
    super.refresh(isActive);
  }

  update (payload = {}) {
    // 更新发消息
    microApp.setData(this.appId, payload)
  }
}

