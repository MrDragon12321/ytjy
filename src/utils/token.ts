import { getCookie, setCookie, delCookie } from './cookie'
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
export function setToken(value: CookieValue) {
    setCookie(tokenName, value, 24 * 365)
}

/**
 * @description 删除token
 */
export function delToken() {
    delCookie(tokenName)
}