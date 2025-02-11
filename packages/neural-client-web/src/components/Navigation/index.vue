<template>
  <div v-if="isNotShowDomBreadCrumbs" class="navigation-container" id="crumbs">
    <!-- <i class="iconfont icon-home"></i> -->
    <Back @goBack="goBack" />
    <BreadCrumbs ref="breadcrumbs" :breadCrumbsListParent="breadCrumbsList" />
  </div>
</template>
<script>
import BreadCrumbs from './BreadCrumbs.vue';

export default {
  components: {
    BreadCrumbs,
  },
  props: {
    isNotShowDomBreadCrumbs: {
      type: Boolean,
      default: true,
    },
    breadCrumbsList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    parentHandleclick(e) {
      this.isNotShowDomBreadCrumbs && this.$refs.breadcrumbs.addBreadCrumbMenuHandle(e);
    },
    goBack() {
      this.$emit('goBackClick');
    },
  },
};
</script>
<style lang="scss" scoped>
.navigation {
  &-container {
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .icon-home {
      @extend .D3;
      color: $EnnWKN6;
      margin: 0 0 0 16px;
    }
  }
}
</style>
