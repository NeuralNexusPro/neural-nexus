import { Action as ActionInterface } from "../interface/action";
import PublisherDecorator from "../publisher/decorator";

@PublisherDecorator
export default class Action implements ActionInterface {
  static module = 'action';
  container: string;
  constructor(container: string) {
    this.container = container;

    return this;
  }

  /**
   * 注册自定义行为
   * @param name 行为名称
   * @param containerCode 行为触发端
   * @param cb 行为回调
   */
  register(name:string, containerCode: string, cb: () => void){
  };

  /**
   * 触发自定义行为
   * @param name 行为名称
   * @param params 行为参数
   * @param containerCodeList 行为触发端列表
   */
  trigger(name: string, params: any = {}, containerCodeList: string[] = []){
  };
}
