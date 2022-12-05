import request from '@/utils/request'
import type { ApiParams } from '@/types/api'
import { pa } from 'element-plus/es/locale'
/**
 * @description: 获取弹窗父级菜单
 * @param {*}
 */
export function getOptions() {
    return request.get('/rbac/menus/options')
    // return request.get('/admin/me').then(res => res.data)
}


/**
 * @description: 获取菜单列表
 * @param {*}
 */
export function getMenuList(params: ApiParams) {
    const res = request.get('/rbac/menus', {params})
    return res
    // return request.get('/admin/me').then(res => res.data)
}


/**
 * @description: 新增菜单
 * @param {*}
 */
export function addMenuItem(params: ApiParams) {
    const res = request.post('/rbac/menus',params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}



/**
 * @description: 删除菜单
 * @param {*}
 */
export function deleteMenuItem(params: ApiParams) {
    const res = request.delete('/rbac/menus/'+params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}


/**
 * @description:获取菜单详情
 * @param {*}
 */
export function getMenuItem(params: ApiParams) {
    const res = request.get('/rbac/menus/'+params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}


/**
 * @description:修改菜单
 * @param {*}
 */
export function updateMenuItem(ids:String ,params: ApiParams) {
    const res = request.put('/rbac/menus/'+ids,params)
    return res
    // return request.get('/admin/me').then(res => res.data)
}




