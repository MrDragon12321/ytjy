import type { AxiosResponse } from 'axios'
import type { TypeObject } from './global'
export interface ApiParams<T = any> extends TypeObject<T> {
    loading?: 'fullScreen',
    result_msg?: boolean
}
export interface ApiResponse {
    code: number,
    data?: any,
    msg?: string | string[],
}