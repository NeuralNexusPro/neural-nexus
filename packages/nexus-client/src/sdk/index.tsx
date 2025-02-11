import _React from "react";
import { memo, FC, useRef, useEffect } from "react";
import Adaptor, { WaitingMessageClass } from "../adaptor/base";
import ProAdaptor from "../adaptor/pro";
import { MessageProps, QuickReplyItemProps, ToolbarItemProps } from "@chatui/core";
import "@/styles/chatui-theme.scss";
import { Spin } from "antd";
import ChatContainer from "@/components/chat-container";
import useStore from "@/store/index";
import { initDefaultTheme } from "../utils/theme";

export type Factory<T> = { new (...any): T };
// export type BotCtx = {
//   // 添加消息
//   appendMessage(msg: Message): void;

//   // 发送消息
//   postMessage(msg: Message): void;

//   // 更新消息
//   updateMessage(msgId: string, msg: Message): void;

//   // 删除消息
//   deleteMessage(msgId: string): void;

//   // 埋点方法
//   log: {
//     // 点击埋点
//     click(params: any, logParams: any): void;

//     // 曝光埋点
//     expo(params: any, logParams: any): void;
//   };

//   // 界面相关的方法
//   ui: {
//     // 滚动消息列表到底部
//     scrollToEnd(opts?: { animated?: boolean; delay?: number }): void;

//     // 隐藏快捷短语
//     hideQuickReplies(): void;

//     // 显示快捷短语
//     showQuickReplies(): void;
//   };

//   // 配置
//   config: any;
//   // jsBridge 方法
//   JSBridge: any;
// };

export interface IChatProps {
  adaptor?: Factory<Adaptor>;
  onStart?: (bot) => void;
  config?: {[key: string]: any};
}

const Chat: FC<IChatProps> = (props: IChatProps) => {
  const { adaptor, onStart = () => {}, config } = props;
  const finalAdaptor = adaptor || ProAdaptor;

  const removeRefs = useRef<Function>();
  const instanceRef = useRef<Adaptor>();
  const setLoading = useStore((state) => state.setLoading);
  const loading = useStore((state) => state.loading);
  const initialMessages = useRef<MessageProps[]>([]);
  const quickReplies = useRef<QuickReplyItemProps[]>([]);
  const toolbars = useRef<ToolbarItemProps[]>([]);
  const waitingMessageClass = useRef<WaitingMessageClass<any>>();
  const { title, components } = instanceRef?.current || {} as Adaptor;

  useEffect(() => {
    async function bootstrap() {
      try {
        const instance = new finalAdaptor(config || {});
        instanceRef.current = instance;
        initDefaultTheme();
        initialMessages.current = await instance.getWelcomeMessage() as MessageProps[];
        quickReplies.current = await instance.getInitActions();
        toolbars.current = await instance.getToolbars();
        waitingMessageClass.current = instanceRef.current?.getWaitingMessage();
        onStart(instance);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
    return () => {
      if (removeRefs.current) removeRefs.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    loading ? (
      <Spin spinning={loading} fullscreen={true} wrapperClassName="loading" />
    ) : <ChatContainer title={title} components={components} toolbars={toolbars.current} waitingMessageClass={waitingMessageClass.current}
      initialMessages={initialMessages.current} quickReplies={quickReplies.current} onSend={instanceRef.current?.send}  />
  )
};

export default memo(Chat);
