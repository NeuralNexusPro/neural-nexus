import { ManagerOptions } from '../type';
export declare const CHANNEL_MANAGER_SYMBOL: unique symbol;
export default class MessageChannelManager {
    private channels;
    private isMainWindow;
    private readonly enableLogging;
    private bufferQueue;
    private masterEventMap;
    private logger;
    name: string;
    constructor(options?: ManagerOptions);
    setup(): void;
    private onMessage;
    getChannelPort: (channelName: string) => MessagePort;
    on(eventName: string, callback: (...any: any[]) => void): void;
    trigger<T>(eventName: string, payload?: T): void;
    disconnect(channelName: string): void;
    private handleClientEvent;
    private handleClientHandshake;
    broadcast<T>(message: T): void;
    sendTo<T>(message: T, target: string): void;
}
