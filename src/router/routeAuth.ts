/**
 * @description: 配置路由守卫
 */
import store from '@/store'
import router from '@/router'
import NProgress from '@/plugins/NProgress'
import { getCookie } from '@/utils/cookie'
import { RouteRecord } from 'vue-router'
import { hasRoute } from '@/utils/routes'
import { ElMessage } from 'element-plus'

const routeAuth = () => {
    router.beforeEach(async (to, from, next) => {
        if (!NProgress.show) {
            NProgress.start()
            NProgress.show = true
        }
        const hasToken = getCookie('token')
        if (hasToken) {
            if (store.getters['routes/addRoutes'].length) {
                next()
            } else {
                try {
                    // 由于store刷新后无状态，必须得重新加载路由
                    const { accessedRoutes, defaultRoute } = await store.dispatch('routes/setAsyncRoutes')
                    accessedRoutes.forEach((route: RouteRecord) => router.addRoute(route))
                    if (!hasRoute(accessedRoutes, to.path)) {
                        ElMessage.error("权限已更改，请重新登录！！！")
                        await store.dispatch('login/resetAll')
                        return next({ path: '/login' })
                    }
                    if (to.path === '/login') {
                        return next({ path: defaultRoute.path, replace: true })
                    }
                    next({ ...to, replace: true })
                } catch (error) {
                    await store.dispatch('login/resetAll')
                    next({ path: '/login' })
                }
            }
        } else {
            if (to.path === '/login') next()
            else next('/login')
        }
    })
    router.afterEach((to, from) => {
        NProgress.done()
        NProgress.show = false
    })
}

export default routeAuth