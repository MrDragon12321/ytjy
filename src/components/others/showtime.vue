<template>
    <span class="online-time hidden-sm-and-down" v-html="nowTime"></span>
</template>
<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { dynamicTime } from '@/utils/date'
const store = useStore(key)
const nowTime = ref('')
let interval: any
nowTime.value = dynamicTime()
interval = setInterval(function () {
    nowTime.value = dynamicTime()
}, 1000)

onUnmounted(() => {
    clearInterval(interval!)
    interval = null
})
</script>
<style>
.online-time {
    border-right: 1px solid #ccc;
    padding-right: 24px;
    margin-right: 8px;
    min-width: 60px;
    color: #fff;
    @include line-clamp(1);
}
</style>
