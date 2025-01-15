import { IOnePage } from '../base/reconciler';

const MICRO_APP_RGX = /^\/([^\/]*)\/@app-([^\/]*)/i;
const MICRO_APP_URL_RGX = /^\/([^\/]*)\/@app-([^\/]*)?(.*)/i;

export interface IViewMeta {
  appId: string;
  base: string;
  baseRoute: string;
  routerPath: string;
  path: string;
}

export function getMetaInfo (view: IOnePage, MICRO_URL_RGX: RegExp): IViewMeta {
  const { data } = view;
  const appId = `@app-${data.id}`;
  // TODO: support parcel
  const { url, currentRouteName } = data;
  const windowPath = window.location.pathname;
  const [_, appLocation = ""] = windowPath.match(/@app-([^\/]*)/i) || [];
  const noLocation = windowPath === '/' || appLocation === "";
  let pathname = noLocation ? `/${currentRouteName}/${appId}` : `${windowPath}${window.location.search}`;

  const pathsplit = pathname.split('/');
  const l = pathsplit.length;
  const parsename = '/' + pathsplit[l-2] + '/' + pathsplit[l-1];

  const [, baseRoute] = parsename.match(MICRO_APP_RGX) || [];

  const [allUrl, routername, pathAppId, childPath] = parsename.match(MICRO_APP_URL_RGX) || [];
  const [wholeUrl, protocol, base, path] = url.match(MICRO_URL_RGX) || [];
  const routerPath = childPath ? childPath : path ? `/${path}` : '/';

  return {
    appId,
    base,
    baseRoute,
    routerPath,
    path,
  };
}

// 获取地址栏参数对象
export const getRequest = (url: string) => {
  const _url = url.match(/[?]([^\/]*)/g);
  const _search = _url ? _url[0] : '';
  const urlSearchParams = new URLSearchParams(_search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

