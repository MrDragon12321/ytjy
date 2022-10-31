
<template>
    <el-container :class="[store.getters['setting/mobile'] ? 'mobile' : '']">
        <SideNav />
        <el-container direction="vertical">
            <Head />
            <Main />
        </el-container>
        <div  :class="store.getters['setting/shrink'] ? 'modal-no' : 'modal-show'"  @click="store.dispatch('setting/setState', {shrink: true})"></div>
    </el-container>
     
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Main from './Main.vue'
import SideNav from './SideNav.vue'
import Head from './Head.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
const store = useStore()


const resize = () => {
    const clientWidth = Math.floor(document.documentElement.clientWidth)//获取窗口宽度
    if (clientWidth <= 980) {
        store.dispatch("setting/setState", {mobile:true,shrink:true })
    } else {
        store.dispatch("setting/setState", {mobile:false})
    }
}

onMounted(() => {
    resize()
    window.addEventListener("resize", resize, false)
})


</script>

<style lang="scss" scoped>
.el-container {
    width: 100%;
    height: 100%;
    // background: $base-layout-background;

   
}
</style>