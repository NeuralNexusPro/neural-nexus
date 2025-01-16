import * as uuid from 'uuid';
import { ChannelMessage, MessageProtocol  } from '../type';
import { CHANNEL_MANAGER_SYMBOL } from '../master/manager';

export const messageBuilder = function<T> (type: string, payload: T, source: string, target?: string): ChannelMessage<any> {
  return {
    type,
    payload,
    source,
    timestamp: new Date().getTime(),
    id: uuid.v4(),
    crossFrame: window[CHANNEL_MANAGER_SYMBOL],
    target
  }
}

export const messageParser = function(message: MessageProtocol<any>) {
  const { type, payload, group } = message;
  return {
    type,
    payload,
    group
  }
}