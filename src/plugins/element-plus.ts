import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

/**
 * element-plus 1.0.2-beta.59 之后版本更改了国际化语言引入方式
 * 
 * .59之前版本采用：
 * import locale from 'element-plus/lib/locale/lang/zh-cn'
 * import 'dayjs/locale/zh-cn'
 * export default { name: ElementPlus, options: { size: 'small', locale }}
 * 
 * .59之后版本采用 configProvider 或 Composable 方式
 */

export default { 
    name: ElementPlus, 
    options: { 
        size: 'default', 
        locale: zhCn
    }
}  // 默认size: default 请勿轻易改动