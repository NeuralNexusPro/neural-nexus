<template>
  <div class="ShellEnnCenterTools">
    <el-button type="primary" @click="refreshIframeSend">iframe更新</el-button>
    <el-button type="primary" @click="refreshQiankunSend">乾坤更新</el-button>
    <el-button type="primary" @click="refreshJingDongSend">京东vue3更新</el-button>
    <el-button type="primary" @click="refreshJingDong2Send">京东vue2更新</el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in toolsList" :key="'tools_' + index" :label="item.title" :name="item.id"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'ShellEnnCenterTools',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnCenterTools',
    },
    toolsList: {
      type: Array,
      default: () => {
        return [
          { id: 'fanneng001', title: '首页', goUrl: '/' },
          { id: 'fanneng002', title: '工具箱', goUrl: '/tools' },
          { id: 'fanneng003', title: '消息', goUrl: '/about' },
          { id: 'fanneng004', title: '集市', goUrl: '/market' },
        ];
      },
    },
    centerMenuObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: this.centerMenuObj ? this.centerMenuObj.id : '',
    };
  },
  mounted() {
    const _path = this.$router.history.current.name;
    const ENUMER_TOOLS = this.toolsList.filter(x => x.goUrl.indexOf(_path) > -1)[0];
    this.activeName = ENUMER_TOOLS ? ENUMER_TOOLS.id : '';
    this.$emit('handleCommandCenterMenu', ENUMER_TOOLS);

    // Note：给乾坤传初始化值
    this.jsQianKunOnMount();
  },
  methods: {
    handleClick(tab, event) {
      const { label, name } = tab;
      let _goUrl = '/homepage/@app-';
      if (event.type === 'click') {
        _goUrl = this.toolsList.filter(x => x.id === name)[0].goUrl;
      }
      this.$emit('handleCommandCenterMenu', { id: name, title: label, goUrl: _goUrl });
      this.$emit('storagePage');
      this.$router.push(_goUrl);
    },
    refreshIframeSend() {
      const pagePath = 'http://localhost:8080/homepage/@app-9990';
      const payload = { userName: 'felisa iframe', age: '30' };
      this.$emit('llpageUpdate', { pagePath, payload }); // 更新iframe子应用
    },
    refreshQiankunSend() {
      const pagePath = 'http://localhost:8080/homepage/@app-9999';
      const payload = { userName: 'felisa qiankun', age: '30' };
      this.$emit('llpageUpdate', { pagePath, payload }); // 更新qiankun子应用
    },
    refreshJingDongSend() {
      const pagePath = 'http://localhost:8080/homepage/@app-jd3';
      const payload = { userName: 'felisa jingdong vue3', age: '30' };
      this.$emit('llpageUpdate', { pagePath, payload }); // 更新jingdong子应用
    },
    refreshJingDong2Send() {
      const pagePath = 'http://localhost:8080/homepage/@app-jd2';
      const payload = { userName: 'felisa jingdong vue2', age: '30' };
      this.$emit('llpageUpdate', { pagePath, payload }); // 更新jingdong子应用
    },
    jsQianKunOnMount() {
      // 传递给qiankun
      const payload = { userName: 'felisa qiankun', age: '30', company: '新智新奥' };
      this.$emit('getGlobalState', payload);
    },
  },
};
</script>

<style lang="scss">
.ShellEnnCenterTools {
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
