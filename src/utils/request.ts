

import store from "@/store"
import { ElMessage } from 'element-plus'
import appLoading from './loading'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosPromise } from 'axios'
import { havePerm } from './perms'
const { successCode, env, baseUrl } = require('@/config/index.js')
let baseURL = baseUrl[env]

if (env != "dev") {
    baseURL = baseUrl[env]
}
// 创建实例、配置axios(基本路径、超时（ms）、是否采用凭证)
const ins = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: false
})

/* 
配置接口拦截器
*/

ins.interceptors.request.use(
    config => {

        // haveperm()
        // console.log(config,config.url,config.data);

        if (config.url != '/captcha') config.headers!['Authorization'] = `Bearer ${store.getters['login/token']}`

        // if (config.url == "/case/carVirtualGps/readExcel") {
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // }
        appLoading.show()
        return config
    },
    (error: AxiosError): AxiosPromise => {

        return Promise.reject(error)
    }
)

ins.interceptors.response.use(
    response => {
        appLoading.close()
        const { data, config } = response


        const { code, message } = data
        const { responseType } = config//通过返回的responseType来判断是否是导出接口
        if (code === successCode || responseType == "blob") {
            return Promise.resolve(data.result || data)
        } else {
            ElMessage.error(message || `后端接口${code}异常`)
            return Promise.reject(false)
        }
    },
    (error: any) => {
        appLoading.close()
        const response = error.response
        let message = error.message
        // console.log( error.response, error.message);
        // let { response, message } = error
        if (response && response.data) {
            const { status, data } = response
            // handleCode(status, data.msg || message)
            ElMessage.error(`${data.message}`)
        } else {
            if (message === 'Network Error') {
                message = '后端接口连接异常'
            } else if (message.includes('timeout')) {
                message = '后端接口请求超时'
            } else if (message.includes('Request failed with status code')) {
                const code = message.substr(message.length - 3)
                message = '后端接口' + code + '异常'
            }
            ElMessage.error(message || `后端接口未知异常`)
        }
        return Promise.reject(false)
    }

)

export default ins

