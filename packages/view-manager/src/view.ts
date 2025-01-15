import Reconciler, { IOnePage, IframeReconciler, MicroAppReconciler, QiankunReconciler } from '@neural-nexus/portal-view-reconciler';
import { createPage, Page } from 'llpage';
import { channel } from '@neural-nexus/portal-channel';
export enum ChannelMessageType {
  APP_DESTORY = 'app_destory'
}


export interface IViewOpts {
  id: string;
  title: string;
  url: string;
  context: {[key: string]: any};
  storagePath: string;
  iframeContentId: string;
  currentRouteName: string;
  urlQuery: string;
}

export interface IPage extends IViewOpts  {
  rootNode: HTMLElement | null;
  mountNode: HTMLElement | null;
  entity: Reconciler;
}

export enum ReconcilerType {
  QIANKUN = 'qiankun',
  MICROAPP = 'microapp',
  IFRAME = 'iframe'
}


export default class View {
  id: string;
  page: Page;
  reconcilerType: ReconcilerType;
  entity: Reconciler;
  rootNode: HTMLElement | null;
  mountNode: HTMLElement | null;
  url: string;
  title: string;
  data: any;

  constructor(opts: IViewOpts) {
    const { id, title, url, context, storagePath, iframeContentId, currentRouteName, urlQuery } = opts;
    const pattern = url.match(/^(\w+)\:\/\//) || [];
    // if (!pattern) throw new Error(`接入的视图无效! 请检查视图地址! ${url}`);
    const [_, scheme] = pattern;

    this.id = id;
    this.url = url;
    this.title = title;

    console.log(scheme, 'scheme')
    const createEntity = (page: IOnePage) => {
      switch (scheme) {
        case ReconcilerType.MICROAPP:
          return new MicroAppReconciler(page, context, iframeContentId);
        case ReconcilerType.QIANKUN:
          return new QiankunReconciler(page, context, iframeContentId);
        default:
          return new IframeReconciler(page, context, iframeContentId);
      }
    }

    const pageObj = {
      data: {
        id,
        title,
        url,
        context,
        currentRouteName,
        storagePath,
        urlQuery
      },
      po: null,
      async onCreate () {
        this.po.create();
        return this.data;
      },
      async onStart () {
        if (!this.po.view.mountNode) throw new Error("集成应用挂在节点不存在!");
        await this.po.start();
    
        return this.data;
      },
      async onPause () {
        await this.po.pause();
    
        return this.data;
      },
      async onResume () {
        await this.po.resume(true, true);
    
        return this.data;
      },
      async onStop () {
        this.po.stop();
    
        return this.data;
      },
      async onDestroy () {
        await this.po.destroy();
          
        channel.send(ChannelMessageType.APP_DESTORY);
    
        return this.data;
      },
      async onRestart () {
        this.po.restart();
    
        return this.data;
      },
      async onRefresh (isActive: boolean) {
        this.po.refresh(isActive);
    
        return this.data;
      }
    } as any
    pageObj.po = createEntity(pageObj);
    this.page = createPage<IOnePage>(pageObj);

    return this;
  }

}