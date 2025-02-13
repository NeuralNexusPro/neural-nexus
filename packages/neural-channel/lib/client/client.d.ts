export default class ChannelClient {
    master: MessagePort | undefined;
    name: string;
    group?: string;
    private enableLogging;
    eventMap: Map<string, Function[]>;
    eventListener: (event: MessageEvent) => void;
    private logger;
    constructor(name: string, options: any);
    on(type: string, callback: (...any: any[]) => void): void;
    remove(eventName: string): void;
    private onMasterMessage;
    send: <T>(eventName: string, payload: T) => void;
    sendTo: <T>(eventName: string, payload: T, target?: string) => void;
    broadcast: <t>(eventName: string, payload: t) => void;
    disconnect: () => void;
    handshake(): () => void;
    multicast<T>(groupName: string, eventName: string, payload: T): void;
}
