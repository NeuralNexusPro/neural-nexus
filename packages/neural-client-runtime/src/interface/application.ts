export interface Application {
  /**
   * 打开应用空间
   */
  openWorkspace(): void;
  /**
   * 打开工作台首页
   */
  openLaunchPad(): void;
  /**
   * 打开智伴
   */
  openNexus(): void;
  /**
   * 打开子应用
   */
  openApp(url: string, name: string): void;
  /**
   * 页面回退
   */
  goBack(): void;
  openTask(): void;
  openNotice(): void;
  openWarning(): void;
  /**
   * 更新首页关注内容
   */
  updateFollow(): void;
    
  /**
   * 更新首页通知
   */
  updateNotice(payload: any): void;
  
  /**
   * 更新首页任务
   */
  updateTask(payload: any): void;
  
  /**
   * 更新首页示险
   */
  updateWarning(payload: any): void
}