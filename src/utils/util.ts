import Base64 from './base64'
const { setting }  = require('@/config/index.js')
import { isArray, isNullOrEmpty, isObject } from './validate'
import type { TypeObject, StrOrNum } from '@/types/global'
type Area={[propName: string]: any}
export function getArea(str:String) {
    const area:Area= {}
    let index11 = 0
    const index1 = str.indexOf("省")
    if (index1 == -1) {
      index11 = str.indexOf("自治区")
      if (index11 != -1) {
        area.province = str.substring(0, index11 + 3)
      } else {
        area.province = str.substring(0, 0)
      }
    } else {
      area.province = str.substring(0, index1 + 1)
    }
  
    const index2 = str.indexOf("市")
    if (index11 == -1) {
      area.city = str.substring(index11 + 1, index2 + 1)
    } else {
      if (index11 == 0) {
        area.city = str.substring(index1 + 1, index2 + 1)
      } else {
        area.city = str.substring(index11 + 3, index2 + 1)
      }
    }
  
    let index3 = str.lastIndexOf("区")
    if (index3 == -1) {
      index3 = str.indexOf("县")
      area.country = str.substring(index2 + 1, index3 + 1)
    } else {
      area.country = str.substring(index2 + 1, index3 + 1)
    }
    return area;
  }

/**
 * @description 对象深拷贝
 */
export function deepClone(newData: TypeObject, data: TypeObject): TypeObject {
    for (const [key, value] of Object.entries(data)) {
        if (isObject(value) || isArray(value)) {
            let _data = newData[key] || {}
            if (isArray(value)) {
                _data = newData[key] || []
            }
            newData[key] = deepClone(_data, value)
        } else {
            newData[key] = value
        }
    }
    return newData
}
/**
 * @description 对象深拷贝
 */
 export function deepAssign(newData: TypeObject, data: TypeObject): TypeObject {
    for (const [key, value] of Object.entries(data)) {
        if (isObject(value) || isArray(value)) {
            let _data = newData[key] || {}
            if (isArray(value)) {
                _data = newData[key] || []
            }
            newData[key] = deepAssign(_data, value)
        } else {
            newData[key] = value
        }
    }
    return newData
}
/**
 * @description 数组随机重排
 */
Array.prototype.shuffle = function(): Array<unknown> {
    const array = this
    let m = array.length, t, i
    while (m) {
        i = Math.floor(Math.random() * m--)
        t = array[m]
        array[m] = array[i]
        array[i] = t
    }
    return array
}

/**
 * @description 横线、小驼峰相互转换
 */
export function humpLine(str: string) {
    return {
        toHump: str.replace(/-(\w)/g, function(all, letter) {
            return letter.toUpperCase()
        }),
        toLine: str.replace(/([A-Z])/g, "-$1").toLowerCase()
    }
}

/**
 * @description 简单的加、解密
 */
export function authcode(option: string, str: string, len: number = 6): string {
    if (option === "decode") { // 解密
        const length = str.length
        if (length <= len) len = length - 2
        str = str.substring(length - len, 2 * length - len) + str.substring(0, length - len)
        return Base64.decode(str)
    } else { // 加密
        str = Base64.encode(str)
        const length = str.length
        if (length <= len) len = length - 2
        str = str.substring(len, length) + str.substring(0, len)
        return str
    }
}

/**
 * @description 设置浏览器标题
 */
export function setBrowserTitle(title: string): void {
    window.document.title = title ? 
    `${title} - ${setting.system.brand} | ${setting.system.name}` : 
    `${setting.system.brand} - ${setting.system.name}`
}

/**
 * @description 数值单位处理
 * @param num - 数据
 * @param multiple - 大于指定值开始格式
 * @param decimalLength - 小数点位数
 * @param rounding -是否四舍五入
 * @param tag - 是否添加<font>样式标签
 */
