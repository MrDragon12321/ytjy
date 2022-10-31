
import constantRoutes from '@/router/constantRoutes'
import asyncRoutes from '@/router/asyncRoutes'
import { GetterTree, ActionContext } from 'vuex'
import { Mutation, RootState, Action } from '@/types/store'
import { getRouter } from '@/api/router'
import { formatRoutes, getDefaultRoute } from '@/utils/routes'
import { deepClone } from '@/utils/util'
import type { Route } from '@/types/router'
type State = {
    routes: unknown[],
    addRoutes: Route[],
    defaultRoute: Route | null
}
type MutationTree<S> = {
    setRoutes: Mutation<S, Route[]>,
    setDefaultRoute: Mutation<S, Route>
}
type ActionTree<S> = {
    setAsyncRoutes: Action<ActionContext<S, RootState>, any>
}

const state = {
    routes: [],             // 完整路由
    addRoutes: [],          // 新增的路由
    defaultRoute: null      // 默认路由
} as State

const getters = <GetterTree<State, RootState>>{
    routes: state => state.routes,
    addRoutes: state => state.addRoutes,
    defaultRoute: state => state.defaultRoute
}

const mutations = <MutationTree<State>>{
    setRoutes: (state, routes) => {
        state.routes = [...constantRoutes, ...routes]
        state.addRoutes = routes
    },
    setDefaultRoute: (state, route) => {
        state.defaultRoute = route
    }
}


const actions = <ActionTree<State>>{
// 
    setAsyncRoutes: async ({ commit, rootGetters }) => {
        try {
            let accessedRoutes = []
            // 获取接口传过来的动态路由
            const { menu, userInfo } = await getRouter()
            const routes = menu as Route[]
            const r = <any[]>deepClone([], routes)
            // 格式化路由
            const allRoute = formatRoutes(r)

            accessedRoutes = [...allRoute] as Route[]
            commit('setRoutes', accessedRoutes)
            //获取默认路由
            const defaultRoute = getDefaultRoute(accessedRoutes, 'valid')
            commit('setDefaultRoute', defaultRoute)
            //保存用户信息
            commit('login/setUserInfo', userInfo, { root: true })
            return Promise.resolve({ accessedRoutes, defaultRoute }) 
        } catch (error) {
            return Promise.reject(error)
        }
    }
} 

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}