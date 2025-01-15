export default class MessageBufferQueue {
    constructor(size = 10) {
        this.queue = [];
        this.size = size;
    }
    add(id) {
        this.queue.unshift(id);
        const len = this.queue.length;
        if (len >= this.size) {
            this.queue.pop();
        }
    }
    has(id) {
        return this.queue.includes(id);
    }
}
//# sourceMappingURL=message-buffer.js.map