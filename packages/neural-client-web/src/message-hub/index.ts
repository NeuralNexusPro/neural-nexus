import CommandExecutor from '@/command/executor';
import { CommandModule, IListener, IMessage, IMessageHubOptions, IToastConfig, IWSMessage, MESSAGE_SCENE_TYPE, ToastCallbackType, ToastInteractionType } from './types';
import PCRuntime from '@/runtime';
import { Terminal } from '@neural-nexus/nexus-protocol';
import { ENCY_TOAST_TYPE_MAP } from './constants';
import { createRandomId, getCUICardParamsFromMessage } from './utils';

import NeuralWebsocketSDK from '@enn/neural-websocket-sdk';
export default class MessageHub {
  connection: NeuralWebsocketSDK;

  runtime: PCRuntime;

  commandExecutor: CommandExecutor;

  listeners: IListener[];

  private static instance: MessageHub;

  static getInstance(options: IMessageHubOptions) {
    if (!MessageHub.instance) {
      MessageHub.instance = new MessageHub(options);
    }
    return MessageHub.instance;
  }

  private constructor(options: IMessageHubOptions) {
    this.connection = new NeuralWebsocketSDK({
      ...options,
      env: options.env.replace('NEW_', ''),
    });
    this.connection.registerListener(MESSAGE_SCENE_TYPE.ALL, this._consumeMessage);
    this.connection.registerListener(MESSAGE_SCENE_TYPE.ALL, this._notifyListeners);

    this.runtime = options.runtime;
    this.commandExecutor = this.runtime.commandExecutor;
    this.listeners = [];
  }

  /**
   * 通知其他监听器
   *
   * @param {IMessage} message
   * @memberof MessageHub
   */
  _notifyListeners = (message: IMessage) => {
    const { scenario } = message;
    this.listeners.forEach((listener: IListener) => {
      if (listener.sceneType === scenario || listener.sceneType === MESSAGE_SCENE_TYPE.ALL) {
        listener.callback(message);
      }
    });
  };

  /**
   * 消息分发
   *
   * @param {IMessage} message
   * @memberof MessageHub
   */
  _consumeMessage = (message: IMessage) => {
    const { scenario, data, title, content, messageId } = message;

    switch (scenario) {
      // ws推送节点
      case MESSAGE_SCENE_TYPE.WS_COMMON:
        this._consumeWSPointMessage({
          title,
          content,
          data: JSON.parse(data),
        });
        break;

      // 卡片节点 - 关注
      case MESSAGE_SCENE_TYPE.GUAN_ZHU:
        this.commandExecutor.execute({
          module: CommandModule.Application,
          api: 'updateFollow',
          payload: [data ? JSON.parse(data) : data],
          from: Terminal.PortalClient,
        });
        break;
      // 卡片节点 - CUI
      case MESSAGE_SCENE_TYPE.CUI: {
        const payload = getCUICardParamsFromMessage(JSON.parse(data));

        this.commandExecutor.execute({
          module: CommandModule.Nexus,
          api: 'sendSystemMsg',
          payload: [
            {
              type: 'card',
              payload,
            },
          ],
          from: Terminal.PortalClient,
        });
        break;
      }
      // 站内消息 - 通知
      case MESSAGE_SCENE_TYPE.NOTIFICATION: {
        const payload = JSON.parse(data);
        if (messageId) {
          payload.id = messageId;
        }
        this.commandExecutor.execute({
          module: CommandModule.UI,
          api: 'openNotification',
          payload: [
            {
              title,
              message: content,
              pcUrl: payload.pcUrl,
            },
          ],
          from: Terminal.PortalClient,
        });

        this.commandExecutor.execute({
          module: CommandModule.Application,
          api: 'updateNotice',
          payload: [payload],
          from: Terminal.PortalClient,
        });
        break;
      }
      // 站内消息 - 示险
      case MESSAGE_SCENE_TYPE.SHI_XIAN: {
        const payload = JSON.parse(data);
        if (messageId) {
          payload.id = messageId;
        }

        this.commandExecutor.execute({
          module: CommandModule.UI,
          api: 'openNotification',
          payload: [
            {
              title,
              message: content,
              pcUrl: payload.pcUrl,
            },
          ],
          from: Terminal.PortalClient,
        });

        this.commandExecutor.execute({
          module: CommandModule.Application,
          api: 'updateWarning',
          payload: [payload],
          from: Terminal.PortalClient,
        });
        break;
      }

      // 站内消息 - 代办
      case MESSAGE_SCENE_TYPE.DAI_BAN: {
        this.commandExecutor.execute({
          module: CommandModule.UI,
          api: 'openNotification',
          payload: [
            {
              title,
              message: content,
            },
          ],
          from: Terminal.PortalClient,
        });

        this.commandExecutor.execute({
          module: CommandModule.Application,
          api: 'updateTask',
          payload: [JSON.parse(data)],
          from: Terminal.PortalClient,
        });
        break;
      }
      default:
        break;
    }
  };

