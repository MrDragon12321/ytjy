import request from '@/utils/request'
import type { ApiParams } from '@/types/api'
/**
 * @description:获取用户列表
 * @param {*}
 */
export function getUser(params: ApiParams) {
    const res = request.get('/rbac/users/pages', { params })
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:角色资源id集合
 * @param {*}
 */
export function updateUserPassword(id: number, params: ApiParams) {
    const res = request.patch('/rbac/users/' + id, params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:获取角色
 * @param {*}
 */
export function getRoles(params: number) {
    const res = request.get('/rbac/roles/options/' + params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:修改
 * @param {*}
 */
export function updateUser(id: string, params: ApiParams) {
    const res = request.put('/rbac/users/' + id, params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}
/**
 * @description:修改
 * @param {*}
 */
export function getUserForm(id: number) {
    const res = request.get('/rbac/users/' + id)
    return res
    // return request.get('/admin/me').then(res => res.data)
}