export function numberFormatter(
    num: number, 
    multiple = 10000, 
    decimalLength = 2, 
    rounding = true, 
    tag = false
): string|number {
    const _n = Math.pow(10, decimalLength)
    const _f = (num: number): number => !rounding ? num : Math.round(num)
    let minus = 1
    if (num < 0) minus = -1, num = Math.abs(+num)
    if (num >= multiple * 10000) {
        return minus * _f(+num * _n / 100000000) / _n + (tag ? '<small>亿</small>' : '亿')
    } else if (num >= multiple) {
        return minus * _f(+num * _n / 10000) / _n + (tag ? '<small>万</small>' : '万')
    } else {
        return minus * _f(+num * _n) / _n
    }
}

/**
 * @description 金额千分位格式
 * @param money - 金额
 * @param decimalLength - 小数点位数
 * @param rounding - 是否四舍五入
 */
export function moneyFormatter(money: number, decimalLength: number = 2, rounding: boolean = true): string {
    const _n = Math.pow(10, decimalLength)
    const _f = (num: number):number => !rounding ? num : Math.round(num)
    money = _f(+money * _n) / _n
    return (money.toString().indexOf ('.') !== -1) 
    ? money.toLocaleString()
    : money.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

/**
 * @description 求和
 */
export function getTotal(target: Array<number>, key: unknown = null): number {
    return target.reduce((sum: number, val: any) => {
        if (key) val = val[1]
        return sum + (+val)
    }, 0)
}

/**
 * @description 比较
 */
export function compare(property: string, desc: boolean = false) {
    return function (a: any, b: any): number {
        const val1 = a[property]
        const val2 = b[property]
        if (desc) {
            return val1 - val2 // 升序排列
        } else {
            return val2 - val1 // 降序排列
        }
    }
}

/**
 * @description 自动补全0
 */
export function prefixZero(num: number, n: number = 2): string {
    return (Array(n).join('0') + num).slice(-n)
}

/**
 * @description 数值动态累计
 */
export function numAnimation(source: number, num: number = 0): void {
    if (num < 0) {
        source = num
        return
    }
    let step = 0
    if (String(num).includes(".")) {
        step =  Number((num / 120).toFixed(4)) // 含小数，递增步阶
    } else {
        step =  Math.ceil(num / 120) // 整数，递增步阶
    }
    const timer = setInterval(() => {
        if (source + step < num) {
            source = source + step
        } else {
            source = Math.floor(num * 100) / 100
            clearInterval(timer)
        }
    }, 2)
}

/**
 * @description 过滤非数字
 */
export function filterNumber(value: string, decimal: number = 0): string {
    const re = new RegExp("^[0]\\d|^\\D*([0-9]\\d*\.?\\d{0," + decimal + "})?.*$", "") // eslint-disable-line
    return decimal == 0 ? value.replace(/^[0]|[^\d]/g, '') : value.replace(re, '$1')  
}

/**
 * @description 手机号中间显示 * 号
 */
export function mobileFormat(mobile: string): string {
    return mobile.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2')
}

/**
 * @description 过滤对象空值属性
 */
export function filterData<T extends TypeObject>(datas: T, isForm: boolean, filterString: boolean = false): T {
    Object.entries(datas).forEach(item => {
        if (isNullOrEmpty(item[1], filterString)) {
            if (isForm) {
                datas.delete(item[0])
            } else {
                delete datas[item[0]]
            }
        }
    })
    return datas
}

/**
 * @description \n 转 <br />
 */
export function nl2br(str: string, is_xhtml: boolean): string {
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>'
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2')
}

/**
 * @description input 值转大小写 
 */
export function toggleCase(obj: TypeObject, key1: StrOrNum, key2: StrOrNum = '', lowerCase: boolean = false): {
    get: () => any,
    set: (val: string) => void
} {
    return {
        get() { return !key2 ? obj[key1] : obj[key1][key2] },
        set(val) {
            if (!key2) obj[key1] = lowerCase ? val.toLowerCase() : val.toUpperCase() 
            else obj[key1][key2] = lowerCase ? val.toLowerCase() : val.toUpperCase() 
        }
    }
}