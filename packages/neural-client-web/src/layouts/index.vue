<template>
  <div class="layerout-container">
    <div class="home-header">
      <slot name="header"></slot>
    </div>
    <div class="two-column-container" :class="{ 'two-column-container-fold': false }"
      ref="columnContainerRef" @mousemove="slideMousemove" @mouseup="slideMouseup">
      <div class="left-column" :style="{ width: leftWidth + '%' }" ref="leftColumnRef">
        <slot name="chat"></slot>
      </div>
      <div class="right-column" :style="{ width: rightWidth + '%' }" ref="rightColumnRef">
        <div v-if="appWindowActive" class="slide-container">
          <div @mousedown.stop="slideMousedown" class="slide-btn">||</div>
        </div>
        <slot name="appWindow"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

const columnContainerRef = ref<any>('column-container');
const leftColumnRef = ref<any>('left-column');
const rightColumnRef = ref<any>('right-column');
const leftWidth = ref(100);
const rightWidth = ref(0);
let startX = 0;
let isSlide = false;
let leftMinimized = false; // 新增变量，用于标记 left-column 是否已达到最小值

const slideMousedown = event => {
  // 如果 right-column 全屏展示，拖动时将 left-column 调整到最小值
  if (rightWidth.value === 100) {
    leftColumnRef.value.style.transition = 'width 0.3s ease-out';
    rightColumnRef.value.style.transition = 'width 0.3s ease-out';
    leftColumnRef.value.style.minWidth = '362px';
    leftWidth.value = 20;
    rightWidth.value = 80;
  }
  // right-column 最小值为600px
  rightColumnRef.value.style.minWidth = '600px';

  startX = event.clientX;
  columnContainerRef.value.style.cursor = 'col-resize';
  isSlide = true;
  leftMinimized = false;
  event.stopPropagation();
  leftColumnRef.value.style.transition = 'none';
  rightColumnRef.value.style.transition = 'none';
  $store.commit('app/setAppWindowIsDrag', true);
};
const slideMousemove = event => {
  if (isSlide) {
    let deltaX = event.clientX - startX;
    if (deltaX > 0 && leftWidth.value >= 80) {
      isSlide = false;
      columnContainerRef.value.style.cursor = 'auto';
      return;
    } else if (deltaX < 0 && leftWidth.value <= 20) {
      if (leftMinimized) {
        // 如果已经达到最小值并且再次拖动，则 right-column 全屏展示
        leftColumnRef.value.style.transition = 'width 0.3s ease-out';
        rightColumnRef.value.style.transition = 'width 0.3s ease-out';
        leftColumnRef.value.style.minWidth = '0px';
        leftWidth.value = 0;
        rightWidth.value = 100;
        isSlide = false;
        columnContainerRef.value.style.cursor = 'auto';
        return;
      } else {
        // 标记 left-column 已达到最小值
        leftMinimized = true;
      }
    } else {
      // 如果 leftWidth 大于最小值，重置标记
      leftMinimized = false;
    }
    let deltaPercentage = (deltaX / columnContainerRef.value.offsetWidth) * 100;
    leftWidth.value = leftWidth.value + deltaPercentage;
    rightWidth.value = rightWidth.value - deltaPercentage;
    startX = event.clientX;
  }
};
const slideMouseup = () => {
  isSlide = false;
  columnContainerRef.value.style.cursor = 'auto';
  leftColumnRef.value.style.transition = 'width 0.3s ease-out 0.1s';
  rightColumnRef.value.style.transition = 'width 0.3s ease-out 0.1s';
  $store.commit('app/setAppWindowIsDrag', false);
};

const $store = useStore();
const appWindowActive = computed(() => $store.state.nav.appWindowActive);

watch(appWindowActive, (newValue, oldValue) => {
  if (newValue) {
    leftWidth.value = 40;
    rightWidth.value = 60;
  } else {
    leftWidth.value = 100;
    rightWidth.value = 0;
    rightColumnRef.value.style.minWidth = '0px';
  }
});

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
