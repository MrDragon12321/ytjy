<template>
    <el-aside :width="$store.getters['setting/shrink'] ? '6.5rem' : '20rem'"
        :class="$store.getters['setting/shrink'] ? 'side-no' : 'side-show'">
        <div class='aside_nav'>
            <component :is="Nav"></component>
        </div>
       
    </el-aside>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
import Nav from './common/Nav.vue'
const { proxy } = getCurrentInstance() as any
const { $store } = proxy



</script>

<style lang="scss" scoped>
.el-aside {
    .aside_nav {
        height: 100%;
        background: #E8ECF8;
    }
}

</style>