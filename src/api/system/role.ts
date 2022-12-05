import request from '@/utils/request'
import type { ApiParams } from '@/types/api'
/**
 * @description: 获取角色列表
 * @param {*}
 */
export function getRoleList(params: ApiParams) {
    const res = request.get('/rbac/roles/pages', { params })
    return res
    // return request.get('/admin/me').then(res => res.data)
}

/**
 * @description: 新增角色
 * @param {*}
 */
export function addRole(params: ApiParams) {
    const res = request.post('/rbac/roles', params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}

/**
 * @description: 修改角色
 * @param {*}
 */
export function updateRole(id: any, params: ApiParams) {
    const res = request.put('/rbac/roles/' + id, params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}

/**
 * @description:角色详情
 * @param {*}
 */
export function detailRole(params: ApiParams) {
    const res = request.get('/rbac/roles/' + params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:角色资源id集合
 * @param {*}
 */
export function getRoleMenus(params: ApiParams) {
    const res = request.get('/rbac/roles/' + params + "/menuIds")
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:分配资源
 * @param {*}
 */
export function roleSources(id:any,params: ApiParams) {
    const res = request.put('/rbac/roles/' + id + "/menus",params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}

/**
 * @description:角色下拉列表
 * @param {*}
 */
export function getRoles() {
    const res = request.get('/rbac/roles/options')
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:获取菜单树资源
 * @param {*}
 */
export function getSources() {
    const res = request.get('/rbac/menus/resources')
    return res
    // return request.get('/admin/me').then(res => res.data)
}



