<template>
  <div class="app-shell-ui modal__wrapper" @click="clickHandle"></div>
</template>

<script>
export default {
  props: {
    close_on_click_modal: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    document.getElementById('leftSideMenu').style.zIndex = '10';
    document.getElementsByClassName('iframe-container')[0].style.zIndex = '12';
  },
  destroyed() {
    document.getElementById('leftSideMenu').style = 'none';
    document.getElementsByClassName('iframe-container')[0].style = 'none';
  },
  methods: {
    clickHandle() {
      if (this.close_on_click_modal) {
        this.$emit('controlChild');
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-shell-ui {
  &.modal__wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
}
</style>
