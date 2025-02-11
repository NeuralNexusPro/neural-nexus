import { Manager, getManagerInstance } from '@neural-nexus/neural-channel';
import { inject } from 'vue';
export enum OperationType {
  // eslint-disable-next-line no-unused-vars
  Route = 'route',
  // eslint-disable-next-line no-unused-vars
  WidgetUI = 'widget_ui',
  // eslint-disable-next-line no-unused-vars
  AppAction = 'app_action',
}

interface Operation {
  type: OperationType;
  data: RouteOperationData | WidgetUIOperationData | AppActionOperationData | any;
}

interface RouteOperationData {
  from: string;
  to: string;
}

interface WidgetUIOperationData {
  widgetId: number;
  action: string;
  params: any;
}

interface AppActionOperationData {
  appid: string;
  appUrl: string;
  params: any;
}

export type OperationManagerInstance = InstanceType<typeof OperationManager>;

export default class OperationManager {
  private stack: Operation[];
  private maxLength: number;
  channel: Manager;

  constructor(maxLength: number) {
    this.stack = [];
    this.maxLength = maxLength;
    this.channel = getManagerInstance();
  }

  pushOperation(type: OperationType | string, data: RouteOperationData | WidgetUIOperationData | AppActionOperationData) {
    const operation: Operation = { type, data };
    this.channel.broadcast('OperationManager_PUSH', operation);
    if (this.stack.length >= this.maxLength) {
      this.stack.shift();
    }
    this.stack.push(operation);
  }

  popOperation(): Operation | undefined {
    return this.stack.pop();
  }

  clearStack() {
    this.stack = [];
  }

  filterOperationsByType(type: OperationType): Operation[] {
    return this.stack.filter(operation => operation.type === type);
  }
}
