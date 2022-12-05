import type { Route, Component } from '@/types/router'
// import { useStore } from 'vuex'
// const $store = useStore()
// 格式化路由
export function formatRoutes<T extends Route>(routes: T[], info: any): T[] {
    const res = [] as T[]
    const keys = ['path', 'name', 'component', 'meta', 'children', 'redirect',]

    let rou = [] as T[]
    // 判断是否是超级管理员，如果leves含有1，则是超级管理员，不过滤菜单
    if (info.levels.indexOf(1)) {
        rou = routes.filter((v: any) => {
            return v.meta.roles.length > 0
        })
    } else {
        rou = routes
    }

    rou.forEach(route => {
        const newRoute = <T>{}
        let component = route.component as string
        if (component) {
            // 解析component路径
            if (component === 'home') {
                route.component = <Component>(() => import('@/components/home/index.vue'))
            } else {
                if (component.substring(0, 1) === '/') {
                    component = component.slice(1)
                }
                route.component = () => import(/* webpackChunkName: "[request]" */ `/src/views/${component}.vue`)
                // route.component =`import(@/views/${component}.vue)`
            }
        }
        if (route.path.substring(0, 1) !== '/') {
            route.path = `/${route.path}`
        }

        for (const key in route) {
            if (keys.includes(key)) {
                newRoute[key] = route[key]
            }
        }

        if (newRoute.children) {
            if (newRoute.children.length) newRoute.children = formatRoutes(newRoute.children, info)
            else delete newRoute.children
        }
        res.push(newRoute)


    })


    return res

}

//获取默认路由
export function getDefaultRoute<T extends Route>(routes: T[], path = ''): T {
    let route = routes[0]
    if (route && route.redirect) {
        if (route.children) {
            const child = route.children.find(child => child.path === route.redirect)
            if (child) {
                route = <T>child
            } else if (path) {
                route = <T>route.children[0]
            }
        } else {
            route = getDefaultRoute(routes.slice(1), path)
        }
    }
    return route
}


export function hasRoute(routes: any, path: String): Boolean {
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].path == path) {
            return true
        } else {
            if (routes[i].children && routes[i].children.length > 0) {
                if (hasRoute(routes[i].children, path)) {
                    return true
                }
            }
        }
    }
    return false
}