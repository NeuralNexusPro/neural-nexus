import SDK, { Factory } from "./sdk";
import Adaptor, { Context } from "./adaptor/base";
import DefaultAdaptor from "./adaptor/pro";

import {
  createTextMessage,
  createCardMessage,
  addQuickReplies,
} from "@/utils/chat";
import ReactDOM from "react-dom";
import { MessageProps } from '@chatui/core';
import "@/assets/fonts/iconfont";
import { importScript } from "./utils/script";
import { ConfigProvider } from "antd";

export type { Adaptor, MessageProps };
export {
  Context,
  DefaultAdaptor,
  createTextMessage,
  createCardMessage,
  addQuickReplies,
};

export interface IProps {
  container: string;
  adaptor?: Factory<Adaptor>;
  onStart?: () => void;
  config: Partial<Adaptor> & { [key: string]: any };
}

export default function bootstrap(props: IProps) {
  const { container } = props;
  const antdPrefixCls = "chatui";

  ConfigProvider.config({
    holderRender: (children) => (
      <ConfigProvider prefixCls={antdPrefixCls}>{children}</ConfigProvider>
    ),
  });

  const promises = [
    // import chatuisdk
    importScript("//g.alicdn.com/chatui/extensions/0.0.7/isv-parser.js"),
  ];
  Promise.all(promises)
    .then(() => {
      console.log("load scripts success");
    })
    .catch(() => {
      console.log("load scripts fail");
    });
  if (!container) throw new Error(`必须传递 nexus 容器挂载节点!`);
  const containerNode = document.getElementById(container);
  ReactDOM.render(
    <ConfigProvider prefixCls={antdPrefixCls}>
      <SDK {...props} />
    </ConfigProvider>,
    containerNode
  );

  return function () {
    ReactDOM.unmountComponentAtNode(containerNode);
  };
}
