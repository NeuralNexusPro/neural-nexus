export interface Action {
  /**
   * 注册自定义行为
   * @param name 行为名称
   * @param containerCode 行为触发端
   * @param cb 行为回调
   */
  register(name:string, containerCode: string, cb: () => void): void;

  /**
   * 触发自定义行为
   * @param name 行为名称
   * @param params 行为参数
   * @param containerCodeList 行为触发端列表
   */
  trigger(name: string, params: any, containerCodeList: string[]): void;
}