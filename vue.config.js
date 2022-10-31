/*
 * @Author: zzl
 * @Date: 2022-01-17 13:36:10
 * @LastEditors: zzl
 * @LastEditTime: 2022-02-14 10:44:31
 * @Description: 
 */
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const { env, baseUrl } = require(resolve("src/config"))
// const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  
  publicPath: '/',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,
  lintOnSave: false,  // 代码保存时进行eslint检测
  runtimeCompiler: true,
  productionSourceMap: false,
  
  css: {
    requireModuleExtension: true,
    sourceMap: false, // 默认 false
    // css预设器配置项
    loaderOptions: {
      sass: {
        //prependData: `@import "~@/assets/scss/variables.scss";`
      },
      scss: {
        prependData: `@import "~@/assets/scss/index.scss";`
      }
    }
  },
  devServer: {
    open: false, 
    host: '0.0.0.0',
    port: 30,
    https: false,
    hotOnly: false,
    /* 本地开发环境使用代理 */
    proxy: {
      ['/' + env]: {
        target: baseUrl[env],
        // target: 'http://api.newweb.com',
        changOrigin: true,
        withCredentials: true,
        pathRewrite: {
          ['^/'+env]: ''
        },

      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}
