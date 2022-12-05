import { getCookie, setCookie, delCookie, setAllCookie } from './cookie'
import type { CookieValue } from '@/types/global'
const { tokenName } = require('@/config/index.js')

/**
 * @description 获取token
 */
export function getToken() {
    return getCookie(tokenName)
}

/**
 * @description 设置token
 */
export function setToken(value: any) {
    setCookie(tokenName, value['access_token'], value['expires_in'] * 1)
    setCookie('refresh_token',value['refresh_token'], value['expires_in'] * 1 + 300)//刷新token比原token多存储5分钟
}

/**
 * @description 删除token
 */
export function delToken() {
    delCookie(tokenName)
    delCookie("refresh_token")
}