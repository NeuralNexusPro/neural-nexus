import {memo, FC, useEffect} from "react";
import {useSafeState} from "ahooks";
import classNames from "classnames";
import PubSub from "pubsub-js";
import styles from "./index.module.scss";
import {isRunningInMobile, scrollBottom} from "@/utils/common";
import KnowLedgeAnswerUI from "@/custom-components/knowledge-answer/index.ui.tsx";
import {KnowledgeAnswerData} from "@/custom-components/knowledge-answer/index.type.ts";
import {ConfigProvider} from "antd";

type KnowledgeAnswerProps = {
    data: { input: KnowledgeAnswerData; globalVars: any };
    isPlay: boolean;
    isStopped: boolean; // 会话是否被终止状态
    ctx: any;
    meta: any;
};
const isMobile = isRunningInMobile();
/**
 * @description 通用卡片组件 - 纯文本卡片
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const KnowledgeAnswer: FC<KnowledgeAnswerProps> = ({data: {input}, isPlay, isStopped,}) => {
    const [text, setText] = useSafeState("");

    useEffect(() => {
        PubSub.subscribe(`update-text-${input.answerId}`, (_, text) => {
            setText((val) => val + text);
            scrollBottom();
        });
        PubSub.subscribe(`update-text-error-${input.answerId}`, (_, text) => {
            setText(text);
            scrollBottom();
        });
        return () => {
            // 移除事件监听
            PubSub.unsubscribe(`update-text-${input.answerId}`);
            PubSub.unsubscribe(`update-text-error-${input.answerId}`);
        };
    }, [setText, input.answerId]);

    return (
        <ConfigProvider prefixCls="chatui">
            <div
                className={classNames(
                    styles.container,
                    isMobile ? styles.mobile : styles.pc
                )}
            >
                <KnowLedgeAnswerUI input={input} text={text} isPlay={isPlay} isStopped={isStopped}></KnowLedgeAnswerUI>
            </div>
        </ConfigProvider>
    );
};

const FinallyKnowledgeAnswer: FC<KnowledgeAnswerProps> = (props) => {
    return<KnowledgeAnswer {...props} />
};
export default memo(FinallyKnowledgeAnswer);
