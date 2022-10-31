<template>
    <el-header :class="[
        'main_header', 
        hiddenTabs ? 'hidden-tabs' : '', 
    ]">
        <el-row justify="space-between" align="middle" class="header_title">
            <el-col :span="12">
                <el-icon @click="changeShrink">
                    <component :is="shrink ? Expand : Fold" />
                </el-icon>
                <el-icon @click="handleHiddenTabs(!hiddenTabs)">
                    <component :is="hiddenTabs ? Bottom : Top" />
                </el-icon>
            </el-col>
<!-- 
            <el-col :span="12">
                <div style="display: flex;justify-content:flex-end">
                    <ShowTime />
                    <button @click="exit">退出登录</button>
                </div>
            </el-col> -->
        </el-row>
        <el-row justify="space-between" align="middle" class="header_tabs">
            <TabsBar />
        </el-row>


    </el-header>
</template>

<script lang="ts" setup>
import { getCurrentInstance, computed, defineAsyncComponent, shallowRef } from 'vue'
// import {useStore} from 'vuex'
// import {useRouter} from 'vue-router'
// import TabsBar from '@/components/common/tabsBar.vue';

import {
    Fold,
    Expand,
    Top,
    Bottom
} from '@element-plus/icons-vue'
import ShowTime from '../others/time.vue'
// const router=useRouter()
const TabsBar = defineAsyncComponent(() => import('@/components/common/tabsBar.vue'))
const { proxy } = getCurrentInstance() as any
const { $router, $store } = proxy

const shrink = computed(() => $store.getters['setting/shrink'])

//伸展收缩导航栏
const changeShrink = () => {
    $store.dispatch("setting/setState", { 'shrink': !shrink.value })

}

// 状态栏 [展开、收起]
const hiddenTabs = computed<boolean>(() => {
    // store.state.setting.hideTabs
    return $store.getters['setting/hideTabs']
})
// 添加过渡css样式，防止在隐藏tabs时闪现main的滚动条
const hiddenTabsTo = shallowRef(false)
const handleHiddenTabs = (hideTabs: boolean) => {
    hiddenTabsTo.value = true
    setTimeout(() => {
        hiddenTabsTo.value = false
    }, 600)
    $store.dispatch('setting/setState', { hideTabs })
}
const exit = () => {
    $router.push({ path: '/login' })
    $store.dispatch('login/logout').then(() => {
        proxy.$router.push({ path: '/login' })
    }).catch((error: Error) => {
        error && proxy.$message.error(`${error}`)
    })
}
</script>

<style lang="scss" scoped>
.main_header {
    width: 100%;
    height: $base-right-header-height;
    // height: $base-header-height;
    will-change: height;
    @include box-shadow(0, 2px, 4px, -1.5px, rgba(138, 162, 198, 0.65));
    padding: 0;

    .el-icon {
        margin: 0 10px;
    }

    &.hidden-tabs-to::v-deep() {
        +.layout-main {

            >section>.container,
            >section>.page-container {
                transition: none;
            }
        }
    }

    &.hidden-tabs {
        ::v-deep() {
            height: $base-header-height;
            transition-delay: 0s;

            .header_tabs {
                transition-delay: 0s;
                opacity: 0
            }
        }
    }

    .header_title {
        height: $base-header-height ;
        padding-left: 20px;
        background: $base-layout-background;
    }

    .header_tabs {
        height: $base-right-header-tabs;
        background: #fff;
        width: 100%;
        padding-left: 20px;
    }

    .el-icon {
        font-size: 18px;
        color: #fff;
    }

    button {
        background: #2165F8;
        border: none;
        color: #fff;
        text-decoration: underline;
        cursor: pointer;
    }

}
</style>