<template>
  <div class="shellheader-container" id="shellheader-container">
    <div v-if="isShowToggleIcon" :class="['collapses', collapsesClass]" title="收缩菜单" @click="toggleMenu">
      <i class="iconfont icon-menu"></i>
    </div>
    <div class="box-item left-menu" id="leftMenu">
      <div v-if="isShowToggleIcon" class="item logoimg" title="收缩菜单">
        <i class="icon-menu"></i>
      </div>
      <div class="item logoname" :title="productInfo.logoName">
        <img v-if="productInfo.logoUrl" :src="productInfo.logoUrl" />
        <SvgIcon v-else iconClass="ency" />
      </div>
      <div class="item productname">
        <span class="ptitle" :title="productInfo.title">{{ productInfo.title }}</span>
        <div v-if="productInfo.isNotShowSubTitle" :class="['subtitle', subtitleIsShow]">
          <span class="title" :title="subtitleValue">{{ productInfo.subtitleList[0] }}</span>
          <!-- <i class="iconfont icon-qiehuanfubiaoti"></i> -->
          <!-- <keep-alive>
            <component
              :is="currentTitleComponent"
              class="titleOperation"
              :subtitleList="productInfo.subtitleList"
            ></component>
          </keep-alive> -->
        </div>
      </div>
    </div>
    <div class="box-item right-menu" id="rightMenu" :style="{ width: `${resizeStyle.rightMenuWidth}px` }"></div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { compreIcon, filterHideList, debounce } from '@/utils/format';
export default {
  components: {},
  props: {
    isShowMenu: {
      type: Boolean,
      default: false,
    },
    headerData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      collapsesClass: this.isShowMenu ? 'selected' : '',
      self: this,
      isShowToggleIcon: true,
    };
  },
  computed: {
    productInfo() {
      return this.headerData.productInfo;
    },
    userInfo() {
      return this.headerData.userInfo;
    },
    operationList() {
      return this.headerData?.operationList?.filter(x => x.isShow === true);
    },
    lastShowList() {
      return compreIcon(this.operationList, this.moreId);
    },
    showHideList() {
      return filterHideList(this.lastShowList._list, this.operationList);
    },
    startList() {
      const temp = [...this.lastShowList._list, ...this.showHideList];
      temp.splice(
        temp.findIndex(item => item === this.lastShowList._moreId),
        1
      );
      return temp;
    },
    ...mapState({
      moreId: state => state.shellheader.moreId,
      menuList: state => state.shellheader.menuList,
      overflowMenuList: state => state.shellheader.overflowMenuList,
      searchClass: state => state.shellheader.searchClass, // 当有input时，会有
      resizeStyle: state => state.shellheader.resizeStyle,
      changeTimer: state => state.shellheader.changeTimer,
      blurChangeTimer: state => state.shellheader.ShellEnnSearch.blurChangeTimer,
      searchComName: state => state.shellheader.ShellEnnSearch.searchComName,
      currentTitleComponent: state => state.shellheader.ShellEnnSubTitle.currentTitleComponent,
      subtitleIsShow: state => state.shellheader.ShellEnnSubTitle.subtitleIsShow,
      subtitleValue: state => state.shellheader.ShellEnnSubTitle.subtitleValue,
      searchContent: state => state.shellheader.ShellEnnSearch.searchContent,
      btnInputClass: state => state.shellheader.ShellEnnSearch.btnInputClass, // btnInput
      searchInputAutoFocus: state => state.shellheader.ShellEnnSearch.searchInputAutoFocus,
      searchInputBol: state => state.shellheader.ShellEnnSearch.searchInputBol,
      iconEnnWKDropDown: state => state.shellheader.iconEnnWKDropDown,
      iconEnnWKDropDownID: state => state.shellheader.iconEnnWKDropDownID,
      iconEnnWKDropDownIsShow: state => state.shellheader.iconEnnWKDropDownIsShow,
      currentCenterTitleComponent: state => state.shellheader.ShellEnnCenterTools.currentCenterTitleComponent,
      currentCenterTabComponent: state => state.shellheader.ShellEnnCenterTab.currentCenterTitleComponent,
      centerMenuObj: state => state.shellheader.ShellEnnCenterTools.centerMenuObj,
      centerTabObj: state => state.shellheader.ShellEnnCenterTab.centerTabObj,
    }),
  },
  async mounted() {
    const _isExitSideMenu = document.getElementById('leftSideMenu');
    this.isShowToggleIcon = !!_isExitSideMenu;
    let widgets = null;
    await this.$store.dispatch('shellheader/headerInit', {
      _self: this,
      _lastShowList: this.lastShowList._list, // 最后剩余显示的
      _showHideList: this.showHideList, // 倒着隐藏，顺着展示
      _startList: this.startList, // 所有的icon id,除了更多 J
      _operationList: this.operationList,
      _moreId: this.lastShowList._moreId,
    });
    (await this.$store.state.shellheader.resizeStyle.rightItemCount) > 0 && window.addEventListener('resize', debounce(this._handleResize, 60, false));
    // if (window.__MICRO_APP_ENVIRONMENT__) { // 判断 京东微应用环境下
    //   const microAppData = window.microApp.getData() // 获取微应用下发数据
    //   widgets = microAppData.widgets
    // }
    // await this.$store.dispatch('loadWidgets',{ widgets, isMicroApp: true })
    await this.$store.dispatch('loadWidgets');
  },
  unmounted() {
    clearTimeout(this.changeTimer);
    clearTimeout(this.blurChangeTimer);
    this.$store.state.shellheader.resizeStyle.rightItemCount > 0 && window.removeEventListener('resize', debounce(this._handleResize, 60, false));
  },
  methods: {
    ...mapActions(['storagePage', 'llpageUpdate', 'getGlobalState', 'setIsInitialLayout', 'switchTabLoading']),
    eSelected(e) {
      return e ? 'selected' : '';
    },
    toggleMenu() {
      this.$emit('toggleMenuClick', e => {
        this.collapsesClass = this.eSelected(e);
        this.setIsInitialLayout(false);
      });
    },
    // 搜入搜索框时更新值
    async handleInputChange(e) {
      await this.$store.dispatch('shellheader/ShellEnnSearch/handleInputChangeSearch', e);
    },
  },
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
