
import request from '@/utils/request'
import type { ApiParams, ApiResponse } from '@/types/api'

/**
 * @description: 登录验证
 * @param params
 */
// export async function login(params: ApiParams) {
//     const res = await request.post('/admin/login', params)
//     return res.data
// }
export function login(params: ApiParams) {
    return Promise.resolve({ token: "ytjy is best" })
}

export function getCaptchaCode() {
    return request.post('/captchaCode', {})
}

/**
 * @description 退出登录
 */

//  export async function logout() {
//     const res = await request.get('/admin/logout') as ApiResponse
//     return res.msg
// }
export function logout() {

    return Promise.resolve({ "msg": "退出成功" })
}