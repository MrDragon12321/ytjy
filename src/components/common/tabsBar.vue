<template>
    <el-tabs type="card" class="top-tabs" v-model="$route.path" @tab-click="handleClick" :closable="true"
        @tab-remove="handleRemove">
        <el-tab-pane v-for="(tab, index) in topTabs" :key="index" :name="tab.path">
            <template #label>
                <i :class="tab.icon" v-if="tab.icon" />
                <span>{{ tab.name }}</span>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { watch, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const [router, route, store] = [useRouter(), useRoute(), useStore()]
type Handle = (...props: any[]) => void
const topTabs = computed(() => {
    return store.getters['tabs/topTabs']
})

const handleClick: Handle = tab => {
    router.push({ path: tab.props.name })
}

const handleRemove = async (path: string): Promise<void> => {
    try {
        if (topTabs.value.length <= 1) return
        const nextTab = await store.dispatch(
            'tabs/clearTopTabs', { type: "delete", path }
        )
        if (route.path === path && nextTab) {
            router.push({ path: nextTab.path })
        }
    } catch (error) {
        error && proxy.$message.error(`${error}`)
    }
}
watch(
    () => router.currentRoute.value,
    route => {

        if (route.path == "/login") return

        store.dispatch('tabs/setTopBars', route)
    }, {
    deep: true,
    immediate: true
}
)
</script>

<style lang="scss" scoped>
.el-tabs--card>.el-tabs__header {
    border-bottom: 0;
    margin: 0px;
}

.top-tabs {
    width: calc(100% - 70px);

    ::v-deep(.el-tabs__header) {
        border-bottom: 0;
        margin: 0px;

        .el-tabs__nav {
            border: 0;
        }

        .el-tabs__item {
            height: 3.5rem;
            line-height: 3.5rem;

            margin-right: 0.5rem;
            background-color: $base-tab-background;
            border-radius: 5px;

            &::after {
                width: 100%;
                height: 0.2rem;
                position: absolute;
                left: 0;
                bottom: 0;
                transform: scaleX(0);
                content: "";
                background: #007ACC;
                @include transition(transform .3s cubic-bezier(.645, .045, .355, 1));
            }

            &:hover,
            &.is-active {
                background: $base-color-blue-bg-hover;

                &:after {
                    transform: scaleX(1);
                    -webkit-transform: scaleX(1);
                }
            }
        }
    }
}
</style>