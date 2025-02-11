import ViewManager from '@neural-nexus/portal-view-manager';

export default class AppStackManager {
  viewManager: any;
  constructor(size: any) {
    this.viewManager = new ViewManager(size);
  }

  async openPage(page: any) {
    if (page.url) {
      page.url = transformUrl(page.url);
    }
    await this.viewManager.openPage({ ...page });
  }

  async closePage(id: any) {
    await this.viewManager.closePage(id);
  }

  async closeAllpage() {
    await this.viewManager.closeAllpage();
  }

  refreshPage() {
    this.viewManager.refreshPage();
  }

  async closeOtherPage(id: any) {
    await this.viewManager.closeOtherPage(id);
  }

  async getAllPages() {
    return await this.viewManager.getAllPages();
  }

  getPageSize() {
    return this.viewManager.getPageSize();
  }

  getCurrentPage(id: any) {
    try {
      return this.viewManager.getCurrentPage(id);
    } catch (e) {
      return null;
    }
  }
}
const transformUrl = (link: any) => {
  if (!link) {
    return '';
  }
};
