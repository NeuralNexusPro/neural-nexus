import * as uuid from 'uuid';
import { ChannelMessage  } from '../type';

export const messageBuilder = function<T> (type: string, payload: T, source: string, target?: string): ChannelMessage<any> {
  return {
    type,
    payload,
    source,
    timestamp: new Date().getTime(),
    id: uuid.v4(),
    target
  }
}