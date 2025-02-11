# Nexus Client 智能会话容器 SDK

## 使用方式

1. 安装依赖

```sh
npm i -S @neural-nexus/nexus-client
```

2. 在项目中植入脚本

在项目 index.html 中植入依赖脚本

```html
<script src="https://g.alicdn.com/chatui/sdk-v2/0.2.2/sdk.js"></script>
```

如果项目技术栈使用的是 React,需要在打包的时候把 React 和 ReactDOM external 掉，并且 React 版本建议使用 17.0.2;因为 https://g.alicdn.com/chatui/sdk-v2/0.2.2/sdk.js 中包含了 v17.0.2 的 React 和 ReactDOM;

webpack 打包时 external 的方法

```javascript
// 使用craco时在 craco.config.js中配置；否则直接配置webpack的externals即可
webpackConfig.externals = {
  react: "React",
  "react-dom": "ReactDOM",
};
```

vite 打包时 external 的方法

```javascript
import { defineConfig } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [
    viteExternalsPlugin({
      react: "React",
      "react-dom": "ReactDOM",
    }),
  ],
});
```

3. 启动

```vue
<template>
    <div id="neural-nexus"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import bootstrap, { IComeAdaptor, createTextMessage } from '@enn/chatui-sdk';

const uninstall = ref();
onMounted(() => {
  uninstall.value = bootstrap({
    container: 'neural-nexus',
    onStart: function (bot) {
      bot.appendMessage(createTextMessage('start'));
    },
    // 支持对接不同的后端服务
    adaptor: IComeAdaptor,
    config: {
      // 传入不同的服务后端需要的配置
      appId: import.meta.env.VITE_PORTAL_APP_ID,
    },
  });
});
// 由于内部使用了 channel 监听注意要执行卸载动作
onUnmounted(() => {
  uninstall.value!();
});
</script>
<style lang="scss" scoped>
@import "@enn/chatui-sdk/dist/style.css"
</style>

```

## 对接不同的配置后台

### 对接 ICome 配置后台

```ts
import bootstrap, { IComeAdaptor, createTextMessage } from "@enn/chatui-sdk";
bootstrap({
  container: "neural-nexus",
  onStart: function (bot) {
    bot.appendMessage(createTextMessage("start"));
  },
  // 支持对接不同的后端服务
  adaptor: IComeAdaptor,
  config: {
    // 传入不同的服务后端需要的配置
    appId: import.meta.env.VITE_PORTAL_APP_ID,
  },
});
```

### 对接 IOP 配置后台

```ts
import bootstrap, { IOPAdaptor, createTextMessage } from "@enn/chatui-sdk";
import createEnnAuthSDK from "@enncloud/enn-auth-sdk";

const authConfig = {
  appid: "ioc-workbench-front",
  baseUrl: "https://rdfa-gateway.dev.ennew.com",
  env: "NEW_DEV",
  // dev rxvBGZZJgXZh6Dg9UPwV2wc3PM8L5iKK
  // fat L6LciTIdDiZyRQe3B7rczKPfARve2RGu
  accessKey: "rxvBGZZJgXZh6Dg9UPwV2wc3PM8L5iKK",
  tenantPageName: "userCenter",
  initAuth: true, //可选参数，置为true会进行初始鉴权，优化体验
};

const auth = await createEnnAuthSDK(authConfig);

const adaptor = new IOPAdaptor({
  // 运行环境 目前只支持EnnDEV EnnFAT EnnUAT EnnPROD, 涉及到环境中一些 X_GW_ACCESSKEY 和接口地址，默认是 EnnFAT
  env: "EnnDEV",
  // 关联的IOP应用Id，必传
  appId: "5206005f837846c6a644b841ebc1435b",
  // 运行的容器，支持 pc 和 mobile 默认是PC
  platform: "pc",
  // 机器人头像url,传空字符串时无头像, 默认是 https://res.ennew.com/image/png/2635bd03786f165928b46727ce84ef87.png?optimize=true
  botAvatar: "",
  // 用户头像url,传空字符串时无头像,默认是 https://res.ennew.com/image/png/63b2d2c6c561e42873eb220c282159ac.png?optimize=true
  userAvatar: "",
  // 是否是预览态,默认是false, false是运行态;
  isPreview: true,
  // 参与者中心sdk实例,里面包含了logout和getUserInfo等接口; 如果接口403了,会调用logout方法;项目中有可能会用到用户信息,用户信息从这取
  auth,
  // 是否展示历史记录,默认false
  showHistory: true,
  // 输入框placeholder
  placeholder:"请输入你的问题…",
});

bootstrap({
  container: "neural-nexus",
  onStart: function (bot) {
    bot.appendMessage(createTextMessage("start"));
  },
  // 支持对接不同的后端服务
  adaptor: adaptor,
  config: adaptor,
});
```

## 自定义配置后台适配器

#### 适配器定义

