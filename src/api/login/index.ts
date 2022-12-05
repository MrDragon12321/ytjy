
import request from '@/utils/request'
import type { ApiParams, ApiResponse } from '@/types/api'
import appLoading from '@/utils/loading'

/**
 * @description: 登录验证
 * @param params
 */
// export async function login(params: ApiParams) {
//     const res = await request.post('/admin/login', params)
//     return res.data
// }
export function login(params: ApiParams) {
    const res = request.post('/auth/oauth/token', params, {
        auth: {
            username: 'ytjy-web',
            password: '123456'
        }
    })
    return res
}

export function refresh(params: ApiParams) {
    // const res = request.post('/auth/oauth/token', params, {
    //     auth: {
    //         username: 'ytjy-web',
    //         password: '123456'
    //     }
    // })
    // return res
    return Promise.resolve("重置成功")
}

export function getCaptchaCode() {
    appLoading.isShow = false // 关闭全局loading
    return request.get('/captcha')
}

/**
 * @description 退出登录
 */

//  export async function logout() {
//     const res = await request.get('/admin/logout') as ApiResponse
//     return res.msg
// }
export function logout() {
    return request.delete('/auth/oauth/logout')
}
export function getUserInfo() {
    return request.get('/rbac/users/me')
}