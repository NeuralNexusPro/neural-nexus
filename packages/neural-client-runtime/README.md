# neural-client-runtime
会话客户端运行时sdk


## Getting started

安装
```
npm i @neural-nexus/neural-client-runtime
```

## 使用说明

使用示例
```typescript
import Runtime, { MessageType } from '@neural-nexus/neural-client-runtime'

const cardRunTime = new Runtime('cardCode')

cardRunTime.application.openApp('https://1688.com', '1688')

cardRunTime.ui.openNotification({
  title: '消息',
  message: '这是一条消息的提示消息',
  type: MessageType.INF
})

```

API列表

### Action(自定义行为)
```typescript
export interface Action {
  /**
   * 注册自定义行为
   * @param name 行为名称
   * @param containerCode 行为触发端
   * @param cb 行为回调
   */
  register(name:string, containerCode: string, cb: () => void): void;

  /**
   * 触发自定义行为
   * @param name 行为名称
   * @param params 行为参数
   * @param containerCodeList 行为触发端列表
   */
  trigger(name: string, params: any, containerCodeList: string[]): void;
}
```

### application(应用空间)
```typescript
export interface Application {
  /**
   * 打开应用空间
   */
  openWorkspace(): void;
  /**
   * 打开工作台首页
   */
  openLaunchPad(): void;
  /**
   * 打开
   */
  openNexus(): void;
  /**
   * 打开子应用
   */
  openApp(url: string, name: string): void;
  /**
   * 页面回退
   */
  goBack(): void;
  /**
   * 更新首页关注内容
   */
  updateFollow(): void;
    
  /**
   * 更新首页通知
   */
  updateNotice(payload: any): void;
  
  /**
   * 更新首页任务
   */
  updateTask(payload: any): void;
  
  /**
   * 更新首页示险
   */
  updateWarning(payload: any): void
}
```

### nexus(会话)
```typescript
export enum NexusMessageType {
  CARD = "card",
  TEXT = "text",
}

export interface ITextMsgPayload {
  text: string,
  show?: boolean,
  notTriggerAPI?: boolean
}

export interface ICardMsgPayload<T = any>  {
  code: string,
  data: T,
  position?: string
}
export interface Nexus {
  /**
   * 发送系统消息
   * @param type 消息类型
   * @param payload 消息数据
   */
  sendSystemMsg(type: NexusMessageType, payload: ITextMsgPayload | ICardMsgPayload): void;
  /**
   * 发送用户消息
   * @param type 消息类型
   * @param payload 消息数据
   */
  sendUserMsg(type: NexusMessageType, payload: ITextMsgPayload | ICardMsgPayload): void;

  /**
   * 更新上次回答结果
   * @param content 回答内容
   */
  updateLastResult(content: string): void;
}
```

### ui
```typescript
export interface UI {

openToast (params: IToastOpts): void;

/**
 * 打开通知，可以从四个角弹出
 * 里面的组件属性和饿了么一样
 * @param {*} params
 */
openNotification (params: INotificationOpts): void;

/**
 * 打开 Modal 弹窗
 * 里面的组件属性和饿了么一样
 * @param {*} params
 */
openDialog (params: IDialogOpts): void;
```




