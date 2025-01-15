export function logger(module, enable) {
    const prefix = 'neural-channel';
    return {
        info: function (message) {
            const timestamp = new Date().toISOString();
            enable && console.log(`[${prefix}:${module} ${timestamp}] ${message}`);
        },
        error: function (message) {
            const timestamp = new Date().toISOString();
            enable && console.error(`[${prefix}:${module} ${timestamp}] ${message}`);
        },
        warn: function (message) {
            const timestamp = new Date().toISOString();
            enable && console.warn(`[${prefix}:${module} ${timestamp}] ${message}`);
        }
    };
}
//# sourceMappingURL=log.js.map