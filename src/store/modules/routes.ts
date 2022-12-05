import constantRoutes from '@/router/constantRoutes'
import asyncRoutes from '@/router/asyncRoutes'
import { GetterTree, ActionContext } from 'vuex'
import { Mutation, RootState, Action } from '@/types/store'
import { getRouter } from '@/api/router'
import { formatRoutes, getDefaultRoute } from '@/utils/routes'
import { deepClone } from '@/utils/util'
import type { Route } from '@/types/router'
import {getUserInfo} from '@/api/login'
type State = {
    routes: unknown[],
    addRoutes: Route[],
    defaultRoute: Route | null,
    showpage: boolean
}
type MutationTree<S> = {
    setRoutes: Mutation<S, Route[]>,
    setDefaultRoute: Mutation<S, Route>
    setShowPage: Mutation<S, boolean>
}
type ActionTree<S> = {
    setAsyncRoutes: Action<ActionContext<S, RootState>, any>
    setIsShow: Action<ActionContext<S, RootState>, any>
}

const state = {
    routes: [],             // 完整路由
    addRoutes: [],          // 新增的路由
    defaultRoute: null,      // 默认路由
    showpage: true   //用于菜单管理刷新路由
} as State

const getters = <GetterTree<State, RootState>>{
    routes: state => state.routes,
    addRoutes: state => state.addRoutes,
    defaultRoute: state => state.defaultRoute,
    showpage: state => state.showpage
}

const mutations = <MutationTree<State>>{
    setRoutes: (state, routes) => {
        state.routes = [...constantRoutes, ...routes]
        state.addRoutes = routes
    },
    setDefaultRoute: (state, route) => {
        state.defaultRoute = route
    },
    setShowPage: (state, value) => {
        state.showpage = value
    }
}


const actions = <ActionTree<State>>{
    // 
    setAsyncRoutes: async ({ commit, rootGetters }) => {
        try {
            const userInfo=await getUserInfo()
            //保存用户信息
            commit('login/setUserInfo', userInfo, { root: true })
            let accessedRoutes = []
            // 获取接口传过来的动态路由
            const menu = await getRouter()
            const routes = menu as unknown as Route[]
            const r = <any[]>deepClone([], routes)
            // 格式化路由
            const allRoute = formatRoutes(r,userInfo)
            // console.log("过滤后的路由》》》",allRoute);
            accessedRoutes = [...allRoute] as Route[]
            commit('setRoutes', accessedRoutes)
            //获取默认路由
            const defaultRoute = getDefaultRoute(accessedRoutes, 'valid')
            commit('setDefaultRoute', defaultRoute)
            return Promise.resolve({ accessedRoutes, defaultRoute })
        } catch (error) {
            return Promise.reject(error)
        }
    },

    setIsShow: ({ commit }, value) => {
      
        
         commit('setShowPage',value)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}