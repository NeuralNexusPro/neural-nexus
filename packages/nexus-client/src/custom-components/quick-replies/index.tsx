import { memo, FC } from "react";
import { useCreation } from "ahooks";
import classNames from "classnames";
import { createTextMessage } from "@/utils/chat";
import { getPrefixCls } from "../index.helper";
import styles from "./index.module.scss";
import { isRunningInMobile } from "@/utils/common";
import { get as getGlobalVars } from "@/utils/global.ts";
import useStore from "@/store";

type QuickRepliesProps = {
  data: string[];
  ctx: any;
  meta: any;
};
/**
 * @description 自定义卡片-快捷短语 可以在卡片后面追加快捷短语,点击后可以该短语快速发起新的对话
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const QuickReplies: FC<QuickRepliesProps> = ({ data, ctx }) => {
  const prefixCls = getPrefixCls("quick-reply");
  const quickReplies = getGlobalVars()?.quickReplies || [];
  const list = useCreation(() => {
    // 后续数据结构可能有变化,所以先这样直接转换，方便后续改造
    return data;
  }, [data]);
  const answering = useStore((store: any) => store.answering);

  const handleClick = (text: string) => {
    if (answering) return;
    ctx.postMessage(createTextMessage(text));
  };

  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return (
    <div
      className={classNames(
        isRunningInMobile() ? styles["m-quick-reply"] : styles["quick-reply"],
        prefixCls
      )}
    >
      {quickReplies?.length ? (
        <div className={`${prefixCls}-text`}>继续提问</div>
      ) : null}

      <div className={`${prefixCls}-wrapper`}>
        {list
          .filter((item) => item)
          .map((item) => {
            return (
              <div
                className={classNames(
                  `${prefixCls}-item`,
                  answering && "disabled"
                )}
                key={item}
                onClick={handleClick.bind(null, item)}
              >
                <div>{item}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default memo(QuickReplies);
