import { IGlobalVars, IVarData, Tools as ToolsInterface } from "../interface/tools";
import PublisherDecorator from "../publisher/decorator";
@PublisherDecorator
export default class Tools implements ToolsInterface {
  static module = 'tools';
  container: string;
  constructor(container: string) {
    this.container = container;

    return this;
  }

  async analysis() {

  }
  async run() {

  }
  /**
   * 获取全局变量
   *
   * @param {keyof IGlobalVars} [namespace]
   * @memberof Tools
   */
  getGlobalVars (callback: (globalVars: IGlobalVars | IVarData) => void, namespace?: keyof IGlobalVars) {}

  /**
   * 修改全局变量
   *
   * @param {*} globalVars
   * @param {keyof IGlobalVars} [namespace='bizVars']
   * @memberof Tools
   */
  setGlobalVars (globalVars: any, namespace: keyof IGlobalVars = 'bizVars') {}
}