import { getAppCode } from '@/utils/common';
import { IGlobalVars, IVarData, Tools } from '@neural-nexus/neural-client-runtime';
import { Store } from 'vuex';

interface IToolOptions {
  store: Store<any>;
}

export default class PCTools implements Tools {
  private globalVars: IGlobalVars = {
    systemVars: {},
    bizVars: {},
  };

  store: Store<any>;

  constructor(options: IToolOptions) {
    const defaultSystemVars = {
      env: import.meta.env.VITE_ENV.replace('NEW_', ''),
      authSDK: window.authSDK,
    };
    this.store = options.store;
    this.globalVars.systemVars = defaultSystemVars;
  }

  run(): Promise<void> {
    // nothing to do
    return Promise.resolve();
  }
  analysis(): Promise<void> {
    // nothing to do
    return Promise.resolve();
  }
  getGlobalVars = (callback, namespace?: keyof IGlobalVars): IVarData | IGlobalVars | void => {
    if (namespace === 'bizVars') {
      callback(this.globalVars.bizVars);
      return;
    }

    const systemVars = {
      appCode: getAppCode() || '',
      authToken: {
        ennUnifiedCsrfToken: localStorage.getItem('ennUnifiedCsrfToken') || '',
        ennUnifiedAuthorization: localStorage.getItem('ennUnifiedAuthorization') || '',
      },
      tenantId: this.store.state.userInfo.tenantId,
      userInfo: this.store.state.userInfo,
    };

    this.globalVars.systemVars = {
      ...this.globalVars.systemVars,
      ...systemVars,
    };
    const globalVars = namespace === 'systemVars' ? systemVars : this.globalVars;
    callback(globalVars);
  };

  setGlobalVars = (globalVars: IVarData, namespace: keyof IGlobalVars = 'bizVars') => {
    const systemReadonlyVars = ['env', 'authSDK', 'appCode', 'authToken', 'tenantId', 'userInfo'];

    if (namespace === 'systemVars') {
      const setReadonlyVars: string[] = [];
      globalVars = Object.keys(globalVars).reduce((pre, current) => {
        if (!systemReadonlyVars.includes(current)) {
          pre[current] = globalVars[current];
        } else {
          setReadonlyVars.push(current);
        }
        return pre;
      }, {});

      if (setReadonlyVars.length > 0) {
        console.warn(`[PCRuntime-setGlobalVars]:${setReadonlyVars.join(',')} 为只读属性，无法赋值`);
      }
    }

    this.globalVars[namespace] = {
      ...this.globalVars[namespace],
      ...globalVars,
    };
  };
}
