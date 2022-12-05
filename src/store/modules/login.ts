
import { GetterTree, ActionContext } from 'vuex'
import { getToken, setToken, delToken } from '@/utils/token'
import { login, logout } from '@/api/login'
import { resetRouter } from '@/router'
import { Mutation, RootState, Action } from '@/types/store'
import { setCookie, setAllCookie } from "@/utils/cookie";

import type { ApiParams } from '@/types/api'
import type { TypeObject } from '@/types/global'
type State = {
    token: string,
    userInfo: TypeObject,
    roles: string[] | null,
    [propName: string]: any
}
type MutationTree<S> = {
    setToken: Mutation<S, any>,
    setUserInfo: Mutation<S, object>,
    resetAll: Mutation<S, any>
}
type ActionTree<S> = {
    login: Action<ActionContext<S, RootState>, ApiParams>,
    [propName: string]: Action<ActionContext<S, RootState>, any>
}

const state = {
    token: getToken() || '', // 请求token
    userInfo: {},            // 用户信息
    roles: null              // 用户角色
} as State


const getters = <GetterTree<State, RootState>>{
    token: state => {
        return state.token
    },
    userInfo: state => {
        return state.userInfo
    },
    roles: state => {
        return state.roles
    }
}

const mutations = <MutationTree<State>>{
    setToken: (state, value) => {
        state.token = value['access_token']
        setToken(value)
    },
    setUserInfo: (state, value) => {
        state.userInfo = value
    },
    resetAll: (state) => {
        state.token = '',
            state.userInfo = {},
            state.roles = null
        delToken()    // 清空token
        resetRouter() // 重置路由
    }
}

const actions = <ActionTree<State>>{
    login: ({ commit }, params) => {
        return (async () => {
            try {
                const loginInfo = await login(params) as any
                commit('setToken', loginInfo)
                return Promise.resolve()
            } catch (error) {
                return Promise.reject(error)
            }
        })()
    },
    logout: ({ commit }) => {//退出
        return (async () => {
            try {
                await logout()
                commit('resetAll')
                return Promise.resolve()
            } catch (error) {
                return Promise.reject(error)
            }
        })()
    },
    resetAll: ({ commit }) => {
        commit("resetAll")
        return Promise.resolve()
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}