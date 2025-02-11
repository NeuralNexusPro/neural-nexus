import React, { FC, useCallback, useEffect } from 'react';
import classNames from "classnames";
import { isRunningInMobile } from "@/utils/common";
import ComponentLoader from '../component-loader';
import CommonText from '../common-text';
import { Composer } from '@/components/composer';
import { shallow } from "zustand/shallow";
import { forwardRef, useImperativeHandle } from 'react';
import Navbar from '@/components/nav';
import useStore from '@/store';
import { WaitingMessageClass, TSend } from '@/adaptor/base';
import useNexusMessages from '../../hooks/useMessage';
import { NexusSystemMessage, NexusUserMessage, MessageWithoutId } from '@/model/message';
import DynamicWebComponent from '../web-component';
import './index.scss';
// 引入组件
import Chat, { Bubble, MessageProps, QuickReplyItemProps, ToolbarItemProps } from '@chatui/core';
// 引入样式

export interface IChatContainerProps {
  title: string;
  initialMessages: MessageWithoutId[];
  quickReplies: QuickReplyItemProps[];
  toolbars: ToolbarItemProps[];
  showHeader?: boolean;
  waitingMessageClass: WaitingMessageClass<any>;
  handleQuickReplyClick?: (item: QuickReplyItemProps) => void;
  components: {
    [key: string]: React.FC<any> | string;
  };
  onSend: TSend;
} 

const ChatContainer:FC<IChatContainerProps> = forwardRef((props: IChatContainerProps, ref)  => {
  const { initialMessages, quickReplies, waitingMessageClass, handleQuickReplyClick, components, title, 
    toolbars = [], onSend, showHeader = false } = props;
  const isMobile = isRunningInMobile();
  const setWaitting = useStore(state => state.setWaiting);
  // 消息列表
  const messageHandler = useNexusMessages(initialMessages);
  const { messages, appendMsg, appendSystemLoading, closeSystemLoading } = messageHandler;
  const headerRender = useCallback(() => {
    return showHeader ? Navbar({ title }) : <div/>;
  }, [ showHeader, title ])

  useImperativeHandle(ref, () => { 
    send
  });


  useEffect(() => useStore.subscribe(
    (state) => state.waiting,
    (waiting) => {
      if (waiting && waitingMessageClass) {
        const message = new waitingMessageClass();
        appendSystemLoading(message);
      } else {
        closeSystemLoading();
      }
    },
    {
      equalityFn: shallow,
      fireImmediately: true,
    }
  ), []);



  // 发送回调
  async function send(type, val) {
    const message = new NexusUserMessage({
      type,
      content: val,
    });
    appendMsg(message.toJSON());
    if (onSend) {     
      setWaitting(true);
      const content = await onSend(message);
      if (Array.isArray(content)) {
        content.forEach(msg => {
          const systemMessage = new NexusSystemMessage(msg);
          appendMsg(systemMessage.toJSON());
        })
      } else {
        const systemMessage = new NexusSystemMessage(content);
        appendMsg(systemMessage.toJSON());
      }
      setWaitting(false);
      // closeSystemLoading();
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function finalHandleQuickReplyClick(item) {
    if (handleQuickReplyClick) {
      handleQuickReplyClick(item)
    } else {
      send('text', item.name);
    }
  }

  

  function renderMessageContent(msg: MessageProps) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case 'markdown':
        return (
          <CommonText data={content}/>
        )
      case 'web-component': 
        return (
          <DynamicWebComponent {...content} />
        )
      default:
        return <ComponentLoader components={components} code={type} data={content} />
    }
  }

  return (
    <div
      className={classNames(
        "chat-container",
        isMobile ? "chat-container-mobile" : "chat-container-pc"
      )}
    >
      <div className="chat">
        <Chat
          navbar={{ title }}
          renderNavbar={headerRender}
          messages={messages}
          renderMessageContent={renderMessageContent}
          quickReplies={quickReplies}
          onQuickReplyClick={finalHandleQuickReplyClick}
          onSend={send}
          toolbar={toolbars}
          Composer={Composer}
        />
      </div>
    </div>    

  );
});

export default ChatContainer;