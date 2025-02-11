<template>
  <div class="ShellEnn_box contactus">联系我们</div>
</template>

<script>
export default {
  name: 'ShellEnnContactUs',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnContactUs',
    },
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
.ShellEnn_box {
  &.contactus {
    max-height: 772px;
    width: 356px;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 326px;
  }
}
</style>
