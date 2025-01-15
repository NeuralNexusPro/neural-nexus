import { createLLPageManager, Page, PageManager } from 'llpage'
import View, { IViewOpts } from './view';

export default class ViewManager {
  llpage: PageManager & { runningPage: Page };
  pageCache: Map<string, Page>;

  constructor(size: number) {
    this.llpage = createLLPageManager({ size }) as (PageManager & { runningPage: Page });
    this.pageCache = new Map();

    return this;
  }


  getCurrentPage(id: string) {
    if (!this.pageCache.has(id)) throw new Error(`Page ${id} not found`);
    return this.pageCache.get(id);
  }

  get runningPage() {
    return this.llpage.runningPage;
  }

  closePage(id: string) {
    this.llpage.close(this.getCurrentPage(id) as Page);
    return this.pageCache.delete(id);
  }

  openPage(view: IViewOpts) {
    const { id } = view;
    let page: Page;
    if (this.pageCache.has(id)) {
      page = this.pageCache.get(id) as Page;
    } else {
      page = new View(view).page;
      this.pageCache.set(id, page);
    }

    this.llpage.open(page);
    return page;
  }

  getPageSize() {
    return this.pageCache.size;
  }

  refreshPage(page: Page) {
    this.llpage.refresh(page);
  }

  closeOtherPage(id: string) {
    const page = this.getCurrentPage(id) as Page;

    this.llpage.closeOthers(page);
    this.pageCache.clear();
    this.pageCache.set(id, page);
  }


  closeAllpage() {
    this.llpage.closeAll();
    this.pageCache.clear();
  }

  getAllPages() {
    return [ ...this.pageCache.values() ];
  }
}