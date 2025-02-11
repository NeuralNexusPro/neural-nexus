
import { ToolbarItemProps } from "@chatui/core";
import CustomComponent from "./components/custom-component";
import bootstrap, { DefaultAdaptor, MessageProps } from "../../src";

class CopilotDriveAdaptor extends DefaultAdaptor {
  constructor(config: Partial<DefaultAdaptor>) {
    super(config);
  }

  components = { ...this.components, "custom-component": CustomComponent };

  getInitActions() {
    return [
      {
        name: '测试',
        code: 'test',
      },
      {
        name: '测试2',
        code: 'test2',
      }
    ];
  }

  getToolbars(): Promise<ToolbarItemProps[]> | ToolbarItemProps[] {
      return [
        {
          type: 'head', // 类型
          img: 'https://res.ennew.com/image/png/c7b8ecf0bda4cb7c07b39770bd899b49.png?optimize=true', // 图片（img），推荐用 56x56 的图，会覆盖 icon
          title: '头像', // 名称
        }
      ]
  }

  

  send(msg: MessageProps): Promise<MessageProps> {
    return new Promise<MessageProps>((resolve, reject) => {
      setTimeout(() => {
        const { type, content } = msg;
        resolve({
          ...msg,
          // type: 'markdown', 
          // content: `# 标题 \n## 二级标题\n收到 ${content}`
          // type: 'iframe-container',
          // content: { url: 'https://ecm.ennew.com', title: 'bing' }
          type: 'custom-component',
          content: {
            url: 'https://s.ennew.com/npm/@enn/test-iop-component-b/0.0.5/index.min.js',
            name: 'TestIopComponentB'
          }
        })
      }, 1000)
    });
  }
}

bootstrap({
  container: "root",
  onStart: function () {
    console.log('on start')
  },
  adaptor: DefaultAdaptor,
  config: {
    appkey: 'fubai_test',
    env: 'dev',
    appsecret: 'b2be6fee39ca5352b1ae8b7304147e13'
  }
});