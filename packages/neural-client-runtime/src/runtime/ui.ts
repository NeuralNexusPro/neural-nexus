import { UI as UIInterface, IToastOpts, INotificationOpts, IDialogOpts } from '../interface/ui';
import PublisherDecorator from "../publisher/decorator";


@PublisherDecorator
export default class UI implements UIInterface {
  static module = 'ui';

  container: string;
  constructor(container: string) {
    this.container = container;

    return this;
  }

  openToast (params: IToastOpts) {

  }

  /**
   * 打开通知，可以从四个角弹出
   * 里面的组件属性和饿了么一样
   * @param {*} params
   */
  openNotification (params: INotificationOpts) {

  }
  
  /**
   * 打开 Modal 弹窗
   * 里面的组件属性和饿了么一样
   * @param {*} params
   */
  openDialog (params: IDialogOpts) {

  }
  
}
