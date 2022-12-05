
<template>
    <el-container :class="[$store.getters['setting/mobile'] ? 'mobile' : '']">
        <SideNav />
        <el-container direction="vertical">

            <Head />
            <Main />
        </el-container>
        <div :class="$store.getters['setting/shrink'] ? 'modal-no' : 'modal-show'"
            @click="$store.dispatch('setting/setState', { shrink: true })"></div>
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center :show-close='false'
            :close-on-click-modal="false" :close-on-press-escape="false">
            <div style="width:100%;text-align:center ;">
                身份认证失效，请刷新或重新登录
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleToken('reset')">重新登录</el-button>
                    <el-button type="primary" @click="handleToken('refresh')">
                        刷新
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>

</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, getCurrentInstance } from 'vue'
import Main from './Main.vue'
import SideNav from './SideNav.vue'
import Head from './Head.vue'
import { getCookie } from "@/utils/cookie";
import { fa } from 'element-plus/es/locale';
const { proxy } = getCurrentInstance() as any
const { $router, $store } = proxy
const centerDialogVisible = ref(false)

const resize = () => {
    const clientWidth = Math.floor(document.documentElement.clientWidth)//获取窗口宽度
    if (clientWidth <= 980) {
        $store.dispatch("setting/setState", { mobile: true, shrink: true })
    } else {
        $store.dispatch("setting/setState", { mobile: false })
    }
}

const handleToken = async (val: String) => {
    if (val == 'reset') {
        $store.dispatch('login/resetAll').then(() => {
            $router.push({ path: '/login' })
        }).catch((error: any) => {
            error && proxy.$message.error(`${error}`)
        })
    } else {
        if (!getCookie("refresh_token")) {
            proxy.$message.error('已超过刷新时间，请重新登录！！！')
            handleToken("reset")
            return
        }
        const formData = new FormData();
        formData.append('refresh_token', getCookie("refresh_token"))
        formData.append('grant_type', "refresh_token")
        await $store.dispatch("login/login", formData)
        
    }
    centerDialogVisible.value = false
}

var timer: any = null
onMounted(() => {
    resize()
    window.addEventListener("resize", resize, false)
    centerDialogVisible.value = !getCookie("token")
    timer = setInterval(() => {
        centerDialogVisible.value = !getCookie("token")
    }, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})


</script>

<style lang="scss" scoped>
.el-container {
    width: 100%;
    height: 100%;
    // background: $base-layout-background;


}
</style>