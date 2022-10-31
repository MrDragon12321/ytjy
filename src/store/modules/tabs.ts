import { GetterTree, ActionContext } from 'vuex'
import { Mutation, RootState, Action } from '@/types/store'
import type { TypeObject } from '@/types/global'
import { Route } from '@/types/router'
import { fliterTabs, clearTopTabs, TypeAction, TopTab } from '@/utils/tabs'
import { RouteLocation } from 'vue-router'

type State = typeof state
interface NewActionContext<S, R> extends ActionContext<S, R> {
    getters: S
}
type Context<S> = NewActionContext<S, RootState>
type ActionTree<S> = {
    setTopBars: Action<ActionContext<S, RootState>, RouteLocation>
    clearTopTabs: Action<Context<S>, TypeAction>,
}

type MutationTree<S> = {
    setTopBars: Mutation<S, TopTab[]>
}

const state = {
    topTabs: <TopTab[]>[],//存放所有浏览过的且不重复的路由数据
}

const getters = <GetterTree<State, RootState>>{
    topTabs: state => {
        return state.topTabs
    }
}

const mutations = <MutationTree<State>>{
    setTopBars: (state, value) => {
        return state.topTabs = [...value]
    }
}

const actions = <ActionTree<State>>{
    setTopBars: ({ commit, state }, view) => {
        const tabs = fliterTabs(state.topTabs, view)
        commit('setTopBars', tabs)
    },
    clearTopTabs: ({ commit, getters }, value) => {

        const res = clearTopTabs(getters.topTabs, value)
        const topTabs = res.topTabs


        if (topTabs.length == 0) {
            commit("setting/setState", { hideTabs: true }, { root: true })
        }
        let nextTab
        if (value.type === "delete") {
            nextTab = res.nextTab
        } else if (value.type === "all") {
            nextTab = topTabs[0]
        }
        commit('setTopBars', topTabs)
        return Promise.resolve(nextTab)

    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}