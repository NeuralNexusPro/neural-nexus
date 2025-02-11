import { Modal, Input } from "antd";
import { useMemoizedFn, useSafeState } from "ahooks";
import { ChangeEvent, FC, memo } from "react";
import classNames from "classnames";
import PubSub from "pubsub-js";
import useStore from "@/store";
import { reasonTags as tags } from "@/constants/data";

import styles from "./index.module.scss";

const { TextArea } = Input;

const FeedbackModal: FC<{ instanceId: string }> = ({ instanceId }) => {
  const show = useStore((state: any) => state.showFeedbackModal);
  const setShow = useStore((state: any) => state.updateShowFeedbackModal);
  const [activeTag, setActtiveTag] = useSafeState(tags[0].value);
  const [text, setText] = useSafeState("");
  const changeText = useMemoizedFn(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      setText(value);
    }
  );
  const handleOk = useMemoizedFn(() => {
    PubSub.publish(`feedback-reason-${instanceId}`, { text, tag: activeTag });
    setShow(false);
  });
  const reset = () => {
    setActtiveTag(tags[0].value);
    setText("");
  };
  return (
    <Modal
      title="反馈"
      cancelText="取消"
      okText="确定"
      centered
      closable
      destroyOnClose
      open={show}
      key={instanceId}
      maskClosable={false}
      onOk={handleOk}
      afterClose={reset}
      onCancel={setShow.bind(null, false)}
      classNames={{ footer: styles.footer }}
    >
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
          placeholder="请输入"
          value={text}
          count={{ max: 300, show: true }}
          autoSize={{ minRows: 3, maxRows: 6 }}
          onChange={changeText}
        ></TextArea>
      </div>
    </Modal>
  );
};

export default memo(FeedbackModal);
