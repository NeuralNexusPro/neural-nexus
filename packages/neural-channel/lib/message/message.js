import * as uuid from 'uuid';
export const messageBuilder = function (type, payload, source, target) {
    return {
        type,
        payload,
        source,
        timestamp: new Date().getTime(),
        id: uuid.v4(),
        target
    };
};
//# sourceMappingURL=message.js.map