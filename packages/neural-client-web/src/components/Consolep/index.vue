<template>
  <div id="consolep-scroll">
    <div class="box">
      <h1>> llpage console</h1>

      <h3>当前设置的保活数量: {{ ll.size }}</h3>

      <h4>实际当前链表长度: {{ currentLian }}</h4>
    </div>

    <div id="consolep" />
  </div>
</template>
<script>
export default {
  name: 'Consolep',
  props: ['ll', 'currentLian'],
  watch: {
    currentLian: function () {},
  },
  methods: {
    _logToConsole(msg) {
      const consolePannel = document.getElementById('consolep');
      const consolePannelScroller = document.getElementById('consolep-scroll');

      const _msgEle = document.createElement('div');
      _msgEle.innerHTML = `<span style="font-size: 12px;line-height: 16px;color: #ffffff">${msg}</span>`;
      consolePannel.appendChild(_msgEle);
      consolePannelScroller.scrollTop = consolePannelScroller.scrollHeight;
    },
  },
};
</script>
<style lang="scss" scoped>
#consolep-scroll {
  width: 300px;
  height: 600px;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
  position: absolute;
  right: 20px;
  top: 120px;
  z-index: 999;
  overflow: auto;
  box-sizing: border-box;
  padding-bottom: 20px;
  text-align: left;
  .box {
    box-sizing: border-box;
    padding: 20px;
  }
  h1 {
    @extend .H1;
    font-size: 16px;
    line-height: 16px;
    color: #16a085;
    margin-bottom: 10px;
  }
  h3 {
    @extend .H4;
    line-height: 12px;
    color: #9b59b6;
    margin-bottom: 4px;
  }
  h4 {
    @extend .H5;
    font-size: 12px;
    line-height: 12px;
    color: #3498db;
  }
  #consolep {
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
