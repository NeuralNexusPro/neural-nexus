import styles from "./index.module.scss";
import classNames from "classnames";
import { isRunningInMobile } from "@/utils/common.ts";
import { getPrefixCls } from "@/custom-components/index.helper.ts";
import { Icon } from "@/components";
import { FC } from "react";
import { useMemoizedFn } from "ahooks";


type StopCardProps = {
  data: any;
  ctx: any;
  msgId: string;
};
const StopCard: FC<StopCardProps> = () => {
  const prefixCls = getPrefixCls("stop-card");

  // 再试一次 如果有推荐问题 都要清除当前的问题再重新回答
  const handleRetry = useMemoizedFn(() => {

  });

  return (
    <div
      className={classNames(
        styles.container,
        isRunningInMobile() ? `${prefixCls}-mobile` : `${prefixCls}-pc`
      )}
    >
      <div className="stop-text">已停止回答</div>
      <div className="retry" onClick={handleRetry}>
        <Icon type="refresh" className="icon"></Icon>
        <span className="text">重新回答</span>
      </div>
    </div>
  );
};

export default StopCard;
