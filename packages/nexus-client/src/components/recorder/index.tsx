import { useState, useEffect, useRef, useCallback, FC } from 'react';
import styles from './index.module.scss';
import ReactDOM from 'react-dom';
import Icon from '../icon';

enum RecorderStatus {
  recording = 'recording',
  willCancel = 'willCancel',
  willOuput = 'willOuput',
  inited = 'inited'
}

enum StatusText {
  recording = '松开发送',
  willCancel = '松手，取消发送',
  willOuput = '松手，编辑文案',
  inited = '我在听，请说话～'
}

type RecorderHandlers = {
  onStart?: (data: { setRecorderText: (value: string) => void }) => void;
  onEnd?: (data: { duration: number }) => void;
  onCancel?: () => void;
  onOutput?: () => void;
}

export type RecorderProps = {
  volume?: number;
  triggerRef?: Element;
  canRecord?: boolean;
} & RecorderHandlers;

let ts = 0;
let referenceX = 0;
let referenceY = 0;

const waves = [...Array(39)];

const getMoveRefXY = (moveRef: HTMLElement) => {
  const rect = moveRef.getBoundingClientRect();
  return { x: rect.width / 2, y: rect.top };
}

export const Recorder: FC<RecorderProps> = ((props) => {
  const { onStart, onEnd, onCancel, onOutput } = props;
  const moveRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>(RecorderStatus.inited);
  const [text, setText] = useState<string>(StatusText.inited);
  const [textOverflow, setTextOverflow] = useState(false);

  const doEnd = useCallback(() => {
    const duration = Date.now() - ts;
    onEnd?.({ duration });
  }, [onEnd]);

  useEffect(() => {
    const wrapper = props.triggerRef!;

    function handleTouchStart(e: TouchEvent) {
      if (e.cancelable) {
        e.preventDefault();
      }

      ts = Date.now();
      setStatus(RecorderStatus.recording);
      const touch = getMoveRefXY(moveRef.current);
      referenceX = touch.x;
      referenceY = touch.y;

      onStart?.({ setRecorderText: setText });
    }

    function handleTouchMove(e: TouchEvent) {
      if (!ts) return;
      const nowY = e.touches[0].pageY;
      const nowX = e.touches[0].pageX;

      if (nowY < referenceY) {
        const isCancel = referenceX > nowX;
        setStatus(isCancel ? 'willCancel' : 'willOuput');
        return;
      }

      setStatus(RecorderStatus.recording);
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!ts) return;
      const endY = e.changedTouches[0].pageY;
      const endX = e.changedTouches[0].pageX;

      const isRecording = endY > referenceY;
      setStatus(RecorderStatus.inited);
      setText(StatusText.inited);

      if (isRecording) {
        doEnd();
      } else {
        const isCancel = referenceX > endX;
        isCancel ? onCancel?.() : onOutput?.();
      }
    }

    wrapper.addEventListener('touchstart', handleTouchStart);
    wrapper.addEventListener('touchmove', handleTouchMove);
    wrapper.addEventListener('touchend', handleTouchEnd);
    wrapper.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [doEnd, onCancel, onStart, props.triggerRef, onOutput]);

  useEffect(() => {
    // always display latest lines
    const element = textRef.current;
    if (element && element.clientHeight !== element.scrollHeight) {
      setTextOverflow(true);
      element.scrollTop = element.scrollHeight;
    }
  }, [text]);


  const isCancel = status === RecorderStatus.willCancel;
  const isOutput = status === RecorderStatus.willOuput;

  return (
    <div className={`${styles[`recorder`]} ${isCancel ? '--cancel' : ''} ${isOutput ? '--output' : ''}`}>
      {status !== 'inited' ? (
        <div className="recorder-toast">
          {textOverflow ? <span className="text-overflow">...</span> : null}
          <div className="recorder-toast-text" ref={textRef}>
            {text}
          </div>
          <div className={`recorder-toast-prompt`}>
            <div className="prompt-text">{StatusText[status]}</div>
          </div>
          <div className="recorder-toast-actions">
            <div className="action cancel-action">
              <Icon type="chehui" className="icon" />
            </div>
            <div className="action output-action">
              <Icon type="jianpan1" className="icon" />
            </div>
          </div>
          <div ref={moveRef} className="recorder-toast-waves">
            <div className="bars">
              {waves.map((_, index) => {
                return <div className="bar" key={index}></div>
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export function createRecorderProxy(handlers?: RecorderHandlers) {
  let container = null;
  let root = null;

  function mount(containerRef: HTMLElement, triggerRef: HTMLElement) {
    if (container && root) return;
    root = containerRef;
    container = document.createElement('div');
    ReactDOM.render(<Recorder triggerRef={triggerRef} {...handlers} />, container);
    root.parentElement.appendChild(container);
  }

  function unmount() {
    if (!container || !root) return;
    ReactDOM.unmountComponentAtNode(container);
    root.parentElement.removeChild(container);
    container = null;
    root = null;
  }

  return { mount, unmount };
}
