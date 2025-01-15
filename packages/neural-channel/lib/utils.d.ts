import { ChannelPorts } from './type';
export declare function validateChannelName(channelName: string, channels: Map<string, ChannelPorts>): void;
export declare function log(message: string, enableLogging: boolean, level?: 'log' | 'error'): void;
