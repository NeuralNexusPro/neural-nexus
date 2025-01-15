import { ChannelMessage } from '../type';
export declare const messageBuilder: <T>(type: string, payload: T, source: string, target?: string) => ChannelMessage<any>;
