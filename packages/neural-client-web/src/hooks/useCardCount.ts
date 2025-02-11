import { useEventListener } from '@vueuse/core';
import { ref, computed } from 'vue';

const useCardCount = (width: number) => {
  const clientWidth = ref(document.body.clientWidth);
  useEventListener(window, 'resize', () => {
    clientWidth.value = document.body.clientWidth;
  });
  const count = computed(() => {
    return Math.floor((clientWidth.value - 40) / width);
  });

  return { count };
};

export default useCardCount;
