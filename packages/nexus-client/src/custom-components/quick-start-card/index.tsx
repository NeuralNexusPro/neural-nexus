import { memo, FC } from "react";
import DynamicWebComponent from "../web-component/dynamicWebComponent";
import { isRunningInMobile } from "@/utils/common";

type QuickStartCardData = {
  answerId: string;
};

type QuickStartCardProps = {
  data: { input: QuickStartCardData; globalVars: any };
  ctx: any;
  meta: any;
};
/**
 * @description 会话式创建欢迎卡片组件 - 智伴名片
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const QuickStartCard: FC<QuickStartCardProps> = ({ctx}) => {
  const input = {
    cdn: "https://s.ennew.com/npm/@enn/quick-start/1.0.3/index.min.js",
    args: {
      title: "欢迎来到智能应用组装平台！",
      subtitle: "快速创建智能体应用",
      introduction: "我是基于人工智能技术的全自动化生产平台，提供丰富的业务建模和流程自动化工具，可快速开发和发布各种智能应用，支持云端部署和管理。",
      list: [
        {
          name: "创建应用",
          value: ""
        }
      ],
      platform: isRunningInMobile() ? "mobile" : "pc"
    }
  };
  return <DynamicWebComponent data={{ input }} ctx={ctx}/>;
};

export default memo(QuickStartCard);
