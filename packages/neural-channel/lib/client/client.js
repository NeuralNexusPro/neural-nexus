import { MessageType } from '../type';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager';
import * as uuid from 'uuid';
import { messageBuilder, messageParser } from '../message/message';
import { logger } from '../utils/log';
export default class ChannelClient {
    constructor(name, options) {
        this.enableLogging = false;
        this.eventMap = new Map();
        this.onMasterMessage = (event) => {
            const { data } = event;
            const { type, payload } = messageParser(data);
            if (!this.eventMap.has(type))
                console.warn(`消息 ${type} 不存在可处理逻辑!`);
            const handlers = this.eventMap.get(type);
            handlers === null || handlers === void 0 ? void 0 : handlers.forEach(handler => {
                handler(payload);
            });
        };
        this.send = (eventName, payload) => {
            if (!this.master) {
                this.logger.error('请先执行 handshake!');
                return;
            }
            const message = {
                type: eventName,
                payload
            };
            const channelMessage = messageBuilder(MessageType.UNICAST_REQUEST, message, this.name);
            this.master.postMessage(channelMessage);
        };
        this.sendTo = (eventName, payload, target) => {
            if (!this.master) {
                this.logger.error('请先执行 handshake!');
                return;
            }
            const message = {
                type: eventName,
                payload
            };
            const channelMessage = messageBuilder(MessageType.UNICAST_REQUEST, message, this.name, target);
            this.master.postMessage(channelMessage);
        };
        this.broadcast = (eventName, payload) => {
            if (!this.master) {
                this.logger.error('请先执行 handshake!');
                return;
            }
            const message = {
                type: eventName,
                payload
            };
            const channelMessage = messageBuilder(MessageType.BROADCAST_REQUEST, message, this.name);
            this.master.postMessage(channelMessage);
        };
        this.disconnect = () => {
            this.eventMap.clear();
            this.master = undefined;
            this.send(MessageType.DISCONNECT, MessageType.DISCONNECT);
        };
        this.name = name;
        this.enableLogging = options.enableLogging || false;
        this.group = options.group;
        this.logger = logger(name, this.enableLogging);
        return this;
    }
    on(type, callback) {
        if (!this.eventMap.has(type)) {
            this.eventMap.set(type, [callback]);
        }
        else {
            const currentListeners = this.eventMap.get(type);
            this.eventMap.set(type, [...currentListeners, callback]);
        }
    }
    remove(eventName) {
        if (this.eventMap.has(eventName)) {
            this.eventMap.delete(eventName);
        }
    }
    handshake() {
        const self = this;
        this.eventListener = (event) => {
            if (event instanceof CustomEvent) {
                const detail = event.detail;
                const { type, payload } = detail;
                switch (type) {
                    case MessageType.HANDSHAKE_REPLY: {
                        self.master = payload.port;
                        self.master.onmessage = self.onMasterMessage;
                    }
                }
            }
            else {
                const { type } = event.data;
                switch (type) {
                    case MessageType.HANDSHAKE_REPLY: {
                        const [masterPort] = event.ports;
                        self.master = masterPort;
                        self.master.onmessage = self.onMasterMessage;
                    }
                }
            }
            this.logger.info('handshake succuess!');
            window.removeEventListener("message", this.eventListener);
        };
        const data = messageBuilder(MessageType.HANDSHAKE, {
            name: this.name,
            id: `${this.name}-${uuid.v4()}`,
            group: this.group
        }, this.name);
        if (window[CHANNEL_MANAGER_SYMBOL]) {
            window.addEventListener(MessageType.HANDSHAKE_REPLY, this.eventListener);
            const event = new CustomEvent(MessageType.HANDSHAKE, {
                detail: data
            });
            window.dispatchEvent(event);
        }
        else {
            window.addEventListener('message', this.eventListener);
            window.parent.postMessage(data, "*");
        }
        return this.disconnect;
    }
    multicast(groupName, eventName, payload) {
        if (!groupName) {
            this.logger.error('组播必须设定传递的分组!');
            return;
        }
        const message = {
            type: eventName,
            payload,
            group: groupName
        };
        const data = messageBuilder(MessageType.MULTICAST_REQUEST, message, this.name);
        this.master.postMessage(data);
    }
}
//# sourceMappingURL=client.js.map