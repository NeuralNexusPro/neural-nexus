import { ChannelStore, ChannelStores, ManagerOptions, ChannelMessage, ChannelPorts } from '../type';
import MessageBufferQueue from './message-buffer' ;
import { logger } from '../utils/log'
import { MessageProtocol, MessageType } from '../type';
import { messageBuilder, messageParser } from '../message/message';

export const CHANNEL_MANAGER_SYMBOL = '___NEURAL_NEXUS_CHANNEL_SYMBOL___';
export default class MessageChannelManager {
    private channels: ChannelStore = new Map();
    private channelIndex = new Map<string, string[]>();
    private groupChannels: ChannelStores = new Map();
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
        this.name = 'master';
        this.enableLogging = options.enableLogging ?? false;
        this.logger = logger('ChannelManger', this.enableLogging);
        window.__messageChannelManagerInstance__ = this;
    }

    public setup(): () => void {
        // 主应用标识
        this.isMainWindow = true;
        Object.defineProperty(window, 'isMainWindow', {
            value: true,
            writable: false,
        });
        window[CHANNEL_MANAGER_SYMBOL] = this;
        window.addEventListener('message', this.handleClientHandshake);
        window.addEventListener(MessageType.HANDSHAKE, this.handleClientHandshake);
        this.logger.info('MessageChannelManager setup completed in main window');

        return () => {
            window.removeEventListener('message', this.handleClientHandshake);
            window.removeEventListener(MessageType.HANDSHAKE, this.handleClientHandshake);
        }
    }

    private onMessage = (event: MessageEvent) => {
        const { type, soruce, target, payload } = event.data;
        const { type: messageType, payload: messagePayload, group } = messageParser(payload)
        switch(type) {
            case MessageType.HANDSHAKE: 
                this.handleClientHandshake(event.data);
                break;
            case MessageType.DISCONNECT:
                this.disconnect(soruce);
                break;
            case MessageType.BROADCAST_REQUEST:
                this.trigger(messageType, messagePayload);
                this.broadcastMessage<any>(payload);
                break;
            case MessageType.UNICAST_REQUEST: {
                if (target) {
                    this.sendMessage<any>(payload, target)
                } else {
                    this.handleClientEvent(messageType, messagePayload)
                }
            }
                break;
            case MessageType.MULTICAST_REQUEST: {
                if (!this.groupChannels.has(group)) {
                    this.logger.error(`当前不存在组播分组 ${group}`, event.data);
                    return;
                }
                this.multicastMessage(group, payload);
            }   
            default:
                break;
        }
    }

    getChannelPort = (channelName: string): MessagePort => {
        if (!this.channels.has(channelName)) {
            this.logger.error(`不存在该 channel: ${channelName}`)
        }
        const channel = this.channels.get(channelName);

        return channel.clientPort;
    }


    on(eventName: string, callback: (...any) => void) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName) as Function[];
            this.masterEventMap.set(eventName, [ ...listeners, callback]);
        } else {
            this.masterEventMap.set(eventName, [ callback ]);
        }
    }

    remove(eventName) {
        if (this.masterEventMap.has(eventName)) {
            this.masterEventMap.delete(eventName)
        }
    }

    trigger<T>(eventName: string, payload?: T) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName);
            listeners?.forEach(listener => listener(payload));
        }
    }

    public disconnect(channelName: string): void {
        const channelNames = this.channelIndex.get(channelName) || [];
        channelNames.forEach(channelName => {
            const channel = this.channels.get(channelName);
            if (channel) {
                channel.clientPort.close();
                channel.remotePort.close();
                this.channels.delete(channelName);
                this.logger.info(`Channel "${channelName}-${this.name}" disconnect`);
            }
        })
        this.channelIndex.delete(channelName);
    }

    private handleClientEvent = (eventName: string, payload: any): void => {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName);
            listeners?.forEach(listener => listener(payload));
        }
    }
    
    private handleClientHandshake = (event: MessageEvent | CustomEvent): void =>  {
        if (event instanceof CustomEvent) {
            const { id: msgId, type, source, payload } = event.detail as ChannelMessage<{name: string, id: string, group: string}>;
            if (this.bufferQueue.has(msgId)) {
                this.logger.warn('重复消息，已过滤', event.detail);
                return;
            }
            if (type !== MessageType.HANDSHAKE) {
                this.logger.warn('非握手消息', event.detail);
                return;
            }
            if (!source) {
                this.logger.error('来源不明的握手, 已拒绝!', event.detail);
                return;
            }
            if (this.channels.has(source)) {
                this.logger.info('当前 client 已握手!', source);
            }
            const { group, id, name } = payload;
            const messageChannel = new MessageChannel();
            const clientPort = messageChannel.port1;
            const remotePort = messageChannel.port2;
            const ports: ChannelPorts = {
                clientPort,
                remotePort
            }
            clientPort.onmessage = this.onMessage;
            if (this.channelIndex.has(name)) {
                const index = this.channelIndex.get(name);
                this.channelIndex.set(name, [ ...index, id ])
            } else {
                this.channelIndex.set(name, [ id ])
            }
            this.channels.set(id, ports);

            if (group) {
                if (this.groupChannels.has(group)) {
                    const groupChannels = this.groupChannels.get(group)
                    this.groupChannels.set(group, [ ...groupChannels, ports ])
                } else {
                    this.groupChannels.set(group, [ ports ])
                }
            }
            const message = {
                port: remotePort
            }
            const channelMessage: ChannelMessage<{port: MessagePort}> = messageBuilder(
                MessageType.HANDSHAKE_REPLY,         
                message,
                this.name,
            )
            const handshakeReplyEvent = new CustomEvent(MessageType.HANDSHAKE_REPLY, {
                detail: channelMessage
            });
            window.dispatchEvent(handshakeReplyEvent);
        } else {
            const { id: msgId, type, source, payload } = event.data as ChannelMessage<{name: string, id: string, group: string}>;
            // already in buffer queue
            if (this.bufferQueue.has(msgId)) {
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
            const { group, id, name } = payload;
            const messageChannel = new MessageChannel();
            const clientPort = messageChannel.port1;
            const remotePort = messageChannel.port2;
            const ports: ChannelPorts = {
                clientPort,
                remotePort
            }
            clientPort.onmessage = this.onMessage;
            if (this.channelIndex.has(name)) {
                const index = this.channelIndex.get(name);
                this.channelIndex.set(name, [ ...index, id ])
            } else {
                this.channelIndex.set(name, [ id ])
            }
            this.channels.set(id, ports)        
            if (group) {
                if (this.groupChannels.has(group)) {
                    const groupChannels = this.groupChannels.get(group)
                    this.groupChannels.set(group, [ ...groupChannels, ports ])
                } else {
                    this.groupChannels.set(group, [ ports ])
                }
            }
            const channelMessage: ChannelMessage<string> = messageBuilder(
                MessageType.HANDSHAKE_REPLY,         
                MessageType.HANDSHAKE_REPLY,
                this.name,
            )
            event.source?.postMessage(channelMessage, { targetOrigin: '*', transfer: [remotePort] });
        }
    }

    broadcast<T>(eventName: string, payload: T) {
        const message: MessageProtocol<T> = {
            type: eventName,
            payload
        }
        const channelMessage: ChannelMessage<T> = messageBuilder(
            MessageType.BROADCAST,
            message,
            this.name,
        )
        this.broadcastMessage(channelMessage);
    }

    private broadcastMessage<T>(message: ChannelMessage<T>) {
        for (const [_, ports] of this.channels) {
            ports.clientPort.postMessage(message);
        }
    }

    multicast<T>(groupName: string, eventName: string, payload: T) {
        const message: MessageProtocol<T> = {
            type: eventName,
            group: groupName,
            payload
        }
        const channelMessage: ChannelMessage<T> = messageBuilder(
            MessageType.BROADCAST,
            message,
            this.name,
        )
        this.multicastMessage(groupName, channelMessage);
    }

    private multicastMessage<T>(groupName: string, message: ChannelMessage<T>) {
        const groupChannels = this.groupChannels.get(groupName);
        groupChannels.forEach(channel => {
            channel.clientPort.postMessage(message);
        })
    }

    sendTo<T>(eventName: string, payload: T, target: string) {
        if (!this.channelIndex.has(target)) {
            this.logger.error(`${target} 接收方不存在!`);
            return;
        }
        const message: MessageProtocol<T> = {
            type: eventName,
            payload
        }
        const channelMessage: ChannelMessage<T> = messageBuilder(
            MessageType.UNICAST,
            message,
            this.name,
            target
        )
        this.sendMessage(channelMessage, target);
    }

    private sendMessage<T>(messsage: ChannelMessage<T>, target: string) {
        if (!this.channelIndex.has(target)) {
            this.logger.error('通信接受方不存在!', target);
            return;
        }
        const channelNames = this.channelIndex.get(target);
        channelNames.forEach(name => {
            const channel = this.channels.get(name);
            if (channel) {
                channel.clientPort.postMessage(messsage)        
            }
        })
    }
}