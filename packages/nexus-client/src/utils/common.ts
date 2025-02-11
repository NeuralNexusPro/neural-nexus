import React from "react";
import { get as getGlobalVars } from "@/utils/global";

export const uuid = () => {
  const uuid = URL.createObjectURL(new Blob());
  URL.revokeObjectURL(uuid);
  return uuid.substring(uuid.length - 36);
};

// 是否运行在移动端
export function isRunningInMobile() {
  const global = getGlobalVars();
  const reg =
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|SymbianOS|WebOS|Symbian|Windows Phone|MicroMessenger)/i;
  return navigator.userAgent.match(reg) || global.platform === "mobile";
}

export const getContainer = (container: HTMLElement): HTMLElement => {
  let node: HTMLElement | null = container;

  while (node && node !== document.body) {
    const { position, overflowX, overflowY } = getComputedStyle(node, null);

    if (overflowX === "visible" && overflowY === "visible" && position !== "static") {
      return node;
    } else {
      node = node.parentElement;
    }
  }

  return document.body;
};

export const ComposeProvider = ({ Providers, children }: any) =>
  Providers.reduceRight((acc: any, Provider: any) => React.createElement(Provider, null, acc), children);

export const getMicroBasename = (type: string) => {
  const regx = new RegExp("/.*?/" + type);
  const pathname = location.pathname;
  return pathname.match(regx)?.[0];
};

export const getQuery = (query: string) => {
  const { search } = window.location;
  const params = new URLSearchParams(search.slice(1));
  return params.get(query);
};

export const registerTheme = ({ theme, container }: { theme: string; container?: Element | null }) => {
  const root = container ?? document.documentElement;
  if (theme === "normal") {
    root.removeAttribute("theme");
  } else {
    root.setAttribute("theme", theme);
  }
};

export const deepFreeze = (object: { [key: string]: any }) => {
  // 获取对象的属性名
  const propNames = Object.keys(object);

  // 冻结自身前先冻结属性
  for (const name of propNames) {
    const value = object[name];

    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};

export const appendUrlQuery = (url: string, queryObj: Record<string, any>) => {
  try {
    const urlObj = new URL(url);
    const hash = urlObj.hash;

    const query = Object.entries(queryObj)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    if (hash) {
      hash.indexOf("?") > 0 ? (urlObj.hash += `&${query}`) : (urlObj.hash = `?${query}`);
    } else {
      urlObj.search ? (urlObj.search += `&${query}`) : (urlObj.search = `?${query}`);
    }

    return urlObj.toString();
  } catch {
    return url;
  }
};
// 实现边打字页面实时滚动到底部
export const scrollBottom = () => {
  const el = document.querySelector(".PullToRefresh");
  const top = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top, behavior: "smooth" });
}

// iframe卡片 / 自定义卡片 需要删除后再发送
export const deleteCards = ["iframe-container", "dynamic-web-component"]
