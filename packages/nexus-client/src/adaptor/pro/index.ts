import BaseAdapter, { Context, TPlatform, WaitingMessageClass } from "../base";
import {
  CommonAnswer,
  IFrameContainer,
} from "@/custom-components";
import { NexusSystemMessage } from "../../model/message";
import { QuickReplyItemProps, MessageProps, ToolbarItemProps } from '@chatui/core';
import { uuid } from "@/utils/common";

export default class ProAdaptor implements BaseAdapter {
  bot = null;
  env;
  title="智能助理";
  platform = "mobile" as TPlatform;
  instanceId = uuid();

  context = new Context<{
    basename: string;
    chat: {
      lastResult: string;
    };
    clientId: string;
  }>({
    basename: undefined,
    chat: {
      lastResult: "",
    },
  });
  components = {
    "common-answer": CommonAnswer,
    "iframe-container": IFrameContainer,
  };
  botAvatar =
    "https://res.ennew.com/image/png/2635bd03786f165928b46727ce84ef87.png?optimize=true";
  userAvatar =
    "https://res.ennew.com/image/png/63b2d2c6c561e42873eb220c282159ac.png?optimize=true";
  placeholder = "请输入你的问题…";

  constructor(config?: {[key: string]: any}) {
    this.init(config || {});
    Object.assign(this, config);
  }

  async init(_config?: {[key: string]: any}) {
  }

  send(msg: MessageProps): object | Promise<MessageProps[]> | Promise<MessageProps> | Promise<null> {
    console.log('im sending a message', msg);

    return {
      ...msg,
      type: 'text',
      content: `收到消息 ${msg.content}`,
    }
  }


  getInitActions(): Promise<QuickReplyItemProps[]> | QuickReplyItemProps[] {
    return [];
  }

  getToolbars(): Promise<ToolbarItemProps[]> | ToolbarItemProps[] {
    return [];
  }

  getWelcomeMessage() {
    return [];
  }

  getWaitingMessage(): WaitingMessageClass<any> {
    return class extends NexusSystemMessage {
      constructor(message = {}) {
        super(message);
        this.type = 'text';
        this.content = `智能助理正在分析中...`;

        return this;
      }
    };
  }
}
