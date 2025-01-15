import { ChannelPorts } from './type';

export function validateChannelName(channelName: string, channels: Map<string, ChannelPorts>): void {
    if (!channelName || typeof channelName !== 'string') {
        throw new Error('Channel name must be a non-empty string');
    }
    if (channels.has(channelName)) {
        throw new Error(`Channel "${channelName}" is already registered`);
    }
}

export function log(message: string, enableLogging: boolean, level: 'log' | 'error' = 'log'): void {
    if (enableLogging) {
        const timestamp = new Date().toISOString();
        console[level](`[MessageChannelManager ${timestamp}] ${message}`);
    }
}