<template>
  <div>
    <template v-if="item.childrens && item.childrens.length > 0">
      <el-submenu :index="item.id" :class="addSelectedClass(item.id)">
        <template slot="title">
          <i v-if="item.icon" :class="['iconfont', 'icon-' + item.icon]"></i>
          <span>{{ item.name }}</span>
        </template>

        <template v-for="child in item.childrens">
          <sidebar-item
            v-if="child.childrens && child.childrens.length > 0"
            :item="child"
            :key="child.id"
            :menuSled.sync="menuSled"
          />
          <el-menu-item v-else :key="child.id+''" :index="child.id">
            <span>{{ child.name }}</span>
          </el-menu-item>
        </template>
      </el-submenu>
    </template>
    <template v-else>
      <el-menu-item class="one" :key="item.id" :index="item.id">
        <i v-if="item.icon" :class="['iconfont', 'icon-' + item.icon]"></i>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    menuSled: {
      type: Array,
    },
  },
  methods: {
    addSelectedClass(id) {
      return this.menuSled.indexOf(id) > -1 ? 'sled' : '';
    },
  },
};
</script>
