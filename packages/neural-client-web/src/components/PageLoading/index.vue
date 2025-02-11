<template>
  <div class="PageLoading" id="PageLoading" v-loading="true">
    <div class="PageLoading_Bg"></div>
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
    background-color: rgb(221 227 247 / 20%);
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

  .pacman {
    position: relative;
    z-index: 10002;
    > div {
      &:first-of-type {
        width: 0px;
        height: 0px;
        border-right: 25px solid transparent;
        border-top: 25px solid $EnnWKNegative;
        border-left: 25px solid $EnnWKNegative;
        border-bottom: 25px solid $EnnWKNegative;
        border-radius: 25px;
        animation: rotate_pacman_half_up 0.5s 0s infinite;
        position: relative;
        left: -30px;
      }
      &:nth-child(2) {
        width: 0px;
        height: 0px;
        border-right: 25px solid transparent;
        border-top: 25px solid $EnnWKNegative;
        border-left: 25px solid $EnnWKNegative;
        border-bottom: 25px solid $EnnWKNegative;
        border-radius: 25px;
        animation: rotate_pacman_half_down 0.5s 0s infinite;
        margin-top: -50px;
        position: relative;
        left: -30px;
      }
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        background-color: $EnnWKNegative;
        width: 15px;
        height: 15px;
        border-radius: 100%;
        margin: 2px;
        width: 10px;
        height: 10px;
        position: absolute;
        transform: translate(0, -6.25px);
        top: 25px;
        left: 70px;
      }
      &:nth-child(3) {
        animation: pacman-balls 1s -0.66s infinite linear;
      }
      &:nth-child(4) {
        animation: pacman-balls 1s -0.33s infinite linear;
      }
      &:nth-child(5) {
        animation: pacman-balls 1s 0s infinite linear;
      }
    }
  }
}
@keyframes rotate_pacman_half_up {
  0% {
    transform: rotate(270deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(270deg);
  }
}
@keyframes rotate_pacman_half_down {
  0% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}
@keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-100px, -6.25px);
  }
}
</style>
