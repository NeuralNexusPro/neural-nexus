import { MessageProps } from "@chatui/core";

export const createTextMessage = (
  text: string,
  show = true,
  position = "right"
) => {
  return {
    type: "text",
    content: {
      text: text,
    },
    show,
    position,
  };
};

export const createSystemTextMessage = (text: string) => {
  return {
    type: "text",
    content: {
      text: text,
    },
    position: "left",
  };
};

export const createCardMessage = (
  code: string,
  data: any,
  position = "left"
) => {
  return {
    type: "card",
    content: {
      code,
      data,
    },
    position,
  } as MessageProps;
};

export const createQuickReplies = (list: any[]) => {
  // return {
  //   type: "quick-replies",
  //   content: {
  //     list: list.map((v) => ({ name: v.name, text: v.desc })),
  //   },
  // };
  return createCardMessage("quick-replies", list) as MessageProps;
};

export const addQuickReplies = (messageList: any[], quickReplies: any[]) => {
  if (quickReplies.length > 0) {
    const message = createQuickReplies(quickReplies);
    messageList.push(message);
  }
};

export const appendTextMessage = (
  ctx: any,
  payload: any,
  isSystem: boolean = false
) => {
  const position = isSystem ? "left" : "right";
  const message = createTextMessage(payload.text, payload.show, position);
  if (isSystem || payload.notTriggerAPI) {
    // 系统消息或者手动配置不触发接口调用
    ctx.appendMessage(message);
  } else {
    ctx.postMessage(message);
  }
};
