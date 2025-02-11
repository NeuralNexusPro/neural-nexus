import { memo, FC, useRef, useEffect } from "react";
import { useMount, useSafeState } from "ahooks";
import classNames from "classnames";
import { getPrefixCls } from "@/custom-components/index.helper";
import styles from "./index.module.scss";
import Typed from "typed.js";
import { get as getGlobalVars } from "@/utils/global";
import { isRunningInMobile } from "@/utils/common";
import html5Media from '@/utils/markdown-media.ts';
import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";
import mk from "markdown-it-katex";
import { MyCommentsPlugin, NexusLinkPlugin } from "@/utils/plugin";
// import markdownItMermaid from "markdown-it-mermaid";

type CommonAnswerData = {
  answer?: string;
};

type CommonAnswerProps = {
  data: { input: CommonAnswerData; globalVars: any };
  ctx: any;
  meta: any;
};
const isMobile = isRunningInMobile();
/**
 * @description 通用卡片组件 - 知识库问答卡片
 * @param data 传给卡片的数据
 * @param ctx chatUIPro暴露出来的对象，可用来appendMessage展示消息、postMessage 发送消息
 * @param meta 传过来的辅助信息
 * @returns void
 */
const CommonAnswer: FC<CommonAnswerProps> = ({ data: { input }, ctx }) => {
  const prefixCls = getPrefixCls("common-answer");
  const [text, setText] = useSafeState("");
  const [type, setType] = useSafeState("chat");

  const el = useRef(null);
  const mdRef = useRef<any>();
  useEffect(() => {
    const appEntry = getGlobalVars()?.appEntry;
    if (appEntry === "custom") {
      setType("custom");
      const typed = new Typed(el.current, {
        strings: [input?.answer || ""],
        typeSpeed: 46,
        showCursor: false,
      });
      return () => {
        typed.destroy();
      };
    }
  }, [input?.answer, setType]);
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
    if (input?.answer) {
      setText(mdRef.current.render(input?.answer));
    }
  });

  return (
    <div
      className={classNames(
        styles.container,
        isMobile ? `${prefixCls}-mobile` : `${prefixCls}-pc`
      )}
    >
      {type === "chat" ? (
        <div className="answer">
          <div
            dangerouslySetInnerHTML={{ __html: text }}
            style={{ whiteSpace: "normal", pointerEvents: "initial" }}
          ></div>
        </div>
      ) : (
        <div className="answer" ref={el}>
          {input?.answer || ""}
        </div>
      )}
    </div>
  );
};

export default memo(CommonAnswer);
