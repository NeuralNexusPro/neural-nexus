export * from './interface/application';
export * from './interface/nexus';
export * from './interface/tools';
export * from './interface/ui';
export * from './interface/action';
export * from './publisher'

import ApplicationRuntime from './runtime/application';
import NexusRuntime from './runtime/nexus';
import ToolsRuntime from './runtime/tools';
import UIRuntime from './runtime/ui';
import ActionRuntime from './runtime/action';

export default class Runtime {
  application: ApplicationRuntime;
  nexus: NexusRuntime;
  tools: ToolsRuntime;
  ui: UIRuntime;
  action: ActionRuntime;
  constructor(container: string) {
    this.application = new ApplicationRuntime(container);
    this.nexus = new NexusRuntime(container);
    this.tools = new ToolsRuntime(container);
    this.ui = new UIRuntime(container);
    this.action = new ActionRuntime(container);

    return this;
  }
}