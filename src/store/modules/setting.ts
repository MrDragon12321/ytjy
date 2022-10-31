import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { GetterTree, ActionContext } from 'vuex'
import { Mutation, RootState, Action } from '@/types/store'

type MutationTree<S> = {
    setBrowserTitle: Mutation<S, string>,
    setState: Mutation<S, object>
}
type ActionTree<S> = {
    setBrowserTitle: Action<ActionContext<S, RootState>, string>,
    setState: Action<ActionContext<S, RootState>, object>
}
type State = typeof state

const state = {
    mobile: false,            // true 表示当前处于移动设备
    deviceWidth: '',          // 设备尺寸layout-little(< 1440px)、device-small(< 980px)、 device-mini(< 768px)
    ios: false,               // ios设备
    shrink: (getLocalStorage("shrink", "boolean") || false) as boolean, // 左侧导航栏收缩
    shrinkForce: false,       // 左侧导航栏强制收缩
    browserTitle: '',         // 浏览器标题
    theme: 'theme-blue',      // 主题样式
    sideBar: (getLocalStorage("sideBar") || 'column') as string,            // 侧边栏布局，分栏: column、纵向: vertical、顶栏：topBar
    hideTabs: (getLocalStorage("hideTabs", "boolean") || false) as boolean, // 隐藏状态标签
    isTabsLayout: false       // 是否引入了tabsLayout布局组件
}

const getters = <GetterTree<State, RootState>>{
    mobile: state => {
        return state.mobile
    },
    deviceWidth: state => {
        return state.deviceWidth
    },
    ios: state => {
        return state.ios
    },
    shrink: state => {
        return state.shrink
    },
    shrinkForce: state => {
        return state.shrinkForce
    },
    browserTitle: state => {
        return state.browserTitle
    },
    theme: state => {
        return state.theme
    },
    sideBar: state => {
        return state.sideBar
    },
    hideTabs: state => {
        return state.hideTabs
    },
    isTabsLayout: state => {
        return state.isTabsLayout
    }
}

function isValidKey(obj: State, key: any): key is keyof typeof obj {
    return key in obj
}

const mutations = <MutationTree<State>>{
    setBrowserTitle: (state, value) => {
        state.browserTitle = value
    },
    setState: (state, obj) => {
        for (const [key, value] of Object.entries(obj)) {
            if (isValidKey(state, key)) {
                state[key] = value as never
            }
            setLocalStorage(key, value)
        }
    }
}

const actions = <ActionTree<State>>{
    setBrowserTitle: ({ commit }, value) => {
        commit('setBrowserTitle', value)
    },
    setState: ({ commit }, value) => {
        commit('setState', value)
    }
}

export default { 
    namespaced: true,
    state, 
    getters, 
    mutations, 
    actions 
}