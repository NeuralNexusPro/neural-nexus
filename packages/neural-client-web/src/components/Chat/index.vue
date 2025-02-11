<template>
  <div class="neural-nexus-container">
    <div id="neural-nexus-chatmode"></div>
  </div>
</template>
<script lang="ts" setup>
import { onUnmounted, onMounted, ref, inject } from 'vue';
import { useStore } from 'vuex';
import bootstrap, { DefaultAdaptor, MessageProps } from '@neural-nexus/nexus-client';
import { CHAT_MODE_ID } from '@/config/constants';
import { BroadcastEvent, Terminal } from '@neural-nexus/nexus-protocol';
import { getAppCode } from '@/utils/common';
import { useDebounceFn } from '@vueuse/core';
import { Manager } from '@neural-nexus/neural-channel';
import Runtime from '@neural-nexus/neural-client-runtime';

const uninstall = ref();
const $store = useStore();
const authSdk = inject('authSdk');
const chatCtx = inject('chatCtx') || [];
const channel = inject('channel') as Manager;
class MyAdaptor extends DefaultAdaptor {
  send(msg: MessageProps) {
    return new Promise<MessageProps>((resolve, reject) => {
      setTimeout(() => {
        const { type, content } = msg;
        if (type === 'text' && content.includes('打开')) {
          const runtime = $store.state.app.runtime.application as Runtime;
          runtime.openApp('http://localhost:5174/', '测试');
          resolve({
            ...msg,
            type: 'text',
            content: "已打开"
          });
        } else {
          return super.send(msg)
        }

      }, 1000)
    });
  }
}

onMounted(() => {
  const message = {
    from: Terminal.PortalClient,
    to: Terminal.NexusClient,
    timestamp: new Date().getTime(),
    content: {
      type: BroadcastEvent.DetectPortalClient,
      payload: 'hello world',
    },
  };
  channel.broadcast(BroadcastEvent.DetectPortalClient, message);
  channel.on(BroadcastEvent.DrivePortalClient, async function (receive) {
    const { from, content } = receive;
    const { payload } = content;
    const { command, args } = payload;

    if (from === Terminal.NexusClient) {
      switch (command) {
        case 'openPage':
          await $store.dispatch('openPage', args);
          break;
        default:
          break;
      }
    }
  });
  channel.on(BroadcastEvent.UpdatePortalModule, msg => {
    console.log('message: ', msg);
  });
  uninstall.value = bootstrap({
    container: CHAT_MODE_ID,
    adaptor: MyAdaptor,
    config: {
      env: import.meta.env.VITE_APM_ENV,
      appId: getAppCode() || '',
      platform: 'pc',
      client: 'neural',
      isPreview: window.localStorage.getItem('isPreview') === 'true',
      showHistory: true,
      showHeader: false,
      botAvatar: '',
      userAvatar: '',
      auth: authSdk as any,
      chatContext: chatCtx as any,
    },
  });
  const cb = useDebounceFn(params => {
    const { toName, toUrl } = params;
    if (!toName || !toUrl) return;
    const runtime = $store.state.runtime.application;
    runtime.openApp(toUrl, toName);
  }, 200);
  channel.on('openPageInApplication', cb);
});

onUnmounted(() => {
  // 定时销毁 配合上层动画。
  setTimeout(() => {
    uninstall.value?.();
  }, 400);
});
</script>
<style lang="scss" scoped>
.neural-nexus-container {
  width: 100%;
  height: 100%;
  padding: 0 10px;

  #neural-nexus-chatmode {
    height: 100%;
  }
}

.el-scrollbar__bar.is-horizontal {
  display: none;
}

.initFrame {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 500ms ease;
  overflow-y: hidden;
}

.create {
  z-index: -1;
  transform: translate3d(200%, 0, 0);
}

.postmate-injected-iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
