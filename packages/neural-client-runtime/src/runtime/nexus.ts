import { Nexus as NexusInterface, INexusMessage } from "../interface/nexus";
import PublisherDecorator from "../publisher/decorator";

@PublisherDecorator
export default class Nexus implements NexusInterface {
  static module = 'nexus';
  container: string;
  constructor(container: string) {
    this.container = container;

    return this;
  }

  /**
   * 发送系统消息
   * @param payload 消息数据
   */
  sendSystemMsg<T>(payload: INexusMessage<T>) {

  }
  /**
   * 发送用户消息
   * @param payload 消息数据
   */
  sendUserMsg<T>(payload: INexusMessage<T>) {

  }
  /**
   * 更新上次回答结果
   * @param content 回答内容
   */
  updateLastResult(content: string) {

  };
  /**
   * 复制文本到CUI输入框中
   * @param text 复制的文本内容
   */
  applyText(text: string) {

  };
}