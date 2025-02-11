import { useRef } from 'react';
import { useMessages, MessageProps } from '@chatui/core';
import { MessageWithoutId } from '@/model/message';

export interface IUserMessage extends MessageWithoutId {

}

export default function useNexusMessages (initialState: MessageWithoutId[] = []) {
  const {
    messages,
    prependMsgs,
    appendMsg,
    updateMsg,
    deleteMsg,
    resetList,
  } = useMessages(initialState);
  const waitingRef = useRef<string|number>();


  const appendSystemLoading = function (payload: MessageProps) {
    waitingRef.current = payload._id; 
    appendMsg(payload);
  }

  const closeSystemLoading = function () {
    if (waitingRef.current) {
      deleteMsg(waitingRef.current);
      waitingRef.current = undefined;
    }
  }

  return {
    messages,
    prependMsgs,
    appendMsg,
    updateMsg,
    deleteMsg,
    resetList,
    appendSystemLoading,
    closeSystemLoading,
  }
}