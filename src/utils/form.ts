import { isPhone, isIP, isVehicleNumber } from '@/utils/validate'
import type { CallBack, TypeObject } from '@/types/global'

/**
 * @description 校验手机号
 */
export function validatePhone(rule: any, value: string, callback: CallBack): void {
    if (!value) {
        callback(new Error('请输入手机号'))
    } else {
        if (!isPhone(value)) {
            callback(new Error('请正确输入11位手机号'))
        } else {
            callback()
        }
    }
}

/**
 * @description 校验IP
 */
export function validateIP(rule: any, value: any, callback: CallBack): void {
    if (!value) {
        callback(new Error('IP地址不能为空'))
    } else {
        if (!isIP(value)) {
            callback(new Error('请正确输入IP地址'))
        } else {
            callback()
        }
    }
}

/**
 * @description 校验车牌号
 */
export function validateVehicle(rule: any, value: any, callback: CallBack): void {
    if (!value) {
        callback(new Error('车牌号不能为空'))
    } else {
        if (!isVehicleNumber(value)) {
            callback(new Error('请正确输入车牌号'))
        } else {
            callback()
        }
    }
}

export const PASSWORD_REG_WEEK = /^[0-9]{6,8}$|^[A-Z]{6,8}$|^[a-z]{6,8}$|^[\W_!@#$%^&*`~()-+=]{6,8}$/ // 弱
export const PASSWORD_REG_MIDDLE = /^(?!\d+$)(?![a-zA-Z]+$)[\da-zA-Z]{8,10}$|^(?!\d+$)(?![\x00-\xff]+$)[\d\x00-\xff]{8,10}$|^(?!a-zA-Z+$)(?![\x00-\xff]+$)[a-zA-Z\x00-\xff]{8,10}$/ // eslint-disable-line
export const PASSWORD_REG_POWER = /^(?=.*[a-zA-Z])(?=.*[\W_!@#$%^&*`~()-+=])(?=.*\d)[^]{10,16}$|^(?=.*[a-zA-Z])(?=.*[\W_!@#$%^&*`~()-+=])[^]{10,16}$|^(?=.*\d)(?=.*[\W_!@#$%^&*`~()-+=])[^]{10,16}$|^(?=.*[a-zA-Z])(?=.*\d)[^]{10,16}$/ // 强
// export const PASSWORD_TEST = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/  // 校验密码8-18位 且需包含数字、字母两种元素
// export const PASSWORD_TEST = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,18}$/ // 必须包含数字、大小字母、特殊字符
// export const PASSWORD_TEST = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{8,18}$/ // 必须包含数字、大小字母
// export const PASSWORD_TEST = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_!@#$%^&*`~()-+=])).{8,18}$/ // 必须包含数字、大小字母和特殊字符
export const PASSWORD_TEST = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\w\s]).{8,18}$/ // 必须包含数字、大小字母和特殊字符

/**
 * @description 校验密码
 */
export function validatePassword(rule: object, value: string, callback: CallBack, { confirmValue = '_default_password_confirmation_' }: any): void {
    if (!value) callback()
    if (value.length < 8 || value.length > 18) {
        callback(new Error('密码位数为8位 ~ 18位'))
    } else if (!PASSWORD_TEST.test(value)) {
        callback(new Error('密码至少包含数字、大小字母和特殊字符'))
    } else if (PASSWORD_REG_WEEK.test(value)) {
        callback(new Error('密码安全等级: 弱'))
    } else if ((confirmValue !== '_default_password_confirmation_') && (value !== confirmValue)) {
        callback(new Error('两次输入密码不一致'))
    }else {
        callback()
    }
}