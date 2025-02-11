import { Popup, TextArea, Button } from "antd-mobile";
import { useMemoizedFn, useSafeState } from "ahooks";
import { FC, memo } from "react";
import classNames from "classnames";
import PubSub from "pubsub-js";
import useStore from "@/store";
import { reasonTags as tags } from "@/constants/data";

import styles from "./index.module.scss";

const FeedbackModal: FC<{ instanceId: string }> = ({ instanceId }) => {
  const show = useStore((state: any) => state.showFeedbackModal);
  const setShow = useStore((state: any) => state.updateShowFeedbackModal);
  const [activeTag, setActtiveTag] = useSafeState(tags[0].value);
  const [text, setText] = useSafeState("");
  const changeText = useMemoizedFn((value: string) => {
    setText(value);
  });
  const handleOk = useMemoizedFn(() => {
    PubSub.publish(`feedback-reason-${instanceId}`, { text, tag: activeTag });
    setShow(false);
  });
  const reset = () => {
    setActtiveTag(tags[0].value);
    setText("");
  };
  return (
    <Popup
      destroyOnClose
      showCloseButton
      visible={show}
      key={instanceId}
      afterClose={reset}
      onClose={setShow.bind(null, false)}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <div className={styles.header}>
        <div className={styles.title}>反馈</div>
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          {tags.map(({ value, label }) => {
            return (
              <div
                className={classNames(
                  styles.tag,
                  activeTag === value && styles.active
                )}
                key={value}
                onClick={setActtiveTag.bind(null, value)}
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className={styles.answer}>
          <div className={styles.text}>您认为理想的答案是什么?</div>
          <TextArea
            showCount
            placeholder="请输入"
            value={text}
            maxLength={300}
            onChange={changeText}
            rows={3}
          ></TextArea>
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          block
          shape="rounded"
          className="cancle"
          onClick={setShow.bind(null, false)}
        >
          取消
        </Button>
        <Button
          block
          color="primary"
          shape="rounded"
          className="confirm"
          onClick={handleOk}
        >
          确定
        </Button>
      </div>
    </Popup>
  );
};

export default memo(FeedbackModal);
