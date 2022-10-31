<template>
  <div class="rlogin">
    <div class="rlogin_card flex-wrp">
      <div class="rlogin_card_left">
        <div class="left_log"></div>
      </div>
      <div class="rlogin_card_right">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./login.scss";
</style>