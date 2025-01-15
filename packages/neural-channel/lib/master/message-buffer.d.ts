export default class MessageBufferQueue {
    queue: string[];
    size: number;
    constructor(size?: number);
    add(id: string): void;
    has(id: any): boolean;
}
