<template>
  <div class="ennwkbreadcrumbs">
    <ul class="ennwkbreadcrumbs-ul" id="ennwk-breadcrumbs" v-if="breadCrumbsList">
      <li v-show="moreIsHide" class="more first" title="更多菜单">
        <el-popover
          popper-class="ennwkbreadcrumbs-popover"
          placement="bottom"
          transition="fade-in-linear"
          :visible-arrow="false"
          width="200"
          trigger="hover"
          @show="showMenu"
        >
          <ul class="popover-ul">
            <li v-for="(item, ind) in breadCrumbsHideList" :key="'crumbHide-' + ind" :title="item.title || item.name">
              <a :href="item.toUrl" @click="deleteMenu(ind, $event, item)">{{ item.title || item.name }}</a>
            </li>
          </ul>
          <span slot="reference" class="iconfont icon-overflow"></span>
        </el-popover>
      </li>
      <li
        v-show="item.isShow"
        v-for="(item, ind) in breadCrumbsListFormats"
        :key="'crumbs-' + ind"
        :class="item.styleC"
      >
        <a :href="item.toUrl" @click="deleteMenu(ind, $event, item)">{{ item.title || item.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import { formateArrObjChong, Logger, getCharacterWidth } from '@/utils/format';

export default {
  name: 'BreadCrumbs',
  props: ['breadCrumbsListParent'],
  data() {
    return {
      breadCrumbsList: this.breadCrumbsListParent,
      oneClass: 'first',
      crumbsTotalWidth: 0,
      moreIsHide: false,
      breadCrumbsHideList: [],
    };
  },
  watch: {
    breadCrumbsListParent(val) {
      this.breadCrumbsList = val;
    },
  },
  computed: {
    breadCrumbsListFormats() {
      return this.firstClass(this.breadCrumbsList);
    },
  },
  inject: ['llpageUpdate'],
  mounted() {
    // this.breadCrumbsUpdateFun();
    window.addEventListener('resize', this.breadCrumbsUpdateFun);
  },
  updated() {
    this.breadCrumbsUpdateFun();
  },
  destroyed() {
    window.removeEventListener('resize', this.breadCrumbsUpdateFun);
  },
  methods: {
    addBreadCrumbMenuHandle(menu) {
      const isExist = formateArrObjChong(this.breadCrumbsList, menu);
      !isExist && this.breadCrumbsList.push({ ...menu });
    },
    firstClass(list) {
      list.map((x, ind) => {
        if (!this.moreIsHide) {
          x.styleC = ind === 0 ? 'first' : '';
        }
      });
      return list;
    },
    /**
     * 计算字体宽度
     */
    computedWidth(x) {
      const _title = x.title || x.name;
      return getCharacterWidth(_title, 7) + 16;
    },
    breadCrumbsUpdateFun() {
      if (document.getElementById('ennwk-breadcrumbs')) {
        const crumbsWidth = document.getElementById('ennwk-breadcrumbs').clientWidth;
        this.crumbsTotalWidth = crumbsWidth;

        let currentWidth = 0;
        let breadCrumbs;
        let isHide = false;

        for (let index = this.breadCrumbsList.length - 1; index >= 0; index--) {
          breadCrumbs = this.breadCrumbsList[index];
          currentWidth += this.computedWidth(breadCrumbs);
          if (currentWidth > this.crumbsTotalWidth) {
            breadCrumbs.isShow = false;
            isHide = true;
          } else {
            if (!breadCrumbs.isShow) {
              breadCrumbs.isShow = true;
            }
          }
        }

        this.moreIsHide = isHide;
      }
    },
    showMenu() {
      this.breadCrumbsHideList = this.breadCrumbsList.filter((item) => item.isShow === false);
      Logger('面包屑流程').info('显示菜单', this.breadCrumbsHideList);
    },
    stopDefault(e) {
      if (e && e.preventDefault) e.preventDefault();
      else window.event.returnValue = false;
    },
    // Note 理正
    refreshIframeSend(item) {
      const pagePath = window.location.href;
      const payload = { type: item };
      this.llpageUpdate({ pagePath, payload });
    },
    deleteMenu(ind, event, item) {
      this.stopDefault(event);
      let _url = item.toUrl;
      Logger('面包屑流程').info('跳转', _url);
      _url && this.$router.push(_url);
      // this.refreshIframeSend(item);
      this.breadCrumbsList.splice(ind + 1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import './BreadCrumbs.scss';
</style>
<style lang="scss">
@import '@/styles/breadCrumbsUl.scss';
.ennwkbreadcrumbs-popover.el-popover {
  width: auto !important;
  padding: 0 5px 0 0;
  margin-top: -6px !important;
  border: none;
  border-radius: 0 !important;
  @extend .L3;
  .popover-ul {
    height: 62px;
    @extend .UL-LI;
  }
}
</style>
