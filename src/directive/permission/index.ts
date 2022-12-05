import { Directive, DirectiveBinding, computed } from 'vue';
import store from '@/store'
/**
 * 事件权限校验
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
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
    // 「其他角色」按钮权限校验
    const { value } = binding;

    if (value) {
      const requiredPerms = value; // DOM绑定需要的按钮权限标识
      const hasPerm = perms.value.some((perm: any) => {
        return requiredPerms.includes(perm);
      });


      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(
        "need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\""
      );
    }
  }
};


