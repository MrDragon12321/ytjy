import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import type { ModulesState } from '@/types/store'
import login from './modules/login'
import routes from './modules/routes'
import tabs from './modules/tabs'
import setting from './modules/setting'
const modules = {
    login,
    routes,
    tabs,
    setting
}
type RootState = ModulesState<typeof modules>
export const key: InjectionKey<Store<RootState>> = Symbol()
export default createStore<RootState>({
    modules,
    strict: false // 非严格模式
})