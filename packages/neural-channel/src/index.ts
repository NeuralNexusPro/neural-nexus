import Client from "./client/client";
import Manager, { CHANNEL_MANAGER_SYMBOL } from "./master/manager";

export * from './type';
const getManagerInstance = function():Manager {
  return window[CHANNEL_MANAGER_SYMBOL];
}

export {
  getManagerInstance,
  Manager,
  Client,
}