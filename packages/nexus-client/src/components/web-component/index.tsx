import React, { useRef, useEffect } from "react";
import { get as getGlobalVars } from "@/utils/global";
import { isRunningInMobile } from "@/utils/common";
import { useSafeState } from "ahooks";


const isMobile = isRunningInMobile();
export interface DynamicWebComponentProps {
  name: string;
  url: string;
  data: any;
}

const DynamicWebComponent: React.FC<DynamicWebComponentProps> = (wbProps: DynamicWebComponentProps) => {
  const { url, name, data } = wbProps;
  const ref = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const [props, setProps] = useSafeState<Record<string, any>>({});

  useEffect(() => {
    setProps(data);
  }, [data]);
  useEffect(() => {
    if (componentRef.current) {
      Object.keys(props).forEach((key) => {
        componentRef.current[key] = props[key];
      });
    }
  }, [props]);

  useEffect(() => {
    const props = Object.assign({}, data);
    const script = document.createElement("script");

    script.src = url;
    script.onload = () => {
      const comp = (window as any)?.[name]?.["default"];
      const componentName = `neural-${name.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;
      if (typeof comp !== "function") return;

      if (!customElements.get(componentName)) {
        customElements.define(componentName, comp);
      }

      const webComponent = document.createElement(componentName);
      componentRef.current = webComponent;
      Object.keys(props).forEach((key) => {
        (webComponent as any)[key] = props[key];
      });
      const { runtime } = getGlobalVars();

      webComponent.addEventListener("ctx:postMessage", (event: any) => {
        const { detail } = event;
        const { show } = detail;
        if (runtime && runtime?.nexus?.sendUserMessage) {
          runtime.nexus.sendUserMessage(event.detail?.[0], show);
        }
      });

      webComponent.addEventListener("ctx:openNotify", (event: any) => {
        const params = event.detail?.[0];
        if (runtime && runtime?.ui?.openNotify) {
          runtime.ui.openNotify(params);
        }
      });

      webComponent.addEventListener("ctx:openDialog", (event: any) => {
        const params = event.detail?.[0];
        if (runtime && runtime?.ui?.openDialog) {
          runtime.ui.openDialog(params);
        }
      });

      webComponent.addEventListener("ctx:openUrl", (event: any) => {
        const { url, title } =
          (event &&
            event.detail &&
            Array.isArray(event.detail) &&
            event.detail[0]) ||
          {};
        if (isMobile) {
          window.open(url, "_blank");
          return;
        }
        if (runtime && runtime.openPage) {
          runtime.openPage(url, title);
        }
      });

      ref.current?.appendChild(webComponent);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [data, url]);

  return (
    <div>
      <div ref={ref}></div>
    </div>
  );
};

export default DynamicWebComponent