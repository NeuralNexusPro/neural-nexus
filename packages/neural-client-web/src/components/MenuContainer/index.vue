<template>
  <div class="menu-container" @click="handleClick">
    <div class="modal">
      <div class="left">
        <div class="title">我的收藏</div>
        <!-- TODO: 修改 -->
        <div class="content" v-if="collectMenus.length">
          <div v-for="(item, index) in collectMenus" :key="index" class="collect-item">
            <el-icon class="draggable-icon">
              <EditPen />
            </el-icon>
            <span>{{ item.title }}</span>
            <el-icon class="close-icon">
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="empty" v-else>
          <el-image class="image" src="https://res.ennew.com/image/png/9bbc11d6515347aa78b285481ab7b973.png?optimize=true" />
          <div class="text">暂无收藏</div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="text">全部应用</div>
          <el-input class="search" v-model="text" placeholder="输入应用名称，快速查找应用">
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="content" :class="{ 'empty-content': !menus.length }" ref="container">
          <template v-if="menus.length">
            <menu-item v-for="menu in menus" :data-id="menu.id" :data-name="menu.name" :key="menu.id" :data="menu" class="menu" @click="openApp(menu.id)" />
          </template>
          <div class="empty" v-else>
            <el-image class="image" src="https://res.ennew.com/image/png/9bbc11d6515347aa78b285481ab7b973.png?optimize=true" />
            <div class="text">暂无应用</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from 'vuex';
import { Close, EditPen, Search } from '@element-plus/icons-vue';
import { computed, onBeforeUnmount, ref, onMounted, nextTick, defineProps, watch } from 'vue';
import MenuItem from '@/components/MenuItem/index.vue';
import { filterMenuByName } from '@/utils/common';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  document.addEventListener('click', handleClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick);
});

const $store = useStore();
const menus = computed(() => {
  const list = filterMenuByName($store.state.pageContainer.menuPages, text.value);
  return list;
});

const collectMenus = computed(() => $store.state.pageContainer.collectPages);
const showMenu = ref(false);
const container = ref();
const text = ref('');

const openApp = (id: string) => {
  $store.dispatch('openPageById', id);
  showMenu.value = false;
};

watch(props, value => {
  if (value.visible) {
    waterfall();
  }
});

const waterfall = () => {
  nextTick(() => {
    const el = container.value as HTMLDivElement;
    const containerWidth = el.offsetWidth;
    const columnWidth = containerWidth / 23;
    const array = Array.from({ length: 4 }).fill(0) as number[];
    const nodes = (el.children as unknown as HTMLDivElement[]) || [];
    let maxHeight = 0;
    nodes.forEach(node => {
      const nodeWidth = parseInt(getComputedStyle(node).width);
      console.log(nodeWidth, '***');
      node.style.width = `${columnWidth * 5}px`;
      const top = Math.min(...array);
      const height = node.offsetHeight + 24;
      const i = array.findIndex(v => v === top);
      array[i] += height;
      const left = (i % 4) * (columnWidth * 6);
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      maxHeight = Math.max(maxHeight, array[i]);
    });
    el.style.height = `${maxHeight}px`;
  });
};

const handleClick = function (e) {
  e.stopPropagation();
};
const hideMenu = () => {
  showMenu.value = false;
};

watch(text, () => {
  waterfall();
});

onMounted(() => {
  window.addEventListener('click', hideMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', hideMenu);
});
</script>
<style lang="scss" scoped>
.menu-container {
  display: flex;
  min-width: 1100px;
  width: fit-content;
  max-width: 1600px;
  min-height: 330px;
  height: fit-content;
  max-height: 550px;
  box-shadow: 0px 9px 22px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .modal {
    width: 100% !important;
    height: 100%;
    min-height: 330px;
    display: flex;
    overflow: hidden;

    .left {
      width: 245px;
      max-height: 100%;
      padding: 29px 15px;
      box-sizing: border-box;
      background-color: #f5f6fa;

      .title {
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        line-height: 20px;
        display: flex;
      }

      .content {
        height: calc(100% - 20px);
        padding-top: 24px;

        .collect-item {
          min-height: 40px;
          background: #ffffff;
          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
          border-radius: 2px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-size: 14px;
          color: #323233;
          font-weight: 400;
          box-sizing: border-box;

          .draggable-icon {
            margin-right: 4px;
            cursor: pointer;
          }

          .close-icon {
            margin-left: auto;
            cursor: pointer;
          }
        }

        .active {
          font-weight: 500;
          color: #4068d4;
        }

        .collect-item + .collect-item {
          margin-top: 8px;
        }
      }

      .empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .image {
          width: 80px;
        }

        .text {
          color: #c8c9cc;
        }
      }
    }

    .right {
      flex: 1;
      min-width: 0;
      padding: 29px 15px;
      box-sizing: border-box;
      background-color: #fff;

      .title {
        display: flex;
        justify-content: space-between;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        line-height: 20px;
        display: flex;
        vertical-align: middle;

        .el-input {
          width: 324px;
          background: #ffffff;
          border-radius: 2px;
          border: 1px solid #c8c9cc;
        }
      }

      .content {
        width: 100%;
        display: flex;
        position: relative;
        margin-top: 24px;

        .menu {
          position: absolute;
          height: initial;
          box-shadow: initial;
          border-radius: initial;
          cursor: pointer;
        }

        .empty {
          .image {
            width: 80px;
          }

          .text {
            color: #c8c9cc;
            text-align: center;
          }
        }

        &.empty-content {
          min-height: 200px;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
