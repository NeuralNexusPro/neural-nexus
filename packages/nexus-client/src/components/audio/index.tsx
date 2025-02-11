import {FC, useEffect, memo, useMemo, useRef} from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import useStore from "@/store/index";
import voiceImage from "@/assets/images/voice.gif";
import pcVoiceImage from "@/assets/images/pc-voice.gif";
import Icon from "@/components/icon";
import {get as getGlobalVars} from "@/utils/global";
import {isRunningInMobile} from "@/utils/common";
import {getPrefixCls} from "@/custom-components/index.helper";
import PubSub from "pubsub-js";
import {Tooltip, Button} from "antd";

const isMobile = isRunningInMobile();
const punctuationPattern = /[,!?:\u3002\uff01\uff1f\uff1a\uff0c\u3001]+/; // 根据标点符号分割

interface IAudioHocProps {
    data: { input: any; globalVars: any };
    text: string; // 语音播报的文本
    onPause?: () => void
}

const AudioComponent: FC<IAudioHocProps> = (props) => {
    const {data: {input}, text, onPause} = props;
    const {audio: {audioGenSocket, baseAudio}} = getGlobalVars();
    const prefixCls = getPrefixCls("audio");
    const streamAudioPlay = useStore((state: any) => state.streamAudioPlay);
    const runMessageId = useStore((state: any) => state.runMessageId);
    const updateMessageId = useStore((state: any) => state.updateMessageId);
    const preText = useRef("");
    const preTextIndex = useRef(0);
    const answeringId = useStore((state: any) => state.answeringId);

    useEffect(() => {
        // 当前有正在播放音频并且关闭了流式按钮
        if (!streamAudioPlay && runMessageId) {
            updateMessageId(undefined);
            baseAudio.longPlayer.stop();
            audioGenSocket.send({type: "end"});
        }
    }, [streamAudioPlay]);

    useEffect(() => {
        // 清除事件订阅
        audioGenSocket?.cancelObserve();
        setTimeout(() => {
            // 事件订阅
            audioGenSocket?.onObserve((data) => {
                baseAudio.longPlayer.play(data);
            }, "observe-" + input.answerId);
        });
    }, []);

    useEffect(() => {
        preTextIndex.current = 0
        // 打开了流式播放按钮
        if (streamAudioPlay) {
            // 代表当前正在播放其他流式消息的音频 发送end 停止播放 先断连再重联（防止拼接到上次播放的语音）
            if (runMessageId) {
                updateMessageId(undefined)
                audioGenSocket.send({type: 'end'})
                baseAudio.longPlayer.stop()
                audioGenSocket.customReconnect(true)
            }
            baseAudio.longPlayer.clear();
            updateMessageId(input.answerId);
            audioGenSocket.send({type: "start"});
        }
        PubSub.subscribe(`update-text-${input.answerId}`, (_, text) => {
            if (streamAudioPlay) parseText(text);
        });
        PubSub.subscribe(`update-card-end-${input.answerId}`, (_, item) => {
            const {end, event, message} = item || {};
            const isMsgStr = typeof message === "string";
            if (end && event === "input" && isMsgStr && streamAudioPlay) {
                if (preText.current) {
                    audioGenSocket.send(preText.current);
                    preText.current = "";
                }
                audioGenSocket.send({type: "end"});
            }
        });
        return () => {
            // 移除事件监听
            PubSub.unsubscribe(`update-text-${input.answerId}`);
            PubSub.unsubscribe(`update-card-end-${input.answerId}`);
        };
    }, []);

    const isPlay = useMemo(() => {
        return runMessageId && runMessageId === input.answerId;
    }, [input.answerId, runMessageId]);

    const parseText = (text) => {
        // 如果包含\n
        if (/\n+/g.test(text)) {
            text = text.replace(/\n+/g, "");
        }
        preText.current += text || "";
        if (
            punctuationPattern.test(text) &&
            (!preTextIndex.current || preText.current.length > 6)
        ) {
            audioGenSocket.send(preText.current);
            preText.current = "";
            preTextIndex.current++;
        }
    };

    // 播放/暂停
    const handlePlay = async () => {
        preTextIndex.current = 0
        // 代表当前正在播放其他消息的音频 发送end 停止播放 先断连再重联（防止拼接到上次播放的语音）
        if (runMessageId) {
            audioGenSocket.send({type: 'end'})
            baseAudio.longPlayer.stop()
            audioGenSocket.customReconnect(true)
        }
        // 暂停
        if (isPlay) {
            updateMessageId(undefined);
            onPause?.();
        }
        // 播放
        if (!isPlay) {
            updateMessageId(input.answerId);
            baseAudio.longPlayer.clear();
            audioGenSocket.send({type: "start"});

            // 长文本模拟流式发送文本
            const promises = [];
            for (const item of text) {
                promises.push(
                    new Promise((resolve: any) => {
                        setTimeout(() => {
                            parseText(item);
                            resolve();
                        }, 688);
                    })
                );
            }
            await Promise.all(promises);
            // 不符合标点符号分割剩余的文本 最后发送一遍
            if (preText.current) {
                audioGenSocket.send(preText.current);
                preText.current = "";
            }
            audioGenSocket.send({type: "end"});
        }
    };

    const isAnswering = useMemo(() => {
        const inputAnswerId = input.answerId?.split("_")?.[0];
        // 判断当前语音播报的是否是刚刚回答结束的
        return answeringId === inputAnswerId;
    }, []);

    return (
        !isAnswering ?
            <div className={classNames(isPlay && "show", isMobile ? `${prefixCls}-mobile-box` : `${prefixCls}-pc-box`)}
                 onClick={handlePlay}>
                {
                    isMobile ?
                        <>
                            <Icon type={isPlay ? "yuyinmianji" : "yuyin1"} className="icon"></Icon>
                            <span>{isPlay ? "停止播报" : "播报"}</span>
                        </> :
                        <Tooltip title={isPlay ? "停止播报" : "语音播报"} trigger="hover">
                            {
                                isPlay ?
                                    <img src={pcVoiceImage} className="image"/> :
                                    <Button prefixCls="chatui-button" type="text">
                                        <Icon type={isPlay ? "close" : "play"} className="icon"/>
                                    </Button>
                            }
                        </Tooltip>
                }
            </div> :
            <div className={classNames(
                styles.container,
                isMobile ? `${prefixCls}-mobile` : `${prefixCls}-pc`
            )}>
                <div className={classNames("voice", isPlay && "show")}
                     onClick={handlePlay}>
                    {isMobile ? (
                        isPlay ? (
                            <img src={voiceImage} className="image"/>
                        ) : (
                            <Icon type="yuyin1" className="icon"/>
                        )
                    ) : (
                        <Tooltip title={isPlay ? "停止播报" : "语音播报"} trigger="hover">
                            {
                                isPlay ?
                                    <img src={pcVoiceImage} className="image"/> :
                                    <Button prefixCls="chatui-button" type="text">
                                        <Icon type={isPlay ? "close" : "play"} className="icon"/>
                                    </Button>
                            }
                        </Tooltip>
                    )}
                </div>
            </div>
    );
};

export default memo(AudioComponent);
