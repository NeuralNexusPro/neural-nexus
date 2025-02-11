import _React, { memo, FC, useRef, useEffect } from "react";
import { useMount, useSafeState } from "ahooks";
import classNames from "classnames";
import { getPrefixCls } from "@/custom-components/index.helper";
import styles from "./index.module.scss";
import { isRunningInMobile } from "@/utils/common";
import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";
import mk from "markdown-it-katex";
import { MyCommentsPlugin, NexusLinkPlugin } from "@/utils/plugin";
// import markdownItMermaid from "markdown-it-mermaid";
import html5Media from '@/utils/markdown-media.ts';

type CommonTextProps = {
  data: string;
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
  data,
}) => {
  const prefixCls = getPrefixCls("common-text");
  const [_, setLoadMarkdown] = useSafeState(false);
  const [text, setText] = useSafeState('');
  const mdRef = useRef<any>();

  useMount(() => {
    const md = markdownit({
      html: false,
      linkify: true,
      typographer: true,
      breaks:true,
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
    md.use(NexusLinkPlugin);
    md.use(html5Media);
    setLoadMarkdown(true);
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
    if (data) {
      setText(mdRef.current.render(data || ""));
    }
  });

  useEffect(() => {
    if (data && mdRef.current) {
      setText(mdRef.current.render(data || ""));
    }
  }, [ data, setText ]);

  return (
    <div
      className={classNames(
        styles.container,
        isMobile ? `${prefixCls}-mobile` : `${prefixCls}-pc`,
      )}
    >
      <div className={classNames("answer")}>
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          style={{ whiteSpace: "normal", pointerEvents: "initial" }}
        ></div>
      </div>
    </div>
  );
};

const FinallyCommonText: FC<CommonTextProps> = (props) => {
  return (
    <CommonText {...props} />
  );
};
export default memo(FinallyCommonText);
