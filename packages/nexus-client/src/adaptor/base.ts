import React from "react";
// import { deepFreeze } from "@utils/common";
import { produce } from "immer";
import { INexusMessage, NexusSystemMessage } from "../model/message";
import { MessageProps, QuickReplyItemProps, ToolbarItemProps } from '@chatui/core';
/* 
  @desc 项目中全局变量的存储和修改，不会涉及渲染。
  比如来自父应用的透传，当前项目的全局变量。
 */

export type WaitingMessageClass<T extends NexusSystemMessage> = new (...args: any[]) => T;

export interface HistoryResult {
  list: MessageProps[];
  noMore: boolean;
}

export class Context<T> {
  context: T;
  constructor(value: any) {
    this.context = value;
  }

  set = (callback: (props: any) => any) => {
    this.context = produce(this.context, callback);
  };

  get = () => Object.assign({}, this.context);

  clear = () => (this.context = {} as any);
}

export type TPlatform = "mobile" | "pc";
export type TClient = "workbench" | "neural";

export type TSend = (
  msg: MessageProps
) => object | Promise<INexusMessage[]> | Promise<INexusMessage> | Promise<null>;

export default interface Adaptor {
  wideBreakpoint?: string;
  bot: any;
  components: {
    [key: string]: React.FC<any>;
  };
  context: Context<any>;
  botAvatar: string;
  userAvatar: string;
  placeholder: string;
  instanceId?: string;
  env: string;
  platform?: TPlatform;
  client?: TClient;
  title: string;
  appEntry?: string;
  // 是否展示历史记录
  showHistory?: boolean;
  getWelcomeMessage: () => Promise<MessageProps[] | MessageProps> | MessageProps[] | MessageProps;
  getQuickStartMessage?: () =>
    | Promise<MessageProps[] | MessageProps>
    | MessageProps[]
    | MessageProps;
  getInitActions: () => Promise<QuickReplyItemProps[]> | QuickReplyItemProps[];
  getToolbars: () => Promise<ToolbarItemProps[]> | ToolbarItemProps[];
  send: TSend;
  getHistory?: () => object | Promise<HistoryResult> | Promise<null>;
  getWaitingMessage?: () => WaitingMessageClass<any>;
}
