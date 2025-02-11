<template>
  <div class="menu-item-container">
    <div
      class="menu-item"
      :class="{
        leaf: menu.isLeaf,
        parent: !menu.isLeaf,
        collected: menu.collected,
        'depth-1': menu.depth === 1,
        'depth-2': menu.depth === 2,
        'depth-3': menu.depth === 3,
      }"
      @click="openPage(menu)"
    >
      <template v-if="menu.depth === 1">
        <custom-icon :type="menu.icon" class="menu-icon" :class="{ leaf: menu.isLeaf }" v-if="menu.icon !== 'customize'" />
        <el-image class="custom-menu-icon" :class="{ leaf: menu.isLeaf }" :src="svgUrl" fit="cover" v-if="svgUrl"></el-image>
      </template>
      <!-- <custom-icon type="ency-shoucang" class="collect-icon" :class="{ leaf: menu.isLeaf }" @click="collect(menu, $event)" /> -->
      <div v-text="menu.name" class="text"></div>
      <custom-icon type="jinru" class="right" v-if="menu.depth === 1 && menu.isLeaf" />
    </div>
    <div class="children" v-if="Array.isArray(menu.childrens) && menu.childrens.length > 0">
      <menu-item v-for="item in menu.childrens" :key="item.id" :data="item" />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import CustomIcon from '@/components/CustomIcon/index.vue';
export default {
  name: 'MenuItem',
  components: { CustomIcon },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      pageTabs: state => state.pageTabs,
      collectedMenus: state => state.collectedMenus,
    }),
  },
  data() {
    return {
      menu: {},
      svgUrl: '',
    };
  },
  watch: {
    menu: async function (value) {
      const iconSvg = value.iconSvg;
      const icon = value.icon;
    },
  },
  methods: {
    ...mapActions(['handleOpenPageClick']),
    ...mapMutations(['setPageTabs', 'setShowMenu', 'setCollectedMenus', 'pageContainer/setShowMenuContainer']),
    openPage(menu) {
      if (!menu?.id || !menu.isLeaf) {
        return;
      }
      this.handleOpenPageClick({
        _id: menu.id,
      });
      this.setShowMenu(false);
      this['pageContainer/setShowMenuContainer'](false);
      if (!this.pageTabs.some(v => v.id === menu.id)) {
        const tabs = [...this.pageTabs];
        tabs.push({
          isShow: true,
          id: menu.id,
          title: menu.name,
          collected: menu.collected,
        });
        this.setPageTabs(tabs);
      }
    },
    collect(menu, event) {
      event.stopPropagation();
      if (menu.collected || this.collectedMenus.some(v => v.id === menu.id)) {
        return;
      }
      // 后端暂未提供接口
      // const collectedMenus = [...this.collectedMenus];
      // const data = { ...menu, collected: true };
      // collectedMenus.push(data);
      // this.menu = data;
      // this.setCollectedMenus(collectedMenus);
    },
  },
  mounted() {
    this.menu = this.data;
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.menu-item-container {
  display: flex;
  flex-direction: column;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 8px;
    line-height: 24px;
    border-radius: 4px;

    .menu-icon {
      font-size: 16px;
      margin-right: 8px;
      padding-top: 4px;
    }
    .custom-menu-icon {
      width: 16px !important;
      height: 16px !important;
      margin-right: 8px;
    }

    .collect-icon {
      display: none;
      font-size: 16px;
      margin-right: 8px;
    }

    .text {
      flex: 1;
      @include ellipsis;
    }

    .right {
      font-size: 16px;
      margin-left: 8px;
      margin-right: 8px;
      padding-top: 4px;
      color: #323233;
    }

    &.depth-1 {
      font-size: 16px;
      font-weight: 600;
      color: #323233;
    }

    &.depth-2 {
      padding-left: 32px;

      &.parent {
        font-weight: 400;
        color: #969799;
      }
    }

    &.depth-3 {
      padding-left: 48px;
    }

    &.leaf {
      cursor: pointer;
    }

    &:hover {
      background: #f6f7fb;

      // &.leaf {
      //   &.depth-2 {
      //     padding-left: 8px;
      //   }

      //   &.depth-3 {
      //     padding-left: 24px;
      //   }
      // }

      // .collect-icon {
      //   &.leaf {
      //     display: block;
      //   }
      // }

      // .menu-icon,
      // .custom-menu-icon {
      //   &.leaf {
      //     display: none;
      //   }
      // }
    }

    &.collected {
      .collect-icon {
        display: block;
        color: #ffc147;
      }

      &.leaf {
        &.depth-2 {
          padding-left: 8px;
        }

        &.depth-3 {
          padding-left: 24px;
        }
      }

      .menu-icon {
        &.leaf {
          display: none;
        }
      }
    }
  }

  .children {
    height: fit-content;
  }
}
</style>
