import Reconciler, { IOnePage } from '../base/reconciler';
import { Manager } from '@neural-nexus/neural-channel';
import { ChannelLifecycleMessageType } from '..//message';

export default class IframeReconciler extends Reconciler {
  disconnect: any;
  iframeNode: HTMLIFrameElement | null;
  channelManger: Manager;

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
      this.channelManger.sendTo<string>(
        ChannelLifecycleMessageType.PAGE_LOADING_FINISH, 
        ChannelLifecycleMessageType.PAGE_LOADING_FINISH,
        this.view.code
      );
      return
    }
    this.channelManger.sendTo(
      ChannelLifecycleMessageType.PAGE_LOADING_START, 
      ChannelLifecycleMessageType.PAGE_LOADING_START,      
      this.view.code
    );
    this.iframeNode = (this.view.mountNode as HTMLElement).childNodes[0] as HTMLIFrameElement;
    const onLoad = () => {
      this.channelManger.trigger(ChannelLifecycleMessageType.PAGE_LOADING_FINISH);
      // mount hook
      this.iframeNode?.contentWindow?.postMessage(
        {
          type: ChannelLifecycleMessageType.PAGE_MOUNT,
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
        type: ChannelLifecycleMessageType.PAGE_UNACTIVE,
        payload: this.view.data,
      },
      (this.iframeNode as HTMLIFrameElement).src
    );
  }

  resume (isActive: boolean, isResume: boolean) {
    super.resume(isActive, isResume);

    this.iframeNode?.contentWindow?.postMessage(
      {
        type: ChannelLifecycleMessageType.PAGE_ACTIVE,
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
          type: ChannelLifecycleMessageType.PAGE_UNMOUNT,
          payload: this.globalState,
        },
        this.iframeNode.src
      );
      
    this.channelManger.disconnect(this.view.code);
    super.destroy();
  }

  restart () {
    this.channelManger.trigger(ChannelLifecycleMessageType.PUSH_ROUTER_STACK, {
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
          type: ChannelLifecycleMessageType.PAGE_UPDATE,
          payload,
        },
        this.iframeNode.src
      );
  }
}

