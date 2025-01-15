import { MessageProtocol } from '../type';
export default class ChannelClient {
    master: MessagePort | undefined;
    name: string;
    private enableLogging;
    eventMap: Map<string, Function[]>;
    eventListener: (event: MessageEvent) => void;
    private logger;
    constructor(name: string, options: any);
    on(type: string, callback: (...any: any[]) => void): void;
    private onMasterMessage;
    sendTo: <T>(message: MessageProtocol<T>, target?: string) => void;
    broadcast: <t>(message: MessageProtocol<t>) => void;
    disconnect: () => void;
    handshake(): () => void;
}
