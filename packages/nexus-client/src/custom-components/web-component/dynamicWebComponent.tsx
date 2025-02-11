import React, { useEffect, useRef } from "react";
import { createTextMessage } from "@/utils/chat";
import { get as getGlobalVars } from "@/utils/global";
// import { APP_ENV, appId } from "@/constants/env";
import { isRunningInMobile, scrollBottom } from "@/utils/common";
import { useSafeState } from "ahooks";
import PubSub from "pubsub-js";
import useCopilotNode from "@/hooks/useCopilotNode.tsx";

interface ComponentInfo {
  name: string;
  mobileName: string;
  wsName: string;
}

const formatName = (compName: string): string => {
  return compName
    .replace(/-(\w)/gi, (_match, letter) => {
      return letter.toUpperCase();
    })
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getComponentInfo = (url: string): ComponentInfo => {
  const match = url.match(/@([^/]+)\/([^/]+)\//);
  const compName = match?.[2];
  const name = formatName(compName || "");
  const mobileName = `@enn/${compName}`;
  const wsName = `iop-${compName}`;

  return {
    name,
    wsName,
    mobileName,
  };
};

const isMobile = isRunningInMobile();
const map = {
  EnnDEV: "dev",
  EnnFAT: "fat",
  EnnUAT: "uat",
  EnnPROD: "pro",
};

const DynamicWebComponent: React.FC<any> = ({ data, ctx }: any) => {
  const global = getGlobalVars();
  const globalProps = {
    appEnv: map[global.env] || "dev",
    appBizId: global.appId,
    X_GW_ACCESSKEY: global?.envVars?.X_GW_ACCESSKEY,
  };
  const ref = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const [props, setProps] = useSafeState<Record<string, any>>({});
  const dom = useCopilotNode(data?.input?.copilot);

  useEffect(() => {
    if (componentRef.current) {
      Object.keys(props).forEach((key) => {
        componentRef.current[key] = props[key];
      });
    }
  }, [props]);

  useEffect(() => {
    PubSub.subscribe(`update-card-args-${data.input.answerId}`, (_, data) => {
      setProps(data);
      scrollBottom();
    });
    return () => {
      PubSub.unsubscribe(`update-card-args-${data.input.answerId}`);
    };
  }, [data.input.answerId, setProps]);

  useEffect(() => {
    const cdn = data?.input?.cdn;
    const globalVars = data?.globalVars;
    const props = Object.assign({}, data?.input, data?.input?.args, {
      globalVars,
    });

    const script = document.createElement("script");

    const { name, wsName, mobileName } = getComponentInfo(cdn);

    script.src = cdn;
    script.onload = () => {
      const comp =
        (window as any)?.[name]?.["default"] ||
        (window as any)?.[mobileName]?.["default"];
      if (typeof comp !== "function") return;

      if (!customElements.get(wsName)) {
        customElements.define(wsName, comp);
      }

      const webComponent = document.createElement(wsName);
      componentRef.current = webComponent;
      console.log(props, "wang");
      Object.keys(props).forEach((key) => {
        (webComponent as any)[key] = props[key];
      });

      Object.keys(globalProps).forEach((key) => {
        (webComponent as any)[key] =
          globalProps[key as keyof typeof globalProps];
      });

      const { runtime } = getGlobalVars();

      webComponent.addEventListener("ctx:postMessage", (event: any) => {
        const showMsg = event.detail?.[1]?.show !== false;
        const textMessage = createTextMessage(event.detail?.[0], showMsg);
        ctx.postMessage(textMessage);
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
  }, [ctx, data?.globalVars, data?.input, data?.input?.cdn]);

  return (
    <div>
      <div ref={ref}></div>
      {dom}
    </div>
  );
};

export default DynamicWebComponent;
