import { inject } from 'vue';
import { Manager, getManagerInstance } from '@neural-nexus/neural-channel';
import { Application } from '@neural-nexus/neural-client-runtime';
import { BroadcastEvent } from '@neural-nexus/nexus-protocol';

export default class PCApplication implements Application {
  router: any;
  store: any;
  channel: Manager;
  constructor(options: any) {
    const { store, router } = options;
    this.store = store;
    this.router = router;
    this.channel = getManagerInstance()
  }
  openLaunchPad(): void {
    this.store.commit('nav/setActiveNav', 'index');
  }
  openApp = (url: string, name: string) => {
    const activeNav = this.store.state.nav.active;

    // 不在应用空间tab, 需要先打开应用空间
    if (activeNav !== 'application') {
      this.store.commit('nav/setActiveNav', 'application');
      setTimeout(() => {
        this.store.dispatch('openOuterPage', { url, name });
      }, 1);
    } else {
      this.store.dispatch('openOuterPage', { url, name });
    }
  };
  openNexus = () => {
    this.store.commit('nav/setActiveNav', 'chat');
  };
  openNotice(): void {}
  openTask(): void {}
  openWarning(): void {}
  openWorkspace = () => {
    this.store.commit('nav/setActiveNav', 'application');
  };
  goBack = () => {
    this.router.back();
  };
  updateFollow = () => {
    const message = {
      code: 'follow',
    };
    this.channel.broadcast(BroadcastEvent.UpdatePortalModule, message);
  };
  updateNotice = payload => {
    const message = {
      code: 'notice',
      payload,
    };
    this.channel.broadcast(BroadcastEvent.UpdatePortalModule, message);
  };
  updateTask = payload => {
    const message = {
      code: 'task',
      payload,
    };
    this.channel.broadcast(BroadcastEvent.UpdatePortalModule, message);
  };
  updateWarning = payload => {
    const message = {
      code: 'warning',
      payload,
    };
    this.channel.broadcast(BroadcastEvent.UpdatePortalModule, message);
  };
}
