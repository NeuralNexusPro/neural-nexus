import _React, { memo, FC, useRef, MouseEvent } from "react";
import { useSafeState } from "ahooks";
import classNames from "classnames";
import { getPrefixCls } from "@/custom-components/index.helper";
import { Icon } from "@/components/index";
import styles from "./index.module.scss";

type IframeContainerProps = {
  url: string;
  title?: string;
};
/**
 * @description 自定义卡片-订单计划变更
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const IframeContainer: FC<IframeContainerProps> = (props) => {
  const { url, title } = props || {};
  const prefixCls = getPrefixCls("iframe-container");
  const [isFullScreen, setIsFullScreen] = useSafeState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const clickContainer = () => {
    setIsFullScreen(false);
  };

  const clickIframe = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsFullScreen((v) => !v);
  };

  return (
    <div
      ref={ref}
      onClick={clickContainer}
      className={classNames(
        styles.container,
        prefixCls,
        isFullScreen && "full-screen"
      )}
    >
      {title ? <div className="title">{title}</div> : null}
      <iframe
        src={url}
        className="iframe"
        frameBorder={0}
        onClick={clickIframe}
      />
      <div className="preview" onClick={handleClick}>
        <Icon type={isFullScreen ? "suoxiao" : "fangda"} className="icon" />
      </div>
    </div>
  );
};

export default memo(IframeContainer);
