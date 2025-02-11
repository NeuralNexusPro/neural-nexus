import { BroadcastEvent } from '@neural-nexus/nexus-protocol';
import { Action } from '@neural-nexus/neural-client-runtime';
import { Manager, getManagerInstance } from '@neural-nexus/neural-channel';

export default class PCAction implements Action {
  channel: Manager = getManagerInstance();

  register = (name, clientCode, cb) => {
    this.channel.on(BroadcastEvent.TriggerPortalAction, (payload: any) => {
      if (payload.name === name && (!payload?.clientCodeList?.length || payload.clientCodeList.includes(clientCode))) {
        cb(payload.params);
      }
    });
  };

  trigger = (name, params = {}, clientCodeList: string[] = []) => {
    this.channel.broadcast(BroadcastEvent.TriggerPortalAction, { name, params, clientCodeList });
  };
}
