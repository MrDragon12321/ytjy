<template>
    <template v-for="menu in children" :key="menu.path">
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path" :popper-append-to-body="true"
            :popper-class="popperClass">
            <template #title>
                <!-- <i :class="[menu.meta.icon, 'iconfont']" v-if="menu.meta.icon"></i> -->
                <!-- <el-icon><AlarmClock /></el-icon> -->
                <component :is='menu.meta.icon' style="width:20px ;height:20px;margin-right: 5px;"></component>
                <span>{{ menu.meta.title }}</span>
            </template>

            <SubMenu :childrens="menu.children" :popper-class="popperClass" />

        </el-sub-menu>
        <el-menu-item v-else :index="menu.path" :route="{ path: menu.path }">
            <!-- <i :class="[menu.meta.icon, 'iconfont']" ></i> -->
            <component :is='menu.meta.icon' style="width:10px ;height:10px;margin-right: 5px;"></component>


            <span>{{ menu.meta.title }}</span>

        </el-menu-item>
    </template>
</template>      


<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SubMenu'
})
</script>

<script lang="ts" setup>
import type { Route } from '@/types/router'
import { computed, defineProps } from 'vue'
import { deepClone } from '@/utils/util'
const props = defineProps<{
    childrens: Route[],
    popperClass?: string
}>()

const children = computed<Route[]>(() => {
    return props.childrens
        .map(child => {
            let newChild = deepClone({}, child) as Route // 防止在 vuex 严格模式下报
            // if (newChild.children && newChild.children.length === 1) {
            //     newChild = newChild.children[0]
            // }
            return newChild
        })
})

</script>

<style lang="scss" scoped>
// .el-sub-menu.is-active.is-opened {
//     ::v-deep .el-sub-menu__title {
//         background: #E8ECF8;
//     }
// }


::v-deep .el-sub-menu__title {
    background-color: #E8ECF8;
}
</style>