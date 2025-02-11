<template>
  <Layout :isLoading="false">
    <template #header_slot>
      <ShellHeader :headerData="headerData" @toggleMenuClick="toggleMenuClick"> </ShellHeader>
    </template>
    <template #content_slot>
      <NotFound btnText="回到首页" @mainBtn="goToHome" />
    </template>
  </Layout>
</template>

<script>
import { mapActions } from 'vuex';
import Layout from '@/layouts/index.vue';
import { ShellHeader, NotFound } from '@/components';
import * as API from '@/api/index';

export default {
  name: '404',
  props: {
    appId: {
      type: String,
      default: '__fannengwang_store__',
    },
    userName: {
      type: String,
      default: 'wfc',
    },
    headerData: {
      type: Object,
      default: () => API.shellheaderApi,
    },
  },
  components: {
    Layout,
    ShellHeader,
    NotFound,
  },
  methods: {
    ...mapActions(['toggleMenuClick']),
    // 界面黑色的console
    logToConsole(msg) {
      !!this.$refs.consolepRef && this.$refs.consolepRef._logToConsole(msg);
    },
    goToHome() {
      console.log('回到首页');
      this.$router.push('/');
    },
  },
};
</script>
