<template>
  <div class="container">
    <div class="header">
      <img
        src="https://res.ennew.com/image/png/23f73b1793c4f255c711ca60ec07fadf.png?optimize=true"
        class="image"
        alt="logo"
      />
    </div>
    <div class="body">
      <div class="empty">
        <img
          src="https://res.ennew.com/image/png/fcdb186c919a1030118817bebcc22b26.png?optimize=true"
          class="image"
          alt="empty"
        />
        <div class="text">暂无访问权限，请联系管理员</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  & > .header {
    height: 48px;
    display: flex;
    align-items: center;
    background: #eff3ff;
    padding: 0 24px;
    .image {
      width: 63px;
    }
  }
  & > .body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #eff3ff 0%, #f6f7fb 100%);
    .empty {
      width: 240px;
      height: fit-content;
      .image {
        width: 100%;
      }
      .text {
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #323233;
        margin-top: 8px;
      }
    }
  }
}
</style>
