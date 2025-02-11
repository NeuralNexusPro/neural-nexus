<template>
  <div class="icon-container" @click="handleClick" :style="customStyle">
    <svg aria-hidden="true" class="icon">
      <use :xlink:href="href"></use>
    </svg>
  </div>
</template>
<script>
import './iconfont';
export default {
  name: 'CustomIcon',
  props: {
    type: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: false,
      default: () => {},
    },
    customStyle: {
      type: Object,
    },
  },
  computed: {
    href() {
      return `#custom-icon-${this.type}`;
    },
  },
  methods: {
    handleClick() {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
