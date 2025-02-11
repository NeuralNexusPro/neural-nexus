<template>
  <div>
    <div class="user-info">
      <el-avatar v-if="userInfo.userimg" :size="54" :src="userInfo.userimg"> </el-avatar>
      <el-avatar v-else :size="54" icon="iconfont icon-touxiang"></el-avatar>
      <div class="user-introduce">
        <h3>{{ userInfo.username || '用户名' }}</h3>
        <div class="h6">{{ userInfo.department || '某某某某事业群-某某 平台-某某群-UED' }}</div>
      </div>
    </div>
    <ol class="user-oper">
      <li><span class="iconfont icon-shezhi"></span><span class="item">设置</span></li>
      <li><span class="iconfont icon-qiyexinxi"></span><span class="item">企业信息</span></li>
      <li><span class="iconfont icon-qitacaozuo"></span><span class="item">其他操作</span></li>
      <li><span class="iconfont icon-banbenhao"></span><span class="item">版本</span></li>
      <li @click="quitCommand"><span class="iconfont icon-tuichu"></span><span class="item">退出登录</span></li>
    </ol>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'ShellEnnPersonalCenter',
  props: {
    refName: {
      type: String,
      default: 'ShellEnnPersonalCenter',
    },
    userInfo: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
  },
  methods: {
    quitCommand() {
      this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.clearTab();
          this.storagePage();
          // this.authSdk.logout();
          this.$router.push({
            path: '/login404/@homepage/@app-3',
          });
        })
        .catch(() => {});
    },
    ...mapActions(['clearTab', 'storagePage']),
  },
};
</script>
<style lang="scss" scoped>
.user {
  &-info {
    width: 262px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 24px 20px 24px;
    border-bottom: 1px solid $EnnWKBorderColor;
    .el-avatar {
      color: $EnnWKShellButton;
      background: transparent;
      .icon-touxiang:before {
        font-size: 54px;
      }
    }
  }
  &-introduce {
    margin: 0 0 0 22px;
    width: 138px;
    h3 {
      font-weight: 500;
      color: $EnnWKN8;
      line-height: 28px;
      margin: 0 0 6px 0;
    }
    .h6 {
      @extend .H6;
      font-weight: 400;
      color: $EnnWKN6;
      line-height: 20px;
    }
  }
  &-oper {
    list-style: none;

    li {
      cursor: pointer;
      padding: 0 24px;
      @extend .T2;
      color: $EnnWKN7;
      line-height: 34px;
      .iconfont {
        margin-right: 12px;
        font-size: 14px;
      }
      &:nth-of-type(1) {
        margin-top: 15px;
      }
      &:last-of-type {
        margin-bottom: 15px;
      }
      &:hover {
        background-color: $EnnWKLineItemHover;
        color: $EnnWKB5;
      }
    }
  }
}
</style>
