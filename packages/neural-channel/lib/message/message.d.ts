import { ChannelMessage, MessageProtocol } from '../type';
export declare const messageBuilder: <T>(type: string, payload: T, source: string, target?: string) => ChannelMessage<any>;
export declare const messageParser: (message: MessageProtocol<any>) => {
    type: string;
    payload: any;
    group: string;
};
