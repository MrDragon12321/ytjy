/*
 * @Author: your name
 * @Date: 2022-02-21 13:42:47
 * @LastEditTime: 2022-02-22 14:36:24
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ytjy\src\api\router\index.ts
 */
import request from '@/utils/request'
import { data } from './real'
/**
 * @description: 获取路由
 * @param {*}
 */
export function getRouter() {
    return request.get('/rbac/menus/routes').then(res => {
        return res
    })
    // return Promise.resolve(data)
    // return request.get('/admin/me').then(res => res.data)
}

