import * as uuid from 'uuid';
import { channel, cb } from '@ennew/one-portal-channel';

export interface CommandProtocol {
  module: string;
  api: string;
  payload: any;
  from: string;
}

export enum EventType {
  command_publish = "@command/publish",
  command_execute = "@command/execute"
}
interface ICommandPublisherOptions extends ICommandQueueOptions {

}

interface ICommandQueueOptions {
  timeout: number;
  internal: number;
}

class CommandQueue {
  queue: Map<number, CommandProtocol> = new Map();
  index: Array<number> = [];
  timeout: number;
  internal: number;
  timeoutId: number | null;
  timeoutCallback: (messages:CommandProtocol[], queue: CommandQueue) => void;

  constructor(options?: ICommandQueueOptions) {
    const { timeout = 5000, internal = 1000 } = options || {};

    this.timeout = timeout;
    this.internal = internal;
  }

  add(message: CommandProtocol) {
    const timestamp = new Date().getTime();

    this.index = [ ...this.index, timestamp ].sort((a, b) => a - b);
    this.queue.set(timestamp, message);
    
    if (!this.timeoutId) this.watch();

    return timestamp;
  }

  remove(id) {
    this.index = this.index.filter(el => el !== id);
    this.queue.delete(id);
  }

  setTimeoutCallback(callback) {
    this.timeoutCallback = callback;
  }

  runTimeout = () => {
    const currentMs = new Date().getTime();
    const threshold = currentMs - this.timeout;
    const [ timeoutIndex, leftIndex ]= this.index.reduce((ret: number[][], el: number) => {
      const [ timeoutIndex, leftIndex ] = ret;
      if (el < threshold) {
        return [
          [ ...timeoutIndex, el ],
          leftIndex
        ]
      } else {
        return [
          timeoutIndex,
          [ ...leftIndex, el ]
        ]
      }
    }, [[], []]); 
    const timeoutItems = Array.from(this.queue).filter(([ key ]) => timeoutIndex.includes(key)).map(([_, value]) => value);
    this.index = leftIndex;
    timeoutIndex.forEach(key => {
      this.queue.delete(key);
    });
    this.timeoutId = null;
    if (this.index.length > 0) {
      this.watch();
    }

    if (this.timeoutCallback) {
      this.timeoutCallback(timeoutItems, this);
    }
    return timeoutItems;
  }

  watch() {
    this.timeoutId = window.setTimeout(this.runTimeout, this.internal);
  }
}


class CommandPublisher {
  commandQueue: CommandQueue;
  commandMap: Map<string, number> = new Map();

  constructor(options?: ICommandPublisherOptions) {
    this.commandQueue = new CommandQueue(options);
    this.commandQueue.setTimeoutCallback(this.retry);
    const self = this;

    const isIFrame = window.self !== window.top;
    const isContainer = location.href.indexOf('__one-portal-container__') !== -1;

    const callback = function (message: CommandProtocol & { id: string }) {
      const { id } = message;

      if (self.commandMap.has(id)) {
        const ts = self.commandMap.get(id);
        self.commandQueue.remove(ts);
      }
    }
    channel.on(EventType.command_execute, isIFrame && !isContainer ? cb.autoRun(callback) : callback);
  }

  retry = (timeoutItems: CommandProtocol[]) => {
    timeoutItems.forEach(message => {
      this.publish(message);
    });
  }

  publish(message: CommandProtocol) {
    const ts = this.commandQueue.add(message);
    const uid = uuid.v4();
    const payload = {
      ...message,
      id: uid
    }
    this.commandMap.set(uid, ts);

    channel.send(EventType.command_publish, payload);
  }
}

export default CommandPublisher;