<template>
    <div :class="['search-bars', status.c1]" :style="`height: ${height}px`">
        <slot/>
        <div class="white-bg"></div>
        <el-button 
            type="primary"
            :class="{'control-btn': true, 'none': height < 60}" 
            @click="handleOpen">
            <el-icon><component :is="status.c2" /></el-icon>
            <span>{{ status.text }}</span>
        </el-button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SearchBars'
})
</script>
<script lang="ts" setup>
import { shallowRef, onMounted, computed, onActivated, watch, onUnmounted, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
const open = shallowRef<boolean>(false)
const handleOpen = function() {
    open.value = !open.value
}
const status = computed(() => {
    return open.value ? { 
        c1: 'search-shrink',
        c2: ArrowDown ,
        text: '展开'
    } : { 
        c1: '',
        c2: ArrowUp,
        text: '收起'
    }
})
const height = shallowRef<number>(0)
const init = (onresize = true) => {
    const el = document.querySelector(".search-bars .el-form") as HTMLElement
    
    
    if (el) {
        height.value = el.offsetHeight
        if (onresize) {
            window.onresize = () => {
                height.value = el.offsetHeight
            }
        }
        
    }
}
const store = useStore()
watch(() => store.getters['setting/shrink'], () => {
    setTimeout(() => init(false), 300)
})
onMounted(init)
onActivated(init)
onUnmounted(() => window.onresize = null)
onDeactivated(() => window.onresize = null)
</script>