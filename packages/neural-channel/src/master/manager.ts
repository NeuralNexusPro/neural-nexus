import { ChannelStore, ManagerOptions, RegisterOptions, ChannelMessage, ChannelPorts } from '../type';
import MessageBufferQueue from './message-buffer' ;
import { logger } from '../utils/log'
import { MessageProtocol, MessageType } from '../type';
import { messageBuilder } from '../message/message';

export const CHANNEL_MANAGER_SYMBOL = Symbol('ChannelManager');
export default class MessageChannelManager {
    private channels: ChannelStore = new Map();
    private isMainWindow: boolean = false;
    private readonly enableLogging: boolean = false;
    private bufferQueue = new MessageBufferQueue(10);
    private masterEventMap = new Map<string, Function[]>();
    private logger;
    name: string;
    
    constructor(options: ManagerOptions = {}) {
        if (window.isMainWindow) {
            this.logger.warn('不能重复注册 channel master');
            return
        }
        if (window[CHANNEL_MANAGER_SYMBOL]) {
            return window[CHANNEL_MANAGER_SYMBOL];
        }
        this.channels = new Map();
        this.name = 'master';
        this.enableLogging = options.enableLogging ?? false;
        this.logger = logger('ChannelManger', this.enableLogging);
        window.__messageChannelManagerInstance__ = this;
    }

    public setup(): void {
        // 主应用标识
        this.isMainWindow = true;
        Object.defineProperty(window, 'isMainWindow', {
            value: true,
            writable: false,
        });
        window[CHANNEL_MANAGER_SYMBOL] = this;
        window.addEventListener('message', this.handleClientHandshake);
        this.logger.info('MessageChannelManager setup completed in main window');
    }

    private onMessage = (event: MessageEvent) => {
        const { type, soruce, target, payload } = event.data;
        switch(type) {
            case MessageType.HANDSHAKE: 
                this.handleClientHandshake(event.data);
                break;
            case MessageType.DISCONNECT:
                this.disconnect(soruce);
                break;
            case MessageType.BROADCAST_REQUEST:
                this.broadcast<any>(payload);
                break;
            case MessageType.UNICAST_REQUEST: {
                if (target) {
                    this.sendTo<any>(payload, target)
                } else {
                    this.handleClientEvent(event)
                }
            }
                break;
            default:
                break;
        }
    }

    getChannelPort = (channelName: string): MessagePort => {
        if (!this.channels.has(channelName)) {
            this.logger.error(`不存在该 channel: ${channelName}`)
        }
        const channel = this.channels.get(channelName);

        return channel.remotePort;
    }


    on(eventName: string, callback: (...any) => void) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName) as Function[];
            this.masterEventMap.set(eventName, [ ...listeners, callback]);
        } else {
            this.masterEventMap.set(eventName, [ callback ]);
        }
    }

    trigger<T>(eventName: string, payload?: T) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName);
            listeners?.forEach(listener => listener(payload));
        }
    }

    public disconnect(channelName: string): void {
        const channelPorts = this.channels.get(channelName);
        if (channelPorts) {
            channelPorts.clientPort.close();
            channelPorts.remotePort.close();
            this.channels.delete(channelName);
            this.logger.info(`Channel "${channelName}-${this.name}" disconnect`);
        }
    }

    private handleClientEvent = (event: MessageEvent): void => {
        const { type, payload, target } = event.data as ChannelMessage<any>;
        if (target && target !== this.name) {
            const channelPorts = this.channels.get(target);
            channelPorts.clientPort.postMessage(event.data)
            return;
        }
        if (this.masterEventMap.has(type)) {
            const listeners = this.masterEventMap.get(type);
            listeners?.forEach(listener => listener(payload));
        }
    }

    private handleClientHandshake = (event: MessageEvent): void =>  {
        const { id, type, source, payload } = event.data as ChannelMessage<string>;
        const messageChannel = new MessageChannel();
        const clientPort = messageChannel.port1;
        const remotePort = messageChannel.port2;
        // already in buffer queue
        if (this.bufferQueue.has(id)) {
            this.logger.warn('重复消息，已过滤', event.data);
            return;
        }
        if (type !== MessageType.HANDSHAKE) {
            this.logger.warn('非握手消息', event.data);
            return;
        }
        if (!source) {
            this.logger.error('来源不明的握手, 已拒绝!', event.data);
            return;
        }
        if (this.channels.has(source)) {
            this.logger.error('当前 client 已握手!', source);
        }
        const ports: ChannelPorts = {
            clientPort,
            remotePort
        }
        clientPort.onmessage = this.onMessage;

        this.channels.set(source, ports)        

        const channelMessage: ChannelMessage<string> = messageBuilder(
            MessageType.HANDSHAKE_REPLY,
            MessageType.HANDSHAKE_REPLY,
            this.name,
        )
        event.source?.postMessage(channelMessage, { targetOrigin: '*', transfer: [remotePort] });
    }

    broadcast<T>(message: T) {
        const channelMessage: ChannelMessage<T> = messageBuilder(
            MessageType.BROADCAST,
            message,
            this.name,
        )
        for (const [_, ports] of this.channels) {
            ports.remotePort.postMessage(channelMessage);
        }
    }

    sendTo<T>(message: T, target: string) {
        if (!this.channels.has(target)) {
            this.logger.error(`${target} 接收方不存在!`);
        }
        const channelPorts = this.channels.get(target);
        const channelMessage: ChannelMessage<T> = messageBuilder(
            MessageType.UNICAST,
            message,
            this.name,
            target
        )
        channelPorts.remotePort.postMessage(channelMessage)
    }
}