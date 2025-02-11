/// <reference types="vite/client" />
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  vue: any;
  MonitorJS: any;
  BASE_PATH: string;
  authSDK: any;
}
declare var window: Window;
// declare module '@enn/card-proxy';

class MonitorJS {
  init: Function;
  static EnnDEV: string;
  static EnnFAT: string;
  static EnnUAT: string;
  static EnnPROD: string;
}
