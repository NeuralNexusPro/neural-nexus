<template>
  <div class="content" :style="{ height: iframeHeight + 'px' }">
    <iframe :src="iframeUrl" width="100%" height="100%" />
  </div>
</template>

<style lang="scss" scoped>
.content {
  min-height: 600px;
  iframe {
    border: none;
  }
}
</style>

<script>
export default {
  name: '',
  props: {
    iframeHeight: Number,
    iframeUrl: String,
  },
  mounted() {},
};
</script>
