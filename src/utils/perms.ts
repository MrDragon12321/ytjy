import store from '@/store'
import { computed } from 'vue';
/* 


*/

export function havePerm(strs: string[]) {

    // 「超级管理员」拥有所有的按钮权限
    const levels = computed<any>(() => {
        return store.getters['login/userInfo'].levels
    })
    const perms = computed(() => {
        return store.getters['login/userInfo'].perms
    })

    if (levels.value.indexOf(1) != -1) {
        return true;
    }

    const hasPerm = perms.value.some((v: string) => {
        return strs.includes(v)
    })
    return hasPerm
}