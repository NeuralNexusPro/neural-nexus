import { getManagerInstance } from '@neural-nexus/neural-channel';
import PCRuntime from '../runtime';
import { inject } from 'vue';
import * as _ from 'lodash';
import { EventType, CommandProtocol } from '@neural-nexus/neural-client-runtime';
import store from '@/store';
import { OperationManagerInstance } from '@/plugins/operationManager';

export default class CommandExecutor {
  channel: Manager;
  runtime: PCRuntime;
  
  constructor(runtime: PCRuntime) {
    this.channel = getManagerInstance();
    this.runtime = runtime;
    this.channel.on(EventType.command_publish, (message: CommandProtocol) => {
      this.execute(message);
    });
  }

  execute(message: CommandProtocol) {
    const operationManager: OperationManagerInstance = store.state.operationManager;
    const { module, api, payload, id } = message;
    const call = _.get(this.runtime, `${module}.${api}`);
    call(...payload);
    this.channel.broadcast(EventType.command_execute, message);
    operationManager.pushOperation(module, message);
  }
}
