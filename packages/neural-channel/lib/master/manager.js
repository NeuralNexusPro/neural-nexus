import MessageBufferQueue from './message-buffer';
import { logger } from '../utils/log';
import { MessageType } from '../type';
import { messageBuilder, messageParser } from '../message/message';
export const CHANNEL_MANAGER_SYMBOL = Symbol('ChannelManager');
export default class MessageChannelManager {
    constructor(options = {}) {
        var _a;
        this.channels = new Map();
        this.groupChannels = new Map();
        this.isMainWindow = false;
        this.enableLogging = false;
        this.bufferQueue = new MessageBufferQueue(10);
        this.masterEventMap = new Map();
        this.onMessage = (event) => {
            const { type, soruce, target, payload } = event.data;
            const { type: messageType, payload: messagePayload, group } = messageParser(payload);
            switch (type) {
                case MessageType.HANDSHAKE:
                    this.handleClientHandshake(event.data);
                    break;
                case MessageType.DISCONNECT:
                    this.disconnect(soruce);
                    break;
                case MessageType.BROADCAST_REQUEST:
                    this.broadcastMessage(payload);
                    break;
                case MessageType.UNICAST_REQUEST:
                    {
                        if (target) {
                            this.sendMessage(payload, target);
                        }
                        else {
                            this.handleClientEvent(messageType, messagePayload);
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
        };
        this.getChannelPort = (channelName) => {
            if (!this.channels.has(channelName)) {
                this.logger.error(`不存在该 channel: ${channelName}`);
            }
            const channel = this.channels.get(channelName);
            return channel.remotePort;
        };
        this.handleClientEvent = (eventName, payload) => {
            if (this.masterEventMap.has(eventName)) {
                const listeners = this.masterEventMap.get(eventName);
                listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => listener(payload));
            }
        };
        this.handleClientHandshake = (event) => {
            var _a;
            if (event instanceof CustomEvent) {
                const { id, type, source, payload } = event.detail;
                if (this.bufferQueue.has(id)) {
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
                    this.logger.error('当前 client 已握手!', source);
                }
                const { group } = payload;
                const messageChannel = new MessageChannel();
                const clientPort = messageChannel.port1;
                const remotePort = messageChannel.port2;
                const ports = {
                    clientPort,
                    remotePort
                };
                clientPort.onmessage = this.onMessage;
                this.channels.set(source, ports);
                if (group) {
                    if (this.groupChannels.has(group)) {
                        const groupChannels = this.groupChannels.get(group);
                        this.groupChannels.set(group, [...groupChannels, ports]);
                    }
                    else {
                        this.groupChannels.set(group, [ports]);
                    }
                }
                const message = {
                    port: remotePort
                };
                const channelMessage = messageBuilder(MessageType.HANDSHAKE_REPLY, message, this.name);
                const handshakeReplyEvent = new CustomEvent(MessageType.HANDSHAKE_REPLY, {
                    detail: channelMessage
                });
                window.dispatchEvent(handshakeReplyEvent);
            }
            else {
                const { id, type, source } = event.data;
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
                const messageChannel = new MessageChannel();
                const clientPort = messageChannel.port1;
                const remotePort = messageChannel.port2;
                const ports = {
                    clientPort,
                    remotePort
                };
                clientPort.onmessage = this.onMessage;
                this.channels.set(source, ports);
                const channelMessage = messageBuilder(MessageType.HANDSHAKE_REPLY, MessageType.HANDSHAKE_REPLY, this.name);
                (_a = event.source) === null || _a === void 0 ? void 0 : _a.postMessage(channelMessage, { targetOrigin: '*', transfer: [remotePort] });
            }
        };
        if (window.isMainWindow) {
            this.logger.warn('不能重复注册 channel master');
            return;
        }
        if (window[CHANNEL_MANAGER_SYMBOL]) {
            return window[CHANNEL_MANAGER_SYMBOL];
        }
        this.name = 'master';
        this.enableLogging = (_a = options.enableLogging) !== null && _a !== void 0 ? _a : false;
        this.logger = logger('ChannelManger', this.enableLogging);
        window.__messageChannelManagerInstance__ = this;
    }
    setup() {
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
        };
    }
    on(eventName, callback) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName);
            this.masterEventMap.set(eventName, [...listeners, callback]);
        }
        else {
            this.masterEventMap.set(eventName, [callback]);
        }
    }
    trigger(eventName, payload) {
        if (this.masterEventMap.has(eventName)) {
            const listeners = this.masterEventMap.get(eventName);
            listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => listener(payload));
        }
    }
    disconnect(channelName) {
        const channelPorts = this.channels.get(channelName);
        if (channelPorts) {
            channelPorts.clientPort.close();
            channelPorts.remotePort.close();
            this.channels.delete(channelName);
            this.logger.info(`Channel "${channelName}-${this.name}" disconnect`);
        }
    }
    broadcast(eventName, payload) {
        const message = {
            type: eventName,
            payload
        };
        const channelMessage = messageBuilder(MessageType.BROADCAST, message, this.name);
        this.broadcastMessage(channelMessage);
    }
    broadcastMessage(message) {
        for (const [_, ports] of this.channels) {
            ports.remotePort.postMessage(message);
        }
    }
    multicast(groupName, eventName, payload) {
        const message = {
            type: eventName,
            group: groupName,
            payload
        };
        const channelMessage = messageBuilder(MessageType.BROADCAST, message, this.name);
        this.multicastMessage(groupName, channelMessage);
    }
    multicastMessage(groupName, message) {
        const groupChannels = this.groupChannels.get(groupName);
        groupChannels.forEach(channel => {
            channel.remotePort.postMessage(message);
        });
    }
    sendTo(eventName, payload, target) {
        if (!this.channels.has(target)) {
            this.logger.error(`${target} 接收方不存在!`);
        }
        const message = {
            type: eventName,
            payload
        };
        const channelMessage = messageBuilder(MessageType.UNICAST, message, this.name, target);
        this.sendMessage(channelMessage, target);
    }
    sendMessage(messsage, target) {
        const channelPorts = this.channels.get(target);
        channelPorts.remotePort.postMessage(messsage);
    }
}
//# sourceMappingURL=manager.js.map