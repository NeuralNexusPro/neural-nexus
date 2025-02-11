import { WS_SERVER_BASE_URL } from './constants';
import { IConnectionOptions, IListener, IMessage } from './types';
import { createRandomId } from './utils';

class Connection {
  // @ts-ignore
  ws: WebSocket;

  listeners: IListener[];

  env: string;

  tenantId: string;

  userId: string;

  appCode: string;

  heartBeatTimer: any = null;

  constructor(options: IConnectionOptions) {
    const { env, tenantId, userId, appCode } = options;
    this.env = env;
    this.tenantId = tenantId;
    this.userId = userId;
    this.appCode = appCode;
    this.listeners = [];

    this.connect();
  }
  connect = () => {
    const url = `${WS_SERVER_BASE_URL[this.env]}/${this.tenantId}/${this.appCode}/${this.userId}`;
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
    this.ws.onopen = () => {
      this.heartBeat();
      this.observerNetworkStatus();
    };
  };

  // 心跳保持
  heartBeat = () => {
    clearTimeout(this.heartBeatTimer);
    this.ws.send('ping');
    this.heartBeatTimer = setTimeout(() => {
      this.heartBeat();
    }, 10000);
  };

  // 监听网络状态
  observerNetworkStatus = () => {
    window.addEventListener('online', () => {
      this.ws.CLOSED && this.reconnect();
    });
    window.addEventListener('offline', () => {
      this.disconnect();
    });
  };

  onmessage = event => {
    const { data: message } = event;
    this.listeners.forEach(listener => listener.callback(JSON.parse(message)));
  };

  onerror = error => {
    console.error(error);
    this.disconnect();
  };

  disconnect = () => {
    this.ws.close();
    clearTimeout(this.heartBeatTimer);
  };

  reconnect = () => {
    this.connect();
  };

  registerListener = (callback: (message: IMessage) => any) => {
    const id = createRandomId();
    this.listeners.push({
      id,
      callback,
    });
    return id;
  };

  removeListener = (listenerId: string) => {
    const listenerIdx = this.listeners.findIndex(listener => listener.id === listenerId);
    if (listenerIdx > -1) {
      this.listeners.splice(listenerIdx, 1);
    }
  };
}

export default Connection;
