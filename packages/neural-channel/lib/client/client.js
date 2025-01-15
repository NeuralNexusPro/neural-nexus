import { MessageType } from '../type';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager';
import { messageBuilder } from '../message/message';
import { logger } from '../utils/log';
export default class ChannelClient {
    constructor(name, options) {
        this.enableLogging = false;
        this.onMasterMessage = (event) => {
            const { data } = event;
            const { type, payload } = data;
            if (!this.eventMap.has(type))
                console.warn(`消息 ${type} 不存在可处理逻辑!`);
            const handlers = this.eventMap.get(type);
            handlers === null || handlers === void 0 ? void 0 : handlers.forEach(handler => {
                handler(payload);
            });
        };
        this.sendTo = (message, target) => {
            if (!this.master) {
                this.logger.error('请先执行 handshake!');
                return;
            }
            const channelMessage = messageBuilder(MessageType.UNICAST_REQUEST, message.payload, this.name, target);
            this.master.postMessage(channelMessage);
        };
        this.broadcast = (message) => {
            if (!this.master) {
                this.logger.error('请先执行 handshake!');
                return;
            }
            const channelMessage = messageBuilder(MessageType.BROADCAST_REQUEST, message.payload, this.name);
            this.master.postMessage(channelMessage);
        };
        this.disconnect = () => {
            if (window[CHANNEL_MANAGER_SYMBOL]) {
                const master = window[CHANNEL_MANAGER_SYMBOL];
                master.disconnect(this.name);
            }
            else {
                const data = messageBuilder(MessageType.DISCONNECT, MessageType.DISCONNECT, this.name);
                window.postMessage(data, "*");
                window.removeEventListener("message", this.eventListener);
            }
        };
        this.name = name;
        this.enableLogging = options.enableLogging || false;
        this.logger = logger(name, this.enableLogging);
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
    handshake() {
        if (window[CHANNEL_MANAGER_SYMBOL]) {
            const master = window[CHANNEL_MANAGER_SYMBOL];
            this.master = master.getChannelPort();
            if (this.master) {
                this.master.onmessage = this.onMasterMessage;
            }
        }
        else {
            const data = messageBuilder(MessageType.HANDSHAKE, MessageType.HANDSHAKE, this.name);
            const self = this;
            this.eventListener = (event) => {
                const { type } = event.data;
                switch (type) {
                    case MessageType.HANDSHAKE_REPLY: {
                        const [masterPort] = event.ports;
                        self.master = masterPort;
                        self.master.onmessage = self.onMasterMessage;
                    }
                }
            };
            window.addEventListener('message', this.eventListener);
            window.postMessage(data, "*");
        }
        return this.disconnect;
    }
}
//# sourceMappingURL=client.js.map