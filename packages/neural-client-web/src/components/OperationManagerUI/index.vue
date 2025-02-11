<template>
  <Teleport to="body">
    <div class="custom-affix" v-if="affix">
      <div class="stack">
        <el-icon class="icon" :size="20" color="#4c8bb4" @click="handleCloseAffix"><CircleClose /></el-icon>
        <transition-group name="stack" tag="div">
          <el-tag
            class="stack-item"
            :bg-color="item.type === 'route' ? '#EBF9FF' : '#FFF8DB'"
            :text-color="item.type === 'route' ? '#318DB8' : '#D8B422'"
            v-for="item in stack"
            :key="item.id || '-1'"
            :id="item.id"
            >操作: {{ item.type }}</el-tag
          >
        </transition-group>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { channel } from '@neural-nexus/one-portal-channel';
import { CircleClose } from '@element-plus/icons-vue';
const $store = useStore();
let stack = ref([]);
const affix = ref(true);
function pop() {
  stack.value.shift();
}
function handleCloseAffix() {
  affix.value = false;
  localStorage.setItem('OperationManagerAffix', 'false');
}

onBeforeMount(() => {
  if (localStorage.getItem('OperationManagerAffix') === 'false') {
    affix.value = false;
  }
});
onMounted(() => {});

stack.value = [...$store.state.operationManager.stack];
channel.on('OperationManager_PUSH', e => {
  if (stack.value.length >= 5) {
    pop();
  }
  nextTick(() => {
    stack.value.push({
      ...e,
      id: new Date().valueOf(),
    });
  });
});
</script>

<style scoped lang="scss">
.custom-affix {
  position: fixed;
  bottom: 10px;
  left: 20px;
  z-index: 100;
  width: 130px;
  height: 170px;
  background-color: rgba(224, 236, 255, 0.9);
  border-radius: 4px;
}
.stack {
  display: flex;
  position: relative;
  .icon {
    position: absolute;
    top: -5px;
    right: -5px;
    cursor: pointer;
  }

  > div {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
  }
}
.stack-item {
  /* padding: 10px; */
  margin: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  transition: all 0.3s;
}
.stack-enter-active,
.stack-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.stack-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.stack-leave-from {
  transform: translateY(0px);
}
.stack-leave-from {
  opacity: 0;
  transform: translateY(5px); /* 出栈时元素向下方离开 */
}
.stack-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 出栈时元素向下方离开 */
}
/* .el-affix {
  width: 130px;
  height: 170px;
  padding-left: 20px;
}
:deep(.el-affix--fixed) {
  background-color: rgba(224, 236, 255, 0.9);
  border-radius: 4px;
  height: inherit !important;
} */
</style>
