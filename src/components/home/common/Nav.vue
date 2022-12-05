<template>
    <el-scrollbar :class="$store.getters['setting/shrink'] ? 'sider-bar-vertical' : ''">
        <div :class="$store.getters['setting/shrink'] ? 'liiter-logo' : 'logo'">

        </div>
        <el-menu class="el-menu-vertical" :default-active="activeIndex" :router="true" :unique-opened="true"
            :collapse="$store.getters['setting/shrink']" :collapse-transition="false" @select="handleSelect"
            >
            <SubMenu :childrens="children" />
        </el-menu>
    </el-scrollbar>
</template>

<script lang="ts" setup>
import SubMenu from './SubMenu.vue'
import { computed, getCurrentInstance, nextTick } from 'vue'
import { deepClone } from '@/utils/util'
import type { Route } from '@/types/router'
const { proxy } = getCurrentInstance() as any
const { $router, $store } = proxy
const routes = $store.getters['routes/addRoutes']

const children = computed<Route[]>(() => {
    const _routes = deepClone([], routes) as Route[]
    return _routes
})

const isMobile = computed<boolean>(() => {
    return $store.getters["setting/mobile"]
})

// 移动端点击菜单，左侧菜单收起
const handleSelect = () => {
    if (isMobile.value) {
        $store.dispatch("setting/setState", { shrink: true })
    }
}

const activeIndex = computed<string>(() => {
    let route = $router.currentRoute.value
    let parentRoute = route.matched[route.matched.length - 2]
    if (parentRoute && parentRoute.meta.r_tabs) {
        route = parentRoute
    }
    return route.path
})




</script>
<style lang="scss" scoped>
.el-scrollbar ::v-deep {
    .logo {
        height: 6rem;
        width: 100%;
        background-image: url("~@/assets/images/lg2.png");
        background-size: 100% 100%;

    }

    .liiter-logo {
        height: 6rem;
        width: 100%;
        background-image: url("~@/assets/images/little_logo2.png");
        background-size: 100% 100%;
    }

    .el-menu-vertical {
        border: 0;
    }
}
</style>