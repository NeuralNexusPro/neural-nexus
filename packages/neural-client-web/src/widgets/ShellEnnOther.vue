<template>
  <div class="ShellEnn_box other">其他</div>
</template>

<script>
export default {
  name: 'ShellEnnOther',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnOther',
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
  &.other {
    max-height: 772px;
    width: 356px;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 326px;
  }
}
</style>
