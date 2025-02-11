<template>
  <div class="ennwk-sidebar">
    <el-menu
      :default-openeds="openeds"
      :default-active="menuActiveIndex"
      mode="vertical"
      text-color="$EnnWKN7"
      active-text-color="$EnnWKB5"
      :unique-opened="isUnique"
      :collapse-transition="true"
      @select="handleSelect"
    >
      <SidebarItem v-for="menu in sidebarMenuList" :key="menu.id" :item="menu" :menuSled="openeds" />
    </el-menu>
  </div>
</template>
<script>
import SidebarItem from './SidebarItem.vue';

export default {
  name: 'SideBar',
  components: {
    SidebarItem,
  },
  props: {
    menuActiveIndex: {
      type: String,
      default: '1',
    },
    openeds: {
      type: Array,
      default: () => ['1'],
    },
    sidebarMenu: {
      type: Array,
      default: () => [
        {
          id: '1',
          name: '导航一',
          type: 'button',
          icon: 'biaodan',
          children: [
            {
              id: '1-1',
              name: '选项1',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '1-2',
              name: '选项2',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '1-3',
              name: '选项3',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '1-4',
              name: '选项4',
              type: 'button',
              icon: '',
              children: [
                {
                  id: '1-4-1',
                  name: '子选项1',
                  type: 'link',
                  icon: '',
                  url: '',
                },
                {
                  id: '1-4-2',
                  name: '一二三四五六七八九十',
                  type: 'link',
                  icon: '',
                  url: '',
                },
                {
                  id: '1-4-3',
                  name: '子选项3',
                  type: 'button',
                  icon: '',
                  children: [
                    {
                      id: '1-4-3-1',
                      name: '子子选项1',
                      type: 'link',
                      icon: '',
                      url: '',
                    },
                    {
                      id: '1-4-3-2',
                      name: '子子选项2',
                      type: 'link',
                      icon: '',
                      url: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: '2',
          name: '导航二',
          type: 'button',
          icon: 'liebiao',
          children: [
            {
              id: '2-1',
              name: '选项1',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '2-2',
              name: '选项2',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '2-3',
              name: '选项3',
              type: 'link',
              icon: '',
              url: '',
            },
          ],
        },
        {
          id: '3',
          name: '导航三',
          type: 'button',
          icon: 'xiangqing',
          children: [
            {
              id: '3-1',
              name: '选项1',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '3-2',
              name: '选项2',
              type: 'link',
              icon: '',
              url: '',
            },
            {
              id: '3-3',
              name: '选项3',
              type: 'link',
              icon: '',
              url: '',
            },
          ],
        },
      ],
    },
  },
  computed: {
    sidebarMenuList() {
      return this.sidebarMenu;
    },
  },
  data() {
    return {
      isUnique: false,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      const [ _key ] = keyPath.slice(-1)[0].split('^').slice(-1); // - ==> ^
      this.$emit('handleOpenPageClick', { _id: _key });
      // note 操作替换功能，并且把隐藏的tab放在最后，将显示的最后一个放在隐藏打开的那栏
      // this.$emit('getIsTabHideItem', { _id: _key }); // 替换隐藏菜单 每次点击时，都判断
    },
  },
};
</script>

<style lang="scss">
@import './index.scss';
</style>
