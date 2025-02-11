import { Application as ApplicationInterface } from "../interface/application";
import PublisherDecorator from "../publisher/decorator";

@PublisherDecorator
export default class Application implements ApplicationInterface {
  static module = 'application';
  container: string;
  constructor(container: string) {
    this.container = container;

    return this;
  }
  /**
   * 打开应用空间
   */
  openWorkspace() {

  }
  /**
   * 打开工作台首页
   */
  openLaunchPad() {

  }
  /**
   * 打开智伴
   */
  openNexus() {

  }
  /**
   * 打开子应用
   */
  openApp(url: string, name: string) {

  }
  /**
   * 页面回退
   */
  goBack() {

  }
  openTask() {

  }
  openNotice() {

  }
  openWarning() {

  }

  /**
   * 更新首页关注内容
   */
  updateFollow(){
    
  }
  
  /**
   * 更新首页通知
   */
  updateNotice(payload: any) {
    
  }

  /**
   * 更新首页任务
   */
  updateTask(payload: any){ 
  
  }

  /**
   * 更新首页示险
   */
  updateWarning(payload: any){
    
  }
}