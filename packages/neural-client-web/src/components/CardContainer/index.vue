<template>
  <div class="card-container">
    <div class="platform-card" v-if="isPlatformCard"></div>
    <div class="normal-card" v-else></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
const props = defineProps({
  cardInfo: {
    type: Object,
    default: () => ({}),
  },
});

const isPlatformCard = computed(() => {
  return props.cardInfo.type === 'platform';
});
</script>

<style></style>
