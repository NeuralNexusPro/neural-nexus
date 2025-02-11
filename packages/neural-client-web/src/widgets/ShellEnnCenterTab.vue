<template>
  <div class="ShellEnnCenterTab">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in toolsList" :key="'tools_' + index" :label="item.title" :name="item.id"> </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { LRUStorage } from '@/plugins/storage';

export default {
  name: 'ShellEnnCenterTab',
  props: {
    centerTabObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    toolsList: {
      type: Array,
      default: () => {
        return [
          { id: 'fanneng001', title: '首页', componentName: 'contentOne' },
          { id: 'fanneng002', title: '工具箱', componentName: 'contentTwo' },
          { id: 'fanneng003', title: '集市', componentName: '' },
        ];
      },
    },
  },
  computed: {
    ...mapState({
      activeIndexOne: state => state.contentOne.activeIndex,
      activeIndexTwo: state => state.contentTwo.activeIndex,
    }),
  },
  data() {
    return {
      storageHandle: null,
      activeName: this.centerTabObj ? this.centerTabObj.id : 'fanneng001',
    };
  },
  mounted() {
    this.storageHandle = LRUStorage({
      name: '_fanneng_',
      maxStorageKeys: 10, // 最大存储 storage keys 长度
      maxTabLen: 100, // 最大可缓存 tab 数
    });
    const { id, title, componentName } = this.toolsList;
    this.storageHandle.setItem('ennwk_currentTab', { id, title, componentName });
  },
  methods: {
    handleClick(tab, event) {
      const { label, name } = tab;
      let _item = this.toolsList.filter(x => x.id === name);
      _item = _item.length > 0 ? _item[0].componentName : '';
      this.$emit('handleCommandCenterTab', { id: tab.name, title: label });
      this.$emit('switchTabLoading');

      this.storageHandle.setItem('ennwk_currentTab', { id: name, title: label, componentName: _item });

      this.$store.dispatch('contentOne/storagePage');
      this.$store.dispatch('contentTwo/storagePage');

      const path = name === 'fanneng002' ? `/fanneng/@app-${this.activeIndexTwo}` : `/fanneng/@app-${this.activeIndexOne}`;

      this.$router.push({
        path,
      });
    },
  },
};
</script>
<style lang="scss">
.ShellEnnCenterTab {
  display: flex;
  flex-direction: row;
  .el-button {
    margin-right: 10px !important;
    background-color: transparent;
    border: 0;
    padding: 5px !important;
  }
  .el-tabs__item {
    color: #ffffff !important;
    &.is-active {
      color: #ffffff !important;
    }
    &.is-top {
      &:nth-child(2) {
        padding-left: 0 !important;
      }
      &:last-child {
        padding-right: 0 !important;
      }
    }
  }
  .el-tabs {
    .el-tabs__header {
      margin: 14px 0 15px;
    }
    .el-tabs__active-bar {
      background-color: #ffffff !important;
    }
    .el-tabs__nav-wrap {
      &::after {
        background-color: transparent !important;
      }
    }
  }
}
</style>
