export type MessageHandler = (data: any) => void;
export type ChannelStore = Map<string, ChannelPorts>;
export type ChannelStores = Map<string, ChannelPorts[]>;
export type Master = 'master';
export interface ChannelMessage<T> extends MessageProtocol<T> {
    source: string;
    target?: string;
    timestamp?: number;
    crossFrame?: boolean;
    id: string;
}
export declare enum MessageType {
    HANDSHAKE = "@neural-channel/handshake",
    HANDSHAKE_REPLY = "@neural-channel/handshake-reply",
    DISCONNECT = "@neural-channel/disconnect",
    BROADCAST_REQUEST = "@neural-channel/broadcast-request",
    BROADCAST = "@neural-channel/broadcast",
    UNICAST = "@neural-channel/unicast",
    UNICAST_REQUEST = "@neural-channel/unicast-request",
    MULTICAST_REQUEST = "@neural-channel/multicast-request"
}
export interface MessageProtocol<T> {
    type: string;
    payload: T;
    group?: string;
}
export interface ManagerOptions {
    enableLogging?: boolean;
}
export interface ChannelPorts {
    clientPort: MessagePort;
    remotePort: MessagePort;
}
export interface BroadcaseMessage<T> extends MessageProtocol<T> {
}
declare global {
    interface Window {
        isMainWindow?: boolean;
        __messageChannelManagerInstance__?: any;
    }
}
