<template>
  <div class="logo">
    <img :src="src" :style="style" class="image" alt="logo" />
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Logo',
  props: {
    fileId: {
      type: String,
      default: () => '',
    },
    url: {
      type: String,
      default: () => '',
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
      default: () => 26,
    },
  },
  data() {
    return {
      // src: 'https://res.ennew.com/image/vnd.microsoft.icon/229166f0bb484a486def8d78c8e739e9.ico',
      style: {},
    };
  },
  computed: {
    ...mapState({
      src: state => state.leftMenuIcon,
    }),
  },
  watch: {
    fileId(id) {
      this.generateSrc();
    },
  },
  methods: {
    // 生成图片地址
    async generateSrc() {
      // 如果传入了logo的url，则直接使用
      if (this.url) {
        this.src = this.url;
        return;
      }
    },
    generateStyle() {
      const style = {};
      if (this.width) {
        style.width = this.width + 'px';
      }
      if (this.height) {
        style.height = this.height + 'px';
      }
      this.style = style;
    },
  },
  mounted() {
    this.generateSrc();
    this.generateStyle();
  },
};
</script>
<style lang="scss" scoped>
.logo {
  width: fit-content;
  height: fit-content;
}
</style>
