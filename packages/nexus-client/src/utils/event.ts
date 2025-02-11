import { useEffect } from "react";

// 发送自定义事件
export const dispatchCustomEvent = (eventName: string, data?: unknown) => {
  const event = new CustomEvent(eventName, { detail: { data } });
  document.body.dispatchEvent(event);
};
// 监听自定义事件
export const useMonitorCustomEvent = (eventName: string, callback: (data?: any) => void) => {
  useEffect(() => {
    const cb = (event: any) => {
      const data = event?.detail?.data;
      callback.call(null, data);
    };
    document.body.addEventListener(eventName, cb);
    return () => {
      document.body.removeEventListener(eventName, cb);
    };
  }, [callback, eventName]);
};
