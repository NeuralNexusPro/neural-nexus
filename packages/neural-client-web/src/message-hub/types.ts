import PCRuntime from '@/runtime';

export enum MESSAGE_SCENE_TYPE {
  NOTIFICATION = 'NOTIFICATION',
  SHI_XIAN = 'SHI_XIAN',
  DAI_BAN = 'DAI_BAN',
  GUAN_ZHU = 'GUAN_ZHU',
  CUI = 'CUI',
  WS_COMMON = 'WS_COMMON',
  ALL = 'ALL',
}

export interface IMessage {
  appCode: string;
  content: string;
  scenario: MESSAGE_SCENE_TYPE;
  tenantId: string;
  title: string;
  data?: any;
  messageId?: string;
}

export interface IWSMessageConfig {
  action: boolean;
  actionContent: string;
  botCommand: boolean;
  commandContent: string;
  toast: boolean;
  interactionType: ToastInteractionType;
  toastType: ToastType;
  afterConfirm: number[];
  afterConfirmValues: Record<string, any>;
  afterCancel: number[];
  afterCancelValues: Record<string, any>;
  extraParamList?: any[];
}

export interface IWSMessage {
  content: string;
  title: string;
  data: IWSMessageConfig;
}

export enum CommandModule {
  Application = 'application',
  UI = 'ui',
  Nexus = 'nexus',
  Page = 'page',
}

export enum ToastType {
  Info = 1,
  Success = 2,
  Warning = 3,
  Error = 4,
}

export enum ToastInteractionType {
  Async = 1,
  Sync = 2,
}

export enum ToastCallbackType {
  JumpUrl = 1,
  SendCUISystemMsg = 2,
}

export interface IToastConfig {
  title: string;
  content: string;
  interactionType: ToastInteractionType;
  toastType: ToastType;
  afterConfirm: number[];
  afterConfirmValues: Record<string, any>;
  afterCancel: number[];
  afterCancelValues: Record<string, any>;
}

export interface IConnectionOptions {
  env: string;
  tenantId: string;
  userId: string;
  appCode: string;
}

export interface IMessageHubOptions extends IConnectionOptions {
  runtime: PCRuntime;
}

export interface IListener {
  id: string;
  callback: (message: IMessage) => any;
  sceneType?: MESSAGE_SCENE_TYPE;
}
