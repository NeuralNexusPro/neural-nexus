import Reconciler, { IOnePage } from '../base/reconciler';
import { channel } from '@neural-nexus/portal-channel';
import { ChannelMessageType } from '..//message';

export default class IframeReconciler extends Reconciler {
  disconnect: any;
  iframeNode: HTMLIFrameElement | null;

  static URL_RGX = /(\/\/)?([^\/\s]+\/?)(.*)/i;

  constructor(view: IOnePage, globalState: {[key: string]: any} = {}, iframeContentId: string) {
    super(view, globalState, iframeContentId);
    this.disconnect = null;
    this.iframeNode = null;
  }

  create () {
    super.create();
  }

  start () {
    super.start();
    if (!this.view.data.url) {
      channel.send(ChannelMessageType.PAGE_LOADING_FINISH);
      return
    }
    channel.send(ChannelMessageType.PAGE_LOADING_START);

    this.disconnect = channel.handshake({
      container: this.view.mountNode,
      url: this.view.data.url,
      name: `ennIframe-${this.view.data.id}`,
      classListArray: ['postmate-injected-iframe'],
    });
    this.iframeNode = (this.view.mountNode as HTMLElement).childNodes[0] as HTMLIFrameElement;
    const onLoad = () => {
      channel.send(ChannelMessageType.PAGE_LOADING_FINISH);

      console.log('iframe on load');
      // mount hook
      this.iframeNode?.contentWindow?.postMessage(
        {
          type: '@@cb.request.mount',
          payload: this.globalState,
        },
        this.iframeNode.src
      );
    };

    if (this.iframeNode) {
      (this.iframeNode as any).attachEvent && (this.iframeNode as any).attachEvent('onload', onLoad);
      this.iframeNode.onload = onLoad;
    }
  }

  pause () {
    super.pause();
    (this.iframeNode as HTMLIFrameElement)?.contentWindow?.postMessage(
      {
        type: '@@cb.request.unActive',
        payload: this.view.data,
      },
      (this.iframeNode as HTMLIFrameElement).src
    );
  }

  resume (isActive: boolean, isResume: boolean) {
    super.resume(isActive, isResume);

    this.iframeNode?.contentWindow?.postMessage(
      {
        type: '@@cb.request.active',
        payload: this.view.data,
      },
      this.iframeNode.src
    );
  }

  stop () {
    super.stop();
  }

  destroy () {
    // unmount hook

    this.iframeNode &&
      (this.iframeNode.contentWindow as Window)?.postMessage(
        {
          type: '@@cb.request.unmount',
          payload: this.globalState,
        },
        this.iframeNode.src
      );
      
    this.disconnect();
    super.destroy();
  }

  restart () {
    channel.send(ChannelMessageType.PUSH_ROUTER_STACK, {
      type: "iframe",
      view: this.view.data,
      ...this.getPath()
    })

    super.restart();
  }

  refresh (isActive: boolean) {
    super.refresh(isActive);
  }

  update (payload = {}) {
    // 更新发消息
    this.iframeNode &&
      (this.iframeNode.contentWindow as Window).postMessage(
        {
          type: '@@cb.request.update',
          payload,
        },
        this.iframeNode.src
      );
  }
}

