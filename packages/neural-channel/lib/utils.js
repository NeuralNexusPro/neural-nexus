export function validateChannelName(channelName, channels) {
    if (!channelName || typeof channelName !== 'string') {
        throw new Error('Channel name must be a non-empty string');
    }
    if (channels.has(channelName)) {
        throw new Error(`Channel "${channelName}" is already registered`);
    }
}
export function log(message, enableLogging, level = 'log') {
    if (enableLogging) {
        const timestamp = new Date().toISOString();
        console[level](`[MessageChannelManager ${timestamp}] ${message}`);
    }
}
//# sourceMappingURL=utils.js.map