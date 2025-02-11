export default class PageHandler {
  router: any;
  store: any;
  constructor(options: any) {
    const { store, router } = options;
    this.store = store;
    this.router = router
  }
  openPage(id: any) {
    this.store.dispatch('handleOpenPageClick', { _id: id })
  }
  goBack() {
    this.router.back();
    const { path } = this.router.getCurrentLocation()
    const appId = this.getAppId(path);
    this.store.dispatch('openPageById', appId)
  }
  getAppId(path: any) {
    const [_, appId] = path.match(/@app-([^\/]*)/i) || [];
    return appId;
  }
  setCurrentStatus(id: any) {
    this.store.dispatch('setCurrentStates', id)
  }
  closePage(id: any) {
    this.store.dispatch('closePageClick', { _id: id })
  }
  getMultiPageData() {
    return this.store.state.multiTaskTabsList
  }
}