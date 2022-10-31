const { storage } = require('@/config/index.js')

/**
 * @description 添加localStorage
 * @param name - 键
 * @param value - 值
 */
export const setLocalStorage = function(name: string, value: unknown): void {
    if (!storage.auto_start) return
    if (typeof value != 'string') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(storage.prefix + "_" + name, <string>value)
}

/**
 * @description 获取localStorage
 * @param name - 键
 * @param type - 类型
 */
export const getLocalStorage = function(name: string, type: string = "string"): any {
    if (!storage.auto_start) return ""
    const prefix = storage.prefix + "_"
    let data: any = localStorage.getItem(prefix + name)
    if (data) {
        if (type !== 'string') {
            data = JSON.parse(data)
        }
    }
    return data
}

/**
 * @description 删除localStorage
 * @param name - 键
 */
export const delLocalStorage = function(name: string) {
    localStorage.removeItem(storage.prefix + "_" + name)
}