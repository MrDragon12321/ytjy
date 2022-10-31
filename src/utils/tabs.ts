import { Route } from '@/types/router'
import { deepClone } from '@/utils/util'
import { RouteLocation, RouteRecordName } from 'vue-router'
import { isString, isNumber } from '@/utils/validate'

export interface TopTab {
    index?: number,
    path: string,
    name: RouteRecordName | null | undefined | unknown,
    title?: string,
    keepAlive?: boolean,
    icon?: string,
    parentPath?: string,
    closable?: boolean
}
export interface TypeAction {
    type: string,
    path: string
}
export function fliterTabs(alltabs: TopTab[], tab: RouteLocation): TopTab[] {
    const tabs = <TopTab[]>[...alltabs]


    const have = tabs.some(val => {
        return val.path === tab.path
    })
    if (!have) {


        tabs.push({
            path: tab.path,
            name: tab.meta.short_name
        })
    }


    return tabs
}


export function clearTopTabs<T extends TopTab>(topTabs: T[], { type, path }: TypeAction): {
    topTabs: T[],
    nextTab?: TopTab
} {

    if (!type || topTabs.length < 1) return { topTabs: [] }
    const tab = topTabs.find((tab, index) => {
        if (tab.path == path) {
            tab.index = index
            return tab
        } else {
            return null
        }
    })
    const index = tab && isNumber(tab.index) ? tab.index : -1
    let nextTab = null

    switch (type) {
        case "delete":
            topTabs.splice(index, 1)
            nextTab = <TopTab>(topTabs[index] || topTabs[index - 1])
            break
        case "other":
            if (index === 0 && topTabs.length > 0) {
                topTabs = topTabs.slice(0, 1)
            } else if (index > 1) {
                topTabs = [topTabs[0], topTabs[index]]
            }
            break
        case "left":
            topTabs.splice(1, index - 1)
            break
        case "right":
            topTabs.splice(index + 1, topTabs.length)
            break
        case "all":
            topTabs.splice(1, topTabs.length)
            break
        default:
    }
    if (nextTab) {
        return { topTabs, nextTab }
    }
    return { topTabs }
}


