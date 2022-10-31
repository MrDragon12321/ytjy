/*
 * @Author: your name
 * @Date: 2022-02-15 16:14:03
 * @LastEditTime: 2022-02-21 14:08:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ytjy\src\config\index.js
 */ 
/**
 * @description: 全局配置，静态变量统一在这进行配置暴露
 */

const config = {
    env: process.env.NODE_ENV === 'production' ? 'pro' : 'dev',
    baseUrl: {
        dev: 'http://apiwp.sit.yuantongjy.com',         // 开发环境
        pro: 'https://apiwp.yuantongjy.com',        // 正式生产环境
        // pro: 'https://apiwp.sit.yuantongjy.com',        // 正式生产环境
    },
    successCode:200,
    cookie: {
        prefix: 'ytjy',//cookie前缀
        expire: 24 * 7,//7天有效时间
        auto_start: true,//是否开启cookie
    },
    tokenName: 'token',
    storage: {
        'prefix': 'ytjy',
        'auto_start': true // 开启 localStorage
    },
    keepAlive: process.env.NODE_ENV === 'production' ? true : false,

}
module.exports = config