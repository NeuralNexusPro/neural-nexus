<template>
  <Layout :isShowMenu="isShowMenu">
    <template #header>
      <HeaderMenu />
    </template>
    <template #chat>
      <Chat />
    </template>
    <template #appWindow>
      <AppWindow />
    </template>
  </Layout>
</template>
<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Layout from '@/layouts/index.vue';
import { HeaderMenu, AppWindow } from '@/components/index';
import Chat from '@/components/Chat/index.vue';
import Runtime from '../runtime';
import * as API from '@/api/index';
import { getQuery } from '@/utils/common';
import { ref, computed, onMounted, onBeforeUnmount, provide, nextTick, watch } from 'vue';
import useAction from '@/store/helpers/useActions';
import { ElLoading } from 'element-plus'

const $store = useStore();
const $router = useRouter();

const props = defineProps({
  appId: {
    type: String,
    default: '',
  },
  userName: {
    type: String,
    default: 'wfc',
  },
  headerData: {
    type: Object,
    default: () => API.shellheaderApi,
  },
  sidemenuData: {
    type: Array,
    default: () => API.sidemenuApi,
  },
});

// data
const runtime = ref(null);
const showContainer = ref(false);

const userInfo = computed(() => $store.state.userInfo);
const isShowMenu = computed(() => $store.state.isShowMenu);
const activeNav = computed(() => $store.state.nav.active);

console.log(activeNav.value);
// 初始化 vuex action
const actions = useAction([
  'app/initApp',
  'app/initInfo',
]);

onMounted(async () => {
  const ctx = getQuery('chatContext');
  let chatCtx = [];
  try {
    if (ctx) {
      chatCtx = JSON.parse(ctx);
    }
  } catch (error) {
    chatCtx = [];
  }
  provide('chatCtx', chatCtx);
  const loadingInstance = ElLoading.service();


  try {
    // const routerName = window.BASE_PATH ? window.BASE_PATH.slice(1) : 'neural-client';
    runtime.value = new Runtime({
      store: $store,
      router: $router,
      size: 1,
    });
    provide('runtime', runtime.value);
    setAppCode();
    setIsPreview();
    const appCode = getQuery('appCode') || import.meta.env.VITE_DEFAULT_APP_NO;
    // messageHub.value = MessageHub.getInstance({
    //   env: import.meta.env.VITE_ENV,
    //   tenantId: userInfo.value.tenantId,
    //   appCode: appCode,
    //   userId: userInfo.value.userId,
    //   runtime: runtime.value,
    // });
    await $store.dispatch('app/initInfo', appCode);
    await $store.dispatch('app/initApp', { runtime: runtime.value });
    showContainer.value = true;
    window.addEventListener('unload', actions.storagePage);
    // 解决在iframe中loading状态一直不关闭的问题
    hideLoading();
  } catch (error) {
    console.error(error);
  } finally {
    loadingInstance.close();
  }
});


const remove = function () {
  $store.dispatch('app/closeAllpages');
}

onBeforeUnmount(() => {
  remove();
  window.removeEventListener('unload', remove);
});

const hideLoading = () => {
  nextTick(() => {
    const el = document.getElementById('PageLoading');
    if (el) {
      el.style.display = 'none';
    }
  });
};

const setAppCode = () => {
  const appCode = getQuery('appCode') || import.meta.env.VITE_DEFAULT_APP_NO;
  window.localStorage.setItem('workbenchAppCode', appCode);
};

const setIsPreview = () => {
  const isPreview = getQuery('isPreview') || window.localStorage.getItem('isPreview');
  window.localStorage.setItem('isPreview', isPreview);
};

// css 动画
const animateName = ref('slideInRight');
watch(
  () => activeNav.value,
  (newVal, oldVal) => {
    const widgetsKey = {
      index: 0,
      chat: 1,
      application: 2,
    };
    if (widgetsKey[newVal] > widgetsKey[oldVal]) {
      if (newVal === 'application') {
        animateName.value = 'slideInUp';
      } else {
        animateName.value = 'slideInRight';
      }
    } else if (oldVal === 'application') {
      animateName.value = 'slideInDown'; // 'slideInDown';
    } else {
      animateName.value = 'slideInLeft';
    }
  }
);
</script>
<style lang="scss" scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-enter-active {
  transition: all 0.4s ease-in-out;
}

.slide-leave-active {
  position: absolute;
}

.slideInUp-enter-from :deep(.tabs-container) {
  transform: translateY(100vh);
}
.slideInUp-enter-active,
.slideInUp-enter-active :deep(.tabs-container) {
  transition: all 0.4s ease-in-out;
}

.slideInRight-enter-from {
  opacity: 0.6;
  transform: translateX(100vw);
}

.slideInRight-enter-active {
  transition: all 0.4s ease-in-out;
}

.slideInUp-enter-active,
.slideInRight-leave-active {
  position: absolute;
  width: 100vw;
  height: -webkit-fill-available;
}
.slideInRight-enter-to {
}

.slideInRight-leave-fron {
}
.slideInRight-leave-active {
}
@keyframes backOutDown {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  20% {
    -webkit-transform: translateY(0px) scale(0.7);
    transform: translateY(0px) scale(0.7);
    opacity: 0.7;
  }

  100% {
    -webkit-transform: translateY(700px) scale(0.7);
    transform: translateY(700px) scale(0.7);
    opacity: 0.7;
  }
}

// .slideInRight-leave-from {
// }
// .slideInRight-leave-active {
// }
// .slideInRight-leave-to {
// }

.slideInDown-leave-active {
  position: absolute;
  width: 100vw;
  height: -webkit-fill-available;
  transition: all 0.4s ease-in-out;
  z-index: 4; // 基于src\components\LaunchPad\components\Task.vue 中的 --el-loading-z-index: 3；
}
.slideInDown-leave-active :deep(.tabs-container) {
  transition: all 0.4s ease-in-out;
}
// .slideInDown-enter-from .tabs-container,
.slideInDown-leave-to :deep(.tabs-container) {
  transform: translateY(100vh);
}

.slideInLeft-enter-from {
  opacity: 0.6;
  transform: translateX(-100vw);
}

.slideInLeft-enter-active {
  transition: all 0.4s ease-in-out;
}
.slideInLeft-enter-to {
}

.slideInLeft-leave-from {
}

.slideInLeft-leave-active {
  position: absolute;
  transform-origin: top left;
  transition: all 0.4s ease-in-out;
}
.slideInLeft-leave-to {
  // transform: scale(0.5);
  opacity: 0.5;
  transform: translateX(100vw);
}
</style>
