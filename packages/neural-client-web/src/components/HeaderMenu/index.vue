<template>
  <div class="shellheader-container">
    <div class="left-menu">
      <div class="icon icon-click">
        <SvgIcon :iconClass="'my'" />
      </div>
    </div>
    <div class="middle-menu" :class="middleMenuHover ? 'middle-menu-hover' : ''">
      <div class="icon">
        <SvgIcon iconClass="AI_logo" @click="jumpToChrome" />
      </div>
      <div class="product-name">Neural Nexus</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Runtime from '@neural-nexus/neural-client-runtime';
import { ref, inject } from 'vue';
import { useStore } from 'vuex';
const runtime = inject('runtime') as Runtime;
const middleMenuHover = ref(true);

const jumpToChrome = () => {
  function makeiframeUrl() {
    return `${location.origin}${location.pathname}`;
    // const newTenantId = '1377517418344550402';
  }
  const url = makeiframeUrl();
  runtime.application.openApp(url, '新开页');
};
</script>
<style lang="scss" scoped>
@import './index.scss';

.shellheader-container {
  // --imageUrl: url('https://res.ennew.com/image/png/76');
  padding: 0 15px;
  z-index: 2;
  background: transparent;
  transition: 0.3s;
}
.rotate-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.appspace {
  position: relative;
  .task-count {
    position: absolute;
    top: 4px;
    right: -10px;
    height: 20px;
    min-width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background: #ea4646;
    border: 1px solid #fff;
    box-shadow: 0 0 0 1px #fff;
    border-radius: 8px;
    padding: 2px;
    color: #fff;
  }
}
</style>