```typescript
export interface Message {
  type: string;
  content: any;
  _id?: string;
  createdAt?: number;
  user?: {
    avatar: string;
  };
  position?: "left" | "right" | "center";
  hasTime?: boolean;
}
export declare class Context<T> {
  context: T;
  constructor(value: any);
  set: (callback: (props: any) => any) => void;
  get: () => {} & T;
  clear: () => any;
}
export default interface Adaptor {
  bot: any;
  components: {
    [key: string]: React.FC<any>;
  };
  context: Context<any>;
  avatarWhiteList: string[];
  botAvatar: string;
  userAvatar: string;
  placeholder: string;
  getWelcomeMessage: () => Promise<Message[] | Message> | Message[] | Message;
  getInitActions: () => Promise<string[]> | string[];
  send: (
    msg: Message
  ) => object | Promise<Message[]> | Promise<Message> | Promise<null>;
}
```

```ts
import bootstrap, {
  Adaptor,
  Context,
  Message,
  createTextMessage,
} from "@enn/chatui-sdk";
import { BroadcastEvent, Terminal, IMessage } from "@ennew/nexus-protocol";
import { channel } from "@ennew/one-portal-channel";
import { EnnAuthSDK } from "@enncloud/enn-auth-sdk";

export default class MyAdaptor implements Adaptor {
  bot = null;
  auth: EnnAuthSDK = undefined;
  context = new Context<{
    basename: string;
    chat: {
      lastResult: string;
    };
    clientId: string;
  }>({
    basename: undefined,
  });
  components = {};
  // 头像白名单
  avatarWhiteList = [];
  botAvatar =
    "https://res.ennew.com/image/png/2635bd03786f165928b46727ce84ef87.png?optimize=true";
  userAvatar =
    "https://res.ennew.com/image/png/63b2d2c6c561e42873eb220c282159ac.png?optimize=true";
  placeholder = "请输入你的问题…";

  constructor(config = {}) {
    Object.assign(this, config);
  }

  async send(msg: Message) {
    const command = {
      command: "openPage",
      args: {
        id: "test-open-bing",
        title: "baidu",
        url: "https://bing.com",
        context: {},
      },
    };
    const message: IMessage = {
      from: Terminal.NexusClient,
      to: Terminal.PortalClient,
      timestamp: new Date().getTime(),
      content: {
        type: "command",
        payload: command,
      },
    };
    channel.broadcast(BroadcastEvent.DrivePortalClient, message);
    return createTextMessage("xxx 应用已打开");
  }

  async getInitActions() {
    return [];
  }

  async getWelcomeMessage() {
    return createTextMessage("hello world");
  }
}

bootstrap({
  container: "neural-nexus",
  onStart: function (bot) {
    bot.appendMessage(createTextMessage("start"));
  },
  // 支持对接不同的后端服务
  adaptor: MyAdaptor,
  config: {
    // 传入不同的服务后端需要的配置
  },
});
```

#### 支持继承 Adaptor 以支持扩展

如例:

```ts
import bootstrap, { IOPAdaptor, createTextMessage } from "@enn/chatui-sdk";

// 重写 send 方法，hook 向系统发送消息
class CopilotDriveAdaptor extends IOPAdaptor {
  async send(msg) {
    const { content, type } = msg;

    // YOUR LOGIC
    const res = await createCompletion(content.text, {
      apps: toRaw(sidebarMenuData.value),
    });
    if (res && res.command) {
      const { command, args, name } = res;

      switch (command) {
        case "openApp": {
          const { id } = args;
          const match = sidebarMenuData.value.find((el) => el.id === id);
          if (match) {
            $store.dispatch("openPageById", id);
          } else {
            $store.dispatch("openPage", args);
          }
          break;
        }
        case "closeApp": {
          const { id } = args;
          $store.dispatch("closePageClick", { _id: id || activePage.id });
          break;
        }
        case "back":
          $store.dispatch("goBackClick");
          break;
        default:
          break;
      }
      if (command !== "notSupport")
        return createTextMessage(`智能操作系统指令${name}已完成`);
    }

    if (activePage.value === "copilot") {
      const message: IMessage = {
        from: Terminal.NexusClient,
        to: Terminal.PortalClient,
        timestamp: new Date().getTime(),
        content: {
          type: "text",
          payload: content.text,
        },
      };

      console.log("appspace send DriveCopilotSdk");
      channel.broadcast(BroadcastEvent.DriveCopilotSdk, message);

      return Promise.resolve();
    }

    // FALLBACK IOP LOGIC
    return await super.send(msg);
  }
}

bootstrap({
  container: "neural-nexus",
  onStart: function (bot) {
    bot.appendMessage(createTextMessage("start"));
  },
  // 支持对接不同的后端服务
  adaptor: CopilotDriveAdaptor,
  config: {
    // 传入不同的服务后端需要的配置
    roleId: "8432629816016175104",
    appId: import.meta.env.VITE_IOP_COPILOT_APP_ID,
    accessKey: import.meta.env.VITE_IOP_GW_ACCESS_KEY,
  },
});
```
