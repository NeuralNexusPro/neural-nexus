import { onMounted, onUnmounted, ref, watch } from 'vue';

// maxReconnectCount 最大重连次数
const useCreateWebsocket = (url: string, maxReconnectCount = 10) => {
  const ws = ref<WebSocket | null>(null);
  // ws接收到的数据
  const data = ref({});
  // ws连接状态 0：正在连接中  1：已经连接并且可以通讯 2：连接正在关闭 3：连接已关闭或者没有连接成功
  const state = ref(0);
  const reconnectCount = ref(0);
  const timer = ref<NodeJS.Timer | null>(null);
  const creatWebSocket = () => {
    if (url) {
      ws.value = new WebSocket(url);
      ws.value.onopen = () => {
        state.value = ws.value?.readyState || 0;
        reconnectCount.value = 0;
        heartbeat();
      };
      ws.value.onmessage = e => {
        try {
          state.value = ws.value?.readyState || 0;
          if (e.data) {
            const message = JSON.parse(e.data);
            // type 为 pang 的是心跳检测的返回
            if (message.type !== 'pang') {
              data.value = message;
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      ws.value.onclose = () => {
        state.value = ws.value?.readyState || 0;
        clearTimer();
        ws.value = null;
      };
      ws.value.onerror = () => {
        state.value = ws.value?.readyState || 0;
        console.log('websocket connect error');
      };
    }
  };

  watch(state, value => {
    if (value === 3) {
      if (reconnectCount.value < maxReconnectCount) {
        reconnectWebsocket();
        reconnectCount.value = reconnectCount.value + 1;
        console.log(`地址为 ${url} 的websocket重连了${reconnectCount.value}次`);
      } else {
        console.log(`地址为 ${url} 的websocket超过最大重连次数`);
      }
    }
  });

  const clearTimer = () => {
    if (timer.value) {
      clearInterval(timer.value);
    }
  };

  const sendMessage = (message: string | Record<string, any>) => {
    if (!ws.value) return;
    const text = typeof message === 'string' ? message : JSON.stringify(message);
    ws.value.send(text);
  };
  // ws心跳检测
  const heartbeat = () => {
    clearTimer();
    timer.value = setInterval(() => {
      sendMessage({ type: 'ping' });
    }, 1000 * 30);
  };

  const closeWebsocket = () => {
    ws.value?.close();
  };

  const reconnectWebsocket = () => {
    closeWebsocket();
    creatWebSocket();
  };

  onMounted(() => {
    creatWebSocket();
  });
  onUnmounted(() => {
    ws.value?.close();
  });

  return { data, state, sendMessage, reconnectWebsocket };
};

export default useCreateWebsocket;