  /**
   * ws推送节点处理
   *
   * @param {IWSMessage} wsMessage
   * @memberof MessageHub
   */
  _consumeWSPointMessage = (wsMessage: IWSMessage) => {
    const { title, content, data } = wsMessage;
    // 给智伴的指令
    if (data.botCommand) {
      this.commandExecutor.execute({
        module: CommandModule.Nexus,
        api: 'sendUserMsg',
        payload: [
          {
            type: 'text',
            payload: { text: data.commandContent },
          },
        ],
        from: Terminal.PortalClient,
      });
    }

    // 行动
    if (data.action) {
      try {
        const { module, api, payload } = JSON.parse(data.actionContent);
        this.commandExecutor.execute({
          module,
          api,
          payload: [payload],
          from: Terminal.PortalClient,
        });
      } catch (error) {
        console.log('[message-hub]行动指令解析不正确:', data.actionContent, error);
      }
    }

    // 轻提示
    if (data.toast) {
      this._showToast({
        ...data,
        title,
        content,
      });
    }
  };

  /**
   * ws推送节点的弹窗处理
   *
   * @param {IToastConfig} toastConfig
   * @memberof MessageHub
   */
  _showToast = (toastConfig: IToastConfig) => {
    const { title, content, toastType, interactionType } = toastConfig;
    // 非阻塞弹窗
    if (+interactionType === ToastInteractionType.Async) {
      this.commandExecutor.execute({
        module: CommandModule.UI,
        api: 'openNotification',
        payload: [
          {
            title,
            message: content,
            type: ENCY_TOAST_TYPE_MAP[toastType],
          },
        ],
        from: Terminal.PortalClient,
      });
    }

    // 阻塞弹窗
    if (+interactionType === ToastInteractionType.Sync) {
      const dialogPayload: any = {
        title,
        message: content,
        type: ENCY_TOAST_TYPE_MAP[toastType],
      };

      if (toastConfig.afterConfirm?.length > 0) {
        dialogPayload.onSuccess = this._createToastCallBack(toastConfig.afterConfirmValues, toastConfig.afterConfirm);
      }

      if (toastConfig.afterCancel?.length > 0) {
        dialogPayload.onFail = this._createToastCallBack(toastConfig.afterCancelValues, toastConfig.afterCancel);
      }

      this.commandExecutor.execute({
        module: CommandModule.UI,
        api: 'openDialog',
        payload: [dialogPayload],
        from: Terminal.PortalClient,
      });
    }
  };

  /**
   * 创建弹窗回调函数
   *
   * @param {*} callbackConfig
   * @memberof MessageHub
   */
  _createToastCallBack = (callbackConfig, configKeys) => {
    return () => {
      if (callbackConfig[ToastCallbackType.JumpUrl] && configKeys.includes(`${ToastCallbackType.JumpUrl}`)) {
        const url = callbackConfig[ToastCallbackType.JumpUrl];
        this.commandExecutor.execute({
          module: CommandModule.Application,
          api: 'openApp',
          payload: [url],
          from: Terminal.PortalClient,
        });
      }
      if (callbackConfig[ToastCallbackType.SendCUISystemMsg] && configKeys.includes(`${ToastCallbackType.SendCUISystemMsg}`)) {
        const systemMsg = callbackConfig[ToastCallbackType.SendCUISystemMsg];
        this.commandExecutor.execute({
          module: CommandModule.Nexus,
          api: 'sendUserMsg',
          payload: [
            {
              type: 'text',
              payload: {
                text: systemMsg,
              },
            },
          ],
          from: Terminal.PortalClient,
        });
      }
    };
  };

  /**
   * 用于给外部监听消息
   *
   * @param {(message: IMessage) => any} callback
   * @memberof MessageHub
   */
  registerListener = (callback: (message: IMessage) => any, sceneType = MESSAGE_SCENE_TYPE.ALL) => {
    const id = createRandomId();
    if (!(sceneType in MESSAGE_SCENE_TYPE)) {
      console.log('[message-hub]注册的消息类型有误:' + sceneType);
      return;
    }

    this.listeners.push({
      id,
      callback,
      sceneType,
    });

    return id;
  };

  removeListener = (listenerId: string) => {
    const listenerIdx = this.listeners.findIndex(listener => listener.id === listenerId);
    if (listenerIdx > -1) {
      this.listeners.splice(listenerIdx, 1);
    }
  };
}
