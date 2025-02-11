import {FC} from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import {isRunningInMobile} from "@/utils/common.ts";
import {getPrefixCls} from "@/custom-components/index.helper.ts";
import {useMemoizedFn} from "ahooks";
import useStore from "@/store";
import {get as getGlobalVars} from "@/utils/global.ts";
import voiceImage from "@/assets/images/voice.gif";

interface IAudioStopProps {
    isPlay: boolean;
}

const isMobile = isRunningInMobile();

const Index: FC<IAudioStopProps> = ({isPlay}) => {
    const prefixCls = getPrefixCls("audio-stop");
    const {audio: { audioGenSocket, baseAudio }} = getGlobalVars();
    const runMessageId = useStore((state: any) => state.runMessageId);
    const updateMessageId = useStore((state: any) => state.updateMessageId);
    const streamAudioPlay = useStore((state: any) => state.streamAudioPlay);

    const handleStop = useMemoizedFn(() => {
        // 当前有正在播放音频并且关闭了流式按钮
        if (!streamAudioPlay && runMessageId) {
            updateMessageId(undefined);
            baseAudio.longPlayer.stop();
            audioGenSocket.send({ type: "end" });
        }
    });
    if (isPlay) {
        return <div className={classNames(
            styles.container,
            isMobile ? `${prefixCls}-mobile` : `${prefixCls}-pc`
        )} onClick={handleStop}>
            <img src={voiceImage} className="image"/>
            <span>停止播报</span>
        </div>
    }
    return null
};

export default Index;