import { inject } from 'vue';
import { BroadcastEvent, IMessage, Terminal, MessageSource } from '@neural-nexus/nexus-protocol';
import { Nexus, INexusMessage } from '@neural-nexus/neural-client-runtime';
import { CHAT_MODE_ID, COPILOT_MODE_ID } from '@/config/constants';
import { getManagerInstance, Manager } from '@neural-nexus/neural-channel';

export default class PCNexus implements Nexus {
  store: any;
  channel = getManagerInstance()
  constructor(options: any) {
    const { store } = options;
    this.store = store;
  }

  private createMessage<T>(message: INexusMessage<T>, source: MessageSource): IMessage {
    const activeNav = this.store.state.nav.active;
    const isInCopilotMode = activeNav === 'application';
    const defaultTargetId = isInCopilotMode ? COPILOT_MODE_ID : CHAT_MODE_ID;
    const { type, payload, context, container } = message;

    return {
      from: Terminal.PortalClient,
      to: Terminal.NexusClient,
      targetId: container || defaultTargetId,
      timestamp: new Date().getTime(),
      content: {
        type,
        context,
        payload,
        messageSource: source,
      },
    };
  }
  sendUserMsg = <T>(message: INexusMessage<T>) => {
    const msg = this.createMessage(message, MessageSource.USER);
    this.channel.broadcast(BroadcastEvent?.DriveNexusClient, msg);
  };

  sendSystemMsg = <T>(message: INexusMessage<T>) => {
    const msg = this.createMessage(message, MessageSource.SYSTEM);
    this.channel.broadcast(BroadcastEvent?.DriveNexusClient, msg);
  };
  updateLastResult = (text: string) => {
    const message: IMessage = {
      from: Terminal.PortalClient,
      to: Terminal.NexusClient,
      targetId: CHAT_MODE_ID,
      timestamp: new Date().getTime(),
      content: {
        type: 'updateLastResult',
        payload: {
          text,
        },
        messageSource: MessageSource.SYSTEM,
      },
    };
    this.channel.broadcast(BroadcastEvent?.DriveNexusClient, message);
  };
  applyText = (text: string) => {
    const message: IMessage = {
      from: Terminal.PortalClient,
      to: Terminal.NexusClient,
      targetId: CHAT_MODE_ID,
      timestamp: new Date().getTime(),
      content: {
        type: 'applyText',
        payload: {
          text,
        },
        messageSource: MessageSource.SYSTEM,
      },
    };
    this.channel.broadcast(BroadcastEvent?.DriveNexusClient, message);
  };
}
