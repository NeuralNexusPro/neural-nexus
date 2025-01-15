import MessageBufferQueue from './message-buffer';
import { logger } from '../utils/log';
import { MessageType } from '../type';
import { messageBuilder } from '../message/message';
export const CHANNEL_MANAGER_SYMBOL = Symbol('ChannelManager');
export default class MessageChannelManager {
    constructor(options = {}) {
        var _a;
        this.channels = new Map();
        this.isMainWindow = false;
        this.enableLogging = false;
        this.bufferQueue = new MessageBufferQueue(10);
        this.masterEventMap = new Map();
        this.onMessage = function (event) {
            const { type, soruce, target, payload } = event.data;
            switch (type) {
                case MessageType.HANDSHAKE:
                    this.handleClientHandshake(event.data);
                    break;
                case MessageType.DISCONNECT:
                    this.disconnect(soruce);
                    break;
                case MessageType.BROADCAST_REQUEST:
                    this.broadcast({ payload });
                    break;
                case MessageType.UNICAST_REQUEST:
                    {
                        if (target) {
                            this.sendTo({ payload }, target);
                        }
                        else {
                            this.handleClientEvent(event);
                        }
                    }
                    break;
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
        this.handleClientEvent = (event) => {
            const { type, payload, target } = event.data;
            if (target && target !== this.name) {
                const channelPorts = this.channels.get(target);
                channelPorts.clientPort.postMessage(event.data);
                return;
            }
            if (this.masterEventMap.has(type)) {
                const listeners = this.masterEventMap.get(type);
                listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => listener(payload));
            }
        };
        this.handleClientHandshake = (event) => {
            var _a;
            const { id, type, source, payload } = event.data;
            const messageChannel = new MessageChannel();
            const clientPort = messageChannel.port1;
            const remotePort = messageChannel.port2;
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
            const ports = {
                clientPort,
                remotePort
            };
            clientPort.onmessage = this.onMessage;
            this.channels.set(source, ports);
            const channelMessage = messageBuilder(MessageType.HANDSHAKE_REPLY, MessageType.HANDSHAKE_REPLY, this.name);
            (_a = event.source) === null || _a === void 0 ? void 0 : _a.postMessage(channelMessage, { targetOrigin: '*', transfer: [remotePort] });
        };
        if (window.isMainWindow) {
            this.logger.warn('不能重复注册 channel master');
            return;
        }
        this.channels = new Map();
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
        this.logger.info('MessageChannelManager setup completed in main window');
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
    disconnect(channelName) {
        const channelPorts = this.channels.get(channelName);
        if (channelPorts) {
            channelPorts.clientPort.close();
            channelPorts.remotePort.close();
            this.channels.delete(channelName);
            this.logger.info(`Channel "${channelName}-${this.name}" disconnect`);
        }
    }
    broadcast(message) {
        const { payload } = message;
        const channelMessage = messageBuilder(MessageType.BROADCAST, payload, this.name);
        for (const [_, ports] of this.channels) {
            ports.remotePort.postMessage(channelMessage);
        }
    }
    sendTo(message, target) {
        if (!this.channels.has(target)) {
            this.logger.error(`${target} 接收方不存在!`);
        }
        const channelPorts = this.channels.get(target);
        const { payload } = message;
        const channelMessage = messageBuilder(MessageType.UNICAST, payload, this.name, target);
        channelPorts.remotePort.postMessage(channelMessage);
    }
}
//# sourceMappingURL=manager.js.map