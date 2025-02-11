
import UI from './ui';
import Tools from './tools';
import Application from './application';
import Nexus from './nexus';
import Action from './action';
import Service from './service';
import ViewManager from '@neural-nexus/view-manager';
import CommandExecutor from '../command/executor';
import * as _ from 'lodash';
import { ChannelLifecycleMessageType } from '@neural-nexus/view-reconciler';
import PageHandler from './page';
import { Logger } from '@/utils/format';
import { getAppCode } from '@/utils/common';
import { getManagerInstance, Manager } from '@neural-nexus/neural-channel';

function switchPageLoading(trigger: any) {
  const _PageLoading = document.getElementsByClassName('PageLoading');
  Logger('切换 loading ').info(`开启状态: ${trigger}`);
  Array.from(_PageLoading).map(x => {
    // @ts-expect-error TS(2339): Property 'style' does not exist on type 'Element'.
    x.style.display = trigger ? 'block' : 'none';
  });
}

const transformUrl = (link: any) => {
  if (!link) {
    return '';
  }

  const authTenantId = window.localStorage.getItem('originTenantId') || '';
  const authCode = window.localStorage.getItem('originGrantCode') || '';
  const appCode = getAppCode();

  let baseUrl = '';
  let hashAndQuery = '';
  let hash = '';
  let queryParts = [];
  let query = '';
  if (link.indexOf('#') !== -1) {
    let hashAndQuery = '';
    [baseUrl, hashAndQuery] = link.split('#');
    [hash, query] = (hashAndQuery || '').split('?');
    queryParts = query ? query.split('&') : [];
  } else {
    [baseUrl, query] = link.split('?');
    queryParts = query ? query.split('&') : [];
  }

  let newQueryParts = queryParts.filter(part => {
    let [key] = part.split('=');
    return key !== 'authTenantId' && key !== 'authCode' && key !== 'appNo';
  });

  newQueryParts.push(`authTenantId=${authTenantId}`);
  newQueryParts.push(`authCode=${authCode}`);
  newQueryParts.push(`appNo=${appCode}`);

  return `${baseUrl}${hash ? '#' + hash : ''}?${newQueryParts.join('&')}`;
};

export default class PCRuntime {
  page: any;
  pageStack: any;
  router: any;
  service: any;
  store: any;
  ui: any;
  application: any;
  nexus: Nexus;
  tools: Tools;
  action: any;
  viewManager: any;
  webWorker: any;
  commandExecutor: CommandExecutor;
  channel: Manager;

  constructor(options: any) {
    const { store, router, size } = options;
    this.store = store;
    this.router = router;
    this.pageStack = this.viewManager = new ViewManager(size);

    this.tools = new Tools(options);
    this.ui = new UI();
    this.application = new Application(options);
    this.nexus = new Nexus(options);
    this.action = new Action();
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.service = new Service();
    this.page = new PageHandler(options);
    this.channel = getManagerInstance();
    this.channel.setup();

    this.channel.on(ChannelLifecycleMessageType.PAGE_LOADING_FINISH, async (payload: any) => {
      Logger('PAGE_LOADING_FINISH').info(`${JSON.stringify(payload)}`);
      switchPageLoading(false);
    });

    this.channel.on(ChannelLifecycleMessageType.PAGE_LOADING_START, async (payload: any) => {
      Logger('PAGE START LOADING').info(`${JSON.stringify(payload)}`);
      switchPageLoading(true);
    });

    this.channel.on('@view/setGlobalContext', (payload: any) => {
      const { from, isOrderWaiting } = payload;

      if (!_.isUndefined(isOrderWaiting)) {
        store.dispatch('setIsOrderWaiting', isOrderWaiting);
      }
    });
    this.commandExecutor = new CommandExecutor(this.channel, this);
  }

  getPage(id: any) {
    try {
      return this.viewManager.getCurrentPage(id);
    } catch (e) {
      return null;
    }
  }

  get currentPage() {
    return this.viewManager.runningPage;
  }

  openPage = async (url: any, name: any, icon: any) => {
    await this.store.dispatch('openOuterPage', { url, name, icon });
  };

  openPageByPageInfo = async (page: any) => {
    if (page.url) {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
      page.url = transformUrl(page.url, 'local');
    }
    await this.viewManager.openPage({ ...page });
  };

  async closePage(id: any) {
    await this.viewManager.closePage(id);
  }

  closeCurrentPage = async () => {
    await this.viewManager.closePage(this.currentPage.data.id);
  };

  async closeAllpage() {
    await this.viewManager.closeAllpage();
  }

  refreshPage = () => {
    this.viewManager.refreshPage();
  };

  async closeOthersPage(id: any) {
    await this.viewManager.closeOtherPage(id);
  }

  async getAllPages() {
    return await this.viewManager.getAllPages();
  }

  getPageSize() {
    return this.viewManager.getPageSize();
  }

  setTitle(title: any) {
    // @ts-expect-error TS(2663): Cannot find name 'store'. Did you mean the instanc... Remove this comment to see the full error message
    store.dispatch('setTabTitle', { _currentId: this.currentPage.id, _title: title });
  }
  goForward(url: any) {
    this.router.push(url);
  }
  goBack = () => {
    this.router.back();
  };
  setToken = (payload: any) => {
    this.store.dispatch('setToken', payload);
  };
}
