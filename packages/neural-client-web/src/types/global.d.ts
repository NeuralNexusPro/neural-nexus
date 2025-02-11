declare interface Zhuge {
  methods: any[];
  _init(...args: any[]): void;
  getDid(): string | number;
  getKey(): string;
  push(params: any): void;
  factory(params: any): any;
  load(a: any, b: any): any;
  track(name: string, params: Record<string, any>): void;
  identify(name: string, params: Record<string, any>): void;
  setUserProperties(params: Record<string, any>): void;
}
declare function parseInt(s: string | number, radix?: number): number;

declare function parseFloat(string: string | number): number;

declare type Nullable<T> = T | null;

declare type NonNullable<T> = T extends null | undefined ? never : T;

declare type RefType<T> = T | null;

declare type CustomizedHTMLElement<T> = HTMLElement & T;

declare type LabelValueOptions = Array<{
  label: string;
  value: any;
}>;

declare type EmitType = (event: string, ...args: any[]) => void;

declare type TargetContext = '_self' | '_blank';

declare type TimeoutHandle = ReturnType<typeof setTimeout>;

declare type IntervalHandle = ReturnType<typeof setInterval>;

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

type IsSame<A, B> = A | B extends A & B ? true : false;

declare module '*.json' {
  const value: any;
  export default value;
}

declare const _APP_VERSION_: string;
declare const _APP_TITLE: string;

declare interface ImportMetaEnv {
  [k: string]: string;
}

declare interface Window {
  BASE_PATH: string;
  ENV: string;
  MonitorJS: any;
}
