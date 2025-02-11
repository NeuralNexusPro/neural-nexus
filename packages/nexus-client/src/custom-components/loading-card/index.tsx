import { memo, FC, useEffect } from "react";
import { useSafeState } from "ahooks";
import classNames from "classnames";
import PubSub from "pubsub-js";
import { getPrefixCls } from "@/custom-components/index.helper";
import { isRunningInMobile } from "@/utils/common";
import styles from "./index.module.scss";

type LoadingCardData = {
  answerId: string;
  loadingText?: string;
};

type LoadingCardProps = {
  data: { input: LoadingCardData; globalVars: any };
  ctx: any;
  meta: any;
};

/**
 * @description 通用卡片组件 - loading卡片
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const LoadingCard: FC<LoadingCardProps> = ({ data: { input } }) => {
  const prefixCls = getPrefixCls("loading-card");
  const [text, setText] = useSafeState(
    input?.loadingText || "正在进行意图识别..."
  );

  useEffect(() => {
    PubSub.subscribe(`update-loading-text-${input.answerId}`, (_, text) => {
      setText(text);
    });

    return () => {
      // 移除事件监听
      PubSub.unsubscribe(`update-loading-text-${input.answerId}`);
    };
  }, [input.answerId, setText]);
  return (
    <div
      className={classNames(
        styles.container,
        isRunningInMobile() ? `${prefixCls}-mobile` : `${prefixCls}-pc`
      )}
    >
      <img
        src="https://res.ennew.com/image/png/d50b8a68b723ed0f9eddcb1f2783fe5c.png"
        className="icon loading"
      />
      <div className="text">{text}</div>
    </div>
  );
};

export default memo(LoadingCard);
