/*
 * @Author: your name
 * @Date: 2022-02-15 16:14:03
 * @LastEditTime: 2022-02-16 09:18:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ytjy\src\utils\loading.ts
 */
import { ElLoading } from 'element-plus'
import type { TypeFunc } from '@/types/global'
// import vLoading from '@/plugins/vLoading' // 引入自定义封装的 loading 插件
interface LoadingInstance {
	close: TypeFunc<void>
}
class AppLoading {
	ajaxQueue: number
	loading: LoadingInstance | null
	isShow: boolean
	constructor() {
		this.ajaxQueue = 0;
		this.loading = null;
		this.isShow = true
	}
	show() {
		if (!this.isShow) return
		this.ajaxQueue++;
		this.loading = ElLoading.service({
			lock: false,
			text: 'Loading',
			background: 'rgba(0, 0, 0, 0.7)',
		});
	}
	close() {
		if (!this.isShow || !this.loading) {
			this.isShow = true
			return
		}
		this.ajaxQueue--;
		if (this.ajaxQueue === 0) {
			this.loading!.close();
		}
	}
}
export default new AppLoading()