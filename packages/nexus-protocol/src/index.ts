export enum Terminal {
  PortalClient = 'portal-client',
  NexusClient = 'nexus-client',
  CopilotSdk = 'copilot-sdk'
}

export enum MessageSource {
  USER = "user",
  SYSTEM = "system",
}

export interface IChatContext {
  code: string;
  value: string;
  desc: string;
  prompt?: string;
}
export interface IContent<T> {
  type: string;
  context?: IChatContext[];
  payload: T;
  messageSource?: MessageSource;
}

export interface ICommand {
  command: string;
  args: {[key: string]: any};
}

export interface IMessage {
  to: Terminal;
  from: Terminal;
  targetId?: string;
  timestamp: number;
  content: IContent<any>;
}

export enum BroadcastEvent {
  DetectPortalClient = 'detect-portal-client',
  DetectCopilotSDK = 'detect-copilot-sdk',
  DrivePortalClient = 'drive-portal-client',
  DriveCopilotSdk = 'drive-copilot-sdk',
  DriveNexusClient = 'drive-nexus-client',
  UpdatePortalModule ="update-portal-module",
  TriggerPortalAction = "trigger-portal-action"
}