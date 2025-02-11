<template>
  <div class="PageLoading" id="PageLoading">
    <div class="PageLoading_Bg"></div>
    <div class="PageLoading_main">
      <div class="load-twelve">
        <div class="twelve-twe">
          <div class="twelve-lve"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLoading',
};
</script>

<style lang="scss" scoped>
.PageLoading {
  position: absolute;
  z-index: 9999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;

  &_Bg {
    position: absolute;
    z-index: 10000;
    width: 100%;
    height: 100%;
    // background-color: transparentize($EnnWKN1, (1-0.08));
    // background-color: rgb(221 227 247 / 20%);
    background-color: #ebeffa;
    left: 0;
    top: 0;
  }
  &_main {
    position: absolute;
    z-index: 10001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // perspective: 500px;
  }
}
.load-twelve {
  width: 32px;
  height: 32px;
  margin: 70px auto;
  text-align: center;

  position: relative;
  z-index: 10002;
}
.twelve-twe {
  width: 32px;
  height: 32px;
  padding: 3px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(0deg, rgba(64, 107, 212, 0.1) 33%, rgb(64, 107, 212) 100%);
  animation: spin 0.8s linear 0s infinite;
}
.twelve-lve {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 50%;
}
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
