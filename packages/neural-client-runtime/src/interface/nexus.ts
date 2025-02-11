import { IChatContext } from '@neural-nexus/nexus-protocol';

export enum NexusMessageType {
  CARD = "card",
  TEXT = "text",
}

export interface INexusMessage<T> {
  // 消息类型
  type: string;
  // 消息内容
  payload: T;
  // 容器ID
  container?: string;
  // 消息上下文
  context?: IChatContext[],
}

export interface ITextMsgPayload {
  text: string,
  show?: boolean,
  notTriggerAPI?: boolean
}

export interface ICardMsgPayload<T = any> {
  code: string,
  data: T,
  position?: string
}
export interface Nexus {
  /**
   * 发送系统消息
   * @param payload 消息数据
   */
  sendSystemMsg<T>(payload: INexusMessage<T>): void;
  /**
   * 发送用户消息
   * @param payload 消息数据
   */
  sendUserMsg<T>(payload: INexusMessage<T>): void;

  /**
   * 更新上次回答结果
   * @param content 回答内容
   */
  updateLastResult(content: string): void;

  /**
   * 复制文本到CUI输入框中
   * @param text 复制的文本内容
   */
  applyText(text: string): void;
}