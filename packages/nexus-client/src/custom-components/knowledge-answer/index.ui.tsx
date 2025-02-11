import React, { FC, useEffect, useMemo, useRef } from "react";
import { Collapse, Button, Popover } from "antd";
import {
  FileType,
  KnowledgeAnswerData,
} from "@/custom-components/knowledge-answer/index.type.ts";
import { useCreation, useMemoizedFn, useMount, useSafeState } from "ahooks";
import classNames from "classnames";
import Icon from "@/components/icon";
import styles from "./index.ui.module.scss";
import { isRunningInMobile } from "@/utils/common.ts";
import { get as getGlobalVars } from "@/utils/global.ts";
import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";
import mk from "markdown-it-katex";
import { MyCommentsPlugin } from "@/utils/plugin";

interface KnowLedgeAnswerProps {
  text: string;
  input: KnowledgeAnswerData;
  isPlay: boolean;
  isStopped: boolean; // 会话是否被终止状态
}

const { Panel } = Collapse;
const KnowLedgeAnswerUI: FC<KnowLedgeAnswerProps> = ({
  text,
  input,
  isPlay,
  isStopped,
}) => {
  const isMobile = isRunningInMobile();
  const global = getGlobalVars();
  const [openPopup, setOpenPopup] = useSafeState<boolean>(false);
  const [file, setFileInfo] = useSafeState<FileType>(null);
  const fileList = useMemo(() => input.files || [], [input.files]);

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
  }, [text]);

  const handleOpenChange = useMemoizedFn((open: boolean) => {
    setOpenPopup(open);
  });

  const handleOpenPop = useMemoizedFn((e: React.MouseEvent, file) => {
    e.stopPropagation();
    setOpenPopup(true);
    setFileInfo(file);
  });

  const handleClose = useMemoizedFn((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPopup(false);
  });

  const handleOpen = useMemoizedFn((e, file: FileType) => {
    e.stopPropagation();
    if (file?.url) {
      window.open(file.url, "_blank");
    }
  });

  const title = useCreation(() => {
    return (
      <div className={styles.title}>
        <div className={styles.name}>{file?.name}</div>
        <Icon
          type="jinru"
          className={classNames("icon", styles.link)}
          onClick={(e) => handleOpen(e, file)}
        />
        <Icon
          type="guanbi"
          className={classNames("icon", styles.close)}
          onClick={handleClose}
        />
      </div>
    );
  }, [file]);

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  return (
    <div
      className={classNames(
        isMobile ? styles["wrapper-mobile"] : styles["wrapper-pc"]
      )}
    >
      {global.showOriginal ? (
        <>
          <Collapse ghost className={styles.collapse}>
            <Panel
              header={`找到了${fileList?.length}篇资料作为参考`}
              key="1"
              className={styles.panel}
            >
              <div className={styles["text-wrapper"]}>
                <p>找到了 {fileList?.length} 篇资料作为参考：</p>
                <p>
                  {fileList?.map((file, index) => (
                    <div key={index} className={styles.file}>
                      <span>{index + 1} ：</span>
                      <Button
                        type="link"
                        onClick={(e) => handleOpenPop(e, file)}
                      >
                        <a className={styles.filename}>{file?.name}</a>
                      </Button>
                    </div>
                  ))}
                </p>
              </div>
            </Panel>
          </Collapse>
          <Popover
            placement="bottomRight"
            content={<div className={styles.content}>{file?.content}</div>}
            title={title}
            trigger="click"
            open={openPopup}
            onOpenChange={handleOpenChange}
            overlayClassName={
              isMobile ? styles["slice-mobile"] : styles["slice-pc"]
            }
            getPopupContainer={(node) => node}
            autoAdjustOverflow
          ></Popover>
        </>
      ) : null}
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
        {global.signSource ? (
          <div className={styles["source-wrapper"]}>
            <div className={styles.source}>基于知识库生成</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KnowLedgeAnswerUI;
