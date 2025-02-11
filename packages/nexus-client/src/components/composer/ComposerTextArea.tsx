import React, { useCallback } from "react";
import classNames from "classnames";
import { Input } from "antd";
import { InputProps } from '@chatui/core';
import { useCreation, useSafeState } from "ahooks";
import { FC } from "react";
import Icon from "@/components/icon";
import styles from "./textarea.module.scss";
import useStore from "@/store/index";
import { isRunningInMobile } from "@/utils/common";

const { TextArea } = Input;


const isMobile = isRunningInMobile();

const TextAreaComponent: FC<InputProps & { onSend: any, invisible: boolean; inputRef: React.MutableRefObject<HTMLTextAreaElement>; }> = function ({ invisible, inputRef, placeholder: defaultPlaceholder, id, value, onSend, onChange, ...rest }) {
    const [placeholder] = useSafeState(defaultPlaceholder);
    const loading = useStore((store: any) => store.loading);
    const waiting = useStore((store: any) => store.waiting);
    const setWaiting = useStore((store: any) => store.setWaiting);
    const disabledSend = useCreation(() => {
      if (loading || waiting) {
        return true;
      }
      return !value;
    }, [value, loading, waiting]);

    const stopAnswer = (event: React.MouseEvent) => {
      event.stopPropagation();
      setWaiting(false);
    };
    const handleChange = useCallback((event) => {
      onChange && onChange(event.target.value, event);
    }, [ onChange ]);

    return !invisible ? (
      <div className={classNames(styles.container, isMobile && styles.mobile)}>
        <div
          className={classNames(
            styles["input-container"]
          )}
        >
          <TextArea
            {...rest as any}          
            variant={ "borderless" as 'outlined' | 'filled' | 'borderless'}
            disabled={waiting}
            value={value}
            onChange={handleChange}
            ref={inputRef}
            placeholder={placeholder}
            autoSize={{ minRows: 1, maxRows: 3 }}
          />
          {waiting ? (
            <div className={classNames(styles.stop)} onClick={stopAnswer}>
              <Icon type="tingzhi" className={styles.icon} />
            </div>
          ) : (
            <div
              className={classNames(
                styles.send,
                disabledSend && styles.disabled
              )}
              onClick={onSend}
            >
              <Icon type="fasong" className={styles.icon} />
            </div>
          )}
        </div>
      </div>
    ): <div/>;
  }

export default TextAreaComponent;
