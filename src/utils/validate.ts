/**
 * @description 判读是否为外链
 */
 export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path)
}
  
/**
 * @description 判断是否为数字
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number'
}
  
/**
 * @description 判断是否是字符串
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

/**
 * @description 判断是否为数字且最多两位小数
 */
export function isNum(value: string): boolean {
    const reg = /^\d+(\.\d{1,2})?$/
    return reg.test(value)
}
  
/**
 * @description 判断是否是名称
 */
export function isName(value: string): boolean {
    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
    return reg.test(value)
}
  
/**
 * @description 判断是否为IP
 */
export function isIP(ip: string): boolean {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
  
/**
 * @description 判断是否是传统网站
 */
export function isUrl(url: string): boolean {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}
  
/**
 * @description 判断是否是小写字母
 */
export function isLowerCase(value: string): boolean {
    const reg = /^[a-z]+$/
    return reg.test(value)
}
  
/**
 * @description 判断是否是大写字母
 */
export function isUpperCase(value: string): boolean {
    const reg = /^[A-Z]+$/
    return reg.test(value)
}
  
/**
 * @description 判断是否是大写字母开头
 */
export function isAlphabets(value: string): boolean {
    const reg = /^[A-Za-z]+$/
    return reg.test(value)
}

/**
 * @description 判断是否为空对象
 */
export function isEmptyObject(arg: object): boolean {
    for (const name in arg) {
        return false
    }
    return true
}

/**
 * @description 判断是否为空 含 空字符串
 */
export function isNullOrEmpty(val: unknown, filterString = true): boolean {
    if (val === null || (filterString && val === "") || (typeof val == 'undefined')) {
        return true
    } else {
        return false
    }
}

/**
 * @description 判断是否是数组
 */
export function isArray(arg: unknown): arg is any[] {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}

/**
 * @description 判断是否为对象
 */
export function isObject(arg: unknown): arg is object {
    if (Object.prototype.toString.call(arg) === '[object Object]') {
        return true
    } else {
        return false
    }
}
  
/**
 * @description 判断是否为FormData
 */
export function isForm(arg: unknown): boolean {
    if (Object.prototype.toString.call(arg) === '[object FormData]') {
        return true
    } else {
        return false
    }
}

/**
 * @description 判断是否是端口号
 */
export function isPort(value: string): boolean {
    const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
    return reg.test(value)
}
  
/**
 * @description 判断是否是手机号
 */
export function isPhone(value: string): boolean {
    const reg = /^1[1-9]\d{9}$/
    return reg.test(value.toString())
}
  
/**
 * @description 判断是否是身份证号(第二代)
 */
export function isIdCard(value: string): boolean {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(value)
}
  
/**
 * @description 判断是否是邮箱
 */
export function isEmail(value: string): boolean {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(value)
}
  
/**
 * @description 判断是否中文
 */
export function isChina(value: string): boolean {
    const reg = /^[\u4E00-\u9FA5]{2,4}$/
    return reg.test(value)
}
  
/**
 * @description 判断是否为空
 */
export function isBlank(value: any): boolean {
    return (
        value == null ||
        false ||
        value === '' ||
        value.trim() === '' ||
        value.toLocaleLowerCase().trim() === 'null'
    )
}

/**
 * @description 判断是否为固话
 */
export function isTel(value: string): boolean {
    const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})([- ])?)?([0-9]{7,8})(([- 转])*([0-9]{1,4}))?$/
    return reg.test(value)
}
  
/**
 * @description 判断经度 -180.0～+180.0（整数部分为0～180，必须输入1到5位小数）
 */
export function isLongitude(value: number): boolean {
    const reg = /^[-|+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/
    return reg.test(value.toString())
}
  
/**
 * @description 判断纬度 -90.0～+90.0（整数部分为0～90，必须输入1到5位小数）
 */
export function isLatitude(value: number): boolean {
    const reg = /^[-|+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/
    return reg.test(value.toString())
}
  
/**
 * @description rtsp校验，只要有rtsp://
 */
export function isRTSP(value: string): boolean {
    const reg = /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    const reg1 = /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):[0-9]{1,5}/
    const reg2 = /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\//
    return reg.test(value) || reg1.test(value) || reg2.test(value)
}
  
/**
 * @description 判断是否为json字符串
 */
export function isJson(value: string): boolean {
    if (typeof value == 'string') {
        try {
            const obj = JSON.parse(value)
            if (typeof obj == 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    } else {
        return false
    }
}
  
/**
 * @description 判断是否存在原始属性
 */
export function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * @description 判断是否为移动端
 */
export function isMobile(): string[]|null {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

/**
 * @description 车牌号验证
 */
export function isVehicleNumber(vehicleNumber: string): boolean {
    // 普通车辆含武警、领馆
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    const creg2 = /^WJ[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]?[0-9a-zA-Z]{5}$/

    // 新能源车牌
    // var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DFG][A-HJ-NP-Z0-9][0-9]{4}$))/
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[ABCDEFGHJK]$)|([ABCDEFGHJK][A-HJ-NP-Z0-9][0-9]{4}$))/

    if (vehicleNumber.length === 7)
        return creg.test(vehicleNumber) || creg2.test(vehicleNumber)
    else if (vehicleNumber.length === 8)
        return xreg.test(vehicleNumber)
    else
        return false
}