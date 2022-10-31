

import store from "@/store"
import { ElMessage } from 'element-plus'
import appLoading from './loading'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosPromise } from 'axios'

const { successCode, env, baseUrl } = require('@/config/index.js')
let baseURL = baseUrl[env]

if (env != "dev") {
    baseURL = baseUrl[env]
}
// 创建实例、配置axios(基本路径、超时（ms）、是否采用凭证)
const ins = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true
})

/* 
配置接口拦截器
*/

ins.interceptors.request.use(
    config => {
        // config.headers!['Authorization'] = `Bearer ${store.getters['login/token']}`


        // if (config.url == "/case/carVirtualGps/readExcel") {
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // }
        appLoading.show()
        return config
    }
)

ins.interceptors.response.use(
    response => {
        appLoading.close()

        const { data, config } = response
        const { code, message } = data
        if (code === successCode || code === undefined) {
            return data.result || data
        } else {

            ElMessage.error(message || `后端接口${code}异常`)
            return Promise.reject(false)
        }
    },
    (error: AxiosError): AxiosPromise => {
        appLoading.close()
        return Promise.reject(false)
    }

)

export default ins

