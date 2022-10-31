export interface TypeObject<T = any> {
    // [propName: string]: T extends Function ? T : any
    [propName: string]: T
}
export interface TypeFunc<T = void> {
    (...props: any[]): T 
}
export type NumOrNull = number | null|string
export interface DialogOptions {
    visible: boolean,
    type?: string,
    row?: any,
    title?: string,
    [propName: string]: any
}
export interface Array<unknown> {
    shuffle: unknown
}
export type DialogHandle = TypeFunc
export type TypeDate = Date | string | number
export type CookieValue = object | string | number | boolean
export type MapToPromise<T> = { [K in keyof T]: Promise<T[K]> }
export declare type CallBack = TypeFunc
export type StrOrNum = string | number
export type ElFormRule = {
    required?: boolean,
    message?: string,
    trigger?: any,
    validator?: (
        rule: any, 
        value: any, 
        callback: any,
        obj?: any
    ) => void
}
export type ElFormRules = TypeObject<ElFormRule[]>