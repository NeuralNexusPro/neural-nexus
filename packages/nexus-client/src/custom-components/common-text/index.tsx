import { memo, FC, useEffect, useRef } from "react";
import { useCreation, useMount, useSafeState } from "ahooks";
import classNames from "classnames";
import { getPrefixCls } from "@/custom-components/index.helper";
import styles from "./index.module.scss";
import { isRunningInMobile, scrollBottom } from "@/utils/common";
import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";
import mk from "markdown-it-katex";
import { MyCommentsPlugin, NexusLinkPlugin } from "@/utils/plugin";
// import markdownItMermaid from "markdown-it-mermaid";
import html5Media from '@/utils/markdown-media.ts';
import PubSub from "pubsub-js";
import useCopilotNode from "@/hooks/useCopilotNode.tsx";
import { get as getGlobalVars } from "@/utils/global.ts";

type CommonTextData = {
  answerId: string;
  copilot?: Record<string, any>;
  answer?: string;
  show?: boolean;
  last?: boolean;
  showSummary?: boolean;
  instanceId?: string;
};

type CommonTextProps = {
  data: { input: CommonTextData; globalVars: any };
  ctx: any;
  meta: any;
  isPlay: boolean; // 语音播报状态
  isStopped: boolean; // 会话是否被终止状态
};
const isMobile = isRunningInMobile();
/**
 * @description 通用卡片组件 - 纯文本卡片
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const CommonText: FC<CommonTextProps> = ({
  data: { input },
  isPlay,
  ctx,
  isStopped,
}) => {
  const prefixCls = getPrefixCls("common-text");
  const [text, setText] = useSafeState(input?.answer || "");
  const [loadMarkdown, setLoadMarkdown] = useSafeState(false);
  const dom = useCopilotNode(input?.copilot);
  const global = getGlobalVars();
  const mdRef = useRef<any>();

  useMount(() => {
    const md = markdownit({
      html: false,
      linkify: true,
      typographer: true,
      langPrefix: "language-",
    });
    mdRef.current = md;
    md.use(mila, {
      attrs: {
        target: "_blank",
        rel: "noopener",
      },
    });
    md.use(mk);
    md.use(MyCommentsPlugin);
    md.use(NexusLinkPlugin(ctx));
    md.use(html5Media);
    setLoadMarkdown(true);
    // md.use(markdownItMermaid);
    const defaultRender =
      md.renderer.rules.table_open ||
      function (tokens: any, idx: any, options: any, _: any, self: any) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.table_open = function (
      tokens: any,
      idx: any,
      options: any,
      env: any,
      self: any
    ) {
      tokens[idx].attrPush(["class", "custom-table"]); // Add custom class to table
      return defaultRender(tokens, idx, options, env, self);
    };
  });

  const result = useCreation(() => {
    if (mdRef.current) {
      return mdRef.current.render(text || "");
    }
    return text;
  }, [text, loadMarkdown]);

  useEffect(() => {
    PubSub.subscribe(
      `update-card-args-${input.answerId}`,
      (_, data: { answer: string }) => {
        setText(data.answer);
        scrollBottom();
      }
    );
    PubSub.subscribe(`update-text-${input.answerId}`, (_, text) => {
      setText((val) => val + text);
      scrollBottom();
    });
    return () => {
      // 移除事件监听
      PubSub.unsubscribe(`update-card-args-${input.answerId}`);
      PubSub.unsubscribe(`update-text-${input.answerId}`);
    };
  }, [setText, input.answerId]);
  return (
    <div
      className={classNames(
        styles.container,
        isMobile ? `${prefixCls}-mobile` : `${prefixCls}-pc`,
        !input?.show && input?.last ? "hide" : "show",
        input?.showSummary ? "show-summary" : "hide-summary"
      )}
    >
      <div className={classNames("answer", isPlay && "blue")}>
        <div
          dangerouslySetInnerHTML={{ __html: result }}
          style={{ whiteSpace: "normal", pointerEvents: "initial" }}
        ></div>
        {isStopped &&
          (text?.length ? (
            <p className="pause-text">回答已停止</p>
          ) : (
            <p>已停止回答</p>
          ))}
        {global.signSource && !(!input?.show && input?.last) ? (
          <div className="source-wrapper">
            <div className="source">由大模型生成</div>
          </div>
        ) : null}
      </div>
      {dom}
    </div>
  );
};

const FinallyCommonText: FC<CommonTextProps> = (props) => {
  return (
      <CommonText {...props} />
  );
};
export default memo(FinallyCommonText);
