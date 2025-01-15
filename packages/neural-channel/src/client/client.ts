import { ChannelMessage, MessageProtocol, MessageType } from '../type';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager' ;
import { messageBuilder } from '../message/message';
import { logger } from '../utils/log'

export default class ChannelClient {
  master: MessagePort | undefined;
  name: string;
  private enableLogging: boolean = false;
  eventMap: Map<string, Function[]>;
  eventListener: (event: MessageEvent) => void;
  private logger;

  constructor(name: string, options) {
    this.name = name;
    this.enableLogging = options.enableLogging || false;
    this.logger = logger(name, this.enableLogging);
  }

  on(type: string, callback: (...any) => void) {
    if (!this.eventMap.has(type)) {
      this.eventMap.set(type, [ callback ]);
    } else {
      const currentListeners = this.eventMap.get(type) as Function[];
      this.eventMap.set(type, [ ...currentListeners, callback])
    }
  }

  private onMasterMessage = (event: MessageEvent) => {
    const { data } = event;
    const { type, payload } = data;

    if (!this.eventMap.has(type)) console.warn(`消息 ${type} 不存在可处理逻辑!`);
    const handlers = this.eventMap.get(type);

    handlers?.forEach(handler => {
      handler(payload);
    });
  }

  sendTo = <T>(message: T, target?: string) => {
    if (!this.master) {
      this.logger.error('请先执行 handshake!')
      return;
    }
    const channelMessage = messageBuilder(
      MessageType.UNICAST_REQUEST,
      message,
      this.name,
      target
    )
    this.master.postMessage(channelMessage);
  }

  broadcast = <t>(message: t) => {
    if (!this.master) {
      this.logger.error('请先执行 handshake!')
      return;
    }
    const channelMessage = messageBuilder(
      MessageType.BROADCAST_REQUEST,
      message,
      this.name,
    )
    this.master.postMessage(channelMessage);
  }

  disconnect = () => {
    if (window[CHANNEL_MANAGER_SYMBOL]) {
      const master = window[CHANNEL_MANAGER_SYMBOL];
      master.disconnect(this.name);
    } else {
      const data: ChannelMessage<string> = messageBuilder(
        MessageType.DISCONNECT,
        MessageType.DISCONNECT,
        this.name,
      ) 
      window.postMessage(data, "*");
      window.removeEventListener("message", this.eventListener);
    }
  }
    
  handshake() {
    if (window[CHANNEL_MANAGER_SYMBOL]) {
      const master = window[CHANNEL_MANAGER_SYMBOL];
      this.master = master.getChannelPort();
      if (this.master) {
        this.master.onmessage = this.onMasterMessage;
      }
    } else {
      const data: ChannelMessage<string> = messageBuilder(
        MessageType.HANDSHAKE,
        MessageType.HANDSHAKE,
        this.name,
      ) 
      const self = this;
      this.eventListener = (event: MessageEvent) => {
        const { type } = event.data;
        switch(type) {
          case MessageType.HANDSHAKE_REPLY: {
            const [ masterPort ] = event.ports;
            self.master = masterPort;
            self.master.onmessage = self.onMasterMessage;
          }
        }
      }
      window.addEventListener('message', this.eventListener);
      window.postMessage(data, "*");
    }

    return this.disconnect
  }
}