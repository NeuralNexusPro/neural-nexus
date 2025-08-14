import { ChannelMessage, MessageProtocol, MessageType } from '../type';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager' ;
import * as uuid from 'uuid';
import { messageBuilder, messageParser } from '../message/message';
import { logger } from '../utils/log'

export default class ChannelClient {
  master: MessagePort | undefined;
  name: string;
  group?: string;
  private enableLogging: boolean = false;
  eventMap: Map<string, Function[]> = new Map();
  eventListener: (event: MessageEvent) => void;
  private logger;
  private handshakeId: string;

  constructor(name: string, options) {
    this.name = name;
    this.enableLogging = options.enableLogging || false;
    this.group = options.group;
    this.logger = logger(name, this.enableLogging);
    return this;
  }

  on(type: string, callback: (...any) => void) {
    if (!this.eventMap.has(type)) {
      this.eventMap.set(type, [ callback ]);
    } else {
      const currentListeners = this.eventMap.get(type) as Function[];
      this.eventMap.set(type, [ ...currentListeners, callback])
    }
  }

  remove(eventName: string) {
    if (this.eventMap.has(eventName)) {
        this.eventMap.delete(eventName)
    }
}

  private onMasterMessage = (event: MessageEvent) => {
    const { data } = event;
    const { type, payload } = messageParser(data)
    const { type: eventName, payload: eventPayload } = payload;

    if (!this.eventMap.has(eventName)) console.warn(`消息 ${type} 不存在可处理逻辑!`);
    const handlers = this.eventMap.get(eventName);

    handlers?.forEach(handler => {
      handler(eventPayload);
    });
  }
  send = <T>(eventName: string, payload: T) => {
    if (!this.master) {
      this.logger.error('请先执行 handshake!')
      return;
    }
    const message: MessageProtocol<T> = {
      type: eventName,
      payload
    }
    const channelMessage = messageBuilder<MessageProtocol<T>>(
      MessageType.UNICAST_REQUEST,
      message,
      this.name
    )
    this.master.postMessage(channelMessage);
  }

  sendTo = <T>(eventName: string, payload: T, target?: string) => {
    if (!this.master) {
      this.logger.error('请先执行 handshake!')
      return;
    }
    const message: MessageProtocol<T> = {
      type: eventName,
      payload
    } 
    const channelMessage = messageBuilder<MessageProtocol<T>>(
      MessageType.UNICAST_REQUEST,
      message,
      this.name,
      target
    )
    this.master.postMessage(channelMessage);
  }

  broadcast = <t>(eventName: string, payload: t) => {
    if (!this.master) {
      this.logger.error('请先执行 handshake!')
      return;
    }
    const message: MessageProtocol<t> = {
      type: eventName,
      payload
    }
    const channelMessage = messageBuilder<MessageProtocol<t>>(
      MessageType.BROADCAST_REQUEST,
      message,
      this.name,
    )
    this.master.postMessage(channelMessage);
  }

  disconnect = () => {
    this.eventMap.clear();
    this.master = undefined;
    this.send(
      MessageType.DISCONNECT,
      MessageType.DISCONNECT,      
    )
  }
    
  handshake() {
    const self = this;
    this.eventListener = (event: MessageEvent | CustomEvent) => {
      if (event instanceof CustomEvent) {
        const detail = event.detail as ChannelMessage<{port: MessagePort, handshakeId: string}>;
        const { type, payload } = detail;
        switch(type) {
          case MessageType.HANDSHAKE_REPLY: {
            if (payload.handshakeId !== this.handshakeId) return;
            self.master = payload.port;
            self.master.onmessage = self.onMasterMessage;
            self.master.start();
            this.logger.info('handshake succuess!');
            window.removeEventListener("message", this.eventListener);
          }
          default:
            break;
        }
      } else {
        const { type, payload } = event.data; 
        switch(type) {
          case MessageType.HANDSHAKE_REPLY: {
            if (payload.handshakeId !== this.handshakeId) return;            
            const [ masterPort ] = event.ports;
            self.master = masterPort;
            self.master.onmessage = self.onMasterMessage;
            self.master.start();
            this.logger.info('handshake succuess!');            
            window.removeEventListener("message", this.eventListener);            
          }
          default:
            break
        }
      }
    }
    const handshakeId = `${this.name}-${uuid.v4()}`;
    this.handshakeId = handshakeId;
    const data: ChannelMessage<{name: string, group: string}> = messageBuilder(
      MessageType.HANDSHAKE,
      {
        name: this.name,
        id: handshakeId,
        group: this.group
      },
      this.name,
    ) 
    if (window[CHANNEL_MANAGER_SYMBOL]) {
      window.addEventListener(MessageType.HANDSHAKE_REPLY, this.eventListener);
      const event = new CustomEvent(MessageType.HANDSHAKE, {
        detail: data
      });
      window.dispatchEvent(event);
    } else {
      window.addEventListener('message', this.eventListener);
      try {
        if (window.parent?.__originPostMessage) {
          window.parent?.__originPostMessage(data, "*");
        } else {
          window.parent.postMessage(data, "*");
        }
      } catch (e) {
        window.parent.postMessage(data, "*");
      }

    }
    return this.disconnect
  }

  multicast<T>(groupName: string, eventName: string, payload: T) {
    if (!groupName) {
      this.logger.error('组播必须设定传递的分组!')
      return;
    }
    const message: MessageProtocol<T> = {
      type: eventName,
      payload,
      group: groupName
    }
    const data: ChannelMessage<MessageProtocol<T>> = messageBuilder(
      MessageType.MULTICAST_REQUEST,
      message,
      this.name,
    ) 
    this.master.postMessage(data)
  }
}