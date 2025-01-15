import { channel } from '@neural-nexus/portal-channel';
import { Page } from 'llpage';
import { getMetaInfo, getRequest } from '../utils';
import { ChannelMessageType } from '../message';
export interface IDestoryOptions {
  callback?: () => void|PromiseLike<any>;
}

export interface IOnePage extends Page {
  title: string;
  url: string;
  context: {[key: string]: any};
  storagePath: string;
  iframeContentId: string;
  currentRouteName: string;
  rootNode: HTMLElement | null;
  mountNode: HTMLElement | null;
  data: any;
}

export default abstract class Reconciler {
  view: IOnePage;
  globalState: {[key: string]: any};
  iframeContentId: string;
  static URL_RGX = new RegExp("");

  constructor(view: IOnePage, globalState: {[key: string]: any} = {}, iframeContentId: string) {
    this.view = view;
    this.globalState = globalState;
    this.iframeContentId = iframeContentId
  };

  getPath() {
    const { baseRoute, appId } = getMetaInfo(this.view, (this.constructor as any).URL_RGX);

    return {
      appId,
      baseRoute,
      query: this.view?.data?.urlQuery || getRequest(baseRoute)
    }
  }

  create() {    
    this.view.rootNode = document.getElementById(this.iframeContentId);

    // 创建挂载点
    this.view.mountNode = document.createElement('div');
    this.view.mountNode.id = `page-${this.view.data.id}`;
    this.view.mountNode.className = 'initFrame create';

    (this.view.rootNode as HTMLElement).appendChild(this.view.mountNode);
  };
  start() {
    (this.view.mountNode as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
    (this.view.mountNode as HTMLElement).style.zIndex = String(10);
  };
  restart () {  
    this.view.rootNode = document.getElementById(this.iframeContentId);
    // 创建挂载点
    this.view.mountNode = document.createElement('div');
    this.view.mountNode.id = `page-${this.view.data.id}`;
    this.view.mountNode.className = 'initFrame pause';

    (this.view.rootNode as HTMLElement).appendChild(this.view.mountNode);
  };
  pause() {
    if (this.view.mountNode) {
      this.view.mountNode.style.transform = 'translate3d(-200%,0,  0)';
      this.view.mountNode.style.zIndex = String(-1);
    }
  };
  resume(isActive: boolean, isResume: boolean) {
    if (isActive) {
      channel.send(ChannelMessageType.PUSH_ROUTER_STACK, this.getPath())
    }
    if (isResume) {
      if (isActive) {
        (this.view.mountNode as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
        (this.view.mountNode as HTMLElement).style.zIndex = String(10);
      } else {
        (this.view.mountNode as HTMLElement).style.transform = 'translate3d(-200%, 0, 0)';
        (this.view.mountNode as HTMLElement).style.zIndex = String(-1);
      }

    } else {
      (this.view.mountNode as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
      (this.view.mountNode as HTMLElement).style.zIndex = String(10);
    }
  };
  stop() {
    (this.view.mountNode as HTMLElement).style.transform = 'translate3d(-200%,0,  0)';
    (this.view.mountNode as HTMLElement).style.zIndex = String(-1);
  };
  destroy(destroyOpts?: IDestoryOptions) {
    if (this.view.mountNode) {
      (this.view.rootNode as HTMLElement).removeChild(this.view.mountNode);
    }
  };
  refresh(isActive: boolean) {
    this.destroy();
    this.create();
    this.start();
    this.resume(isActive, true);
  };
  update() {

  };
}
