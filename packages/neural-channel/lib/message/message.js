import * as uuid from 'uuid';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager';
export const messageBuilder = function (type, payload, source, target) {
    return {
        type,
        payload,
        source,
        timestamp: new Date().getTime(),
        id: uuid.v4(),
        crossFrame: window[CHANNEL_MANAGER_SYMBOL],
        target
    };
};
export const messageParser = function (message) {
    const { type, payload, group } = message;
    return {
        type,
        payload,
        group
    };
};
//# sourceMappingURL=message.js.map