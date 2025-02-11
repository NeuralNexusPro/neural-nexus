import localforage from 'localforage';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash';

/**
 * storage操作
 * @param {*} name: 存储的范围名字；
 * @returns
 */

export default class BrowserStorage {
  logger: any;
  storage: any;
  constructor(name: any, opts = {}) {
    // @ts-expect-error TS(2339): Property 'engine' does not exist on type '{}'.
    const { engine = localforage.LOCALSTORAGE, logger = console.log } = opts;
    this.storage = localforage.createInstance({
      driver: engine,
      name,
    });
    this.logger = logger;
  }

  async save(key: any, value: any) {
    this.logger(`离线存储 写入键值${key} 值: ${_.isString(value) ? value : JSON.stringify(value)}`);
    return await this.storage.setItem(key, value);
  }

  async get(key: any) {
    const value = await this.storage.getItem(key);
    this.logger(`离线存储 获取键值${key} 值: ${value}`);

    return value;
  }
}
