const { cookie } = require('@/config/index.js')
import type { CookieValue } from '@/types/global'

/**
 * @description 添加cookie
 * @param key - 键
 * @param value - 值
 * @param expires - 过期时间(时)
 * @param prefix - 前缀
 */
const setCookie = function(key: string, value: CookieValue, expires = 0, prefix?: string): void {
    if (!cookie.auto_start) return
    if (typeof value === 'object'){
        value = JSON.stringify(value)
    }
    expires = expires ? expires : cookie.expire
    prefix = prefix ?? cookie.prefix + "_"
    const expDate = new Date()
    expDate.setTime(+expDate + 60 * 60 * 1000 * + expires)
    document.cookie = prefix + key + "=" + encodeURIComponent(value) + ";path=/;expires=" + expDate.toUTCString()
}

/**
 * @description 批量添加cookie
 * @param values - 键值对象
 * @param expires - 过期时间(时)
 * @param prefix - 前缀
 */
 const setAllCookie = function(values: {[propName: string]: CookieValue}, expires?: number, prefix?: string) {
    for (const [key, value] of Object.entries(values)) {
        setCookie(key, value, expires, prefix)
    }
}

/**
 * @description 获取cookie
 */
const getCookie = function(key: string, type = "string"): any {
    const arr = document.cookie.split("; ") || []
    for (const value of arr) {
        const _arr = value.split("=")
        if (_arr[0] === cookie.prefix + "_" + key) {
            if (type === 'object'){
                return JSON.parse(decodeURIComponent(_arr[1]))
            }
            return decodeURIComponent(_arr[1])
        }
    }
}

/**
 * @description 删除cookie
 */
const delCookie = function(key: string) {
    setCookie(key, "", -1)
}

/**
 * @description 清空所有 cookie
 */
const clearAllCookie = function() {
    const keys = document.cookie.match(/[^ =;]+(?==)/g) || []
    keys.forEach(key => {
        if (key.includes(`${cookie.prefix}_`)) {
            setCookie(key, "", -1, "")
        }
    })
}

export {
    setCookie,
    setAllCookie,
    getCookie,
    delCookie,
    clearAllCookie
}