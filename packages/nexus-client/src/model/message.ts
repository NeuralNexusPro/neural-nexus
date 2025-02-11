import { MessageProps } from '@chatui/core';
import { uuid } from '@/utils/common';
export declare type IMessageStatus = 'pending' | 'sent' | 'fail';

export interface User {
  avatar?: string;
  name?: string;
  url?: string;
  [k: string]: any;
}

export type MessageWithoutId = Omit<MessageProps, '_id'>;

export interface INexusMessage {
  type?: string;
  content?: any;
  user?: User;
  position?: 'left' | 'right' | 'center' | 'pop';
  status?: IMessageStatus;
}

export class NexusMessage implements MessageProps {
    _id: string;
    type: string;
    content?: any;
    createdAt?: number;
    user?: User;
    position?: 'left' | 'right' | 'center' | 'pop';
    hasTime?: boolean;
    status?: IMessageStatus;
    constructor(message: INexusMessage) {
      const { type, content, user = {}, position, status } = message;
      this._id = uuid();
      this.type = type || 'text';
      this.content = content;
      this.createdAt = new Date().getTime();
      this.user = user;
      this.position = position || 'right';
      this.hasTime = true;
      this.status = status || 'pending';
    }

    toJSON() { 
      return this;
    }
}

export class NexusUserMessage extends NexusMessage {
  constructor(message: INexusMessage) {
    super(message);
    this.position = 'right';
  }
}

export class NexusSystemMessage extends NexusMessage {
  constructor(message: INexusMessage) {
    super(message);
    this.position = 'left';
  }
}